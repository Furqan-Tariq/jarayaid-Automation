import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  countryId: number;
  countries: any[];
  countrySources: any;
  setCountrySources: (sources: any) => void;
  reloadSources: () => void;
  canSubmit: boolean;
  joiningWords: any[];
  handleSubmit: () => Promise<void>;
  toggleStatus: (row: any) => Promise<void>;
};

const TYPES = [
  {
    label: "Newpaper",
    value: "NEWSPAPER",
  },
  {
    label: "Website",
    value: "WEBSITE",
  },
];

function SourcesTable({
  countryId,
  countries,
  countrySources,
  setCountrySources,
  canSubmit,
  joiningWords,
  handleSubmit,
  toggleStatus,
}: Props) {
  const updateRow = (idx: number, key: string, value: any) => {
    console.log(idx,key,  value)
    const rows = [...countrySources]; // deep copy
    rows[idx][key] = value;
    setCountrySources(rows);
  };

  return (
    <>
      <div className="mt-6">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {countries.find((c) => c.id === countryId)?.country_name} –
              Sources
            </CardTitle>
            <Button
              className="bg-accent hover:bg-accent/90 hover:cursor-pointer"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Save Sources
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold"></th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Source
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      News Source
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Article Count
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Sequence
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Joining Words
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Intro Music
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {countrySources?.map((row, idx) => (
                    <tr
                      key={row.id ?? idx}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">
                        <Switch
                          checked={row.status === "ACTIVE"}
                          onCheckedChange={() => toggleStatus(row)}
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{row.source}</td>
                      <td className="py-3 px-4">{row.news_source}</td>
                      <td className="py-3 px-4">
                        <Input
                          value={row.article_count}
                          type="number"
                          className="h-8 w-20"
                          onChange={(e) =>
                            updateRow(idx, "article_count", e.target.value)
                          }
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Input
                          value={row.sequence}
                          type="number"
                          className="h-8 w-20"
                          onChange={(e) =>
                            updateRow(idx, "sequence", e.target.value)
                          }
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={row.type}
                          onValueChange={(v) => updateRow(idx, "type", v)}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>

                          <SelectContent>
                            {TYPES.map((d) => (
                              <SelectItem key={d.value} value={String(d.value)}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={row.joining_words?.toString()}
                          onValueChange={(v) =>
                            updateRow(idx, "joining_words", v)
                          }
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select Joining Word" />
                          </SelectTrigger>

                          <SelectContent>
                            {joiningWords?.map((d: any) => (
                              <SelectItem key={d.value} value={String(d.value)}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          value={row.intro_music}
                          className="text-xs"
                          type="file"
                          onChange={(e) =>
                            updateRow(idx, "intro_music", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default React.memo(SourcesTable);
