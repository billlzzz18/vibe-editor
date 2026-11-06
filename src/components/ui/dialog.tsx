import * as React from "react"
import {
  Dialog as DialogPrimitive,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive

const DialogContentComponent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-4 z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 rounded-3xl border bg-background/80 backdrop-blur-xl p-6 shadow-2xl duration-200 data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContentComponent.displayName = DialogPrimitive.Content.displayName

const DialogHeaderComponent = (
  { className, ...props }: React.HTMLAttributes<HTMLDivElement>
) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
)
DialogHeaderComponent.displayName = "DialogHeader"

const DialogFooterComponent = (
  { className, ...props }: React.HTMLAttributes<HTMLDivElement>
) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooterComponent.displayName = "DialogFooter"

const DialogTitleComponent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitleComponent.displayName = DialogPrimitive.Title.displayName

const DialogDescriptionComponent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescriptionComponent.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogTrigger,
  DialogContent: DialogContentComponent,
  DialogHeader: DialogHeaderComponent,
  DialogFooter: DialogFooterComponent,
  DialogTitle: DialogTitleComponent,
  DialogDescription: DialogDescriptionComponent,
}
