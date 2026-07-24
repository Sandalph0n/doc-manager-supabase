"use client"

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Plus, X, FileText, ChevronUp, ChevronDown } from 'lucide-react'
import { Document, Page, Text, View, StyleSheet, Font, Image, pdf } from '@react-pdf/renderer'
import { ResizableCustomHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useGenerateCtx } from '../../generate-context'
import { BLANK, mkId, mkLine } from '../../generate-types'
import type { ContractDoc, ContractItem, Line, Term } from '../../generate-types'

Font.register({
  family: 'NotoSansSC',
  fonts: [
    { src: '/NotoSansSC-Regular.ttf', fontWeight: 'normal' },
    { src: '/NotoSansSC-Bold.ttf',    fontWeight: 'bold'   },
  ],
})

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then(m => m.PDFViewer),
  { ssr: false }
)

// ── Number formatting (European: 18.395,65) ───────────────────────────────────

function fmtEU(n: number): string {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function itemAmount(item: ContractItem): number {
  const price = parseFloat(item.unitPrice) || 0
  return item.priceUnit === 'weight'
    ? (parseFloat(item.weight) || 0) * price
    : (parseFloat(item.qty)    || 0) * price
}

// ── Column widths (numbers, not strings) — change here, everything updates ────
//    c0   c1   c2   c3   c4   c5   c6
const CW = [5,  27,  18,  11,  11,  13,  15] as const
// Total row: label spans c0+c1+c2
const TOTAL_LABEL_W = `${CW[0] + CW[1] + CW[2]}%`

// ── PDF styles ────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page:       { paddingTop: 20, paddingBottom: 24, paddingHorizontal: 36, fontSize: 8, fontFamily: 'NotoSansSC', color: '#111' },

  // header
  titleCN:    { fontSize: 14, fontWeight: 'bold', textAlign: 'center', letterSpacing: 6, marginBottom: 2 },
  titleEN:    { fontSize: 17, textAlign: 'center', marginBottom: 8 },

  // two-column (seller left / meta right)
  topRow:     { flexDirection: 'row', marginBottom: 4 },
  sellerCol:  { flex: 2.2 },
  metaCol:    { flex: 1, alignItems: 'flex-end' },

  // divider before buyer
  divider:    { borderTop: '0.5px solid #bbb', marginVertical: 3 },

  // table
  // Table — borders on View cells so borderRight fills full row height
  // tWrap provides top + left outer border; c6 provides right outer border
  tWrap:   { marginTop: 6, borderTop: '0.5px solid #999', borderLeft: '0.5px solid #999' },
  tHead1:  { flexDirection: 'row', backgroundColor: '#dde4ee', borderBottom: '0.5px solid #999' },
  tHead2:  { flexDirection: 'row', backgroundColor: '#eaecf5', borderBottom: '0.5px solid #999' },
  tRow:    { flexDirection: 'row', borderBottom: '0.5px solid #ccc' },
  tTotal:  { flexDirection: 'row', borderTop: '0.5px solid #888', borderBottom: '0.5px solid #999', fontWeight: 'bold', backgroundColor: '#f5f5f5' },
  // Cell View containers — widths driven by CW constants above
  c0:  { width: `${CW[0]}%`, borderRight: '0.5px solid #bbb' },
  c1:  { width: `${CW[1]}%`, borderRight: '0.5px solid #bbb' },
  c2:  { width: `${CW[2]}%`, borderRight: '0.5px solid #bbb' },
  c3:  { width: `${CW[3]}%`, borderRight: '0.5px solid #bbb' },
  c4:  { width: `${CW[4]}%`, borderRight: '0.5px solid #bbb' },
  c5:  { width: `${CW[5]}%`, borderRight: '0.5px solid #bbb' },
  c6:  { width: `${CW[6]}%`, borderRight: '0.5px solid #999' },
  // Cell Text styles (padding lives here, not on the View)
  ct:  { paddingHorizontal: 3, paddingVertical: 1, lineHeight: 0.8 },
  ctR: { paddingHorizontal: 3, paddingVertical: 1, lineHeight: 0.8, textAlign: 'right'  as const },
  ctC: { paddingHorizontal: 3, paddingVertical: 1, lineHeight: 0.8, textAlign: 'center' as const },

  // terms
  termRow:    { flexDirection: 'row', marginBottom: 2 },
  termNum:    { width: 20, color: '#555' },
  termBody:   { flex: 1 },

  // signature
  sigTable:   { flexDirection: 'row', border: '0.5px solid #999', marginTop: 12 },
  sigCell:    { flex: 1, padding: 6 },
  sigDivider: { borderRight: '0.5px solid #999' },
  sigLine:    { borderTop: '0.5px solid #555', marginTop: 28, marginBottom: 4, width: '70%' },

  // utility
  bold:       { fontWeight: 'bold' as const },
})

// ── Render Line[] with group-gap logic ────────────────────────────────────────
// CN lines (bold) + EN line(s) = one group. Gap only BETWEEN groups, not within.

const L  = { lineHeight: 0.5, marginBottom: 2 } as const
const LG = { lineHeight: 0.7, marginBottom: 0 } as const   // after last line of a group

function renderLines(lines: Line[], align?: 'right', forceBold?: boolean) {
  return lines.map((l, i) => {
    const next = lines[i + 1]
    const isBold = forceBold || l.bold
    const isGroupEnd = !isBold && (!next || (forceBold || lines[i + 1]?.bold))
    return (
      <Text
        key={l.id}
        style={{
          ...(isGroupEnd ? LG : L),
          ...(isBold      ? { fontWeight: 'bold' }          : {}),
          ...(l.underline ? { textDecoration: 'underline' } : {}),
          ...(align       ? { textAlign: align }            : {}),
        }}
      >
        {l.val}
      </Text>
    )
  })
}

// ── PDF component ─────────────────────────────────────────────────────────────

function SaleContractPDF({ doc }: { doc: ContractDoc }) {
  const total = doc.items.reduce((s, i) => s + itemAmount(i), 0)

  return (
    <Document>
      <Page size='A4' style={S.page}>

        {/* ── Header ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Image src='/logo.png' style={{ width: 60, height: 60, objectFit: 'contain' }}  />
          <View style={{ flex: 1 }}>
            <Text style={S.titleCN}>{doc.header[0]?.val ?? '销 售 合 同'}</Text>
            <Text style={S.titleEN}>{doc.header[1]?.val ?? 'SALES CONTRACT'}</Text>
          </View>
          <View style={{ width: 60 }} />
        </View>

        {/* ── Seller (left) + Meta (right) ── */}
        <View style={S.topRow}>
          <View style={S.sellerCol}>
            {renderLines(doc.sellerLines, undefined, true)}
          </View>
          <View style={S.metaCol}>
            {doc.ctNo && <>
              <Text style={{ ...L, fontWeight: 'bold', textAlign: 'right' }}>合同号码: {doc.ctNo}</Text>
              <Text style={{ ...LG, textAlign: 'right' }}>CT NO.: {doc.ctNo}</Text>
            </>}
            {doc.date && <>
              <Text style={{ ...L, fontWeight: 'bold', textAlign: 'right' }}>日期: {doc.date}</Text>
              <Text style={{ ...LG, textAlign: 'right' }}>Date: {doc.date}</Text>
            </>}
            <Text style={{ ...L, fontWeight: 'bold', textAlign: 'right' }}>签约地点: {doc.placeOfSigningCn}</Text>
            <Text style={{ ...L, textAlign: 'right' }}>Place of Signing： {doc.placeOfSigning}</Text>
          </View>
        </View>

        <View style={S.divider} />

        {/* ── Buyer ── */}
        {renderLines(doc.buyerLines, undefined, true)}

        {/* ── Opening clause ── */}
        {doc.openingLines.length > 0 && (
          <View style={{ marginTop: 4, marginBottom: 2 }}>
            {doc.openingLines.map(l => (
              <Text key={l.id} style={{ ...L, fontWeight: l.bold ? 'bold' : 'normal' }}>{l.val}</Text>
            ))}
          </View>
        )}

        {/* ── Goods Table ── */}
        {doc.items.length > 0 && (
          <View style={S.tWrap}>
            {/* Header row 1 — Chinese labels (all centered) */}
            <View style={S.tHead1}>
              <View style={S.c0}><Text style={[S.ctC, S.bold]}>序号</Text></View>
              <View style={S.c1}><Text style={[S.ctC, S.bold]}>货物名称及规格</Text></View>
              <View style={S.c2}><Text style={[S.ctC, S.bold]}>规格型号</Text></View>
              <View style={S.c3}><Text style={[S.ctC, S.bold]}>数量</Text></View>
              <View style={S.c4}><Text style={[S.ctC, S.bold]}>重量</Text></View>
              <View style={S.c5}><Text style={[S.ctC, S.bold]}>单价</Text></View>
              <View style={S.c6}><Text style={[S.ctC, S.bold]}>金额</Text></View>
            </View>
            {/* Header row 2 — English labels (all centered) */}
            <View style={S.tHead2}>
              <View style={S.c0}><Text style={S.ctC}>#</Text></View>
              <View style={S.c1}><Text style={S.ctC}>{'Name of Commodity and\nSpecification'}</Text></View>
              <View style={S.c2}><Text style={S.ctC}>{'Specifications and\nModel'}</Text></View>
              <View style={S.c3}><Text style={S.ctC}>Quantity</Text></View>
              <View style={S.c4}><Text style={S.ctC}>weight（kg）</Text></View>
              <View style={S.c5}><Text style={S.ctC}>{'Unit Price\n(USD)'}</Text></View>
              <View style={S.c6}><Text style={S.ctC}>{`Amount USD\n(${doc.amountLabel || 'DAF Chi Ma'})`}</Text></View>
            </View>

            {/* Data rows */}
            {doc.items.map((item, idx) => {
              const amt = itemAmount(item)
              return (
                <View key={item.id} style={S.tRow} wrap={false}>
                  <View style={S.c0}><Text style={S.ctC}>{idx + 1}</Text></View>
                  <View style={S.c1}><Text style={S.ctC}>{item.name}</Text></View>
                  <View style={S.c2}><Text style={S.ctC}>{item.spec}</Text></View>
                  <View style={S.c3}><Text style={S.ctC}>{item.qty ? Number(item.qty).toLocaleString('de-DE') : ''}</Text></View>
                  <View style={S.c4}><Text style={S.ctC}>{item.weight ? Number(item.weight).toLocaleString('de-DE') : ''}</Text></View>
                  <View style={S.c5}><Text style={S.ctC}>{item.unitPrice ? `$${fmtEU(parseFloat(item.unitPrice))}` : ''}</Text></View>
                  <View style={S.c6}><Text style={S.ctC}>{amt > 0 ? `$${fmtEU(amt)}` : ''}</Text></View>
                </View>
              )
            })}

            {/* Total row — label spans c0+c1+c2 (auto-computed from CW) */}
            <View style={S.tTotal}>
              <View style={{ width: TOTAL_LABEL_W, borderRight: '0.5px solid #bbb' }}>
                <Text style={[S.ctC, S.bold]}>合计Total Amount::</Text>
              </View>
              <View style={S.c3}>
                <Text style={[S.ctC, S.bold]}>
                  {doc.items.reduce((s, i) => s + (parseInt(i.qty) || 0), 0).toLocaleString('de-DE')}
                </Text>
              </View>
              <View style={S.c4}>
                <Text style={[S.ctC, S.bold]}>
                  {doc.items.reduce((s, i) => s + (parseFloat(i.weight) || 0), 0).toLocaleString('de-DE')}
                </Text>
              </View>
              <View style={S.c5}><Text style={S.ct} /></View>
              <View style={S.c6}>
                <Text style={[S.ctC, S.bold]}>{total > 0 ? `$${fmtEU(total)}` : ''}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Terms ── */}
        {doc.terms.length > 0 && (
          <View style={{ marginTop: 6 }}>
            {doc.terms.map(term => (
              <View key={term.id} style={S.termRow} wrap={false}>
                <Text style={{ ...L, width: 20, color: '#555' }}>({term.num})</Text>
                <View style={S.termBody}>
                  {term.cnText && (
                    <Text style={{ ...L, fontWeight: 'bold' }}>{term.cnText}</Text>
                  )}
                  {term.enText && term.enText.split('\n').map((line, i) => (
                    <Text key={i} style={L}>{line}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── Signature block ── */}
        <View style={S.sigTable} wrap={false}>
          <View style={[S.sigCell, S.sigDivider]}>
            <Text style={S.bold}>卖方：{doc.sellerSig}</Text>
            <Text style={{ marginTop: 1, marginBottom: 4 }}>The Sellers:</Text>
            <View style={S.sigLine} />
          </View>
          <View style={S.sigCell}>
            <Text style={S.bold}>买方：{doc.buyerSig}</Text>
            <Text style={{ marginTop: 1, marginBottom: 4 }}>The Buyers:</Text>
            <View style={S.sigLine} />
          </View>
        </View>

      </Page>
    </Document>
  )
}

// ── Blob generator (called from generate-client on Save) ──────────────────────

export async function generateContractBlob(doc: ContractDoc): Promise<Blob> {
  return pdf(<SaleContractPDF doc={doc} />).toBlob()
}

// ── Editor sub-components ─────────────────────────────────────────────────────

const inputClass = 'w-full text-xs bg-transparent border-b border-transparent hover:border-muted-foreground/40 focus:border-primary outline-none py-0.5 transition-colors'
const taClass    = inputClass + ' resize-none overflow-hidden'

function AutoTextarea({ value, onChange, className, placeholder }: {
  value: string; onChange: (v: string) => void; className?: string; placeholder?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [value])
  return (
    <textarea
      ref={ref}
      value={value}
      rows={1}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      style={{ overflow: 'hidden' }}
    />
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='border rounded-lg p-3 space-y-2 bg-background'>
      <p className='text-[10px] font-semibold uppercase tracking-widest text-muted-foreground'>{title}</p>
      {children}
    </div>
  )
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className='flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors mt-0.5'>
      <Plus className='size-3' />{label}
    </button>
  )
}

function LineEditor({ value, onChange, onRemove, onMoveUp, onMoveDown, placeholder = 'Enter text…', bold }: {
  value: string; onChange: (v: string) => void; onRemove: () => void
  onMoveUp?: () => void; onMoveDown?: () => void; placeholder?: string; bold?: boolean
}) {
  return (
    <div className='flex items-center gap-1 group'>
      <div className='flex flex-col opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
        <button onClick={onMoveUp}   disabled={!onMoveUp}   className='text-muted-foreground hover:text-foreground disabled:opacity-20 leading-none'>
          <ChevronUp className='size-3' />
        </button>
        <button onClick={onMoveDown} disabled={!onMoveDown} className='text-muted-foreground hover:text-foreground disabled:opacity-20 leading-none'>
          <ChevronDown className='size-3' />
        </button>
      </div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass + (bold ? ' font-semibold' : '')}
      />
      <button onClick={onRemove} className='opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive shrink-0 transition-opacity'>
        <X className='size-3' />
      </button>
    </div>
  )
}

function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className='flex items-center gap-2'>
      <span className='text-[10px] text-muted-foreground shrink-0 w-32'>{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
    </div>
  )
}

function LinesEditor({ lines, onChange, placeholder }: { lines: Line[]; onChange: (v: Line[]) => void; placeholder?: string }) {
  const set    = (id: string, val: string) => onChange(lines.map(l => l.id === id ? { ...l, val } : l))
  const remove = (id: string)              => onChange(lines.filter(l => l.id !== id))
  const add    = ()                         => onChange([...lines, mkLine()])
  const move   = (idx: number, dir: -1 | 1) => {
    const next = [...lines]
    ;[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]
    onChange(next)
  }
  return (
    <div className='space-y-1'>
      {lines.map((l, i) => (
        <LineEditor
          key={l.id}
          value={l.val}
          bold={l.bold}
          onChange={v => set(l.id, v)}
          onRemove={() => remove(l.id)}
          onMoveUp={i > 0 ? () => move(i, -1) : undefined}
          onMoveDown={i < lines.length - 1 ? () => move(i, 1) : undefined}
          placeholder={placeholder}
        />
      ))}
      <AddBtn onClick={add} label='Add line' />
    </div>
  )
}

function ItemsEditor({ items, onChange }: { items: ContractItem[]; onChange: (v: ContractItem[]) => void }) {
  const setField = (id: string, f: keyof ContractItem, v: string) =>
    onChange(items.map(i => i.id === id ? { ...i, [f]: v } : i))
  const togglePriceUnit = (id: string) =>
    onChange(items.map(i => i.id === id ? { ...i, priceUnit: i.priceUnit === 'qty' ? 'weight' : 'qty' } : i))
  const remove = (id: string) => onChange(items.filter(i => i.id !== id))
  const add    = () => onChange([...items, { id: mkId(), name: '', spec: '', qty: '', weight: '', unitPrice: '', priceUnit: 'qty' }])
  const move   = (idx: number, dir: -1 | 1) => {
    const next = [...items]
    ;[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]
    onChange(next)
  }

  return (
    <div className='space-y-2'>
      <div className='grid grid-cols-[1rem_2fr_1fr_1fr_1fr_1fr_3rem_1rem] gap-x-2 text-[9px] font-medium text-muted-foreground pb-1 border-b'>
        <span /><span>Name</span><span>Model</span><span>Qty</span><span>Weight (kg)</span><span>Unit Price</span><span>$/unit</span><span />
      </div>
      {items.map((item, idx) => (
        <div key={item.id} className='grid grid-cols-[1rem_2fr_1fr_1fr_1fr_1fr_3rem_1rem] gap-x-2 items-start group border-b border-dashed pb-2'>
          <div className='flex flex-col opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
            <button onClick={() => move(idx, -1)} disabled={idx === 0} className='text-muted-foreground hover:text-foreground disabled:opacity-20 leading-none'>
              <ChevronUp className='size-3' />
            </button>
            <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className='text-muted-foreground hover:text-foreground disabled:opacity-20 leading-none'>
              <ChevronDown className='size-3' />
            </button>
          </div>
          <AutoTextarea value={item.name} onChange={v => setField(item.id, 'name', v)} className={taClass} />
          <AutoTextarea value={item.spec} onChange={v => setField(item.id, 'spec', v)} className={taClass} />
          <input value={item.qty}       onChange={e => setField(item.id, 'qty',       e.target.value)} type='number' className={inputClass} />
          <input value={item.weight}    onChange={e => setField(item.id, 'weight',    e.target.value)} type='number' className={inputClass} />
          <input value={item.unitPrice} onChange={e => setField(item.id, 'unitPrice', e.target.value)} type='number' className={inputClass} />
          <button
            onClick={() => togglePriceUnit(item.id)}
            title='Click to toggle: amount = qty×price or weight×price'
            className={`text-[9px] px-1 rounded border transition-colors ${
              item.priceUnit === 'weight'
                ? 'border-blue-400 text-blue-600 bg-blue-50'
                : 'border-muted-foreground/30 text-muted-foreground'
            }`}
          >
            {item.priceUnit === 'weight' ? '$/kg' : '$/pc'}
          </button>
          <button onClick={() => remove(item.id)} className='opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity pt-1'>
            <X className='size-3' />
          </button>
        </div>
      ))}
      <AddBtn onClick={add} label='Add item' />
    </div>
  )
}

function TermsEditor({ terms, onChange }: { terms: Term[]; onChange: (v: Term[]) => void }) {
  const setCN  = (id: string, v: string) => onChange(terms.map(t => t.id === id ? { ...t, cnText: v } : t))
  const setEN  = (id: string, v: string) => onChange(terms.map(t => t.id === id ? { ...t, enText: v } : t))
  const remove = (id: string)            => onChange(terms.filter(t => t.id !== id).map((t, i) => ({ ...t, num: i + 1 })))
  const add    = ()                       => onChange([...terms, { id: mkId(), num: terms.length + 1, cnText: '', enText: '' }])
  const move   = (idx: number, dir: -1 | 1) => {
    const next = [...terms]
    ;[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]
    onChange(next.map((t, i) => ({ ...t, num: i + 1 })))
  }

  return (
    <div className='space-y-3'>
      {terms.map((term, i) => (
        <div key={term.id} className='flex gap-2 group'>
          <div className='flex flex-col items-center shrink-0 pt-0.5'>
            <div className='flex flex-col opacity-0 group-hover:opacity-100 transition-opacity'>
              <button onClick={() => move(i, -1)} disabled={i === 0} className='text-muted-foreground hover:text-foreground disabled:opacity-20 leading-none'>
                <ChevronUp className='size-3' />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === terms.length - 1} className='text-muted-foreground hover:text-foreground disabled:opacity-20 leading-none'>
                <ChevronDown className='size-3' />
              </button>
            </div>
            <span className='text-[10px] text-muted-foreground leading-none mt-0.5'>({term.num})</span>
          </div>
          <div className='flex-1 space-y-1'>
            <AutoTextarea
              value={term.cnText}
              onChange={v => setCN(term.id, v)}
              className={taClass + ' font-semibold'}
              placeholder='Chinese text (bold in PDF)…'
            />
            <AutoTextarea
              value={term.enText}
              onChange={v => setEN(term.id, v)}
              className={taClass}
              placeholder='English text…'
            />
          </div>
          <button onClick={() => remove(term.id)} className='opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive shrink-0 transition-opacity pt-1'>
            <X className='size-3' />
          </button>
        </div>
      ))}
      <AddBtn onClick={add} label='Add clause' />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function SaleContract({ shipmentId }: { shipmentId: string }) {
  const ctx = useGenerateCtx()
  const doc = ctx.getDrafts(shipmentId).contract ?? BLANK

  const set = <K extends keyof ContractDoc>(k: K, v: ContractDoc[K]) =>
    ctx.setContract(shipmentId, { ...doc, [k]: v })

  const hasContent = doc.items.length > 0 || doc.sellerLines.length > 0

  return (
    <ResizablePanelGroup orientation='horizontal' className='flex-1 overflow-hidden'>

      {/* ── Editor ── */}
      <ResizablePanel defaultSize='50%' className='flex flex-col overflow-hidden'>
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>

          <SectionCard title='Header'>
            <LinesEditor lines={doc.header} onChange={v => set('header', v)} placeholder='Title line…' />
          </SectionCard>

          <SectionCard title='Seller Info'>
            <LinesEditor lines={doc.sellerLines} onChange={v => set('sellerLines', v)} placeholder='Seller info…' />
          </SectionCard>

          <SectionCard title='Contract Info'>
            <FieldInput label='CT No.'              value={doc.ctNo}             onChange={v => set('ctNo', v)} />
            <FieldInput label='Date'                value={doc.date}             onChange={v => set('date', v)} />
            <FieldInput label='Place (EN)'          value={doc.placeOfSigning}   onChange={v => set('placeOfSigning', v)} />
            <FieldInput label='Place (CN)'          value={doc.placeOfSigningCn} onChange={v => set('placeOfSigningCn', v)} />
          </SectionCard>

          <SectionCard title='Buyer Info'>
            <LinesEditor lines={doc.buyerLines} onChange={v => set('buyerLines', v)} placeholder='Buyer info…' />
          </SectionCard>

          <SectionCard title='Opening Clause'>
            <LinesEditor lines={doc.openingLines} onChange={v => set('openingLines', v)} placeholder='Clause text…' />
          </SectionCard>

          <SectionCard title='Goods Table'>
            <FieldInput label='Amount column label' value={doc.amountLabel} onChange={v => set('amountLabel', v)} />
            <div className='mt-2'>
              <ItemsEditor items={doc.items} onChange={v => set('items', v)} />
            </div>
          </SectionCard>

          <SectionCard title='Terms & Conditions'>
            <TermsEditor terms={doc.terms} onChange={v => set('terms', v)} />
          </SectionCard>

          <SectionCard title='Signature'>
            <FieldInput label='Seller' value={doc.sellerSig} onChange={v => set('sellerSig', v)} />
            <FieldInput label='Buyer'  value={doc.buyerSig}  onChange={v => set('buyerSig', v)} />
          </SectionCard>

        </div>
      </ResizablePanel>

      <ResizableCustomHandle />

      {/* ── Preview ── */}
      <ResizablePanel defaultSize='50%' className='flex flex-col overflow-hidden bg-muted/30'>
        {hasContent ? (
          <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
            <SaleContractPDF doc={doc} />
          </PDFViewer>
        ) : (
          <div className='flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground'>
            <FileText className='size-10 opacity-20' />
            <p className='text-xs'>Click <span className='font-medium'>Generate</span> to preview</p>
          </div>
        )}
      </ResizablePanel>

    </ResizablePanelGroup>
  )
}
