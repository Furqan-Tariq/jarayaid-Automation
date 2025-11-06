"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Plus, Share2, Pencil, Trash2, DollarSign, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

type Sponsor = {
  id: number
  name: string
  website: string
  logo: string // can be a public path or object URL
  activePeriod: { start: string; end: string }
  countries: string[]
}

const initialSponsors: Sponsor[] = [
  {
    id: 1,
    name: "Tommy Pizza",
    website: "tommypizza.com",
    logo: "/tommy_pizza.jpeg",
    activePeriod: { start: "2025-01-01", end: "2025-12-31" },
    countries: ["Lebanon", "Egypt", "Economy"],
  },
  {
    id: 2,
    name: "Tech Solutions",
    website: "techsolutions.ae",
    logo: "/tech_solutions.jpeg",
    activePeriod: { start: "2025-02-01", end: "2025-06-30" },
    countries: ["UAE", "Tech"],
  },
]

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors)

  // --- Dialog state ---
  const [open, setOpen] = useState(false)

  // --- Form state (client-only) ---
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [countriesDraft, setCountriesDraft] = useState<string[]>([])
  const [countryInput, setCountryInput] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")

  const fileRef = useRef<HTMLInputElement | null>(null)

  const canSubmit = useMemo(() => {
    return name.trim() && website.trim() && start && end
  }, [name, website, start, end])

  const resetForm = () => {
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
    const newSponsor: Sponsor = {
      id: Date.now(),
      name: name.trim(),
      website: website.trim(),
      logo: logoPreview || "/placeholder.svg", // if no upload, show placeholder
      activePeriod: { start, end },
      countries: countriesDraft.length ? countriesDraft : ["General"],
    }
    setSponsors((prev) => [newSponsor, ...prev])
    setOpen(false)
    // Don't revoke preview immediately; if you want to free memory, do it after image mounts or on dialog close
    resetForm()
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sponsors</h1>
            <p className="mt-2 text-muted-foreground">
              Manage sponsor logos, date ranges, categories, and Arabic mention text
            </p>
          </div>
          <Button className="gap-2 bg-accent hover:bg-accent/90" onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Sponsor
          </Button>
        </div>

        {/* Add Sponsor Dialog (perfect mid size, uncluttered) */}
<Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
  <DialogContent className="max-w-md rounded-xl">
    <DialogHeader>
      <DialogTitle>Add Sponsor</DialogTitle>
      <DialogDescription>
        Fill in the sponsor details — stored only in this page.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-sm">Logo</Label>
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 overflow-hidden rounded-md border border-border bg-muted">
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
                title="Clear"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Name & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="s-name">Name</Label>
          <Input
            id="s-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tommy Pizza"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="s-website">Website</Label>
          <Input
            id="s-website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="tommypizza.com"
            className="mt-1"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="s-start">Start Date</Label>
          <Input
            id="s-start"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="s-end">End Date</Label>
          <Input
            id="s-end"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Countries */}
      <div className="space-y-2">
        <Label>Countries</Label>
        <div className="flex flex-wrap items-center gap-2">
          {countriesDraft.map((c) => (
            <Badge key={c} variant="secondary" className="bg-muted text-muted-foreground">
              <span className="mr-1">{c}</span>
              <button
                type="button"
                onClick={() => removeCountryChip(c)}
                className="ml-1 rounded-sm px-1 text-xs hover:bg-muted/70"
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

    <DialogFooter className="pt-2">
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button
        className="bg-accent hover:bg-accent/90"
        disabled={!canSubmit}
        onClick={handleCreate}
      >
        Create Sponsor
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>




        {/* Active Sponsors Section */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
              <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-card-foreground">Active Sponsors</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Active Period</TableHead>
                  <TableHead>Countries</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors.map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell>
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={sponsor.logo || "/placeholder.svg"}
                          alt={`${sponsor.name} logo`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{sponsor.name}</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 text-sm text-muted-foreground">
                        {sponsor.website}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {sponsor.activePeriod.start} → {sponsor.activePeriod.end}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {sponsor.countries.map((country) => (
                          <Badge key={`${sponsor.id}-${country}`} variant="secondary" className="bg-muted text-muted-foreground">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => alert("Share: mock")}
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => alert("Edit: mock")}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setSponsors((prev) => prev.filter((s) => s.id !== sponsor.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sponsors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No sponsors yet — click “Add Sponsor” to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
