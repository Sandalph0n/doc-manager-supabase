"use client"

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Plus, X, FileText, ChevronUp, ChevronDown } from 'lucide-react'
import { Document, Page, Text, View, StyleSheet, Font, Image, pdf } from '@react-pdf/renderer'
import { ResizableCustomHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useGenerateCtx } from '../../generate-context'
import { BLANK_PL, mkId } from '../../generate-types'
import type { PackingListDoc, PLItem } from '../../generate-types'

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

function fmtNum(s: string): string {
  const n = parseFloat(s)
  return isNaN(n) ? '' : n.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 3 })
}

// ── PDF Styles ────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page:      { paddingTop: 16, paddingBottom: 24, paddingHorizontal: 32, fontSize: 8, fontFamily: 'NotoSansSC', color: '#111' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  logoBox:   { width: 56, height: 56, objectFit: 'contain' as const },
  sellerBox: { flex: 1, alignItems: 'center' },
  sellerCN:  { fontSize: 11, fontWeight: 'bold', textAlign: 'center' },
  sellerEN:  { fontSize: 9,  fontWeight: 'bold', textAlign: 'center' },
  sellerAdr: { fontSize: 7.5, textAlign: 'center' },
  metaSpacer:{ width: 56 },
  metaStrip: { position: 'absolute' as const, top: 16, right: 32, textAlign: 'right' as const },
  metaLine:  { fontSize: 8, fontWeight: 'bold', lineHeight: 1.4 },
  titleCN:   { fontSize: 16, fontWeight: 'bold', textAlign: 'center', letterSpacing: 4, marginTop: 4, marginBottom: 1 },
  titleEN:   { fontSize: 12, fontWeight: 'bold', textAlign: 'center', letterSpacing: 2, marginBottom: 6 },
  consignee: { marginBottom: 4 },
  cLine:     { fontSize: 8, fontWeight: 'bold', lineHeight: 1.2 },
  tWrap:  { marginTop: 4, borderTop: '0.5px solid #999', borderLeft: '0.5px solid #999' },
  tHead1: { flexDirection: 'row', backgroundColor: '#dde4ee', borderBottom: '0.5px solid #999' },
  tRow:   { flexDirection: 'row', borderBottom: '0.5px solid #ccc' },
  tTotal: { flexDirection: 'row', borderTop: '0.5px solid #888', borderBottom: '0.5px solid #999', fontWeight: 'bold', backgroundColor: '#f5f5f5' },
  c0: { width: '5%',  borderRight: '0.5px solid #bbb' },
  c1: { width: '9%',  borderRight: '0.5px solid #bbb' },
  c2: { width: '28%', borderRight: '0.5px solid #bbb' },
  c3: { width: '16%', borderRight: '0.5px solid #bbb' },
  c4: { width: '8%',  borderRight: '0.5px solid #bbb' },
  c5: { width: '11%', borderRight: '0.5px solid #bbb' },
  c6: { width: '11%', borderRight: '0.5px solid #bbb' },
  c7: { width: '12%', borderRight: '0.5px solid #999' },
  ct:  { paddingHorizontal: 2, paddingVertical: 1, lineHeight: 1.0 },
  ctC: { paddingHorizontal: 2, paddingVertical: 1, lineHeight: 1.0, textAlign: 'center' as const },
  ctR: { paddingHorizontal: 2, paddingVertical: 1, lineHeight: 1.0, textAlign: 'right'  as const },
  bold:{ fontWeight: 'bold' as const },
})

// ── PDF Component ─────────────────────────────────────────────────────────────

function PackingListPDF({ doc }: { doc: PackingListDoc }) {
  const totalQty  = doc.items.reduce((s, i) => s + (parseFloat(i.qty)  || 0), 0)
  const totalNw   = doc.items.reduce((s, i) => s + (parseFloat(i.nwKg) || 0), 0)
  const totalGw   = doc.items.reduce((s, i) => s + (parseFloat(i.gwKg) || 0), 0)
  const totalCbm  = doc.items.reduce((s, i) => s + (parseFloat(i.cbm)  || 0), 0)

  return (
    <Document>
      <Page size='A4' style={S.page}>

        {/* Seller header */}
        <View style={S.headerRow}>
          <Image src='/logo.png' style={S.logoBox} />
          <View style={S.sellerBox}>
            <Text style={S.sellerCN}>{doc.sellerNameCn}</Text>
            <Text style={S.sellerEN}>{doc.sellerNameEn}</Text>
            <Text style={S.sellerAdr}>{doc.sellerAddrCn}</Text>
            <Text style={S.sellerAdr}>{doc.sellerAddrEn}</Text>
          </View>
          <View style={S.metaSpacer} />
        </View>

        {/* Meta strip */}
        <View style={S.metaStrip}>
          {doc.plNo && <Text style={S.metaLine}>NO: {doc.plNo}</Text>}
          {doc.date && <Text style={S.metaLine}>日 期 Date: {doc.date}</Text>}
        </View>

        {/* Title */}
        <Text style={S.titleCN}>装 箱 单</Text>
        <Text style={S.titleEN}>PACKING LIST</Text>

        {/* Consignee */}
        <View style={S.consignee}>
          <Text style={S.cLine}>Messrs: {doc.consigneeName}</Text>
          <Text style={S.cLine}>Address: {doc.consigneeAddress}</Text>
        </View>

        {/* Table */}
        <View style={S.tWrap}>
          <View style={S.tHead1}>
            <View style={S.c0}><Text style={[S.ctC, S.bold]}>STT</Text></View>
            <View style={S.c1}><Text style={[S.ctC, S.bold]}>Ký hiệu</Text></View>
            <View style={S.c2}><Text style={[S.ctC, S.bold]}>Tên hàng (Trung + Việt)</Text></View>
            <View style={S.c3}><Text style={[S.ctC, S.bold]}>Quy cách đóng gói</Text></View>
            <View style={S.c4}><Text style={[S.ctC, S.bold]}>Số lượng</Text></View>
            <View style={S.c5}><Text style={[S.ctC, S.bold]}>{'Trọng tịnh\n(kg)'}</Text></View>
            <View style={S.c6}><Text style={[S.ctC, S.bold]}>{'Trọng cả\nbao bì (kg)'}</Text></View>
            <View style={S.c7}><Text style={[S.ctC, S.bold]}>{'Thể tích\n(CBM)'}</Text></View>
          </View>
          {doc.items.map((item, idx) => (
            <View key={item.id} style={S.tRow} wrap={false}>
              <View style={S.c0}><Text style={S.ctC}>{idx + 1}</Text></View>
              <View style={S.c1}><Text style={S.ctC}>{item.marks}</Text></View>
              <View style={S.c2}><Text style={S.ct}>{item.name}</Text></View>
              <View style={S.c3}><Text style={S.ctC}>{item.spec}</Text></View>
              <View style={S.c4}><Text style={S.ctC}>{item.qty ? Number(item.qty).toLocaleString('de-DE') : ''}</Text></View>
              <View style={S.c5}><Text style={S.ctR}>{fmtNum(item.nwKg)}</Text></View>
              <View style={S.c6}><Text style={S.ctR}>{fmtNum(item.gwKg)}</Text></View>
              <View style={S.c7}><Text style={S.ctR}>{fmtNum(item.cbm)}</Text></View>
            </View>
          ))}
          <View style={S.tTotal}>
            <View style={{ width: '42%', borderRight: '0.5px solid #bbb' }}>
              <Text style={[S.ctC, S.bold]}>合计 (TOTAL)</Text>
            </View>
            <View style={S.c3}><Text style={S.ct} /></View>
            <View style={S.c4}><Text style={[S.ctC, S.bold]}>{totalQty > 0 ? totalQty.toLocaleString('de-DE') : ''}</Text></View>
            <View style={S.c5}><Text style={[S.ctR, S.bold]}>{totalNw > 0 ? fmtNum(totalNw.toString()) : ''}</Text></View>
            <View style={S.c6}><Text style={[S.ctR, S.bold]}>{totalGw > 0 ? fmtNum(totalGw.toString()) : ''}</Text></View>
            <View style={S.c7}><Text style={[S.ctR, S.bold]}>{totalCbm > 0 ? fmtNum(totalCbm.toString()) : ''}</Text></View>
          </View>
        </View>

      </Page>
    </Document>
  )
}

// ── Blob generator ────────────────────────────────────────────────────────────

export async function generatePackingListBlob(doc: PackingListDoc): Promise<Blob> {
  return pdf(<PackingListPDF doc={doc} />).toBlob()
}

// ── Editor helpers ────────────────────────────────────────────────────────────

const inputClass = 'w-full text-xs bg-transparent border-b border-transparent hover:border-muted-foreground/40 focus:border-primary outline-none py-0.5 transition-colors'
const taClass    = inputClass + ' resize-none overflow-hidden'

function AutoTextarea({ value, onChange, className }: {
  value: string; onChange: (v: string) => void; className?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'
  }, [value])
  return <textarea ref={ref} value={value} rows={1} onChange={e => onChange(e.target.value)}
    className={className} style={{ overflow: 'hidden' }} />
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='border rounded-lg p-3 space-y-2 bg-background'>
      <p className='text-[10px] font-semibold uppercase tracking-widest text-muted-foreground'>{title}</p>
      {children}
    </div>
  )
}

function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className='flex items-center gap-2'>
      <span className='text-[10px] text-muted-foreground shrink-0 w-36'>{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
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

function ItemsEditor({ items, onChange }: { items: PLItem[]; onChange: (v: PLItem[]) => void }) {
  const setField = (id: string, f: keyof PLItem, v: string) =>
    onChange(items.map(i => i.id === id ? { ...i, [f]: v } : i))
  const remove = (id: string) => onChange(items.filter(i => i.id !== id))
  const add    = () => onChange([...items, { id: mkId(), marks: 'N/M', name: '', spec: '', qty: '', nwKg: '', gwKg: '', cbm: '' }])
  const move   = (idx: number, dir: -1 | 1) => {
    const next = [...items]
    ;[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]
    onChange(next)
  }
  return (
    <div className='space-y-2'>
      <div className='grid grid-cols-[1rem_1fr_2fr_1fr_1fr_1fr_1fr_1fr_1rem] gap-x-2 text-[9px] font-medium text-muted-foreground pb-1 border-b'>
        <span /><span>Marks</span><span>Name (CN/EN)</span><span>Spec</span><span>Qty</span><span>NW (kg)</span><span>GW (kg)</span><span>CBM</span><span />
      </div>
      {items.map((item, idx) => (
        <div key={item.id} className='grid grid-cols-[1rem_1fr_2fr_1fr_1fr_1fr_1fr_1fr_1rem] gap-x-2 items-start group border-b border-dashed pb-2'>
          <div className='flex flex-col opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
            <button onClick={() => move(idx, -1)} disabled={idx === 0} className='text-muted-foreground hover:text-foreground disabled:opacity-20 leading-none'>
              <ChevronUp className='size-3' />
            </button>
            <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className='text-muted-foreground hover:text-foreground disabled:opacity-20 leading-none'>
              <ChevronDown className='size-3' />
            </button>
          </div>
          <input value={item.marks} onChange={e => setField(item.id, 'marks', e.target.value)} className={inputClass} />
          <AutoTextarea value={item.name} onChange={v => setField(item.id, 'name', v)} className={taClass} />
          <input value={item.spec}  onChange={e => setField(item.id, 'spec',  e.target.value)} className={inputClass} />
          <input value={item.qty}   onChange={e => setField(item.id, 'qty',   e.target.value)} type='number' className={inputClass} />
          <input value={item.nwKg}  onChange={e => setField(item.id, 'nwKg',  e.target.value)} type='number' className={inputClass} />
          <input value={item.gwKg}  onChange={e => setField(item.id, 'gwKg',  e.target.value)} type='number' className={inputClass} />
          <input value={item.cbm}   onChange={e => setField(item.id, 'cbm',   e.target.value)} type='number' className={inputClass} />
          <button onClick={() => remove(item.id)} className='opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity pt-1'>
            <X className='size-3' />
          </button>
        </div>
      ))}
      <AddBtn onClick={add} label='Add item' />
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function PackingList({ shipmentId }: { shipmentId: string }) {
  const ctx = useGenerateCtx()
  const doc = ctx.getDrafts(shipmentId).packingList ?? BLANK_PL
  const set = <K extends keyof PackingListDoc>(k: K, v: PackingListDoc[K]) =>
    ctx.setPackingList(shipmentId, { ...doc, [k]: v })
  const hasContent = doc.items.length > 0 || !!doc.plNo

  return (
    <ResizablePanelGroup orientation='horizontal' className='flex-1 overflow-hidden'>
      <ResizablePanel defaultSize='50%' className='flex flex-col overflow-hidden'>
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          <SectionCard title='Seller Header'>
            <FieldInput label='Company (CN)'  value={doc.sellerNameCn} onChange={v => set('sellerNameCn', v)} />
            <FieldInput label='Company (EN)'  value={doc.sellerNameEn} onChange={v => set('sellerNameEn', v)} />
            <FieldInput label='Address (CN)'  value={doc.sellerAddrCn} onChange={v => set('sellerAddrCn', v)} />
            <FieldInput label='Address (EN)'  value={doc.sellerAddrEn} onChange={v => set('sellerAddrEn', v)} />
          </SectionCard>
          <SectionCard title='Packing List Info'>
            <FieldInput label='PL No.'  value={doc.plNo} onChange={v => set('plNo', v)} />
            <FieldInput label='Date'    value={doc.date} onChange={v => set('date', v)} />
          </SectionCard>
          <SectionCard title='Consignee'>
            <FieldInput label='Company name' value={doc.consigneeName}    onChange={v => set('consigneeName', v)} />
            <FieldInput label='Address'      value={doc.consigneeAddress} onChange={v => set('consigneeAddress', v)} />
          </SectionCard>
          <SectionCard title='Items'>
            <ItemsEditor items={doc.items} onChange={v => set('items', v)} />
          </SectionCard>
        </div>
      </ResizablePanel>
      <ResizableCustomHandle />
      <ResizablePanel defaultSize='50%' className='flex flex-col overflow-hidden bg-muted/30'>
        {hasContent ? (
          <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
            <PackingListPDF doc={doc} />
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
