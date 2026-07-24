"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { ContractDoc, InvoiceDoc, PackingListDoc } from './generate-types'

// ── Per-shipment draft state ──────────────────────────────────────────────────

type ShipmentDrafts = {
  contract:    ContractDoc    | null
  invoice:     InvoiceDoc     | null
  packingList: PackingListDoc | null
  lastModified: number   // Unix ms — used for TTL cleanup
}

const EMPTY: ShipmentDrafts = { contract: null, invoice: null, packingList: null, lastModified: 0 }

const STORAGE_KEY = 'hh:generate-drafts'
const TTL_MS      = 7 * 24 * 60 * 60 * 1000   // 7 days
const MAX_ENTRIES = 30                          // keep at most 30 shipments

function pruneAndLoad(): Record<string, ShipmentDrafts> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}

    const parsed: Record<string, ShipmentDrafts> = JSON.parse(raw)
    const now = Date.now()

    // 1. Drop entries older than TTL
    const fresh = Object.fromEntries(
      Object.entries(parsed).filter(([, v]) => now - (v.lastModified ?? 0) < TTL_MS)
    )

    // 2. If still too many, keep only the MAX_ENTRIES most recent
    const entries = Object.entries(fresh).sort(([, a], [, b]) => b.lastModified - a.lastModified)
    if (entries.length > MAX_ENTRIES) entries.splice(MAX_ENTRIES)

    return Object.fromEntries(entries)
  } catch {
    return {}
  }
}

function saveToStorage(store: Record<string, ShipmentDrafts>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore quota errors
  }
}

// ── Context shape ─────────────────────────────────────────────────────────────

type GenerateCtx = {
  getDrafts:      (shipmentId: string) => ShipmentDrafts
  setContract:    (shipmentId: string, doc: ContractDoc)     => void
  setInvoice:     (shipmentId: string, doc: InvoiceDoc)      => void
  setPackingList: (shipmentId: string, doc: PackingListDoc)  => void
  clearDraft:     (shipmentId: string, type: keyof ShipmentDrafts) => void
  clearAll:       (shipmentId: string) => void
}

const Ctx = createContext<GenerateCtx | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function GenerateProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Record<string, ShipmentDrafts>>({})

  // Load from localStorage once on mount — prune stale entries on the way in
  useEffect(() => {
    const saved = pruneAndLoad()
    if (Object.keys(saved).length > 0) setStore(saved)
  }, [])

  // Persist to localStorage on every change
  useEffect(() => {
    saveToStorage(store)
  }, [store])

  const update = (id: string, patch: Partial<ShipmentDrafts>) =>
    setStore(s => ({
      ...s,
      [id]: { ...(s[id] ?? EMPTY), ...patch, lastModified: Date.now() },
    }))

  const getDrafts      = (id: string): ShipmentDrafts => store[id] ?? EMPTY
  const setContract    = (id: string, doc: ContractDoc)    => update(id, { contract: doc })
  const setInvoice     = (id: string, doc: InvoiceDoc)     => update(id, { invoice: doc })
  const setPackingList = (id: string, doc: PackingListDoc) => update(id, { packingList: doc })

  const clearDraft = (id: string, type: keyof ShipmentDrafts) =>
    update(id, { [type]: null })

  const clearAll = (id: string) =>
    setStore(s => ({ ...s, [id]: EMPTY }))

  return (
    <Ctx.Provider value={{ getDrafts, setContract, setInvoice, setPackingList, clearDraft, clearAll }}>
      {children}
    </Ctx.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useGenerateCtx(): GenerateCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useGenerateCtx must be used inside GenerateProvider')
  return ctx
}
