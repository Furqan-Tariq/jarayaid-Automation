"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"
import { fetchJson } from "@/lib/fetchJson"

type Props = {
  countryId: number
  countries: any[]
  countrySources: Record<number, any[]>
  setCountrySources: (sources: Record<number, any[]>) => void
}

export default function SourcesTable({ countryId, countries, countrySources, setCountrySources }: Props) {
  const loadSources = async () => {
    try {
      const res: any = await fetchJson(`admin-dashboard/getRssSources?countryId=${countryId}`)
      setCountrySources(prev => ({ ...prev, [countryId]: res?.data || [] }))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { loadSources() }, [countryId])

  const addEmptyRow = () => {
    const rows = [...(countrySources[countryId] || [])]
    rows.push({ source: "", newsSource: "", active: false, articleCount: 0, sequence: rows.length + 1, type: "Website" })
    setCountrySources(prev => ({ ...prev, [countryId]: rows }))
  }

  const updateRow = (idx: number, key: string, value: any) => {
    const rows = [...(countrySources[countryId] || [])]
    rows[idx][key] = value
    setCountrySources(prev => ({ ...prev, [countryId]: rows }))
  }

  const saveRow = async (idx: number) => {
    const row = (countrySources[countryId] || [])[idx]
    if (!row.source || !row.newsSource) return alert("Fill required fields")
    try {
      const url = row.id ? "admin-dashboard/updateRssSource" : "admin-dashboard/addRssSource"
      await fetchJson(url, { method: "POST", body: JSON.stringify({ ...row, countryId }) })
      loadSources()
    } catch (e) {
      console.error(e)
      alert("Failed to save source")
    }
  }

  const deleteRow = async (idx: number) => {
    const row = (countrySources[countryId] || [])[idx]
    if (row?.id && !confirm("Delete this source?")) return
    if (row.id) {
      try { await fetchJson("admin-dashboard/deleteRssSource", { method: "POST", body: JSON.stringify({ id: row.id }) }) } catch (e) { console.error(e) }
    }
    const rows = [...(countrySources[countryId] || [])]
    rows.splice(idx, 1)
    setCountrySources(prev => ({ ...prev, [countryId]: rows }))
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">{countries.find(c => c.id === countryId)?.name} – Sources</h2>
        <Button onClick={addEmptyRow} className="gap-2 bg-accent hover:bg-accent/90"><Plus size={16} /> Add Source</Button>
      </div>

      <table className="w-full text-sm border">
        <thead>
          <tr className="border-b">
            <th>Source</th>
            <th>News Source</th>
            <th>Status</th>
            <th>Article Count</th>
            <th>Sequence</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(countrySources[countryId] || []).map((row, idx) => (
            <tr key={row.id ?? idx} className="border-b hover:bg-muted/50">
              <td><input className="h-8 px-2" value={row.source} onChange={(e) => updateRow(idx, "source", e.target.value)} /></td>
              <td><input className="h-8 px-2" value={row.newsSource} onChange={(e) => updateRow(idx, "newsSource", e.target.value)} /></td>
              <td>
                <Button size="xs" variant={row.active ? "default" : "outline"} onClick={() => updateRow(idx, "active", !row.active)}>
                  {row.active ? "Active" : "Inactive"}
                </Button>
              </td>
              <td><input type="number" className="h-8 w-20 px-2" value={row.articleCount} onChange={e => updateRow(idx, "articleCount", Number(e.target.value))} /></td>
              <td><input type="number" className="h-8 w-20 px-2" value={row.sequence} onChange={e => updateRow(idx, "sequence", Number(e.target.value))} /></td>
              <td>
                <select className="px-2 py-1" value={row.type} onChange={e => updateRow(idx, "type", e.target.value)}><option>Website</option><option>Newspaper</option></select>
              </td>
              <td className="flex gap-2">
                <Button size="sm" onClick={() => saveRow(idx)}><Edit2 size={14} /></Button>
                <Button size="sm" variant="destructive" onClick={() => deleteRow(idx)}><Trash2 size={14} /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
