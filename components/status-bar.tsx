'use client'

// ─── Imports ─────────────────────────────────────────────────────────────────
import { FileText, Users, CheckCircle, Globe } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

// ─── StatusBar ───────────────────────────────────────────────────────────────
export function StatusBar() {
  const { lang } = useLang()

  return (
    <footer className='flex items-center h-5 px-3 gap-3 bg-primary text-primary-foreground text-[10px] shrink-0'>

      <StatusItem icon={FileText}>4 shipments</StatusItem>
      <StatusSep />
      <StatusItem icon={Users}>3 customers</StatusItem>
      <StatusSep />
      <StatusItem icon={CheckCircle}>1 finalized</StatusItem>

      {/* Push language to right */}
      <div className='ml-auto'>
        <StatusItem icon={Globe}>{lang.toUpperCase()}</StatusItem>
      </div>

    </footer>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatusItem({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className='flex items-center gap-1 opacity-80'>
      <Icon className='size-3' />
      {children}
    </span>
  )
}

function StatusSep() {
  return <span className='w-px h-3 bg-primary-foreground/30' />
}
