'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import {
  Download, Trash2, Upload, RefreshCw, Link, Pencil, FileText,
  Check, X, Loader2, FileUp, AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

// ── Types ─────────────────────────────────────────────────────────────────────

type ShipmentDoc = {
  id:               string
  shipment_id:      string
  doc_type:         string
  file_name:        string
  storage_path:     string | null
  is_auto_generated: boolean
  uploaded_at:      string | null
}

const BUCKET = 'shipment-documents'

const DOC_TYPE_LABEL: Record<string, string> = {
  contract:     'Sale Contract',
  invoice:      'Commercial Invoice',
  packing_list: 'Packing List',
  other:        'Other',
}

const DOC_TYPE_CLASS: Record<string, string> = {
  contract:     'bg-blue-50 text-blue-700 border-blue-200',
  invoice:      'bg-green-50 text-green-700 border-green-200',
  packing_list: 'bg-amber-50 text-amber-700 border-amber-200',
  other:        'bg-gray-50 text-gray-600 border-gray-200',
}

function DocTypeBadge({ type }: { type: string }) {
  const label = DOC_TYPE_LABEL[type] ?? type
  const cls   = DOC_TYPE_CLASS[type] ?? DOC_TYPE_CLASS.other
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${cls}`}>
      {label}
    </span>
  )
}

function fmtDate(s: string | null) {
  if (!s) return '—'
  return new Date(s).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function triggerDownload(url: string, fileName: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

async function getSignedUrl(supabase: ReturnType<typeof createClient>, path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 86400) // 24h
  if (error || !data) return null
  return data.signedUrl
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DocumentsTab({ shipmentId }: { shipmentId: string }) {
  const supabase = createClient()

  const [docs, setDocs]                 = useState<ShipmentDoc[] | null>(null) // null = loading
  const [missingIds, setMissingIds]     = useState<Set<string>>(new Set())
  const [selected, setSelected]         = useState<Set<string>>(new Set())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch docs + kiểm tra file nào không tồn tại trên storage
  async function loadDocs(cancelled?: () => boolean) {
    const [{ data, error }, { data: storageFiles }] = await Promise.all([
      supabase
        .from('shipment_document')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('uploaded_at', { ascending: false }),
      supabase.storage
        .from(BUCKET)
        .list(`shipments/${shipmentId}`),
    ])

    if (cancelled?.()) return
    if (error) { toast.error(error.message); return }

    const existingNames = new Set(storageFiles?.map(f => f.name) ?? [])
    const missing = new Set(
      (data ?? [])
        .filter(d => d.storage_path && !existingNames.has(d.storage_path.split('/').pop()!))
        .map(d => d.id)
    )

    setDocs(data ?? [])
    setMissingIds(missing)
  }

  // Always fetch fresh on mount — never use cached/SSR data
  useEffect(() => {
    let _cancelled = false
    loadDocs(() => _cancelled)
    return () => { _cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentId])

  const [isUploading, setIsUploading]   = useState(false)
  const [deleteTargets, setDeleteTargets] = useState<ShipmentDoc[] | null>(null)
  const [renamingId, setRenamingId]       = useState<string | null>(null)
  const [renameValue, setRenameValue]     = useState('')
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Selection ───────────────────────────────────────────────────────────────

  const docList       = docs ?? []
  const allSelected   = docList.length > 0 && selected.size === docList.length
  const someSelected  = selected.size > 0 && !allSelected
  const selectedDocs  = docList.filter(d => selected.has(d.id))

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(docList.map(d => d.id)))
  }
  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Refresh ─────────────────────────────────────────────────────────────────

  async function handleRefresh() {
    setIsRefreshing(true)
    await loadDocs()
    setSelected(new Set())
    setIsRefreshing(false)
  }


  // ── Upload ──────────────────────────────────────────────────────────────────

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setIsUploading(true)
    const ts = Date.now()
    const inserted: ShipmentDoc[] = []

    for (const file of Array.from(files)) {
      const sanitized   = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const storagePath = `shipments/${shipmentId}/${ts}_${sanitized}`

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file, { contentType: file.type || 'application/octet-stream', upsert: false })

      if (uploadErr) { toast.error(`Upload "${file.name}": ${uploadErr.message}`); continue }

      const { data, error: dbErr } = await supabase
        .from('shipment_document')
        .insert({
          shipment_id:      shipmentId,
          doc_type:         'other',
          file_name:        file.name,
          storage_path:     storagePath,
          is_auto_generated: false,
        })
        .select()
        .single()

      if (dbErr) { toast.error(`DB insert "${file.name}": ${dbErr.message}`); continue }
      if (data) inserted.push(data)
    }

    setDocs(prev => [...inserted, ...prev])
    setIsUploading(false)
    if (inserted.length > 0) toast.success(`Đã upload ${inserted.length} file.`)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Download ─────────────────────────────────────────────────────────────────

  async function handleDownload(targets: ShipmentDoc[]) {
    for (const doc of targets) {
      if (!doc.storage_path) { toast.error(`"${doc.file_name}" không có file.`); continue }
      setActionLoading(p => ({ ...p, [doc.id]: true }))
      const url = await getSignedUrl(supabase, doc.storage_path)
      setActionLoading(p => ({ ...p, [doc.id]: false }))
      if (!url) { toast.error(`Không thể tạo link cho "${doc.file_name}".`); continue }
      triggerDownload(url, doc.file_name)
      // small delay between multiple downloads so browser doesn't block them
      if (targets.length > 1) await new Promise(r => setTimeout(r, 300))
    }
  }

  // ── Copy link ────────────────────────────────────────────────────────────────

  async function handleCopyLink(doc: ShipmentDoc) {
    if (!doc.storage_path) { toast.error('File này không có storage path.'); return }
    setActionLoading(p => ({ ...p, [doc.id]: true }))
    const url = await getSignedUrl(supabase, doc.storage_path)
    setActionLoading(p => ({ ...p, [doc.id]: false }))
    if (!url) { toast.error('Không thể tạo link.'); return }
    await navigator.clipboard.writeText(url)
    toast.success('Đã copy link (hiệu lực 24 giờ).')
  }

  // ── Rename ───────────────────────────────────────────────────────────────────

  function startRename(doc: ShipmentDoc) {
    setRenamingId(doc.id)
    setRenameValue(doc.file_name)
  }

  async function commitRename(doc: ShipmentDoc) {
    const newName = renameValue.trim()
    if (!newName || newName === doc.file_name) { setRenamingId(null); return }

    const { error } = await supabase
      .from('shipment_document')
      .update({ file_name: newName })
      .eq('id', doc.id)

    if (error) { toast.error(error.message); return }
    setDocs(prev => prev ? prev.map(d => d.id === doc.id ? { ...d, file_name: newName } : d) : prev)
    setRenamingId(null)
    toast.success('Đã đổi tên.')
  }

  // ── Delete ───────────────────────────────────────────────────────────────────

  async function confirmDelete() {
    if (!deleteTargets || deleteTargets.length === 0) return

    const paths = deleteTargets.map(d => d.storage_path).filter(Boolean) as string[]
    if (paths.length > 0) {
      const { error } = await supabase.storage.from(BUCKET).remove(paths)
      if (error) { toast.error(`Storage: ${error.message}`); setDeleteTargets(null); return }
    }

    const ids = deleteTargets.map(d => d.id)
    const { error: dbErr } = await supabase
      .from('shipment_document')
      .delete()
      .in('id', ids)

    if (dbErr) { toast.error(dbErr.message); setDeleteTargets(null); return }

    setDocs(prev => prev ? prev.filter(d => !ids.includes(d.id)) : prev)
    setSelected(prev => { const n = new Set(prev); ids.forEach(id => n.delete(id)); return n })
    toast.success(`Đã xoá ${deleteTargets.length} file.`)
    setDeleteTargets(null)
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>

      {/* Toolbar */}
      <div className='flex items-center h-9 px-4 gap-2 border-b bg-background shrink-0'>
        <p className='text-[11px] font-medium text-muted-foreground uppercase tracking-wide'>
          {docs === null
            ? 'Đang tải...'
            : selected.size > 0
              ? `${selected.size} file được chọn`
              : `Tài liệu — ${docs.length} file`}
        </p>

        <div className='ml-auto flex items-center gap-1.5'>
          {/* Batch download */}
          {selected.size > 0 && (
            <Button
              variant='outline' size='sm' className='h-7 text-xs gap-1.5'
              onClick={() => handleDownload(selectedDocs)}
            >
              <Download className='size-3' />
              Tải xuống ({selected.size})
            </Button>
          )}

          {/* Batch delete */}
          {selected.size > 0 && (
            <Button
              variant='outline' size='sm' className='h-7 text-xs gap-1.5 text-destructive hover:text-destructive'
              onClick={() => setDeleteTargets(selectedDocs)}
            >
              <Trash2 className='size-3' />
              Xoá ({selected.size})
            </Button>
          )}

          {/* Upload */}
          <Button
            variant='outline' size='sm' className='h-7 text-xs gap-1.5'
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading
              ? <Loader2 className='size-3 animate-spin' />
              : <Upload className='size-3' />
            }
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type='file'
            multiple
            className='hidden'
            onChange={e => handleUpload(e.target.files)}
          />

          {/* Refresh */}
          <Button
            variant='ghost' size='sm' className='h-7 text-xs gap-1.5'
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`size-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className='flex-1 overflow-auto p-4'>
        {docs === null ? (
          <div className='h-full flex items-center justify-center'>
            <Loader2 className='size-5 animate-spin text-muted-foreground' />
          </div>
        ) : docs.length === 0 ? (
          <div className='h-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
            <FileUp className='size-10 opacity-20' />
            <p className='text-xs'>Chưa có tài liệu nào. Upload file hoặc Generate để tạo.</p>
          </div>
        ) : (
          <table className='text-sm border-collapse w-full'>
            <thead>
              <tr className='border-b'>
                <th className='pb-2 px-2 w-8'>
                  <input
                    type='checkbox'
                    checked={allSelected}
                    ref={el => { if (el) el.indeterminate = someSelected }}
                    onChange={toggleAll}
                    className='cursor-pointer'
                  />
                </th>
                <th className='text-left text-[11px] font-medium text-muted-foreground pb-2 px-2'>Tên file</th>
                <th className='text-left text-[11px] font-medium text-muted-foreground pb-2 px-2 w-36'>Loại</th>
                <th className='text-left text-[11px] font-medium text-muted-foreground pb-2 px-2 w-24'>Nguồn</th>
                <th className='text-left text-[11px] font-medium text-muted-foreground pb-2 px-2 w-40'>Ngày upload</th>
                <th className='pb-2 px-2 w-28' />
              </tr>
            </thead>
            <tbody>
              {docList.map(doc => {
                const isEditing   = renamingId === doc.id
                const isActing    = actionLoading[doc.id]
                const isSelected  = selected.has(doc.id)
                const isMissing   = missingIds.has(doc.id)

                return (
                  <tr
                    key={doc.id}
                    onClick={() => !isEditing && handleDownload([doc])}
                    className={`border-b align-middle group cursor-pointer ${isSelected ? 'bg-accent/10' : 'hover:bg-muted/40'}`}
                  >
                    {/* Checkbox */}
                    <td className='px-2 py-1.5 w-8' onClick={e => e.stopPropagation()}>
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => toggleOne(doc.id)}
                        className='cursor-pointer'
                      />
                    </td>

                    {/* File name */}
                    <td className='px-2 py-1.5'>
                      <div className='flex items-center gap-2'>
                        <FileText className='size-3.5 text-muted-foreground shrink-0' />
                        {isEditing ? (
                          <div className='flex items-center gap-1 flex-1' onClick={e => e.stopPropagation()}>
                            <input
                              autoFocus
                              value={renameValue}
                              onChange={e => setRenameValue(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') commitRename(doc)
                                if (e.key === 'Escape') setRenamingId(null)
                              }}
                              onBlur={() => commitRename(doc)}
                              className='flex-1 h-6 min-w-0 rounded border bg-background px-1.5 text-xs outline-none focus:ring-1 focus:ring-ring'
                            />
                            <button onClick={() => commitRename(doc)} className='text-green-600 hover:text-green-700'>
                              <Check className='size-3.5' />
                            </button>
                            <button onClick={() => setRenamingId(null)} className='text-muted-foreground hover:text-foreground'>
                              <X className='size-3.5' />
                            </button>
                          </div>
                        ) : (
                          <div className='flex items-center gap-1.5 min-w-0'>
                            <span className='text-xs font-medium truncate max-w-xs' title={doc.file_name}>
                              {doc.file_name}
                            </span>
                            {isMissing && (
                              <span
                                className='inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border bg-red-50 text-red-600 border-red-200 shrink-0'
                                title='File không tồn tại trên storage'
                              >
                                <AlertTriangle className='size-2.5' />
                                Không tìm thấy file
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Doc type */}
                    <td className='px-2 py-1.5 w-36'>
                      <DocTypeBadge type={doc.doc_type} />
                    </td>

                    {/* Source */}
                    <td className='px-2 py-1.5 w-24'>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                        doc.is_auto_generated
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {doc.is_auto_generated ? 'Tự tạo' : 'Upload'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className='px-2 py-1.5 w-40 text-xs text-muted-foreground tabular-nums'>
                      {fmtDate(doc.uploaded_at)}
                    </td>

                    {/* Row actions */}
                    <td className='px-2 py-1.5 w-28' onClick={e => e.stopPropagation()}>
                      {isActing ? (
                        <Loader2 className='size-3.5 animate-spin text-muted-foreground ml-1' />
                      ) : (
                        <div className='flex items-center gap-0.5 invisible group-hover:visible bg-background border rounded-md shadow-sm px-0.5'>
                          <ActionBtn title='Tải xuống' onClick={() => handleDownload([doc])}>
                            <Download className='size-3' />
                          </ActionBtn>
                          <ActionBtn title='Copy link (24h)' onClick={() => handleCopyLink(doc)}>
                            <Link className='size-3' />
                          </ActionBtn>
                          <ActionBtn title='Đổi tên' onClick={() => startRename(doc)}>
                            <Pencil className='size-3' />
                          </ActionBtn>
                          <ActionBtn title='Xoá' onClick={() => setDeleteTargets([doc])} danger>
                            <Trash2 className='size-3' />
                          </ActionBtn>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTargets} onOpenChange={open => { if (!open) setDeleteTargets(null) }}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>Xoá tài liệu?</DialogTitle>
            <DialogDescription>
              {deleteTargets?.length === 1
                ? <>Bạn có chắc muốn xoá <span className='font-medium text-foreground'>{deleteTargets[0].file_name}</span>?</>
                : <>Bạn có chắc muốn xoá <span className='font-medium text-foreground'>{deleteTargets?.length} file</span>?</>
              }
              {' '}File sẽ bị xoá khỏi storage và không thể khôi phục.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' size='sm' onClick={() => setDeleteTargets(null)}>Huỷ</Button>
            <Button variant='destructive' size='sm' onClick={confirmDelete}>Xoá</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

// ── Small helper ──────────────────────────────────────────────────────────────

function ActionBtn({ children, onClick, title, danger }: {
  children: React.ReactNode
  onClick: () => void
  title?: string
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1 rounded transition-colors ${
        danger
          ? 'text-muted-foreground hover:text-destructive'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}
