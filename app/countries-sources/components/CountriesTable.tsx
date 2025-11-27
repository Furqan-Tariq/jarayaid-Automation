"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { fetchJson } from "@/lib/fetchJson";
import { update } from "../service";

type Country = {
  id: number;
  country_id: number;
  country_name: string;
  country_arabic_name: string;
  slug: string;
  type: string;
  operator: string;
  datetime: string;
  modified_datetime: string;
  status: "ACTIVE" | "INACTIVE";
};

type Props = {
  countries: Country[];
  setCountries: (c: Country[]) => void;
  setSelectedCountryId: (id: number) => void;
  openEditCountry: (id: number) => void;
};

export default function CountriesTable({
  countries,
  setCountries,
  setSelectedCountryId,
  openEditCountry,
}: Props) {
  const toggleStatus = async (country: Country) => {
    const newStatus = country.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const updated = { ...country, status: newStatus };

    try {
      const payload = {
        id: country.id,
        status: newStatus,
      }
      update(payload);
      setCountries(countries.map((c) => (c.id === country.id ? updated : c)));
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };
  
  const changeScriptType = async (country: Country) => {
    const newType = country.type === "MANUAL" ? "AUTO" : "MANUAL";
    const updated = { ...country, type: newType };

    try {
      const payload = {
        id: country.id,
        type: newType,
      }
      update(payload);
      setCountries(countries.map((c) => (c.id === country.id ? updated : c)));
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  const deleteCountry = async (id: number) => {
    if (!confirm("Delete this country?")) return;

    try {
      await fetchJson("admin-dashboard/deleteCountry", {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      setCountries(countries.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete country");
    }
  };

  return (
    <div>
      <table className="w-full min-w-[1100px] text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold w-12"></th>
            <th className="text-left py-3 px-4 font-semibold">Country</th>
            <th className="text-left py-3 px-4 font-semibold">Slug</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-left py-3 px-4 font-semibold">Source</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr
              key={country.id}
              className="border-b border-border hover:bg-muted/50"
            >
              <td className="py-3 px-4">
                <Switch
                  checked={country.status === "ACTIVE"}
                  onCheckedChange={() => toggleStatus(country)}
                />
              </td>
              <td className="py-3 px-4 font-medium">{country.country_name}</td>
              <td className="py-3 px-4 text-muted-foreground text-xs">
                {country.slug}
              </td>
              <td className="py-3 px-4">
                <button
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    country.type === "MANUAL"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => changeScriptType(country)}
                >
                  {country.type === "MANUAL" ? "Manual" : "Auto"}
                </button>
              </td>
              <td className="py-3 px-4">
                <Button
                  className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground text-xs px-3 py-1"
                  onClick={() => setSelectedCountryId(country.id)}
                >
                  View
                </Button>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditCountry(country.id)}
                    className="gap-1"
                  >
                    <Edit2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
