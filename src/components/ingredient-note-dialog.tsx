import { useState } from "react"
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog"

import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Textarea, TextareaProps } from "~/components/ui/textarea"

interface IngredientNoteDialogProps extends TextareaProps {}

export function IngredientNoteDialog({
  children,
  ...props
}: IngredientNoteDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Add note</DialogHeader>
        <DialogBody>
          <Textarea {...props} />
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
