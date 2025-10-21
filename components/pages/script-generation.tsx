"use client"

import { useState } from "react"
import { ChevronDown, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ScriptGeneration() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["BUL-5007"]))
  const [bulletins, setBulletins] = useState([
    {
      id: "BUL-5007",
      country: "Lebanon",
      category: "Economy",
      created: "Today 10:05",
      status: "Approved",
      video: "Ready",
      components: [
        {
          name: "Welcome Messages (Rotational Library)",
          messages: [
            "Welcome to today's news bulletin",
            "Good morning, here are today's top stories",
            "Hello and welcome to your daily update",
          ],
        },
      ],
    },
    {
      id: "BUL-5006",
      country: "Egypt",
      category: "Tech",
      created: "Today 09:45",
      status: "Pending",
      video: "Not Started",
      components: [
        {
          name: "Welcome Messages (Rotational Library)",
          messages: ["Tech news update for today", "Latest technology developments"],
        },
      ],
    },
    {
      id: "BUL-5005",
      country: "Saudi Arabia",
      category: "Sports",
      created: "Today 08:50",
      status: "Approved",
      video: "Generating",
      components: [
        {
          name: "Welcome Messages (Rotational Library)",
          messages: ["Sports bulletin for today", "Latest sports updates"],
        },
      ],
    },
    {
      id: "BUL-5004",
      country: "UAE",
      category: "Health",
      created: "Yesterday 18:12",
      status: "Rejected",
      video: "Not Started",
      components: [
        {
          name: "Welcome Messages (Rotational Library)",
          messages: ["Health news update", "Latest health information"],
        },
      ],
    },
  ])

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
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
                {expandedIds.has(bulletin.id) && bulletin.components && (
                  <div className="border-t border-border p-4 bg-muted/30 space-y-4">
                    {bulletin.components.map((component, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <span>📁</span>
                          {component.name}
                        </h4>
                        <div className="space-y-2 ml-6">
                          {component.messages.map((msg, msgIdx) => (
                            <div key={msgIdx} className="flex items-start justify-between gap-4">
                              <p className="text-sm text-foreground">{msg}</p>
                              <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded whitespace-nowrap">
                                {msgIdx === 0 ? "Active" : "Inactive"}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 gap-2 bg-transparent">
                          <Plus size={16} />
                          Add New Message
                        </Button>
                      </div>
                    ))}

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
