
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import React from 'react';

type Props = {
  countries: { id: number; name: string }[];
  platforms?: string[];
  scheduler?: any;
  setScheduler: () => void;
  canSubmitScheduler: boolean;
  handleSubmit: () => void;
  toggleSchedule: (row: any) => void;
};

function QuickScheduler({
  countries,
  platforms = ["YouTube", "Instagram", "Facebook", "TikTok"],
  scheduler,
  setScheduler,
  canSubmitScheduler,
  handleSubmit,
  toggleSchedule
}: Props) {

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
  
  const updateScheduler = (
    countryIndex: number,
    platformKey: string,
    fieldKey: string,
    value: any
  ) => {
    setScheduler((prev: any[]) => {
      const copy = structuredClone(prev); // safe deep clone
  
      // ensure object paths exist
      if (!copy[countryIndex][platformKey]) {
        copy[countryIndex][platformKey] = {};
      }
  
      // update value
      copy[countryIndex][platformKey][fieldKey] = value;
  
      return copy;
    });
  };


  return (
    <>
      {scheduler && (
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Scheduler</CardTitle>
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
                {scheduler.map((scheduler: any, rowIndex: number) => (
                  <tr
                    key={scheduler.COUNTRY_ID}
                    className="border-b text-center align-top"
                  >
                    <td className="py-4 px-4">
                      <div className="w-full h-[180px] bg-accent rounded-2xl flex items-center justify-center text-white flex-col gap-1">
                        {scheduler.COUNTRY_NAME}
                        <Switch
                          checked={scheduler.status === "ACTIVE"}
                          className="!bg-[#ffffff99]"
                          onCheckedChange={() => toggleSchedule(scheduler)}
                        />
                      </div>
                    </td>
                    {Object.keys(scheduler).filter(
                      (key) => !["COUNTRY_ID", "COUNTRY_NAME", "rowExists", "status"].includes(key),
                      ).map((platform) => {
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
                                const [hh, mm] = e.target.value.split(":");
                                const seconds = Number(hh) * 3600 + Number(mm) * 60;
                              
                                updateScheduler(rowIndex, platform, "UPLOAD_TIME", seconds);
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
                              onValueChange={(v) => {
                                updateScheduler(rowIndex, platform, "UPLOAD_FREQUENCY", v);
                              }}
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
                ))}
              </tbody>
            </table>
            <div className="w-full flex justify-end pt-5">            
              <Button
                className="bg-accent hover:bg-accent/90 hover:cursor-pointer"
                disabled={!canSubmitScheduler}
                onClick={handleSubmit}
              >
                Save Scheduler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default React.memo(QuickScheduler);
