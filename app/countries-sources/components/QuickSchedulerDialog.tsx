"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
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

type SchedulerData = {
  country_id: number;
  platform: string;
  key: "UPLOAD_TIME" | "UPLOAD_FREQUENCY";
  value: string | number;
};

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  country: string
  editRow?: {
    country_id: number;
    platform: string;
    upload_time?: number | null;
    upload_frequency?: string | null;
  };

  onSave: (data: SchedulerData) => Promise<void>;
};

export default function SchedulerDialog({
  open,
  setOpen,
  editRow,
  onSave,
  country,
}: Props) {
  const [platform, setPlatform] = useState("");
  const [frequency, setFrequency] = useState<string>("");
  const [timeSeconds, setTimeSeconds] = useState("");

  useEffect(() => {
    if (!editRow) return;

    setPlatform(editRow.platform || "");

    if (editRow.upload_frequency) {
      setFrequency(editRow.upload_frequency);
    }

    if (editRow.upload_time) {
      setTimeSeconds(String(editRow.upload_time));
    }
  }, [editRow]);


  const handleSave = async () => {
    if (!platform) return;

    let payload: SchedulerData;

    if (frequency) {
      payload = {
        country_id: editRow?.country_id as number,
        platform,
        key: "UPLOAD_FREQUENCY",
        value: frequency,
      };
    }
    else if (timeSeconds) {
      payload = {
        country_id: editRow?.country_id as number,
        platform,
        key: "UPLOAD_TIME",
        value: Number(timeSeconds),
      };
    } else {
      return;
    }

    await onSave(payload);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {country + " - " + (editRow ? "Update Scheduler" : "Create Scheduler")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">Platform</label>
          <Input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="FACEBOOK / TIKTOK / INSTAGRAM"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Frequency</label>

          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Select frequency..." />
            </SelectTrigger>
            <SelectContent>
              {frequencyOptions.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Time (seconds)</label>
          <Input
            type="number"
            placeholder="e.g. 36000"
            value={timeSeconds}
            onChange={(e) => setTimeSeconds(e.target.value)}
            disabled={!!frequency}
          />
        </div>

        <DialogFooter>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-accent hover:bg-accent/90"
            >
              {editRow ? "Update" : "Add"} Scheduler
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
