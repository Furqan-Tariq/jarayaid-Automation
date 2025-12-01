"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function RejectModal({
  open,
  onClose,
  onConfirm
}: {
  open: boolean
  onClose: () => void
  onConfirm: (remarks: string) => void
}) {

  const [remarks, setRemarks] = useState("")

  const handleSubmit = () => {
    onConfirm(remarks)
    setRemarks("") // reset after submit
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Cancellation Remarks</DialogTitle>
        </DialogHeader>

        <Textarea
          placeholder="Reason for rejection..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="min-h-[120px]"
        />

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit}>
            Reject Script
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
