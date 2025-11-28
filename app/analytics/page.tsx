"use client"

import { useState } from "react"
import { TrendingUp, Users, Eye, Share2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d")

  // Chart data
  const viewsData = [
    { date: "Mon", views: 4200, engagement: 2400 },
    { date: "Tue", views: 3800, engagement: 2210 },
    { date: "Wed", views: 5200, engagement: 2290 },
    { date: "Thu", views: 4800, engagement: 2000 },
    { date: "Fri", views: 6200, engagement: 2181 },
    { date: "Sat", views: 5800, engagement: 2500 },
    { date: "Sun", views: 7200, engagement: 2100 },
  ]

  const platformData = [
    { name: "X", value: 28, color: "#000000" },
    { name: "Facebook", value: 22, color: "#1877F2" },
    { name: "TikTok", value: 18, color: "#000000" },
    { name: "YouTube", value: 16, color: "#FF0000" },
    { name: "Instagram", value: 12, color: "#E4405F" },
    { name: "WhatsApp", value: 4, color: "#25D366" },
  ]

  const countryPerformance = [
    { country: "Lebanon", views: 12400, engagement: 8200, shares: 3200 },
    { country: "Egypt", views: 11200, engagement: 7800, shares: 2900 },
    { country: "Saudi Arabia", views: 10800, engagement: 7200, shares: 2700 },
    { country: "UAE", views: 9600, engagement: 6800, shares: 2400 },
    { country: "Qatar", views: 8200, engagement: 5800, shares: 2100 },
  ]

  const topPerformers = [
    { title: "Saudi Economy Grows 5.2% in Q4", views: 45200, engagement: 8920, shares: 3450 },
    { title: "Egypt Tech Startup Raises $50M", views: 38900, engagement: 7650, shares: 2890 },
    { title: "UAE Launches New Space Program", views: 36700, engagement: 6780, shares: 2340 },
    { title: "Lebanon Sports Team Wins Regional", views: 32400, engagement: 5890, shares: 1980 },
    { title: "Qatar Fashion Week Highlights", views: 28900, engagement: 4560, shares: 1650 },
  ]

  const metrics = [
    { label: "Total Views", value: "156.2K", change: "+12.5%", icon: Eye },
    { label: "Engagement Rate", value: "8.4%", change: "+2.1%", icon: TrendingUp },
    { label: "Total Shares", value: "24.8K", change: "+18.3%", icon: Share2 },
    { label: "Audience Growth", value: "+4.2K", change: "+5.8%", icon: Users },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive performance metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant={timeRange === "7d" ? "default" : "outline"} onClick={() => setTimeRange("7d")} size="sm">
            7 Days
          </Button>
          <Button variant={timeRange === "30d" ? "default" : "outline"} onClick={() => setTimeRange("30d")} size="sm">
            30 Days
          </Button>
          <Button variant={timeRange === "90d" ? "default" : "outline"} onClick={() => setTimeRange("90d")} size="sm">
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <Card key={idx} className="bg-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{metric.value}</p>
                    <p className="text-xs text-green-600 mt-2">{metric.change}</p>
                  </div>
                  <Icon className="text-accent" size={24} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Views & Engagement Trend */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Views & Engagement Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ fill: "var(--accent)" }}
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: "var(--primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform Distribution & Country Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Country Performance */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Country Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="country" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="views" fill="var(--accent)" />
                <Bar dataKey="engagement" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Views</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Engagement</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Shares</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Engagement Rate</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((item, idx) => {
                  const engagementRate = ((item.engagement / item.views) * 100).toFixed(1)
                  return (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground font-medium">{item.title}</td>
                      <td className="py-3 px-4 text-foreground">{item.views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-foreground">{item.engagement.toLocaleString()}</td>
                      <td className="py-3 px-4 text-foreground">{item.shares.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="bg-accent/20 text-accent px-3 py-1 rounded text-xs font-semibold">
                          {engagementRate}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Country Breakdown */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Detailed Country Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {countryPerformance.map((country, idx) => (
              <div key={idx} className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-3">{country.country}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Views</span>
                    <span className="font-semibold text-foreground">{country.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engagement</span>
                    <span className="font-semibold text-foreground">{country.engagement.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shares</span>
                    <span className="font-semibold text-foreground">{country.shares.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Engagement Rate</span>
                      <span className="font-semibold text-accent text-xs">
                        {((country.engagement / country.views) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
