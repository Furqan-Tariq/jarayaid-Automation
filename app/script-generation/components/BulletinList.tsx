"use client"

import BulletinItem from "./BulletinItem"
import { Bulletin } from "./types"

type Props = {
  bulletins: Bulletin[]
  expandedIds: Set<number>
  toggleExpanded: (id: number) => void
  setStatus: (id: number, s: "APPROVED" | "REJECTED") => void
  getStatusColor: (s: string) => string
  getVideoColor: (s: string) => string
}

export default function BulletinList({
  bulletins,
  expandedIds,
  toggleExpanded,
  setStatus,
  getStatusColor,
  getVideoColor,
}: Props) {
  return (
    <div className="space-y-4">
      {bulletins.map((b) => (
        <BulletinItem
          key={b.id}
          b={b}
          expanded={expandedIds.has(b.id)}
          toggleExpanded={() => toggleExpanded(b.id)}
          setStatus={(s) => setStatus(b.id, s)}
          getStatusColor={getStatusColor}
          getVideoColor={getVideoColor}
          text={b.prompt}
        />
      ))}
    </div>
  )
}
