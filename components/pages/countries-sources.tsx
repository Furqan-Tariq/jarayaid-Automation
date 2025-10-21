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

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Countries & Sources</h1>
          <p className="text-sm text-muted-foreground mt-1">Click on View to view a Country's News Sources</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2 bg-accent hover:bg-accent/90">
              <Plus size={18} />
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

      {/* Countries Table */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground w-12"></th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Country</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Slug</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Welcome Message</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Goodbye Message</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">WhatsApp</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((country) => (
                  <tr key={country.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <Switch checked={country.enabled} onCheckedChange={() => toggleCountry(country.id)} />
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
                    <td className="py-3 px-4 text-xs text-foreground max-w-xs truncate">{country.welcome}</td>
                    <td className="py-3 px-4 text-xs text-foreground max-w-xs truncate">{country.goodbye}</td>
                    <td className="py-3 px-4 text-xs text-foreground max-w-xs truncate">{country.whatsapp}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(country)} className="gap-1">
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

      {/* Quick Scheduler */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Quick Scheduler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.slice(0, 3).map((country) => (
              <div
                key={country.id}
                className="bg-gradient-to-br from-accent to-accent/80 rounded-lg p-6 text-accent-foreground font-semibold text-lg"
              >
                {country.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
