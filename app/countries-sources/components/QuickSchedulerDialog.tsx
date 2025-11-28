"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
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

const frequencyOptions = [
  { label: "Daily", value: "DAILY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
];

const platformOptions = ["YouTube", "Instagram", "Facebook", "TikTok"];

type Row = {
  platform: string;
  frequency: string;
  timeSeconds: string;
};

type SchedulerData = {
  country_id: number;
  platform: string;
  key: "UPLOAD_TIME" | "UPLOAD_FREQUENCY";
  value: string | number;
};

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  country: string;
  country_id: number;
  editRow?: {
    platform: string;
    upload_time?: number | null;
    upload_frequency?: string | null;
  }[];
  onSave: (data: SchedulerData[]) => Promise<void>;
};

export default function SchedulerDialog({
  open,
  setOpen,
  editRow,
  onSave,
  country,
  country_id,
}: Props) {
  const [rows, setRows] = useState<Row[]>([
    { platform: "", frequency: "", timeSeconds: "" },
  ]);

  useEffect(() => {
    if (!editRow) return;

    const mapped = editRow.map((r) => ({
      platform: r.platform ?? "",
      frequency: r.upload_frequency ?? "",
      timeSeconds:
        r.upload_time || r.upload_time === 0 ? String(r.upload_time) : "",
    }));

    setRows(mapped.length > 0 ? mapped : rows);
  }, [editRow]);

  const updateRow = (i: number, key: keyof Row, value: string) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [key]: value };
      return copy;
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, { platform: "", frequency: "", timeSeconds: "" }]);
  };

  const removeRow = (i: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    const payload: SchedulerData[] = [];

    rows.forEach((row) => {
      if (!row.platform) return;

      if (row.frequency) {
        payload.push({
          country_id,
          platform: row.platform,
          key: "UPLOAD_FREQUENCY",
          value: row.frequency,
        });
      }

      if (row.timeSeconds) {
        payload.push({
          country_id,
          platform: row.platform,
          key: "UPLOAD_TIME",
          value: row.timeSeconds,
        });
      }
    });

    if (payload.length === 0) return;

    await onSave(payload);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {country + " - " + (editRow ? "Update Scheduler" : "Create Scheduler")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-3 p-3 border rounded-lg"
            >
              {/* Platform */}
              <div className="col-span-3 space-y-1">
                <label className="text-sm font-medium">Platform</label>
                <Select
                  value={row.platform}
                  onValueChange={(v) => updateRow(index, "platform", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Frequency */}
              <div className="col-span-3 space-y-1">
                <label className="text-sm font-medium">Frequency</label>
                <Select
                  value={row.frequency}
                  onValueChange={(v) => updateRow(index, "frequency", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time */}
              <div className="col-span-4 space-y-1">
                <label className="text-sm font-medium">Time (sec)</label>
                <Input
                  type="number"
                  placeholder="e.g. 36000"
                  value={row.timeSeconds}
                  onChange={(e) => updateRow(index, "timeSeconds", e.target.value)}
                />
              </div>

              <div className="col-span-2 flex items-end justify-end">
                {rows.length > 1 && (
                  <Button
                    variant="destructive"
                    onClick={() => removeRow(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addRow} className="w-full">
            + Add Another Platform
          </Button>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-accent hover:bg-accent/90">
            {editRow ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
