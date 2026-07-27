'use client'

// ─── Imports ─────────────────────────────────────────────────────────────────
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Users, Building2, Settings, Home, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLang } from '@/lib/i18n/context'

// ─── Sub-components ──────────────────────────────────────────────────────────
function NavItem({ href, icon: Icon, label, active }: {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors',
        active
          ? 'bg-accent/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className='size-4 shrink-0' />
      {label}
    </Link>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export function AppSidebar() {
  const pathname = usePathname()
  const { t } = useLang()

  const TOP_NAV = [
    { href: '/', icon: Home, label: t.nav.home },
    { href: '/shipments', icon: LayoutGrid, label: t.nav.explorer },

    { href: '/customers', icon: Users, label: t.nav.customers },
  ]

  const BOTTOM_NAV = [
    { href: '/seller', icon: Building2, label: t.nav.sellerProfile },
    { href: '/settings', icon: Settings, label: t.nav.settings },
    { href: '/recycle-bin', icon: Trash2, label: t.nav.recycleBin },
  ]



  return (
    <nav className='flex flex-col h-full py-2 px-2 gap-0.5'>

      {/* Top nav */}
      <div className='flex flex-col gap-0.5'>
        {TOP_NAV.map(item => (
          <NavItem key={item.href} {...item} active={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)} />
        ))}
      </div>

      {/* Spacer */}
      <div className='flex-1' />

      {/* Divider */}
      <div className='h-px bg-border mx-1 my-1' />

      {/* Bottom nav */}
      <div className='flex flex-col gap-0.5'>
        {BOTTOM_NAV.map(item => (
          <NavItem key={item.href} {...item} active={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)} />
        ))}

      </div>

    </nav>
  )
}
