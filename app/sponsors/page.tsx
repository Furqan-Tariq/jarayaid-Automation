"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import SponsorsTable from "./components/SponsorsTable";
import SponsorDialog from "./components/SponsorDialog";
import { Button } from "@/components/ui/button";
import { createSponsor, getActiveSponsors, updateSponsor } from "./service";
import toast from "react-hot-toast";
import useGetCategories from "@/hooks/useGetCategories";

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [editingSponsor, setEditingSponsor] = useState<any | null>(null);

  const getCategories = useGetCategories();

  useEffect(() => {
    getCategories().then((res: any) => setCountries(res));
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    getActiveSponsors().then((res: any) => {
      const normalized = res?.data?.map((s: any) => ({
        ...s,
        activePeriod: {
          start: s.startdate,
          end: s.enddate,
        },
        countries: s.countries.map((c) => ({
          country_name: c.country_name,
          country_id: c.country_id,
        })),
      }));

      setSponsors(normalized as any);
    });
  };

  const handleSubmit = async (payload: any) => {
    try {
      if (payload?.id) {
        const res = await updateSponsor(payload);
        const responseJson = await res?.json();
        if (!res.ok || res.status !== 200 || responseJson?.statusCode !== 200) {
          throw new Error("Error occured");
        }
        toast.success(responseJson?.message);
        loadSponsors();
      } else {
        const res = await createSponsor(payload);
        const responseJson = await res?.json();
        if (!res.ok || res.status !== 201 || responseJson?.statusCode !== 200) {
          throw new Error("Error occured");
        }
        toast.success(responseJson?.message);
        loadSponsors();
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  const handleDeleteSponsor = async (row: any) => {
    console.log(row);
    try {
      const payload = {
        status: "INACTIVE",
        id: row?.id
      }
      const res = await updateSponsor(payload);
      const responseJson = await res?.json();
      if (!res.ok || res.status !== 200 || responseJson?.statusCode !== 200) {
        throw new Error("Error occured");
      }
      toast.success(responseJson?.message);
      loadSponsors();
    } catch(e) {
      console.log(e)
    }
    // setSponsors((prev: any) => prev.filter((s: any) => s.id !== sponsor.id))
  }

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

          <Button
            className="gap-2 bg-accent hover:bg-accent/90"
            onClick={() => setOpen(true)}
          >
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
        <SponsorsTable
          sponsors={sponsors}
          setEditingSponsor={setEditingSponsor}
          setOpen={setOpen}
          handleDeleteSponsor={handleDeleteSponsor}
        />
      </div>
    </div>
  );
}
