"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Props = {
  countries: { id: number; name: string }[];
  platforms?: string[];
};

export default function QuickScheduler({
  countries,
  platforms = [
    "YouTube Playlist 1",
    "YouTube Playlist 2",
    "YouTube Playlist 3",
    "Facebook",
  ],
}: Props) {
  const handleSchedule = (country: string, platform: string) => {
    alert(`Mock schedule clicked:\n${country} → ${platform}`);
  };

  return (
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
        {countries.map((c) => (
          <tr
            key={c.id}
            className="border-b border-border align-top text-center"
          >
            <td className="py-4 px-4">
              <div className="w-full h-[180px] rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                {c.name}
              </div>
            </td>
            {platforms.map((p) => (
              <td key={p} className="py-4 px-4">
                <div className="w-full h-[180px] flex flex-col items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-28"
                    // onClick={() => handleMockSchedule(c.name, p)}
                  >
                    Schedule
                  </Button>
                  <Input
                    type="time"
                    className="h-9 w-28 text-center"
                    onChange={() => {}}
                  />
                  <div className="flex border border-border rounded-md overflow-hidden">
                    <button className="px-3 py-1 text-xs bg-muted hover:bg-muted/80">
                      AM
                    </button>
                    <button className="px-3 py-1 text-xs hover:bg-muted">
                      PM
                    </button>
                  </div>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
