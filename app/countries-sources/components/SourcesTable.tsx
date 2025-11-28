"use client";

import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { fetchJson } from "@/lib/fetchJson";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import EditSourceDialog from "./EditSourceDialog";
import { updateSource } from "../service";

type Props = {
  countryId: number;
  countries: any[];
  countrySources: any;
  setCountrySources: (sources: any) => void;
  reloadSources: () => void;
};

export default function SourcesTable({
  countryId,
  countries,
  countrySources,
  setCountrySources,
  reloadSources,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const addEmptyRow = () => {
    const rows = [...(countrySources[countryId] || [])];
    rows.push({
      source: "",
      news_source: "",
      active: "INACTIVE",
      article_count: 0,
      sequence: rows.length + 1,
      type: "Website",
    });
    setCountrySources((prev) => ({ ...prev, [countryId]: rows }));
  };

  const updateRow = (idx: number, key: string, value: any) => {
    const rows = countrySources;
    rows[idx][key] = value;
    setCountrySources(rows);
  };

  const saveRow = async (idx: number) => {
    const row = countrySources[idx];
    if (!row.source || !row.news_source) return alert("Fill required fields");
    try {
      if(row?.id) {
        updateSource(row)
      }
      reloadSources();
    } catch (e) {
      console.error(e);
      alert("Failed to save source");
    }
  };

  const handleSaveDialog = (updated: any) => {
    const idx = countrySources.findIndex((r: any) => r === selectedRow);
    updateRow(idx, "source", updated.source);
    updateRow(idx, "news_source", updated.news_source);
    updateRow(idx, "article_count", updated.article_count);
    updateRow(idx, "sequence", updated.sequence);
    updateRow(idx, "type", updated.type);

    saveRow(idx);
  };

  return (
    <>
      <EditSourceDialog
        open={open}
        row={selectedRow}
        onClose={() => setOpen(false)}
        onSave={handleSaveDialog}
      />
      <div className="mt-6">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {countries.find((c) => c.id === countryId)?.country_name} –
              Sources
            </CardTitle>
            <Button
              onClick={addEmptyRow}
              className="gap-2 bg-accent hover:bg-accent/90"
            >
              <Plus size={16} /> Add Source
            </Button>
          </CardHeader>
          <CardContent>
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold w-12"></th>
                  <th className="text-left py-3 px-4 font-semibold">Source</th>
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
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
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
                    <td className="py-3 px-4">{row.article_count}</td>
                    <td className="py-3 px-4">{row.sequence}</td>
                    <td className="py-3 px-4">{row.type}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={() => {
                            setSelectedRow(row);
                            setOpen(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
