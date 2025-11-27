"use client"

import { BarChart3, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const stats = [
    {
      title: "Bulletins Today",
      value: "12",
      subtitle: "Scheduled across countries",
      icon: BarChart3,
    },
    {
      title: "Ready to Publish",
      value: "8",
      subtitle: "Awaiting window",
      icon: CheckCircle2,
    },
    {
      title: "Queued Posts",
      value: "31",
      subtitle: "All platforms",
      icon: Clock,
    },
  ]

  const bulletinData = [
    { country: "Lebanon", x: 56372, facebook: 6421, tiktok: 2637, youtube: 7361, insta: 4022, whatsapp: 6113 },
    { country: "Egypt", x: 56372, facebook: 6421, tiktok: 2637, youtube: 7361, insta: 4022, whatsapp: 6113 },
    { country: "Saudi Arabia", x: 56372, facebook: 6421, tiktok: 2637, youtube: 7361, insta: 4022, whatsapp: 6113 },
    { country: "UAE", x: 56372, facebook: 6421, tiktok: 2637, youtube: 7361, insta: 4022, whatsapp: 6113 },
    { country: "Qatar", x: 56372, facebook: 6421, tiktok: 2637, youtube: 7361, insta: 4022, whatsapp: 6113 },
  ]

  const topVideos = [
    { title: "Saudi Economy Grows 5.2% in Q4", country: "SA", views: 45200 },
    { title: "Egypt Tech Startup Raises $50M", country: "EG", views: 38900 },
    { title: "UAE Launches New Space Program", country: "AE", views: 36700 },
    { title: "Lebanon Sports Team Wins Regional", country: "LB", views: 32400 },
    { title: "Qatar Fashion Week Highlights", country: "QA", views: 28900 },
  ]

  const topLinks = [
    { title: "Breaking: New Trade Agreement Signed", country: "SA", views: 8920 },
    { title: "Tech Innovation Summit Announced", country: "AE", views: 7650 },
    { title: "Healthcare Reform Bill Passed", country: "EG", views: 6780 },
    { title: "Sports Championship Finals Set", country: "LB", views: 5890 },
    { title: "Fashion Industry Report Released", country: "QA", views: 4560 },
  ]

  const mostReadLinks = [
    { title: "Economic Outlook 2025: What to Expect", reads: "12,340", avgTime: "4:32 avg" },
    { title: "Complete Guide to New Tech Regulations", reads: "10,890", avgTime: "6:15 avg" },
    { title: "Health Tips for the New Year", reads: "9,670", avgTime: "3:48 avg" },
    { title: "Sports Analysis: Season Predictions", reads: "8,450", avgTime: "5:22 avg" },
    { title: "Fashion Trends Dominating 2025", reads: "7,230", avgTime: "4:05 avg" },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back to your content management hub</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="bg-card hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-4xl font-bold text-foreground mt-2">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-2">{stat.subtitle}</p>
                  </div>
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Icon className="text-accent" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* News Bulletin Table */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} className="text-accent" />
            News Bulletin Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Country</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">X</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Facebook</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">TikTok</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">YouTube</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Instagram</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {bulletinData.map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{row.country}</td>
                    <td className="py-3 px-4 text-foreground">{row.x.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground">{row.facebook.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground">{row.tiktok.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground">{row.youtube.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground">{row.insta.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground">{row.whatsapp.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Videos */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 size={20} className="text-accent" />
              Top 5 Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topVideos.map((video, idx) => (
                <div key={idx} className="flex items-start justify-between pb-3 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm leading-snug">{video.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{video.country}</p>
                  </div>
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2">
                    {video.views.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 10 Links */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 size={20} className="text-accent" />
              Top 10 Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLinks.map((link, idx) => (
                <div key={idx} className="flex items-start justify-between pb-3 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm leading-snug">{link.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{link.country}</p>
                  </div>
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2">
                    {link.views.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Read Links */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} className="text-accent" />
            Most Read Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mostReadLinks.map((link, idx) => (
              <div key={idx} className="flex items-start justify-between pb-3 border-b border-border last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{link.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {link.reads} reads • {link.avgTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
