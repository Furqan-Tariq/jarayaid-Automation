"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import SchedulerDialog from "./QuickSchedulerDialog";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { createScheduler } from "../service";

type Props = {
  countries: { id: number; name: string }[];
  platforms?: string[];
  scheduler?: any; // 👈 Add
};

export default function QuickScheduler({
  countries,
  platforms = ["YouTube", "Instagram", "Facebook", "TikTok"],
  scheduler,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<any>(null);

  const handleEdit = (platform: string, data: any) => {
    setDialogData({
      country_id: scheduler.COUNTRY_ID,
      platform,
      upload_time: data.UPLOAD_TIME ?? null,
      upload_frequency: data.UPLOAD_FREQUENCY ?? null,
    });
    setDialogOpen(true);
  };

  const onSaveScheduler = async (payload: any) => {
    if(payload.id) {
      
    } else {
      await createScheduler({schedulers: payload});
    }
  };

  const secondsToHHMM = (sec: number) => {
    if (!sec && sec !== 0) return "";
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const hhmmToSeconds = (hhmm: string) => {
    if (!hhmm) return null;
    const [hh, mm] = hhmm.split(":").map(Number);
    return hh * 3600 + mm * 60;
  };

  const platformKeys = useMemo(() => {
    if (scheduler) {
      return Object.keys(scheduler).filter(
        (key) => !["COUNTRY_ID", "COUNTRY_NAME"].includes(key),
      );
    }
    return [];
  }, [scheduler]);

  const frequencyOptions = [
    {
      label: "Daily",
      value: "DAILY",
    },
    {
      label: "Weekly",
      value: "WEEKLY",
    },
    {
      label: "Monthly",
      value: "MONTHLY",
    },
  ];

  return (
    <>
      {scheduler && (
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Scheduler</CardTitle>
            <Button
              onClick={() => setDialogOpen(true)}
              className="gap-2 bg-accent hover:bg-accent/90"
            >
              <Plus size={16} /> Add Scheduler
            </Button>
          </CardHeader>
          <CardContent>
            <table className="w-full min-w-[1100px] table-fixed text-sm">
              <colgroup>
                <col className="w-[180px]" />
                {platforms.map((p) => (
                  <col key={p} className="w-[180px]" />
                ))}
              </colgroup>
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left font-semibold">Country</th>
                  {platforms.map((p) => (
                    <th key={p} className="py-3 px-4 text-center font-semibold">
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr
                  key={scheduler.COUNTRY_ID}
                  className="border-b text-center align-top"
                >
                  <td className="py-4 px-4">
                    <div className="w-full h-[180px] bg-accent rounded-2xl flex items-center justify-center text-white">
                      {scheduler.COUNTRY_NAME}
                    </div>
                  </td>
                  {platformKeys.map((platform) => {
                    const data = scheduler[platform] || {};
                    const timeInSeconds = data.UPLOAD_TIME ?? "";
                    const hours = Math.floor(timeInSeconds / 3600);
                    const minutes = Math.floor((timeInSeconds % 3600) / 60);
                    const formatted = timeInSeconds
                      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
                      : "";
                    return (
                      <td key={platform} className="py-4 px-4">
                        <div className="w-full h-[180px] flex flex-col items-center justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-28"
                          >
                            Schedule
                          </Button>

                          <Input
                            type="time"
                            value={formatted}
                            className="h-9 w-28 text-center"
                            onChange={(e) => {
                              // convert back to seconds
                              const [hh, mm] = e.target.value.split(":");
                              const seconds =
                                Number(hh) * 3600 + Number(mm) * 60;
                            }}
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-28"
                          >
                            Frequency
                          </Button>

                          <Select
                            value={data.UPLOAD_FREQUENCY}
                            // onValueChange={(v) => {
                            //   const found = dropdownCountries.find(
                            //     (d) => String(d.id) === v,
                            //   );
                            //   const sources = countrySources
                            //     ?.find((row) => row.ID === found?.id)
                            //     ?.rssCategoriesUrls?.filter(
                            //       (row: any) => row.STATUS === "active",
                            //     )
                            //     ?.map((row: any) => ({
                            //       source_name: row.NAME,
                            //       news_source: row.SOURCE_URL,
                            //       source_type: "News",
                            //     }));
                            //   setForm((prev) => ({
                            //     ...prev,
                            //     country_id: v,
                            //     name: found?.name || "",
                            //     sources: sources,
                            //   }));
                            // }}
                          >
                            <SelectTrigger className="h-9 w-28 text-center">
                              <SelectValue placeholder="Frequency" />
                            </SelectTrigger>

                            <SelectContent>
                              {frequencyOptions.map((d) => (
                                <SelectItem
                                  key={d.value}
                                  value={String(d.value)}
                                >
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      <SchedulerDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        editRow={dialogData}
        onSave={onSaveScheduler}
        country={scheduler?.COUNTRY_NAME}
        country_id={scheduler?.COUNTRY_ID}
      />
    </>
  );
}
