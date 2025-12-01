"use client"

import BulletinHeader from "./BulletinHeader"
import BulletinContent from "./BulletinContent"
import { Bulletin } from "./types"

type Props = {
  b: Bulletin
  expanded: boolean
  toggleExpanded: () => void
  setStatus: (s: "APPROVED" | "REJECTED") => void
  getStatusColor: (s: string) => string
  getVideoColor: (s: string) => string
  text: string
}

export default function BulletinItem({
  b,
  expanded,
  toggleExpanded,
  setStatus,
  getStatusColor,
  getVideoColor,
  text,
}: Props) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <BulletinHeader
        b={b}
        expanded={expanded}
        toggle={toggleExpanded}
        setStatus={setStatus}
        getStatusColor={getStatusColor}
        getVideoColor={getVideoColor}
      />

      {expanded && <BulletinContent text={text} />}
    </div>
  )
}
