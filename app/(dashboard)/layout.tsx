// ─── Imports ─────────────────────────────────────────────────────────────────
import { MenuBar } from '@/components/menu-bar'
import { AppSidebar } from '@/components/app-sidebar'
import { StatusBar } from '@/components/status-bar'
import { ResizableCustomHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { createClient } from '@/lib/supabase/server'

// ─── Layout ──────────────────────────────────────────────────────────────────
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className='flex flex-col h-screen overflow-hidden'>

      <MenuBar userEmail={user?.email ?? ''} />

      <ResizablePanelGroup orientation='horizontal' className='flex-1 overflow-hidden'>

        {/* Sidebar */}
        <ResizablePanel defaultSize='16%' minSize='10%' maxSize="50%" collapsedSize={0} collapsible className='bg-muted/40 border-r'>
          <AppSidebar />
        </ResizablePanel>

        <ResizableCustomHandle />

        {/* Main content */}
        <ResizablePanel defaultSize='84%'>
          <div className='flex flex-col h-full overflow-hidden'>
            {children}
          </div>
        </ResizablePanel>

      </ResizablePanelGroup>

      {/* <StatusBar /> */}

    </div>
  )
}
