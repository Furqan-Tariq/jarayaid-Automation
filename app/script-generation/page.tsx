// components/pages/script-generation.tsx
"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// ---------- Arabic script (single paragraph) ----------
const ARABIC_TEXT =
  "مرحبًا بكم في أخبار jarayaid.com، هذه نشرة أهم ثلاث أخبار اليوم، وفيديو اليوم برعاية بيتزا تومي. " +
  "أفادت قناة الجزيرة بأن مباحثات وقف إطلاق النار ما تزال متعثّرة، في وقت يبقى فيه الوصول الإنساني محدودًا وتعاني المناطق من نقص الأدوية والمياه. " +
  "ومن جانبها قالت قناة العربية إن مستشفيات غزة تواجه انقطاعات كهرباء متكررة، ما يزيد الضغط على الطواقم الطبية وسط غموض في مسارات الإجلاء وندرة في الموارد. " +
  "وذكرت الجزيرة أيضًا أن الأضرار طالت مساكن وبنية تحتية في مناطق متعددة، بينما تصطف العائلات للحصول على الخبز والمياه مع استمرار مساعي إدخال المساعدات. " +
  "وبهذا نكون قد استعرضنا أبرز ثلاث عناوين لليوم. للمزيد من التغطيات والتحديثات، تفضلوا بزيارة jarayaid.com. شكرًا لمشاهدتكم—لا تنسوا الإعجاب والمشاركة والاشتراك. نلتقيكم في النشرة القادمة."

type Bulletin = {
  id: string
  country: string
  category: string
  created: string
  status: "Approved" | "Pending" | "Rejected" | string
  video: "Ready" | "Generating" | "Not Started" | string
}

export default function ScriptGeneration() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["BUL-5007"]))
  const [bulletins, setBulletins] = useState<Bulletin[]>([
    { id: "BUL-5007", country: "Lebanon",      category: "Economy", created: "Today 10:05",      status: "Approved", video: "Ready" },
    { id: "BUL-5006", country: "Egypt",        category: "Tech",    created: "Today 09:45",      status: "Pending",  video: "Not Started" },
    { id: "BUL-5005", country: "Saudi Arabia", category: "Sports",  created: "Today 08:50",      status: "Approved", video: "Generating" },
    { id: "BUL-5004", country: "UAE",          category: "Health",  created: "Yesterday 18:12",  status: "Rejected", video: "Not Started" },
  ])

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const setStatus = (id: string, status: "Approved" | "Rejected") => {
    setBulletins(prev => prev.map(b => (b.id === id ? { ...b, status } : b)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800"
      case "Pending":  return "bg-yellow-100 text-yellow-800"
      case "Rejected": return "bg-red-100 text-red-800"
      default:         return "bg-gray-100 text-gray-800"
    }
  }

  const getVideoColor = (video: string) => {
    switch (video) {
      case "Ready":       return "bg-accent text-accent-foreground"
      case "Generating":  return "bg-blue-100 text-blue-800"
      default:            return "bg-gray-100 text-gray-800"
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
            {bulletins.map((b) => (
              <div key={b.id} className="border border-border rounded-lg overflow-hidden">
                {/* Top row: summary + action buttons (no overlap) */}
                <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
                  {/* Left side: clickable summary */}
                  <button
                    onClick={() => toggleExpanded(b.id)}
                    className="flex flex-1 items-center gap-3 text-left hover:opacity-80 transition-opacity"
                  >
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${expandedIds.has(b.id) ? "rotate-180" : ""}`}
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-sm w-full">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">ID</p>
                        <p className="font-semibold text-foreground">{b.id}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">Country</p>
                        <p className="font-semibold text-foreground">{b.country}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">Category</p>
                        <p className="font-semibold text-foreground">{b.category}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">Created</p>
                        <p className="font-semibold text-foreground">{b.created}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${getVideoColor(b.video)}`}>
                          {b.video}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Right side: action buttons */}
                  <div className="flex-shrink-0 flex items-center gap-2 self-end md:self-auto">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 w-24"
                      onClick={() => setStatus(b.id, "Approved")}
                    >
                      Approved
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-24"
                      onClick={() => setStatus(b.id, "Rejected")}
                    >
                      Rejected
                    </Button>
                  </div>
                </div>

                {/* Expanded content: Arabic paragraph only */}
                {expandedIds.has(b.id) && (
                  <div className="border-t border-border p-5 bg-muted/30">
                    <div
                      dir="rtl"
                      className="rounded-2xl bg-background text-foreground shadow-sm border border-border px-5 py-4 leading-8 text-[15px]"
                      style={{ lineHeight: 1.9 }}
                    >
                      {ARABIC_TEXT}
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
