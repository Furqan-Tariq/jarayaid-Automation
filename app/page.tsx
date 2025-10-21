"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Dashboard from "@/components/pages/dashboard"
import CountriesSources from "@/components/pages/countries-sources"
import Publishing from "@/components/pages/publishing"
import ScriptGeneration from "@/components/pages/script-generation"
import Sponsors from "@/components/pages/sponsors"
import Analytics from "@/components/pages/analytics"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "countries-sources":
        return <CountriesSources />
      case "sponsors":
        return <Sponsors />
      case "script-generation":
        return <ScriptGeneration />
      case "publishing":
        return <Publishing />
      case "analytics":
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  )
}
