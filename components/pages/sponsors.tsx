import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Share2, Pencil, Trash2, DollarSign } from "lucide-react"
import Image from "next/image"

// Sample sponsor data
const sponsors = [
  {
    id: 1,
    name: "Tommy Pizza",
    website: "tommypizza.com",
    logo: "/tommy_pizza.jpeg",
    activePeriod: {
      start: "2025-01-01",
      end: "2025-12-31",
    },
    countries: ["Lebanon", "Egypt", "Economy"],
  },
  {
    id: 2,
    name: "Tech Solutions",
    website: "techsolutions.ae",
    logo: "/tech_solutions.jpeg",
    activePeriod: {
      start: "2025-02-01",
      end: "2025-06-30",
    },
    countries: ["UAE", "Tech"],
  },
]

export default function SponsorsPage() {
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
          <Button className="gap-2 bg-accent hover:bg-accent/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Sponsor
          </Button>
        </div>

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
                          <Badge key={country} variant="secondary" className="bg-muted text-muted-foreground">
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
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
