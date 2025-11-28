"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type Props = {
  open: boolean
  setOpen: (v: boolean) => void
  onCreate: (data: any) => void
}

export default function SponsorDialog({ open, setOpen, onCreate }: Props) {
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [countriesDraft, setCountriesDraft] = useState<string[]>([])
  const [countryInput, setCountryInput] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")

  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) reset()
  }, [open])

  const reset = () => {
    setName("")
    setWebsite("")
    setStart("")
    setEnd("")
    setCountriesDraft([])
    setCountryInput("")
    setLogoFile(null)
    setLogoPreview("")
    if (fileRef.current) fileRef.current.value = ""
  }

  const canSubmit = useMemo(() => {
    return name.trim() && website.trim() && start && end
  }, [name, website, start, end])

  const handleAddCountryChip = () => {
    const val = countryInput.trim()
    if (!val) return
    if (!countriesDraft.includes(val)) {
      setCountriesDraft((prev) => [...prev, val])
    }
    setCountryInput("")
  }

  const removeCountryChip = (target: string) => {
    setCountriesDraft((prev) => prev.filter((c) => c !== target))
  }

  const onUploadLogo: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setLogoFile(f)
    const url = URL.createObjectURL(f)
    setLogoPreview(url)
  }

  const handleCreate = () => {
    if (!canSubmit) return

    onCreate({
      id: Date.now(),
      name,
      website,
      logo: logoPreview || "/placeholder.svg",
      activePeriod: { start, end },
      countries: countriesDraft.length ? countriesDraft : ["General"],
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Add Sponsor</DialogTitle>
          <DialogDescription>Fill in sponsor details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="text-sm">Logo</Label>
            <div className="flex items-center gap-3">
              <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={logoPreview || "/placeholder.svg"}
                  alt="Logo preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={onUploadLogo}
                  className="w-full"
                />
                {logoPreview && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setLogoFile(null)
                      setLogoPreview("")
                      if (fileRef.current) fileRef.current.value = ""
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Website</Label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>

          {/* Countries */}
          <div className="space-y-2">
            <Label>Countries</Label>
            <div className="flex flex-wrap gap-2">
              {countriesDraft.map((c) => (
                <Badge key={c} variant="secondary">
                  {c}
                  <button
                    onClick={() => removeCountryChip(c)}
                    className="ml-1 text-xs rounded-sm px-1"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCountryChip()
                  }
                }}
                placeholder="Type and press Enter"
              />
              <Button variant="outline" size="sm" onClick={handleAddCountryChip}>
                Add
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-accent hover:bg-accent/90" disabled={!canSubmit} onClick={handleCreate}>
            Create Sponsor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
