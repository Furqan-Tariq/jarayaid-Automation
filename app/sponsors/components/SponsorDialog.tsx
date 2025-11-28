"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MultiSelect } from "@/components/ui/multi-select";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  onCreate: (data: any) => void;
  countries: any[];
};

export default function SponsorDialog({
  open,
  setOpen,
  onCreate,
  countries,
}: Props) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [countriesDraft, setCountriesDraft] = useState<string[]>([]);
  const [countryInput, setCountryInput] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const reset = () => {
    setName("");
    setWebsite("");
    setStart("");
    setEnd("");
    setCountriesDraft([]);
    setCountryInput("");
    setLogoFile(null);
    setLogoPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const canSubmit = useMemo(() => {
    return name.trim() && website.trim() && start && end;
  }, [name, website, start, end]);

  const onUploadLogo: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    const url = URL.createObjectURL(f);
    setLogoPreview(url);
  };

  const handleCreate = () => {
    if (!canSubmit) return;

    const operator = "admin";

    const payload = {
      name,
      website,
      startdate: start,
      enddate: end,
      operator,
      countries: selectedCountries.map((c) => ({
        country_id: c,
        operator,
      })),
    };

    onCreate(payload);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Add Sponsor</DialogTitle>
          <DialogDescription>Fill in sponsor details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="text-sm">Logo</Label>
            <div className="flex items-center gap-3">
              <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={logoPreview || "/placeholder.svg"}
                  alt="Logo preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={onUploadLogo}
                  className="w-full"
                />
                {logoPreview && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview("");
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Countries */}
          <div className="space-y-2">
            <Label>Countries</Label>
            <MultiSelect
              value={selectedCountries}
              onChange={setSelectedCountries}
              placeholder="Select countries"
              options={
                countries.map((c) => ({
                  label: c.name,
                  value: c.id,
                })) as any
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90"
            disabled={!canSubmit}
            onClick={handleCreate}
          >
            Create Sponsor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
