"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import { Check, CircleSlash, Pencil, Plus, Search, Trash2, X } from "lucide-react"
import { useLang } from "@/lib/i18n/context"
import { useState } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { ShipmentItem } from "@/schemas/shipment-item"

const supabase = createClient()
const NEW_ID = '__new__'

// ── Draft ────────────────────────────────────────────────────────────────────

type Draft = {
	name_en: string
	name_cn: string
	name_other: string
	hs_code: string
	specification: string
	quantity: string
	unit_price_usd: string
	num_packages: string
	nw_kg: string
	gw_kg: string
	cbm: string
}

const emptyDraft = (): Draft => ({
	name_en: '', name_cn: '', name_other: '', hs_code: '', specification: '',
	quantity: '', unit_price_usd: '',
	num_packages: '', nw_kg: '', gw_kg: '', cbm: '',
})

function itemToDraft(item: ShipmentItem): Draft {
	return {
		name_en:        item.name_en ?? '',
		name_cn:        item.name_cn ?? '',
		name_other:     item.name_other ?? '',
		hs_code:        item.hs_code ?? '',
		specification:  item.specification ?? '',
		quantity:       item.quantity?.toString() ?? '',
		unit_price_usd: item.unit_price_usd?.toString() ?? '',
		num_packages:   item.num_packages?.toString() ?? '',
		nw_kg:          item.nw_kg?.toString() ?? '',
		gw_kg:          item.gw_kg?.toString() ?? '',
		cbm:            item.cbm?.toString() ?? '',
	}
}

function parseDraft(d: Draft) {
	const num = (s: string) => s === '' ? null : parseFloat(s)
	const int = (s: string) => s === '' ? null : parseInt(s, 10)
	return {
		name_en:        d.name_en || null,
		name_cn:        d.name_cn || null,
		name_other:     d.name_other || null,
		hs_code:        d.hs_code || null,
		specification:  d.specification || null,
		quantity:       int(d.quantity),
		unit_price_usd: num(d.unit_price_usd),
		num_packages:   int(d.num_packages),
		nw_kg:          num(d.nw_kg),
		gw_kg:          num(d.gw_kg),
		cbm:            num(d.cbm),
	}
}

function isDraftEmpty(d: Draft): boolean {
	return Object.values(d).every(v => v === '')
}

// ── Inline input ─────────────────────────────────────────────────────────────

function InlineInput({ value, onChange, type = 'text' }: {
	value: string
	onChange: (v: string) => void
	type?: string
}) {
	return (
		<input
			type={type}
			value={value}
			onChange={e => onChange(e.target.value)}
			className="w-full h-6 min-w-0 rounded border bg-background px-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
		/>
	)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ItemsTab({ shipmentId, initialItems }: { shipmentId: string; initialItems: ShipmentItem[] }) {
	const { t } = useLang()
	const s = t.shipments

	const [items, setItems] = useState<ShipmentItem[]>(initialItems)
	const [search, setSearch] = useState('')
	const [editingId, setEditingId] = useState<string | null>(null)
	const [draft, setDraft] = useState<Draft | null>(null)
	const [deleteTarget, setDeleteTarget] = useState<ShipmentItem | null>(null)

	// ── Helpers ───────────────────────────────────────────────────────────────

	function setField(k: keyof Draft, v: string) {
		setDraft(d => d ? { ...d, [k]: v } : d)
	}

	function startEdit(item: ShipmentItem) {
		// Discard unsaved new row if any
		setItems(prev => prev.filter(i => i.id !== NEW_ID))
		setEditingId(item.id)
		setDraft(itemToDraft(item))
	}

	function addNewRow() {
		if (editingId) return // already editing something
		const newItem: ShipmentItem = {
			id: NEW_ID,
			shipment_id: shipmentId,
			item_no: items.length + 1,
			name_en: '',
		}
		setItems(prev => [...prev, newItem])
		setEditingId(NEW_ID)
		setDraft(emptyDraft())
	}

	function discard() {
		// New unsaved row → always remove from list
		setItems(prev => prev.filter(i => i.id !== NEW_ID))
		setEditingId(null)
		setDraft(null)
	}

	async function save() {
		if (!editingId || !draft) return

		const isEmpty = isDraftEmpty(draft)

		// ── New row ──────────────────────────────────────────────────────────────
		if (editingId === NEW_ID) {
			if (isEmpty) {
				// Nothing entered → just remove
				discard()
				return
			}
			const realCount = items.filter(i => i.id !== NEW_ID).length
			const { data, error } = await supabase
				.from('shipment_item')
				.insert({ ...parseDraft(draft), shipment_id: shipmentId, item_no: realCount + 1 })
				.select()
				.single()
			if (error) { toast.error(error.message); return }
			toast.success('Added')
			setItems(prev => prev.map(i => i.id === NEW_ID ? data : i))
			setEditingId(null)
			setDraft(null)
			return
		}

		// ── Existing row ─────────────────────────────────────────────────────────
		if (isEmpty) {
			// All fields cleared → delete
			const { error } = await supabase.from('shipment_item').delete().eq('id', editingId)
			if (error) { toast.error(error.message); return }
			toast.success('Deleted')
			setItems(prev => prev.filter(i => i.id !== editingId))
			setEditingId(null)
			setDraft(null)
			return
		}

		const { error } = await supabase
			.from('shipment_item')
			.update(parseDraft(draft))
			.eq('id', editingId)
		if (error) { toast.error(error.message); return }
		toast.success('Saved')
		setItems(prev => prev.map(i =>
			i.id === editingId ? { ...i, ...parseDraft(draft) } as ShipmentItem : i
		))
		setEditingId(null)
		setDraft(null)
	}

	async function confirmDelete() {
		if (!deleteTarget) return
		const { error } = await supabase.from('shipment_item').delete().eq('id', deleteTarget.id)
		if (error) { toast.error(error.message); setDeleteTarget(null); return }
		toast.success('Deleted')
		setItems(prev => prev.filter(i => i.id !== deleteTarget.id))
		setDeleteTarget(null)
	}

	// ── Render ────────────────────────────────────────────────────────────────

	const columns: { label: string; w: string }[] = [
		{ label: '#',             w: 'w-8'  },
		{ label: s.nameEn,        w: 'w-36' },
		{ label: s.nameCn,        w: 'w-36' },
		{ label: s.nameOther,     w: 'w-28' },
		{ label: s.hsCode,        w: 'w-24' },
		{ label: s.specification, w: 'w-36' },
		{ label: s.quantity,      w: 'w-20' },
		{ label: s.unitPrice,     w: 'w-24' },
		{ label: s.numPackages,   w: 'w-20' },
		{ label: s.nwKg,          w: 'w-20' },
		{ label: s.gwKg,          w: 'w-20' },
		{ label: s.cbm,           w: 'w-20' },
	]

	const realCount = items.filter(i => i.id !== NEW_ID).length

	const q = search.trim().toLowerCase()
	const visibleItems = q === ''
		? items
		: items.filter(i =>
			i.id === NEW_ID ||
			[i.name_en, i.name_cn, i.hs_code, i.specification]
				.some(v => v?.toLowerCase().includes(q))
		)

	return (
		<div className="flex-1 flex flex-col overflow-hidden">

			{/* Toolbar */}
			<div className="flex items-center h-9 px-4 gap-2 border-b bg-background shrink-0">
				<p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
					{s.tabItems} — {realCount} records
				</p>
				<div className="ml-auto flex items-center gap-2">
					<div className="relative flex items-center">
						<Search className="absolute left-2 size-3 text-muted-foreground pointer-events-none" />
						<input
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder={s.searchItem}
							className="h-7 w-48 rounded-md border bg-background pl-6 pr-6 text-xs outline-none focus:ring-1 focus:ring-ring"
						/>
						{search && (
							<button onClick={() => setSearch('')} className="absolute right-2 text-muted-foreground hover:text-foreground">
								<X className="size-3" />
							</button>
						)}
					</div>
					<Button size="sm" className="h-7 text-xs gap-1.5" onClick={addNewRow} disabled={!!editingId}>
						<Plus className="size-3" />
						{s.addItem}
					</Button>
				</div>
			</div>

			{/* Table */}
			<div className="flex-1 overflow-auto p-4">
				<table className="text-sm border-collapse w-full">
					<thead>
						<tr className="border-b">
							{columns.map(col => (
								<th key={col.label} className={`text-left text-[11px] font-medium text-muted-foreground pb-2 px-2 whitespace-nowrap ${col.w}`}>
									{col.label}
								</th>
							))}
							<th className="pb-2 px-2 w-16" />
						</tr>
					</thead>
					<tbody>
						{visibleItems.length === 0 ? (
							<tr>
								<td colSpan={columns.length + 1} className="px-2 py-8 text-center text-xs text-muted-foreground">
									{realCount === 0 ? s.noItems : s.noResults}
								</td>
							</tr>
						) : visibleItems.map((row, idx) => {
							const isEditing = row.id === editingId

							return (
								<tr key={row.id} className={`border-b align-middle ${isEditing ? 'bg-accent/5' : 'group hover:bg-muted/40'}`}>

									<td className="px-2 py-1.5 text-muted-foreground tabular-nums text-xs w-8">{idx + 1}</td>

									{isEditing && draft ? (
										<>
											<td className="px-2 py-1"><InlineInput value={draft.name_en}    onChange={v => setField('name_en',    v)} /></td>
											<td className="px-2 py-1"><InlineInput value={draft.name_cn}    onChange={v => setField('name_cn',    v)} /></td>
											<td className="px-2 py-1"><InlineInput value={draft.name_other} onChange={v => setField('name_other', v)} /></td>
											<td className="px-2 py-1"><InlineInput value={draft.hs_code}    onChange={v => setField('hs_code',    v)} /></td>
											<td className="px-2 py-1"><InlineInput value={draft.specification} onChange={v => setField('specification', v)} /></td>
											<td className="px-2 py-1"><InlineInput value={draft.quantity} onChange={v => setField('quantity', v)} type="number" /></td>
											<td className="px-2 py-1"><InlineInput value={draft.unit_price_usd} onChange={v => setField('unit_price_usd', v)} type="number" /></td>
											<td className="px-2 py-1"><InlineInput value={draft.num_packages} onChange={v => setField('num_packages', v)} type="number" /></td>
											<td className="px-2 py-1"><InlineInput value={draft.nw_kg} onChange={v => setField('nw_kg', v)} type="number" /></td>
											<td className="px-2 py-1"><InlineInput value={draft.gw_kg} onChange={v => setField('gw_kg', v)} type="number" /></td>
											<td className="px-2 py-1"><InlineInput value={draft.cbm} onChange={v => setField('cbm', v)} type="number" /></td>
										</>
									) : (
										<>
											<td className="px-2 py-2 font-medium">{row.name_en || '—'}</td>
											<td className="px-2 py-2 text-muted-foreground">{row.name_cn || '—'}</td>
											<td className="px-2 py-2 text-muted-foreground">{row.name_other || '—'}</td>
											<td className="px-2 py-2 text-muted-foreground font-mono text-xs">{row.hs_code || '—'}</td>
											<td className="px-2 py-2 text-muted-foreground">{row.specification || '—'}</td>
											<td className="px-2 py-2 text-muted-foreground text-right tabular-nums">{row.quantity ?? '—'}</td>
											<td className="px-2 py-2 text-muted-foreground text-right tabular-nums">{row.unit_price_usd ?? '—'}</td>
											<td className="px-2 py-2 text-muted-foreground text-right tabular-nums">{row.num_packages ?? '—'}</td>
											<td className="px-2 py-2 text-muted-foreground text-right tabular-nums">{row.nw_kg ?? '—'}</td>
											<td className="px-2 py-2 text-muted-foreground text-right tabular-nums">{row.gw_kg ?? '—'}</td>
											<td className="px-2 py-2 text-muted-foreground text-right tabular-nums">{row.cbm ?? '—'}</td>
										</>
									)}

									<td className="px-2 py-1.5 sticky right-0">
										{isEditing ? (
											<div className="flex items-center gap-0.5">
												<Button key="save" variant="ghost" size="icon-sm" className="size-6 text-green-600 hover:text-green-600 transition-none" onClick={save}>
													<Check className="size-3.5" />
												</Button>
												<Button key="discard" variant="ghost" size="icon-sm" className="size-6 text-muted-foreground transition-none" onClick={discard}>
													<CircleSlash className="size-3.5" />
												</Button>
											</div>
										) : (
											<div className="flex items-center gap-0.5 invisible group-hover:visible bg-background border rounded-md shadow-md px-0.5">
												<Button variant="ghost" size="icon-sm" className="size-6 transition-none" onClick={() => startEdit(row)}>
													<Pencil className="size-3" />
												</Button>
												<Button variant="ghost" size="icon-sm" className="size-6 text-destructive hover:text-destructive transition-none" onClick={() => setDeleteTarget(row)}>
													<Trash2 className="size-3" />
												</Button>
											</div>
										)}
									</td>

								</tr>
							)
						})}
					</tbody>
				</table>
			</div>

		<Dialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null) }}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Xoá hàng hoá?</DialogTitle>
					<DialogDescription>
						Bạn có chắc muốn xoá <span className="font-medium text-foreground">{deleteTarget?.name_en || deleteTarget?.name_cn || 'item này'}</span>? Hành động này không thể hoàn tác.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Huỷ</Button>
					<Button variant="destructive" size="sm" onClick={confirmDelete}>Xoá</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

		</div>
	)
}
