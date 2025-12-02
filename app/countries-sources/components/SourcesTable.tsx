
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import React from 'react';
import { Button } from "@/components/ui/button";

type Props = {
  countryId: number;
  countries: any[];
  countrySources: any;
  setCountrySources: (sources: any) => void;
  reloadSources: () => void;
  canSubmit: boolean;
  handleSubmit: () => void;
};

function SourcesTable({
  countryId,
  countries,
  countrySources,
  setCountrySources,
  canSubmit,
  handleSubmit
}: Props) {

  const updateRow = (idx: number, key: string, value: any) => {
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
          </CardHeader>
          <CardContent>
            <table className="w-full min-w-[1180px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold w-4"></th>
                  <th className="text-left py-3 px-4 font-semibold w-4">Source</th>
                  <th className="text-left py-3 px-4 font-semibold w-4">
                    News Source
                  </th>
                  <th className="text-left py-3 px-4 font-semibold w-8">
                    Article Count
                  </th>
                  <th className="text-left py-3 px-4 font-semibold w-8">
                    Sequence
                  </th>
                  <th className="text-left py-3 px-4 font-semibold w-8">Type</th>
                  <th className="text-left py-3 px-4 font-semibold w-8">Joining Words</th>
                  <th className="text-left py-3 px-4 font-semibold w-8">Intro Music</th>
                </tr>
              </thead>
              <tbody>
                {countrySources.map((row, idx) => (
                  <tr
                    key={row.id ?? idx}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      <Switch
                        checked={row.status === "ACTIVE"}
                        // onCheckedChange={() => toggleStatus(row)}
                      />
                    </td>
                    <td className="py-3 px-4 font-medium">{row.source}</td>
                    <td className="py-3 px-4">{row.news_source}</td>
                    <td className="py-3 px-4">
                      <Input
                        value={row.article_count}
                        type="number"
                        onChange={(e) => updateRow(idx, 'article_count', e.target.value)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        value={row.sequence}
                        type="number"
                        onChange={(e) => updateRow(idx, 'sequence', e.target.value)}
                      />
                    </td>
                    <td className="py-3 px-4">{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-full flex justify-end pt-5">            
              <Button
                className="bg-accent hover:bg-accent/90 hover:cursor-pointer"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                Save Sources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default React.memo(SourcesTable);
