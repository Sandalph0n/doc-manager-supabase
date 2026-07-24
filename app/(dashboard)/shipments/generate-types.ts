// Shared types and helpers for the Generate Documents flow.

import type { Shipment }     from '@/schemas/shipment'
import type { ShipmentItem } from '@/schemas/shipment-item'
import type { Customer }     from '@/schemas/customer'

// ── Primitive types ───────────────────────────────────────────────────────────

export type Line = {
  id:         string
  val:        string
  bold?:      boolean
  underline?: boolean
}

export type ContractItem = {
  id:        string
  name:      string   // displayed in table (may be multiline CN\nEN)
  spec:      string
  qty:       string
  weight:    string
  unitPrice: string
  priceUnit: 'qty' | 'weight'  // amount = qty*price OR weight*price
}

export type Term = {
  id:     string
  num:    number
  cnText: string   // Chinese text (rendered bold)
  enText: string   // English text (rendered regular)
}

export type ContractDoc = {
  header:            Line[]
  sellerLines:       Line[]
  ctNo:              string
  date:              string
  placeOfSigning:    string    // EN, e.g. "GUANGZHOU"
  placeOfSigningCn:  string    // CN, e.g. "广州"
  buyerLines:        Line[]
  openingLines:      Line[]
  items:             ContractItem[]
  amountLabel:       string    // column header suffix, e.g. "DAF Chi Ma"
  terms:             Term[]
  sellerSig:         string
  buyerSig:          string
}

// ── InvoiceDoc ────────────────────────────────────────────────────────────────

export type InvoiceItem = {
  id:        string
  hsCode:    string
  name:      string   // multiline: CN \n EN
  spec:      string   // Quy cách đóng gói
  unit:      string   // Đơn vị tính
  qty:       string
  unitPrice: string
}

export type InvoiceDoc = {
  sellerNameCn:     string
  sellerNameEn:     string
  sellerAddrCn:     string
  sellerAddrEn:     string
  invNo:            string
  date:             string
  consigneeName:    string
  consigneeAddress: string
  amountLabel:      string   // e.g. "FOB Bằng Tường"
  items:            InvoiceItem[]
  sayUsdEn:         string
  sayUsdVi:         string
  note:             string
  beneficiary:      string
  bankAccount:      string
  swiftCode:        string
  bankName:         string
  bankAddress:      string
}

export const BLANK_INVOICE: InvoiceDoc = {
  sellerNameCn: '', sellerNameEn: '', sellerAddrCn: '', sellerAddrEn: '',
  invNo: '', date: '', consigneeName: '', consigneeAddress: '',
  amountLabel: '', items: [], sayUsdEn: '', sayUsdVi: '', note: '',
  beneficiary: '', bankAccount: '', swiftCode: '', bankName: '', bankAddress: '',
}

// ── PackingListDoc ────────────────────────────────────────────────────────────

export type PLItem = {
  id:    string
  marks: string
  name:  string   // CN \n EN
  spec:  string
  qty:   string
  nwKg:  string
  gwKg:  string
  cbm:   string
}

export type PackingListDoc = {
  sellerNameCn:     string
  sellerNameEn:     string
  sellerAddrCn:     string
  sellerAddrEn:     string
  plNo:             string
  date:             string
  consigneeName:    string
  consigneeAddress: string
  items:            PLItem[]
}

export const BLANK_PL: PackingListDoc = {
  sellerNameCn: '', sellerNameEn: '', sellerAddrCn: '', sellerAddrEn: '',
  plNo: '', date: '', consigneeName: '', consigneeAddress: '', items: [],
}

// ── Data fetched on Generate click ───────────────────────────────────────────

export type GeneratedData = {
  shipment:  Partial<Shipment>
  items:     ShipmentItem[]
  seller:    Record<string, unknown> | null
  customer:  Customer | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export const mkId = (): string => crypto.randomUUID()

export const mkLine = (
  val      = '',
  bold?:     boolean,
  underline?: boolean,
): Line => ({
  id: mkId(),
  val,
  ...(bold      ? { bold: true }      : {}),
  ...(underline ? { underline: true } : {}),
})

export const BLANK: ContractDoc = {
  header: [], sellerLines: [], ctNo: '', date: '',
  placeOfSigning: '', placeOfSigningCn: '',
  buyerLines: [], openingLines: [], items: [],
  amountLabel: '', terms: [], sellerSig: '', buyerSig: '',
}

// ── initDoc — build ContractDoc from DB data ──────────────────────────────────

export function initDoc(data: GeneratedData): ContractDoc {
  const { shipment, items: dbItems, seller, customer } = data

  const items: ContractItem[] = dbItems.map(i => ({
    id:        i.id,
    name:      [i.name_cn, i.name_en, i.name_other].filter(Boolean).join('\n'),
    spec:      i.specification ?? '',
    qty:       i.quantity?.toString()       ?? '',
    weight:    i.nw_kg?.toString()          ?? '',
    unitPrice: i.unit_price_usd?.toString() ?? '',
    // Default to qty; user can toggle to 'weight' in editor if needed
    priceUnit: 'qty' as const,
  }))

  const loading     = shipment.port_of_loading      ?? ''
  const dest        = shipment.port_of_destination  ?? ''
  const transport   = shipment.transport_mode        ?? 'Highway Transportation'
  const routeEN     = loading && dest ? `From ${loading} to ${dest}` : ''
  const routeCN     = loading && dest ? `由 ${loading} 到 ${dest}` : ''
  const packingCN   = shipment.packing_type  ?? '出口包装袋'
  const packingEN   = shipment.packing_type  ?? 'packing in bags for exporting.'
  const marksCN     = shipment.shipping_marks ?? 'N/M'
  const marksEN     = shipment.shipping_marks ?? 'N/M'
  const shipDateCN  = shipment.shipment_date  ?? ''
  const shipDateEN  = shipment.shipment_date  ?? ''
  const paymentEN   = shipment.payment_terms  ?? 'Shipment will be made upon 100% payment receipt.'

  const sellerNameEN  = seller?.company_name_en as string | undefined
  const bankAccount   = seller?.bank_account   as string | undefined
  const swiftCode     = seller?.swift_code     as string | undefined
  const bankName      = seller?.bank_name      as string | undefined
  const bankAddr      = seller?.bank_address   as string | undefined

  const terms: Term[] = [
    {
      id: mkId(), num: 1,
      cnText: '合同总值（大写）美元：___',
      enText: 'The total value of the contract (in capital letters): USD___：___',
    },
    {
      id: mkId(), num: 2,
      cnText: `包装：${packingCN}`,
      enText: `Packing: ${packingEN}`,
    },
    {
      id: mkId(), num: 3,
      cnText: `装运唛头 ${marksCN}`,
      enText: `Shipping Marks: ${marksEN}`,
    },
    {
      id: mkId(), num: 4,
      cnText: `运输方式及运输起讫：${transport === 'Highway Transportation' ? '公路运输' : transport}，${routeCN}`,
      enText: `Transport Mode and Delivery:${transport}: ${routeEN}`,
    },
    {
      id: mkId(), num: 5,
      cnText: `装运期：${shipDateCN}`,
      enText: `Time of Shipment: ${shipDateEN}`,
    },
    {
      id: mkId(), num: 6,
      cnText: '装运单证Shipping Documents:',
      enText: '- 提货单Bill of Lading (BL):\n- 发票Commercial Invoice (CI)\n- 产地证明Certificate of Origin（FE)\n- 装箱单Packing List (P/L)',
    },
    {
      id: mkId(), num: 7,
      cnText: `付款条件：100%付款后发货`,
      enText: [
        `Terms of Payment: ${paymentEN}`,
        sellerNameEN ? `Beneficiary: ${sellerNameEN}` : '',
        bankAccount  ? `Bank account no：${bankAccount}` : '',
        swiftCode    ? `Swift code:${swiftCode}` : '',
        bankName     ? `Bank name:${bankName}` : '',
        bankAddr     ? `Bank add:${bankAddr}` : '',
      ].filter(Boolean).join('\n'),
    },
    {
      id: mkId(), num: 8,
      cnText: '有效期限：\n本合同自双方签字之日或双方以书面形式确认之日生效。本合同在双方完全履行合同项下全部义务前持续有效，除非双方另有书面约定。',
      enText: 'Contract Effectiveness and Validity Period:\nThis Contract shall become effective from the date of signing and remain valid until both Parties have fully fulfilled all obligations under the Contract, unless otherwise agreed in writing.',
    },
    {
      id: mkId(), num: 9,
      cnText: '因本合同产生的所有争议均由越南有管辖权的法院依据越南法律予以解决。',
      enText: 'All disputes arising from this Contract shall be settled by the competent Courts of Vietnam in accordance with Vietnamese law.',
    },
    {
      id: mkId(), num: 10,
      cnText: '本合同一式两份，甲乙双方一致同意，微信、QQ、电子邮件等线上沟通载体形成的所有聊天记录、沟通纪要、确认意见（包括但不限于价格调整、交货变更、条款补充等内容），均属于本合同的有效附件，与本合同正文条款具有同等法律效力，双方均应严格遵守履行。具有同等法律效力，双方各执一份。',
      enText: 'This Contract is made in duplicate. Both Party A and Party B hereby agree that all chat records, communication minutes, and confirmation opinions (including but not limited to price adjustments, delivery changes, and additional clauses) formed through online communication channels such as WeChat, QQ, and email shall be deemed valid attachments to this Contract, with the same legal effect as the main clauses herein. Both parties shall strictly abide by and perform such contents. Each party holds one copy.',
    },
  ]

  // ── Seller lines ───────────────────────────────────────────────────────────
  const sellerLines: Line[] = []
  if (seller) {
    const nameCn = seller.company_name_cn as string | undefined
    const nameEn = seller.company_name_en as string | undefined
    const addrCn = seller.address_cn      as string | undefined
    const addrEn = seller.address_en      as string | undefined
    const person   = seller.authorized_person as string | undefined
    const position = seller.position          as string | undefined
    const taxCode  = seller.tax_code          as string | undefined
    const swift    = seller.swift_code        as string | undefined

    if (nameCn) sellerLines.push(mkLine(`卖方：${nameCn}`, true))
    if (nameEn) sellerLines.push(mkLine(`Sellers: ${nameEn}`))
    if (addrCn) sellerLines.push(mkLine(`地址：${addrCn}`, true))
    if (addrEn) sellerLines.push(mkLine(`Address:${addrEn}`))
    if (person)   sellerLines.push(mkLine(`Authorized Person:${person}`))
    if (position) sellerLines.push(mkLine(`Position: ${position}`))
    sellerLines.push(mkLine(`TAX CODE :${taxCode ? ` ${taxCode}` : ''}`))
    if (bankAccount) sellerLines.push(mkLine(`Bank account no：${bankAccount}`))
    if (swift)       sellerLines.push(mkLine(`Swift code:${swift}`))
    if (bankName)    sellerLines.push(mkLine(`Bank name:${bankName}`))
  }

  // ── Buyer lines (all bold, always show all fields) ────────────────────────
  const buyerLines: Line[] = []
  if (customer) {
    buyerLines.push(mkLine(`Buyer: ${customer.company_name ?? ''}`, true))
    buyerLines.push(mkLine(`TAX CODE: ${customer.tax_code ?? ''}`, true))
    buyerLines.push(mkLine(`Authorized Person: ${customer.contact_person ?? ''}`, true))
    buyerLines.push(mkLine(`Position: ${customer.position ?? ''}`, true))
    buyerLines.push(mkLine(`Address: ${customer.address ?? ''}`, true))
    buyerLines.push(mkLine(`Beneficiary's Account No.: ${customer.bank_account ?? ''}`, true))
    buyerLines.push(mkLine(`Swift code: ${customer.swift_code ?? ''}`, true))
    buyerLines.push(mkLine(`Bank name: ${customer.bank_name ?? ''}`, true))
    buyerLines.push(mkLine(`Bank Address: ${customer.bank_address ?? ''}`, true))
  }

  return {
    header: [mkLine('销 售 合 同'), mkLine('SALES CONTRACT')],
    sellerLines,
    ctNo:             shipment.doc_number     ?? '',
    date:             shipment.contract_date  ?? '',
    placeOfSigning:   'GUANGZHOU',
    placeOfSigningCn: '广州',
    buyerLines,
    openingLines: [
      mkLine('经买卖双方确认根据下列条款订立本合同：', true),
      mkLine('This contract is made out by the Sellers and the Buyers as per the following terms and conditions mutually confirmed.', true),
    ],
    items,
    amountLabel: 'DAF Chi Ma',
    terms,
    sellerSig: (seller?.company_name_en as string) ?? '',
    buyerSig:  customer?.company_name ?? '',
  }
}

// ── initInvoice ───────────────────────────────────────────────────────────────

export function initInvoice(data: GeneratedData): InvoiceDoc {
  const { shipment, items: dbItems, seller, customer } = data

  const items: InvoiceItem[] = dbItems.map(i => ({
    id:        i.id,
    hsCode:    i.hs_code ?? '',
    name:      [i.name_cn, i.name_en].filter(Boolean).join('\n'),
    spec:      i.specification ?? '',
    unit:      'Thùng',
    qty:       i.quantity?.toString() ?? '',
    unitPrice: i.unit_price_usd?.toString() ?? '',
  }))

  return {
    sellerNameCn:     (seller?.company_name_cn as string) ?? '',
    sellerNameEn:     (seller?.company_name_en as string) ?? '',
    sellerAddrCn:     `地址：${(seller?.address_cn as string) ?? ''}`,
    sellerAddrEn:     `ADD：${(seller?.address_en as string) ?? ''}`,
    invNo:            shipment.doc_number ?? '',
    date:             shipment.contract_date ?? '',
    consigneeName:    customer?.company_name ?? '',
    consigneeAddress: customer?.address ?? '',
    amountLabel:      `FOB ${shipment.port_of_loading ?? ''}`,
    items,
    sayUsdEn:         '',
    sayUsdVi:         '',
    note:             '',
    beneficiary:      (seller?.company_name_en as string) ?? '',
    bankAccount:      (seller?.bank_account as string) ?? '',
    swiftCode:        (seller?.swift_code as string) ?? '',
    bankName:         (seller?.bank_name as string) ?? '',
    bankAddress:      (seller?.bank_address as string) ?? '',
  }
}

// ── initPackingList ───────────────────────────────────────────────────────────

export function initPackingList(data: GeneratedData): PackingListDoc {
  const { shipment, items: dbItems, seller, customer } = data

  const marks = shipment.shipping_marks ?? 'N/M'

  const items: PLItem[] = dbItems.map(i => ({
    id:    i.id,
    marks,
    name:  [i.name_cn, i.name_en].filter(Boolean).join('\n'),
    spec:  i.specification ?? '',
    qty:   i.quantity?.toString() ?? '',
    nwKg:  i.nw_kg?.toString()  ?? '',
    gwKg:  i.gw_kg?.toString()  ?? '',
    cbm:   i.cbm?.toString()    ?? '',
  }))

  return {
    sellerNameCn:     (seller?.company_name_cn as string) ?? '',
    sellerNameEn:     (seller?.company_name_en as string) ?? '',
    sellerAddrCn:     `地址：${(seller?.address_cn as string) ?? ''}`,
    sellerAddrEn:     `ADD：${(seller?.address_en as string) ?? ''}`,
    plNo:             shipment.doc_number ?? '',
    date:             shipment.contract_date ?? '',
    consigneeName:    customer?.company_name ?? '',
    consigneeAddress: customer?.address ?? '',
    items,
  }
}
