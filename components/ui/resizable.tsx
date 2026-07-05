"use client"

import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  children,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />
      )}
      {children}
    </ResizablePrimitive.Separator>
  )
}

function ResizableCustomHandle({
  className,
  ...props
}: React.ComponentProps<typeof ResizableHandle>) {
  return (
    <ResizableHandle
      className={cn(
        // Mở rộng ::after hit area (base: w-1 / h-1) để dễ nắm
        "after:w-4 aria-[orientation=horizontal]:after:h-4",
        // ::before — highlight, ẩn mặc định, hiện khi hover chính element
        "before:absolute before:content-[''] before:bg-primary before:opacity-0 before:transition-opacity before:duration-150",
        "hover:before:opacity-100",
        // ::before vertical — đường dọc
        "aria-[orientation=vertical]:before:inset-y-0 aria-[orientation=vertical]:before:left-1/2 aria-[orientation=vertical]:before:-translate-x-1/2 aria-[orientation=vertical]:before:w-0.5",
        // ::before horizontal — đường ngang
        "aria-[orientation=horizontal]:before:inset-x-0 aria-[orientation=horizontal]:before:top-1/2 aria-[orientation=horizontal]:before:-translate-y-1/2 aria-[orientation=horizontal]:before:h-0.5",
        className
      )}
      {...props}
    />
  )
}

export { ResizableHandle, ResizableCustomHandle, ResizablePanel, ResizablePanelGroup }
