"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Edit2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"

interface Sponsor {
  id: number
  name: string
  website: string
  logo: string // Now stores image URL
  description: string
  status: "Active" | "Inactive"
}

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([
    {
      id: 1,
      name: "TechCorp",
      website: "https://techcorp.com",
      logo: "/tech-company-logo.jpg",
      description: "Leading technology solutions provider",
      status: "Active",
    },
    {
      id: 2,
      name: "MediaHub",
      website: "https://mediahub.com",
      logo: "/media-hub-logo.jpg",
      description: "Digital media and content platform",
      status: "Active",
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    logo: "",
    description: "",
    status: "Active" as const,
  })

  const handleOpenDialog = (sponsor?: Sponsor) => {
    if (sponsor) {
      setEditingId(sponsor.id)
      setFormData({
        name: sponsor.name,
        website: sponsor.website,
        logo: sponsor.logo,
        description: sponsor.description,
        status: sponsor.status,
      })
    } else {
      setEditingId(null)
      setFormData({
        name: "",
        website: "",
        logo: "",
        description: "",
        status: "Active",
      })
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.website || !formData.logo) {
      alert("Please fill in all required fields (Name, Website, and Logo)")
      return
    }

    if (editingId) {
      setSponsors(sponsors.map((s) => (s.id === editingId ? { ...s, ...formData } : s)))
    } else {
      setSponsors([...sponsors, { id: Date.now(), ...formData }])
    }

    setIsOpen(false)
    setFormData({
      name: "",
      website: "",
      logo: "",
      description: "",
      status: "Active",
    })
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this sponsor?")) {
      setSponsors(sponsors.filter((s) => s.id !== id))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sponsors</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your sponsors and partnerships</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2 bg-accent hover:bg-accent/90">
              <Plus size={18} />
              Add Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Sponsor" : "Add New Sponsor"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update sponsor information" : "Create a new sponsor entry"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Sponsor Name *</label>
                <Input
                  placeholder="e.g., TechCorp"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Website *</label>
                <Input
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Logo Image *</label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
                {formData.logo && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={formData.logo || "/placeholder.svg"}
                        alt="Logo preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">Logo preview</span>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  placeholder="Sponsor description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-accent hover:bg-accent/90">
                  {editingId ? "Update" : "Add"} Sponsor
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sponsors Grid */}
      {sponsors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id} className="bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={sponsor.logo || "/placeholder.svg"}
                        alt={`${sponsor.name} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{sponsor.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            sponsor.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {sponsor.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Website</p>
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline truncate"
                  >
                    {sponsor.website}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm text-foreground">{sponsor.description || "No description"}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(sponsor)}
                    className="flex-1 gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(sponsor.id)}
                    className="flex-1 gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-12">
              No sponsors added yet. Click "Add Sponsor" to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
