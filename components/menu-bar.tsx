'use client'

// ─── Imports ─────────────────────────────────────────────────────────────────
import { ChevronDown, Globe, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLang } from '@/lib/i18n/context'
import { Lang } from '@/lib/i18n/translations'
import { logout } from '@/app/(dashboard)/action'

// ─── Constants ───────────────────────────────────────────────────────────────
const LANG_OPTIONS: { value: Lang; label: string; native: string }[] = [
  { value: 'vi', label: 'Tiếng Việt', native: 'VI' },
  { value: 'en', label: 'English',    native: 'EN' },
  { value: 'cn', label: '中文',        native: '中' },
]

// ─── MenuBar ─────────────────────────────────────────────────────────────────
export function MenuBar({ userEmail }: { userEmail: string }) {
  const { t, lang, setLang } = useLang()

  const MENUS = [
    {
      label: t.menubar.file,
      items: [
        { label: t.menubar.newShipment, shortcut: '⌘N'  },
        { label: t.menubar.newCustomer, shortcut: '⌘⇧N' },
        null,
        { label: t.menubar.exportPdf,   shortcut: '⌘E'  },
      ],
    },
    {
      label: t.menubar.edit,
      items: [
        { label: t.menubar.undo, shortcut: '⌘Z'  },
        { label: t.menubar.redo, shortcut: '⌘⇧Z' },
      ],
    },
    {
      label: t.menubar.view,
      items: [
        { label: t.menubar.toggleSidebar, shortcut: '⌘B' },
      ],
    },
  ]

  // Display name: phần trước @ của email
  const displayName = userEmail ? userEmail.split('@')[0] : '...'
  const currentLang = LANG_OPTIONS.find(o => o.value === lang)!

  return (
    <header className='flex items-center h-7 px-3 gap-1 border-b bg-muted/50 shrink-0'>

      {/* App name */}
      <span className='text-xs font-semibold tracking-tight mr-2'>HH Docs</span>

      {/* File / Edit / View menus */}
      {MENUS.map(menu => (
        <DropdownMenu key={menu.label}>
          <DropdownMenuTrigger className='text-xs text-muted-foreground px-2 py-0.5 rounded hover:bg-muted hover:text-foreground outline-none cursor-default'>
            {menu.label}
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='min-w-44'>
            {menu.items.map((item, i) =>
              item === null
                ? <DropdownMenuSeparator key={i} />
                : (
                  <DropdownMenuItem key={item.label} className='flex justify-between gap-8 text-xs'>
                    {item.label}
                    {item.shortcut && (
                      <span className='text-muted-foreground'>{item.shortcut}</span>
                    )}
                  </DropdownMenuItem>
                )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      {/* Push right */}
      <div className='flex-1' />

      {/* Language switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger className='flex items-center gap-1 text-xs text-muted-foreground px-2 py-0.5 rounded hover:bg-muted hover:text-foreground outline-none cursor-default '>
          <Globe className='size-3' />
          {currentLang.native}
          <ChevronDown className='size-3' />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-36'>
          {LANG_OPTIONS.map(opt => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => setLang(opt.value)}
              data-active={lang === opt.value}
              className='text-xs gap-2 data-[active=true]:font-medium'
            >
              <span className='w-5 text-center text-muted-foreground'>{opt.native}</span>
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Account */}
      <DropdownMenu>
        <DropdownMenuTrigger className='flex items-center gap-1 text-xs text-muted-foreground px-2 py-0.5 rounded hover:bg-muted hover:text-foreground outline-none cursor-default'>
          <User className='size-3' />
          {displayName}
          <ChevronDown className='size-3' />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-40'>
          <div className='px-2 py-1.5 text-xs text-muted-foreground truncate'>{userEmail}</div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='text-xs gap-2 text-destructive focus:text-destructive'
            onClick={() => logout()}
          >
            <LogOut className='size-3' />
            {t.account.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </header>
  )
}
