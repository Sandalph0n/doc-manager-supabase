"use client"

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Plus, X, FileText, ChevronUp, ChevronDown } from 'lucide-react'
import { Document, Page, Text, View, StyleSheet, Font, Image, pdf } from '@react-pdf/renderer'
import { ResizableCustomHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useGenerateCtx } from '../../generate-context'
import { BLANK_INVOICE, mkId } from '../../generate-types'
import type { InvoiceDoc, InvoiceItem } from '../../generate-types'

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

function fmtEU(n: number): string {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function itemAmount(item: InvoiceItem): number {
  return (parseFloat(item.qty) || 0) * (parseFloat(item.unitPrice) || 0)
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
  titleCN:   { fontSize: 16, fontWeight: 'bold', textAlign: 'center', letterSpacing: 4, marginTop: 4, marginBottom: 1 },
  titleEN:   { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  metaStrip: { position: 'absolute' as const, top: 16, right: 32, textAlign: 'right' as const },
  metaLine:  { fontSize: 8, fontWeight: 'bold', lineHeight: 1.4 },
  consignee: { marginBottom: 6 },
  cLabel:    { fontSize: 8, fontWeight: 'bold' },
  cLine:     { fontSize: 8, fontWeight: 'bold', lineHeight: 1.2 },
  divider:   { borderTop: '0.5px solid #bbb', marginVertical: 4 },
  tWrap:  { marginTop: 4, borderTop: '0.5px solid #999', borderLeft: '0.5px solid #999' },
  tHead1: { flexDirection: 'row', backgroundColor: '#dde4ee', borderBottom: '0.5px solid #999' },
  tHead2: { flexDirection: 'row', backgroundColor: '#eaecf5', borderBottom: '0.5px solid #999' },
  tRow:   { flexDirection: 'row', borderBottom: '0.5px solid #ccc' },
  tTotal: { flexDirection: 'row', borderTop: '0.5px solid #888', borderBottom: '0.5px solid #999', fontWeight: 'bold', backgroundColor: '#f5f5f5' },
  c0: { width: '4%',  borderRight: '0.5px solid #bbb' },
  c1: { width: '10%', borderRight: '0.5px solid #bbb' },
  c2: { width: '30%', borderRight: '0.5px solid #bbb' },
  c3: { width: '14%', borderRight: '0.5px solid #bbb' },
  c4: { width: '8%',  borderRight: '0.5px solid #bbb' },
  c5: { width: '8%',  borderRight: '0.5px solid #bbb' },
  c6: { width: '9%', borderRight: '0.5px solid #bbb' },
  c7: { width: '17%', borderRight: '0.5px solid #999' },
  ct:  { paddingHorizontal: 2, paddingVertical: 1, lineHeight: 1.0 },
  ctC: { paddingHorizontal: 2, paddingVertical: 1, lineHeight: 1.0, textAlign: 'center' as const },
  ctR: { paddingHorizontal: 2, paddingVertical: 1, lineHeight: 1.0, textAlign: 'right'  as const },
  say:     { marginTop: 4, fontSize: 8, fontWeight: 'bold', lineHeight: 1.3 },
  note:    { marginTop: 4, fontSize: 7.5, fontWeight: 'bold', lineHeight: 1.3 },
  bankLine:{ fontSize: 8, fontWeight: 'bold', lineHeight: 1.4 },
  bold:    { fontWeight: 'bold' as const },
})

// ── PDF Component ─────────────────────────────────────────────────────────────

function InvoicePDF({ doc }: { doc: InvoiceDoc }) {
  const total = doc.items.reduce((s, i) => s + itemAmount(i), 0)
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

        {/* Meta strip top-right */}
        <View style={S.metaStrip}>
          {doc.invNo && <Text style={S.metaLine}>INV NO: {doc.invNo}</Text>}
          {doc.date  && <Text style={S.metaLine}>日 期 Date: {doc.date}</Text>}
        </View>

        {/* Title */}
        <Text style={S.titleCN}>发 票</Text>
        <Text style={S.titleEN}>INVOICE</Text>

        {/* Consignee */}
        <View style={S.consignee}>
          <Text style={S.cLabel}>Consignee:</Text>
          <Text style={S.cLine}>Messrs: {doc.consigneeName}</Text>
          <Text style={S.cLine}>Address: {doc.consigneeAddress}</Text>
        </View>

        {/* Table */}
        <View style={S.tWrap}>
          <View style={S.tHead1}>
            <View style={S.c0}><Text style={[S.ctC, S.bold]}>序号</Text></View>
            <View style={S.c1}><Text style={[S.ctC, S.bold]}>Mã HS</Text></View>
            <View style={S.c2}><Text style={[S.ctC, S.bold]}>货物名称及规格</Text></View>
            <View style={S.c3}><Text style={[S.ctC, S.bold]}>规格型号</Text></View>
            <View style={S.c4}><Text style={[S.ctC, S.bold]}>单位</Text></View>
            <View style={S.c5}><Text style={[S.ctC, S.bold]}>数量</Text></View>
            <View style={S.c6}><Text style={[S.ctC, S.bold]}>单价</Text></View>
            <View style={S.c7}><Text style={[S.ctC, S.bold]}>金额</Text></View>
          </View>
          <View style={S.tHead2}>
            <View style={S.c0}><Text style={[S.ctC, S.bold]}>#</Text></View>
            <View style={S.c1}><Text style={[S.ctC, S.bold]}>HS Code</Text></View>
            <View style={S.c2}><Text style={[S.ctC, S.bold]}>{'Tên hàng hóa &\nQuy cách'}</Text></View>
            <View style={S.c3}><Text style={[S.ctC, S.bold]}>Quy cách đóng gói</Text></View>
            <View style={S.c4}><Text style={[S.ctC, S.bold]}>Đơn vị tính</Text></View>
            <View style={S.c5}><Text style={[S.ctC, S.bold]}>Số lượng</Text></View>
            <View style={S.c6}><Text style={[S.ctC, S.bold]}>Đơn giá (USD)</Text></View>
            <View style={S.c7}><Text style={[S.ctC, S.bold]}>{`Thành tiền (USD, ${doc.amountLabel})`}</Text></View>
          </View>
          {doc.items.map((item, idx) => {
            const amt = itemAmount(item)
            return (
              <View key={item.id} style={S.tRow} wrap={false}>
                <View style={S.c0}><Text style={S.ctC}>{idx + 1}</Text></View>
                <View style={S.c1}><Text style={S.ctC}>{item.hsCode}</Text></View>
                <View style={S.c2}><Text style={S.ct}>{item.name}</Text></View>
                <View style={S.c3}><Text style={S.ctC}>{item.spec}</Text></View>
                <View style={S.c4}><Text style={S.ctC}>{item.unit}</Text></View>
                <View style={S.c5}><Text style={S.ctC}>{item.qty ? Number(item.qty).toLocaleString('de-DE') : ''}</Text></View>
                <View style={S.c6}><Text style={S.ctR}>{item.unitPrice ? `$${fmtEU(parseFloat(item.unitPrice))}` : ''}</Text></View>
                <View style={S.c7}><Text style={S.ctR}>{amt > 0 ? `$${fmtEU(amt)}` : ''}</Text></View>
              </View>
            )
          })}
          <View style={S.tTotal}>
            <View style={{ width: '66%', borderRight: '0.5px solid #bbb' }}>
              <Text style={[S.ctC, S.bold]}>合计 Total Amount:</Text>
            </View>
            <View style={S.c5}>
              <Text style={[S.ctC, S.bold]}>
                {doc.items.reduce((s, i) => s + (parseFloat(i.qty) || 0), 0).toLocaleString('de-DE')}
              </Text>
            </View>
            <View style={S.c6}><Text style={S.ct} /></View>
            <View style={S.c7}><Text style={[S.ctR, S.bold]}>{total > 0 ? `$${fmtEU(total)}` : ''}</Text></View>
          </View>
        </View>

        {/* SAY + Note */}
        {doc.sayUsdEn && <Text style={S.say}>{doc.sayUsdEn}</Text>}
        {doc.sayUsdVi && <Text style={[S.say, { fontWeight: 'normal' }]}>{doc.sayUsdVi}</Text>}
        {doc.note     && <Text style={S.note}>{doc.note}</Text>}

        <View style={S.divider} />

        {/* Bank */}
        {doc.beneficiary && <Text style={S.bankLine}>Beneficiary: {doc.beneficiary}</Text>}
        {doc.bankAccount && <Text style={S.bankLine}>Bank account no (USD): {doc.bankAccount}</Text>}
        {doc.swiftCode   && <Text style={S.bankLine}>Swift code: {doc.swiftCode}</Text>}
        {doc.bankName    && <Text style={S.bankLine}>Bank name: {doc.bankName}</Text>}
        {doc.bankAddress && <Text style={S.bankLine}>Bank add: {doc.bankAddress}</Text>}

      </Page>
    </Document>
  )
}

// ── Blob generator ────────────────────────────────────────────────────────────

export async function generateInvoiceBlob(doc: InvoiceDoc): Promise<Blob> {
  return pdf(<InvoicePDF doc={doc} />).toBlob()
}

// ── Editor helpers ────────────────────────────────────────────────────────────

const inputClass = 'w-full text-xs bg-transparent border-b border-transparent hover:border-muted-foreground/40 focus:border-primary outline-none py-0.5 transition-colors'
const taClass    = inputClass + ' resize-none overflow-hidden'

function AutoTextarea({ value, onChange, className, placeholder }: {
  value: string; onChange: (v: string) => void; className?: string; placeholder?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'
  }, [value])
  return <textarea ref={ref} value={value} rows={1} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} className={className} style={{ overflow: 'hidden' }} />
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='border rounded-lg p-3 space-y-2 bg-background'>
      <p className='text-[10px] font-semibold uppercase tracking-widest text-muted-foreground'>{title}</p>
      {children}
    </div>
  )
}

function FieldInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className='flex items-center gap-2'>
      <span className='text-[10px] text-muted-foreground shrink-0 w-36'>{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
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

function ItemsEditor({ items, onChange }: { items: InvoiceItem[]; onChange: (v: InvoiceItem[]) => void }) {
  const setField = (id: string, f: keyof InvoiceItem, v: string) =>
    onChange(items.map(i => i.id === id ? { ...i, [f]: v } : i))
  const remove = (id: string) => onChange(items.filter(i => i.id !== id))
  const add    = () => onChange([...items, { id: mkId(), hsCode: '', name: '', spec: '', unit: 'Thùng', qty: '', unitPrice: '' }])
  const move   = (idx: number, dir: -1 | 1) => {
    const next = [...items]
    ;[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]
    onChange(next)
  }
  return (
    <div className='space-y-2'>
      <div className='grid grid-cols-[1rem_1fr_2fr_1fr_1fr_1fr_1fr_1rem] gap-x-2 text-[9px] font-medium text-muted-foreground pb-1 border-b'>
        <span /><span>HS Code</span><span>Name (CN/EN)</span><span>Spec</span><span>Unit</span><span>Qty</span><span>Unit Price</span><span />
      </div>
      {items.map((item, idx) => (
        <div key={item.id} className='grid grid-cols-[1rem_1fr_2fr_1fr_1fr_1fr_1fr_1rem] gap-x-2 items-start group border-b border-dashed pb-2'>
          <div className='flex flex-col opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
            <button onClick={() => move(idx, -1)} disabled={idx === 0} className='text-muted-foreground hover:text-foreground disabled:opacity-20 leading-none'>
              <ChevronUp className='size-3' />
            </button>
            <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className='text-muted-foreground hover:text-foreground disabled:opacity-20 leading-none'>
              <ChevronDown className='size-3' />
            </button>
          </div>
          <input value={item.hsCode}    onChange={e => setField(item.id, 'hsCode',    e.target.value)} className={inputClass} />
          <AutoTextarea value={item.name} onChange={v => setField(item.id, 'name', v)} className={taClass} />
          <input value={item.spec}      onChange={e => setField(item.id, 'spec',      e.target.value)} className={inputClass} />
          <input value={item.unit}      onChange={e => setField(item.id, 'unit',      e.target.value)} className={inputClass} />
          <input value={item.qty}       onChange={e => setField(item.id, 'qty',       e.target.value)} type='number' className={inputClass} />
          <input value={item.unitPrice} onChange={e => setField(item.id, 'unitPrice', e.target.value)} type='number' className={inputClass} />
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

export function CommercialInvoice({ shipmentId }: { shipmentId: string }) {
  const ctx = useGenerateCtx()
  const doc = ctx.getDrafts(shipmentId).invoice ?? BLANK_INVOICE
  const set = <K extends keyof InvoiceDoc>(k: K, v: InvoiceDoc[K]) =>
    ctx.setInvoice(shipmentId, { ...doc, [k]: v })
  const hasContent = doc.items.length > 0 || !!doc.invNo

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
          <SectionCard title='Invoice Info'>
            <FieldInput label='INV No.'  value={doc.invNo} onChange={v => set('invNo', v)} />
            <FieldInput label='Date'     value={doc.date}  onChange={v => set('date', v)} />
          </SectionCard>
          <SectionCard title='Consignee'>
            <FieldInput label='Company name' value={doc.consigneeName}    onChange={v => set('consigneeName', v)} />
            <FieldInput label='Address'      value={doc.consigneeAddress} onChange={v => set('consigneeAddress', v)} />
          </SectionCard>
          <SectionCard title='Goods Table'>
            <FieldInput label='Amount column label' value={doc.amountLabel} onChange={v => set('amountLabel', v)} placeholder='FOB Bằng Tường' />
            <div className='mt-2'><ItemsEditor items={doc.items} onChange={v => set('items', v)} /></div>
          </SectionCard>
          <SectionCard title='Footer'>
            <div className='space-y-1'>
              <span className='text-[10px] text-muted-foreground'>SAY USD (EN)</span>
              <AutoTextarea value={doc.sayUsdEn} onChange={v => set('sayUsdEn', v)} className={taClass} placeholder='SAY UNITED STATES DOLLARS...' />
            </div>
            <div className='space-y-1'>
              <span className='text-[10px] text-muted-foreground'>SAY USD (VI)</span>
              <AutoTextarea value={doc.sayUsdVi} onChange={v => set('sayUsdVi', v)} className={taClass} placeholder='Tổng số tiền:...' />
            </div>
            <div className='space-y-1'>
              <span className='text-[10px] text-muted-foreground'>Note</span>
              <AutoTextarea value={doc.note} onChange={v => set('note', v)} className={taClass} placeholder='This batch of goods...' />
            </div>
          </SectionCard>
          <SectionCard title='Seller Bank Details'>
            <FieldInput label='Beneficiary'  value={doc.beneficiary}  onChange={v => set('beneficiary', v)} />
            <FieldInput label='Bank account' value={doc.bankAccount}  onChange={v => set('bankAccount', v)} />
            <FieldInput label='Swift code'   value={doc.swiftCode}    onChange={v => set('swiftCode', v)} />
            <FieldInput label='Bank name'    value={doc.bankName}     onChange={v => set('bankName', v)} />
            <FieldInput label='Bank address' value={doc.bankAddress}  onChange={v => set('bankAddress', v)} />
          </SectionCard>
        </div>
      </ResizablePanel>
      <ResizableCustomHandle />
      <ResizablePanel defaultSize='50%' className='flex flex-col overflow-hidden bg-muted/30'>
        {hasContent ? (
          <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
            <InvoicePDF doc={doc} />
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
