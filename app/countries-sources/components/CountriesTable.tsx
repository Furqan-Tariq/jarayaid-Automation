import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { post, update } from "../service";
import React from 'react';
import toast from "react-hot-toast";

type Country = {
  id: number;
  country_id: number;
  country_name: string;
  country_arabic_name: string;
  type: string;
  country_info_id: number | null
  status: "ACTIVE" | "INACTIVE";
};

type Props = {
  countries: Country[];
  setCountries: (c: Country[]) => void;
  setSelectedCountryId: (id: number) => void;
};

const operator = "admin";

function CountriesTable({
  countries,
  setCountries,
  setSelectedCountryId,
}: Props) {
  
  const toggleStatus = async (country: Country) => {

    try {
      if(country?.country_info_id) {
        const newStatus = country.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const updated = { ...country, status: newStatus };
        const payload = {
          id: country.country_info_id,
          status: newStatus,
        };
        const res = await update(payload);
        const responseJson = await res.json();
        if(!res.ok || res.status !== 200 || responseJson?.statusCode !== 200) {
          throw new Error("Error occured");
        }
        setCountries(countries.map((c) => (c.id === country.id ? updated : c)));
        toast.success(responseJson?.message);
      } else {
        const payload = {
          country_id: country?.id,
          type: country?.type,
          operator: operator
        }
        const res = await post(payload);
        const responseJson = await res.json();
        if(!res.ok || res.status !== 200 || responseJson?.statusCode !== 200) {
          throw new Error("Error occured");
        }
        // setCountries(countries.map((c) => (c.id === country.id ? updated : c)));
        toast.success(responseJson?.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    }
  };

  const changeScriptType = async (country: Country) => {
    const newType = country.type === "MANUAL" ? "AUTO" : "MANUAL";
    const updated = { ...country, type: newType };

    try {
      const payload = {
        id: country.country_info_id,
        type: newType,
      };
      const res = await update(payload);
      const responseJson = await res.json();
      if(!res.ok || res.status !== 200 || responseJson?.statusCode !== 200) {
        throw new Error("Error occured");
      }
      setCountries(countries.map((c) => (c.id === country.id ? updated : c)));
      toast.success(responseJson?.message);
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  return (
    <table className="w-full min-w-[1100px] table-fixed text-sm">
      <thead className="sticky top-0 bg-card z-10">
        <tr className="border-b border-border">
          <th className="text-left py-3 px-4 font-semibold w-12"></th>
          <th className="text-left py-3 px-4 font-semibold">Country</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default React.memo(CountriesTable);
