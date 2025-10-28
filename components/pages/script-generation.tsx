"use client"

import { useState } from "react"
import { ChevronDown, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type ToggleItem = { text: string; active: boolean }

type Bulletin = {
  id: string
  country: string
  category: string
  created: string
  status: "Approved" | "Pending" | "Rejected" | string
  video: "Ready" | "Generating" | "Not Started" | string
  // Sections shown in the expanded view
  welcomeMessages: ToggleItem[]
  tags: ToggleItem[]
  goodbyeMessages: ToggleItem[]
  captions: ToggleItem[]
}

export default function ScriptGeneration() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["BUL-5007"]))
  const [bulletins, setBulletins] = useState<Bulletin[]>([
    {
      id: "BUL-5007",
      country: "Lebanon",
      category: "Economy",
      created: "Today 10:05",
      status: "Approved",
      video: "Ready",
      welcomeMessages: [
        { text: "Welcome to today's news bulletin", active: true },
        { text: "Good morning, here are today's top stories", active: false },
        { text: "Hello and welcome to your daily update", active: false },
      ],
      tags: [
        { text: "Breaking", active: true },
        { text: "Top Stories", active: false },
        { text: "Local", active: false },
      ],
      goodbyeMessages: [
        { text: "Thanks for watching!", active: true },
        { text: "That's all for today—see you tomorrow.", active: false },
        { text: "Stay tuned for more updates.", active: false },
      ],
      captions: [
        { text: "Daily news update for Lebanon", active: true },
        { text: "Economy headlines and market shifts", active: false },
      ],
    },
    {
      id: "BUL-5006",
      country: "Egypt",
      category: "Tech",
      created: "Today 09:45",
      status: "Pending",
      video: "Not Started",
      welcomeMessages: [
        { text: "Tech news update for today", active: true },
        { text: "Latest technology developments", active: false },
      ],
      tags: [
        { text: "AI", active: true },
        { text: "Startups", active: false },
      ],
      goodbyeMessages: [
        { text: "Thanks for tuning in.", active: true },
        { text: "More tech tomorrow!", active: false },
        { text: "Subscribe for updates.", active: false },
      ],
      captions: [
        { text: "Egypt tech roundup", active: true },
        { text: "Gadgets & innovation today", active: false },
      ],
    },
    {
      id: "BUL-5005",
      country: "Saudi Arabia",
      category: "Sports",
      created: "Today 08:50",
      status: "Approved",
      video: "Generating",
      welcomeMessages: [
        { text: "Sports bulletin for today", active: true },
        { text: "Latest sports updates", active: false },
      ],
      tags: [
        { text: "Football", active: true },
        { text: "Highlights", active: false },
      ],
      goodbyeMessages: [
        { text: "Catch you after the next match!", active: true },
        { text: "Thanks for watching sports daily.", active: false },
        { text: "Share your thoughts below.", active: false },
      ],
      captions: [
        { text: "Saudi sports headlines", active: true },
        { text: "Matchday recap", active: false },
      ],
    },
    {
      id: "BUL-5004",
      country: "UAE",
      category: "Health",
      created: "Yesterday 18:12",
      status: "Rejected",
      video: "Not Started",
      welcomeMessages: [
        { text: "Health news update", active: true },
        { text: "Latest health information", active: false },
      ],
      tags: [
        { text: "Wellness", active: true },
        { text: "Medical", active: false },
      ],
      goodbyeMessages: [
        { text: "Take care and stay healthy!", active: true },
        { text: "Thanks for watching the health brief.", active: false },
        { text: "See you in the next bulletin.", active: false },
      ],
      captions: [
        { text: "UAE health digest", active: true },
        { text: "Wellness trends & tips", active: false },
      ],
    },
  ])

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds)
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id)
    setExpandedIds(newExpanded)
  }

  const toggleItem = (id: string, section: keyof Bulletin, index: number) => {
    setBulletins((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b
        const arr = b[section] as ToggleItem[]
        if (!Array.isArray(arr)) return b
        const updated = arr.map((it, i) => (i === index ? { ...it, active: !it.active } : it))
        return { ...b, [section]: updated }
      })
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVideoColor = (video: string) => {
    switch (video) {
      case "Ready":
        return "bg-accent text-accent-foreground"
      case "Generating":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const Section = ({
    title,
    items,
    onToggle,
    addLabel,
  }: {
    title: string
    items: ToggleItem[]
    onToggle: (idx: number) => void
    addLabel: string
  }) => (
    <div className="mb-6">
      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <span>📁</span>
        {title}
      </h4>
      <div className="space-y-2 ml-6">
        {items.map((it, idx) => (
          <div key={`${title}-${idx}`} className="flex items-start justify-between gap-4">
            <p className="text-sm text-foreground">{it.text}</p>
            <button
              type="button"
              onClick={() => onToggle(idx)}
              className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                it.active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {it.active ? "Active" : "Inactive"}
            </button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="mt-3 gap-2 bg-transparent">
        <Plus size={16} />
        {addLabel}
      </Button>
    </div>
  )

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Script & Video Generation</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-Powered</p>
      </div>

      {/* Generated News Bulletins */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Generated News Bulletins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bulletins.map((bulletin) => (
              <div key={bulletin.id} className="border border-border rounded-lg overflow-hidden">
                {/* Main Row */}
                <button
                  onClick={() => toggleExpanded(bulletin.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <ChevronDown
                    size={20}
                    className={`transition-transform flex-shrink-0 ${expandedIds.has(bulletin.id) ? "rotate-180" : ""}`}
                  />
                  <div className="flex-1 text-left">
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">ID</p>
                        <p className="font-semibold text-foreground">{bulletin.id}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">Country</p>
                        <p className="font-semibold text-foreground">{bulletin.country}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">Category</p>
                        <p className="font-semibold text-foreground">{bulletin.category}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">Created</p>
                        <p className="font-semibold text-foreground">{bulletin.created}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(bulletin.status)}`}>
                          {bulletin.status}
                        </span>
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${getVideoColor(bulletin.video)}`}>
                          {bulletin.video}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedIds.has(bulletin.id) && (
                  <div className="border-t border-border p-4 bg-muted/30 space-y-4">
                    {/* Welcome Messages */}
                    <Section
                      title="Welcome Messages (Rotational Library)"
                      items={bulletin.welcomeMessages}
                      onToggle={(idx) => toggleItem(bulletin.id, "welcomeMessages", idx)}
                      addLabel="Add New Message"
                    />

                    {/* Tags */}
                    <Section
                      title="Tags"
                      items={bulletin.tags}
                      onToggle={(idx) => toggleItem(bulletin.id, "tags", idx)}
                      addLabel="Add New Tag"
                    />

                    {/* Good Bye Messages */}
                    <Section
                      title="Good Bye Messages"
                      items={bulletin.goodbyeMessages}
                      onToggle={(idx) => toggleItem(bulletin.id, "goodbyeMessages", idx)}
                      addLabel="Add New Message"
                    />

                    {/* Captions */}
                    <Section
                      title="Captions"
                      items={bulletin.captions}
                      onToggle={(idx) => toggleItem(bulletin.id, "captions", idx)}
                      addLabel="Add New Caption"
                    />

                    {/* Script Approval */}
                    <div className="border-t border-border pt-4 mt-4">
                      <h4 className="font-semibold text-foreground mb-3">Script Approval</h4>
                      <Button className="gap-2 bg-accent hover:bg-accent/90">
                        <span>✓</span>
                        Approve Script
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
