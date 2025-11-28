"use client";

import { useState, ReactNode, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { post, update } from "../service";
import toast from "react-hot-toast";

type DropDownCountry = { id: number; name: string; arabicname: string };

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  dropdownCountries: DropDownCountry[];
  editingCountryId: number | null;
  onSaved: () => void;
  savedCountries: any[];
  countrySources: any[];
  children: ReactNode;
};

export default function CountryDialog({
  open,
  setOpen,
  dropdownCountries,
  editingCountryId,
  onSaved,
  savedCountries,
  countrySources,
  children,
}: Props) {
  const [form, setForm] = useState({
    country_id: "",
    name: "",
    slug: "",
    type: "MANUAL" as "MANUAL" | "AUTO",
    sources: []
  });

  useEffect(() => {
    if (editingCountryId) {
      const country = savedCountries?.find((c) => c.id === editingCountryId);

      if (country) {
        setForm({
          country_id: String(country.country_id),
          name: country.country_name,
          slug: country.slug || "",
          type: country.type?.toUpperCase() === "AUTO" ? "AUTO" : "MANUAL",
          sources: country?.sources
        });
      }
    } else {
      // Reset form on add mode
      setForm({
        country_id: "",
        name: "",
        slug: "",
        type: "MANUAL",
        sources: []
      });
    }
  }, [editingCountryId, savedCountries]);

  const saveCountry = async () => {
    if (!form.country_id) return toast.error("Country is required");

    try {
      if(!editingCountryId) {
        const ddlCountry = dropdownCountries.find(
          (c) => String(c.id) === form.country_id,
        );
  
        const payload = {
          country_id: Number(form.country_id),
          country_name: ddlCountry?.name,
          country_arabic_name: ddlCountry?.arabicname,
          slug: form.slug,
          type: form.type,
          operator: "test1",
          sources: form.sources
        };
  
        await post(payload);
      } else {
        const ddlCountry = dropdownCountries.find(
          (c) => String(c.id) === form.country_id,
        );
  
        const payload = {
          id: editingCountryId,
          country_id: Number(form.country_id),
          country_name: ddlCountry?.name,
          country_arabic_name: ddlCountry?.arabicname,
          slug: form.slug,
          type: form.type,
          operator: "test1",
          sources: form.sources
        };
  
        await update(payload);
      }
      onSaved();
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save country");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingCountryId ? "Edit Country" : "Add Country"}
          </DialogTitle>
          <DialogDescription>
            {editingCountryId
              ? "Update country configuration"
              : "Create a new country entry"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* COUNTRY DROPDOWN */}
          <div>
            <label className="text-sm font-medium">Country</label>
            <Select
              value={form.country_id}
              onValueChange={(v) => {
                const found = dropdownCountries.find((d) => String(d.id) === v);
                const sources = countrySources?.find(row => row.ID === found?.id)?.rssCategoriesUrls?.filter((row: any) => row.STATUS === "active")?.map((row: any) => ({
                  source_name: row.NAME,
                  news_source: row.SOURCE_URL,
                  source_type: "News",
                }))
                setForm((prev) => ({
                  ...prev,
                  country_id: v,
                  name: found?.name || "",
                  sources: sources
                }));
              }}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Pick a country" />
              </SelectTrigger>

              <SelectContent>
                {dropdownCountries.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SLUG */}
          <div>
            <label className="text-sm font-medium">Slug</label>
            <Input
              placeholder="/pakistan"
              value={form.slug}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="mt-1"
            />
          </div>

          {/* TYPE (Manual / Auto) */}
          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              className="w-full mt-1 px-3 py-2 border rounded-md"
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value as "MANUAL" | "AUTO",
                }))
              }
            >
              <option value="MANUAL">Manual</option>
              <option value="AUTO">Auto</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveCountry}
              className="bg-accent hover:bg-accent/90"
            >
              {editingCountryId ? "Update" : "Add"} Country
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
