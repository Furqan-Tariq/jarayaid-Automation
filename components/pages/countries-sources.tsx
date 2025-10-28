"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Country {
  id: number
  name: string
  slug: string
  enabled: boolean
  status: "Manual" | "Auto"
  welcome: string
  goodbye: string
  whatsapp: string
}

export default function CountriesSources() {
  const [countries, setCountries] = useState<Country[]>([
    {
      id: 1,
      name: "Lebanon",
      slug: "/lebanon",
      enabled: false,
      status: "Manual",
      welcome: "Welcome to Lebanon news bulletin",
      goodbye: "Thank you for watching",
      whatsapp: "Lebanon News",
    },
    {
      id: 2,
      name: "Egypt",
      slug: "/egypt",
      enabled: false,
      status: "Auto",
      welcome: "Welcome to Egypt news bulletin",
      goodbye: "Thank you for watching",
      whatsapp: "Egypt News",
    },
    {
      id: 3,
      name: "Saudi Arabia",
      slug: "/saudi-arabia",
      enabled: false,
      status: "Manual",
      welcome: "Welcome to Saudi Arabia news bulletin",
      goodbye: "Thank you for watching",
      whatsapp: "Saudi Arabia News",
    },
    {
      id: 4,
      name: "UAE",
      slug: "/uae",
      enabled: false,
      status: "Manual",
      welcome: "Welcome to UAE news bulletin",
      goodbye: "Thank you for watching",
      whatsapp: "UAE News",
    },
    {
      id: 5,
      name: "Qatar",
      slug: "/qatar",
      enabled: false,
      status: "Auto",
      welcome: "Welcome to Qatar news bulletin",
      goodbye: "Thank you for watching",
      whatsapp: "Qatar News",
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    status: "Manual" as const,
    welcome: "",
    goodbye: "",
    whatsapp: "",
  })

  const handleOpenDialog = (country?: Country) => {
    if (country) {
      setEditingId(country.id)
      setFormData({
        name: country.name,
        slug: country.slug,
        status: country.status,
        welcome: country.welcome,
        goodbye: country.goodbye,
        whatsapp: country.whatsapp,
      })
    } else {
      setEditingId(null)
      setFormData({
        name: "",
        slug: "",
        status: "Manual",
        welcome: "",
        goodbye: "",
        whatsapp: "",
      })
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.slug) {
      alert("Please fill in all required fields")
      return
    }

    if (editingId) {
      setCountries(countries.map((c) => (c.id === editingId ? { ...c, ...formData } : c)))
    } else {
      setCountries([...countries, { id: Date.now(), enabled: false, ...formData }])
    }

    setIsOpen(false)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this country?")) {
      setCountries(countries.filter((c) => c.id !== id))
    }
  }

  const toggleCountry = (id: number) => {
    setCountries(countries.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)))
  }

  const toggleStatus = (id: number) => {
    setCountries(countries.map((c) => (c.id === id ? { ...c, status: c.status === "Manual" ? "Auto" : "Manual" } : c)))
  }

  // -------------------------
  // QUICK SCHEDULER (UI only)
  // -------------------------
  const platforms = ["YouTube Playlist 1", "YouTube Playlist 2", "YouTube Playlist 3", "Facebook"] as const

  const handleMockSchedule = (country: string, platform: string) => {
    alert(`Mock schedule clicked:\n${country} → ${platform}`)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Countries & Sources</h1>
          <p className="text-sm text-muted-foreground mt-1">Click on View to view a Country&apos;s News Sources</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {/* onClick={() => handleOpenDialog()} */}
            <Button disabled className="gap-2 bg-accent hover:bg-accent/90">
              {/* <Plus size={18} /> */}
              {countries.length} Countries
              
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Country" : "Add New Country"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update country configuration" : "Create a new country entry"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Country Name *</label>
                  <Input
                    placeholder="e.g., Lebanon"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Slug *</label>
                  <Input
                    placeholder="e.g., /lebanon"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "Manual" | "Auto" })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="Manual">Manual</option>
                  <option value="Auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Welcome Message</label>
                <Textarea
                  placeholder="Welcome message for this country"
                  value={formData.welcome}
                  onChange={(e) => setFormData({ ...formData, welcome: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Goodbye Message</label>
                <Textarea
                  placeholder="Goodbye message for this country"
                  value={formData.goodbye}
                  onChange={(e) => setFormData({ ...formData, goodbye: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">WhatsApp Title</label>
                <Input
                  placeholder="WhatsApp title"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-accent hover:bg-accent/90">
                  {editingId ? "Update" : "Add"} Country
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

{/* Countries Table (wide + horizontal scroll, with Add button, editable fields, and Source column) */}
<Card className="bg-card">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>Countries</CardTitle>
    <Button
      onClick={() => handleOpenDialog()}
      className="gap-2 bg-accent hover:bg-accent/90"
    >
      <Plus size={18} />
      Add Country
    </Button>
  </CardHeader>

  <CardContent>
    {/* Horizontal slider */}
    <div className="overflow-x-auto">
      {/* Make table naturally wide so it scrolls instead of compressing */}
      <table className="w-full min-w-[1400px] text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground w-12"></th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Country</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Slug</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Welcome Message</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Goodbye Message</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Source</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
          </tr>
        </thead>

        <tbody>
          {countries.map((country) => (
            <tr key={country.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">
                <Switch
                  checked={country.enabled}
                  onCheckedChange={() => toggleCountry(country.id)}
                />
              </td>

              <td className="py-3 px-4 text-foreground font-medium">{country.name}</td>
              <td className="py-3 px-4 text-muted-foreground text-xs">{country.slug}</td>

              <td className="py-3 px-4">
                <button
                  onClick={() => toggleStatus(country.id)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    country.status === "Manual"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {country.status}
                </button>
              </td>

              {/* Editable Welcome Message (full-size input, wider cell) */}
              <td className="py-3 px-4">
                <Input
                  value={country.welcome}
                  placeholder={country.welcome}
                  onChange={(e) =>
                    setCountries(
                      countries.map((c) =>
                        c.id === country.id ? { ...c, welcome: e.target.value } : c
                      )
                    )
                  }
                  className="h-9 w-[320px]"
                />
              </td>

              {/* Editable Goodbye Message (full-size input, wider cell) */}
              <td className="py-3 px-4">
                <Input
                  value={country.goodbye}
                  placeholder={country.goodbye}
                  onChange={(e) =>
                    setCountries(
                      countries.map((c) =>
                        c.id === country.id ? { ...c, goodbye: e.target.value } : c
                      )
                    )
                  }
                  className="h-9 w-[320px]"
                />
              </td>

              {/* Source Column (display-only button styled like Add Country) */}
              <td className="py-3 px-4">
                <Button
                  className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground text-xs px-3 py-1"
                  onClick={() => {}}
                >
                  View
                </Button>
              </td>

              {/* Actions */}
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(country)}
                    className="gap-1"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(country.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>




{/* Quick Scheduler (scrollable horizontally + vertically) */}
<Card className="bg-card">
  <CardHeader>
    <CardTitle>Quick Scheduler</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Both scroll directions + sticky header */}
    <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
      <table className="w-full min-w-[1100px] table-fixed text-sm">
        <colgroup>
          <col className="w-[180px]" />
          {platforms.map((p) => (
            <col key={p} className="w-[180px]" />
          ))}
        </colgroup>

        <thead className="sticky top-0 bg-card z-10">
          <tr className="border-b border-border">
            <th className="py-3 px-4 text-left font-semibold">Country</th>
            {platforms.map((p) => (
              <th key={p} className="py-3 px-4 text-center font-semibold">
                {p}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {countries.map((c) => (
            <tr key={c.id} className="border-b border-border align-top text-center">
              <td className="py-4 px-4">
                <div className="w-full h-[180px] rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                  {c.name}
                </div>
              </td>

              {platforms.map((p) => (
                <td key={p} className="py-4 px-4">
                  <div className="w-full h-[180px] flex flex-col items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-28"
                      onClick={() => handleMockSchedule(c.name, p)}
                    >
                      Schedule
                    </Button>
                    <Input type="time" className="h-9 w-28 text-center" onChange={() => {}} />
                    <div className="flex border border-border rounded-md overflow-hidden">
                      <button className="px-3 py-1 text-xs bg-muted hover:bg-muted/80">AM</button>
                      <button className="px-3 py-1 text-xs hover:bg-muted">PM</button>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>



    </div>
  )
}
