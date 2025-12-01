"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import SponsorsTable from "./components/SponsorsTable"
import SponsorDialog from "./components/SponsorDialog"
import { Button } from "@/components/ui/button"
import { createSponsor, getAllSponsors, updateSponsor } from "./service"
import toast from "react-hot-toast"
import useGetCategories from "@/hooks/useGetCategories"

const initialSponsors = [
  {
    id: 1,
    name: "Tommy Pizza",
    website: "tommypizza.com",
    logo: "/tommy_pizza.jpeg",
    activePeriod: { start: "2025-01-01", end: "2025-12-31" },
    countries: ["Lebanon", "Egypt", "Economy"],
  },
]

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([])
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [editingSponsor, setEditingSponsor] = useState<any | null>(null);
  
  const getCategories = useGetCategories();
  
  useEffect(() => {
    getCategories().then((res: any) => setCountries(res))
    getAllSponsors().then((res: any) => {
      const normalized = res?.data?.map((s: any) => ({
        ...s,
        activePeriod: {
          start: s.startdate,
          end: s.enddate,
        },
        countries: s.countries.map((c) => ({country_name: c.country_name, country_id: c.country_id})),
      }));
    
      setSponsors(normalized as any);
    });
  }, [])
  
  const handleSubmit = async (payload: any) => {
    if (payload?.id) {
      const response = await updateSponsor(payload);
      if (!response.ok && response.status !== 200) {
        return toast.error("Error while saving sponsor");
      }
      // update in state
      setSponsors((prev) =>
        prev.map((s) => (s.id === payload.id ? { ...s, ...payload } : s))
      );
      toast.success("Sponsor updated successfully");
    } else {
      const response = await createSponsor(payload);
      if (!response.ok && response.status !== 200) {
        return toast.error("Error while saving sponsor");
      }
      setSponsors((prev) => [payload, ...prev]);
      toast.success("Sponsor created successfully");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sponsors</h1>
            <p className="mt-2 text-muted-foreground">
              Manage sponsor logos, date ranges and categories.
            </p>
          </div>

          <Button className="gap-2 bg-accent hover:bg-accent/90" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Sponsor
          </Button>
        </div>

        <SponsorDialog
          open={open}
          setOpen={(v) => {
            if (!v) setEditingSponsor(null); // reset when closed
            setOpen(v);
          }}
          onCreate={handleSubmit}
          countries={countries}
          editingSponsor={editingSponsor}
        />
        <SponsorsTable sponsors={sponsors} setSponsors={setSponsors} setEditingSponsor={setEditingSponsor} setOpen={setOpen} />
      </div>
    </div>
  )
}
