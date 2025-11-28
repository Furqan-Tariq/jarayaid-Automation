"use client"

import Image from "next/image"
import { DollarSign, Pencil, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Props = {
  sponsors: any[]
  setSponsors: (fn: any) => void
}

export default function SponsorsTable({ sponsors, setSponsors }: Props) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
          <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold">Sponsors</h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
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
                      alt={sponsor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>

                <TableCell className="font-medium">{sponsor.name}</TableCell>

                <TableCell>
                  <code className="rounded bg-muted px-2 py-1 text-sm">{sponsor.website}</code>
                </TableCell>

                <TableCell>
                  {sponsor.activePeriod.start} → {sponsor.activePeriod.end}
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {sponsor.countries.map((c) => (
                      <Badge key={c} variant="secondary">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() =>
                        setSponsors((prev: any) => prev.filter((s: any) => s.id !== sponsor.id))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {sponsors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No sponsors — click “Add Sponsor” to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
