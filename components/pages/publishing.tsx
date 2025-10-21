"use client"

import { Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Publishing() {
  const publishedItems = [
    { id: "PUB-0951", title: "Daily Bulletin - India", platform: "X", timestamp: "Today 09:12", result: "Success" },
    { id: "PUB-0950", title: "Daily Bulletin - USA", platform: "YouTube", timestamp: "Today 08:58", result: "Success" },
    {
      id: "PUB-0949",
      title: "Daily Bulletin - Kenya",
      platform: "TikTok",
      timestamp: "Today 08:31",
      result: "Success",
    },
    {
      id: "PUB-0948",
      title: "Daily Bulletin - Nigeria",
      platform: "Facebook",
      timestamp: "Today 07:55",
      result: "Success",
    },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Send size={28} className="text-accent" />
            Publishing
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Window-aware publishing history</p>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Today</Button>
        <Button variant="outline">7d</Button>
        <Button variant="outline">30d</Button>
        <Button variant="outline">Custom</Button>
      </div>

      {/* Recently Published Table */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Recently Published</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Platform</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Result</th>
                </tr>
              </thead>
              <tbody>
                {publishedItems.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground font-mono text-xs">{item.id}</td>
                    <td className="py-3 px-4 text-foreground font-medium">{item.title}</td>
                    <td className="py-3 px-4 text-foreground">{item.platform}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-semibold">
                        {item.result}
                      </span>
                    </td>
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
