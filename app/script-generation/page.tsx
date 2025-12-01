"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BulletinList from "./components/BulletinList"
import { Bulletin } from "./components/types"
import { getScripts, updateApprovalStatus } from "./service"
import toast from "react-hot-toast"
import RejectModal from "./components/RejectModal"

export default function ScriptGeneration() {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [rejectingId, setRejectingId] = useState<number | null>(null)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  
  useEffect(() => {
      loadScripts()
    }, [])
  
  const loadScripts = async () => {
    try {
      const res = await getScripts()
      setBulletins(res.data || [])
    } catch (err) {
      console.error("Error loading scripts", err)
    }
  }

  const toggleExpanded = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const setStatus = async (id: number, status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED") {
      setRejectingId(id)
      setRejectModalOpen(true)
      return
    }
    // approval is direct
    return await submitStatus({ id, status })
  }
  
  const submitStatus = async (payload: any) => {
    try {
      const response = await updateApprovalStatus(payload);
  
      if (!response.ok && response.status !== 200) {
        return toast.error("Error while saving script");
      }
  
      setBulletins(prev =>
        prev.map(b => (b.id === payload.id ? { ...b, status: payload.status } : b))
      )
  
      toast.success(`Script ${payload.status} successfully.`);
    } catch (e) {
      toast.error("System Error");
    }
  }
  
  const handleRejectSubmit = async (remarks: string) => {
    if (!rejectingId) return
    
    if(!remarks) {
      return toast.error("Please enter cancellation remarks");
    }
    
    const payload = {
      id: rejectingId,
      approval_status: "REJECTED",
      cancellation_remarks: remarks
    }
  
    await submitStatus(payload)
  
    setRejectModalOpen(false)
    setRejectingId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800"
      case "PENDING":  return "bg-yellow-100 text-yellow-800"
      case "REJECTED": return "bg-red-100 text-red-800"
      default:         return "bg-gray-100 text-gray-800"
    }
  }

  const getVideoColor = (video: string) => {
    switch (video) {
      case "Ready":      return "bg-accent text-accent-foreground"
      case "Generating": return "bg-blue-100 text-blue-800"
      default:           return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Script & Video Generation</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-Powered</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated News Bulletins</CardTitle>
        </CardHeader>
        <CardContent>
          <BulletinList
            bulletins={bulletins}
            expandedIds={expandedIds}
            toggleExpanded={toggleExpanded}
            setStatus={setStatus}
            getStatusColor={getStatusColor}
            getVideoColor={getVideoColor}
          />
          <RejectModal
            open={rejectModalOpen}
            onClose={() => setRejectModalOpen(false)}
            onConfirm={handleRejectSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}
