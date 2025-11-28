"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import SponsorsTable from "./components/SponsorsTable"
import SponsorDialog from "./components/SponsorDialog"
import { Button } from "@/components/ui/button"

const initialSponsors = [
  {
    id: 1,
    name: "Tommy Pizza",
    website: "tommypizza.com",
    logo: "/tommy_pizza.jpeg",
    activePeriod: { start: "2025-01-01", end: "2025-12-31" },
    countries: ["Lebanon", "Egypt", "Economy"],
  },
]

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState(initialSponsors)
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sponsors</h1>
            <p className="mt-2 text-muted-foreground">
              Manage sponsor logos, date ranges and categories.
            </p>
          </div>

          <Button className="gap-2 bg-accent hover:bg-accent/90" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Sponsor
          </Button>
        </div>

        <SponsorDialog
          open={open}
          setOpen={setOpen}
          onCreate={(data) => setSponsors((prev) => [data, ...prev])}
        />

        <SponsorsTable sponsors={sponsors} setSponsors={setSponsors} />
      </div>
    </div>
  )
}
