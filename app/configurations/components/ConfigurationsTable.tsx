import React from "react";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";

type Props = {
  configurations: any[];
  onEdit?: (row: any) => void;
  onChangeStatus?: (id: number, status: string) => void;
};

function ConfigurationsTable({ configurations, onEdit, onChangeStatus }: Props) {
  return (
    <table className="w-full min-w-[500px] table-fixed text-sm">
      <colgroup>
        <col className="w-[40%]" />
        <col className="w-[15%]" />
        <col className="w-[15%]" />
        <col className="w-[15%]" />
        <col className="w-[15%]" />
      </colgroup>

      <thead className="sticky top-0 bg-card z-10">
        <tr className="border-b border-border">
          <th className="py-3 px-4 text-left font-semibold">Configuration Type</th>
          <th className="py-3 px-4 text-left font-semibold">Configuration Value</th>
          <th className="py-3 px-4 text-left font-semibold">Precedence</th>
          <th className="py-3 px-4 text-left font-semibold">Status</th>
          <th className="py-3 px-4 text-center font-semibold">Actions</th>
        </tr>
      </thead>

      <tbody>
        {configurations.length === 0 && (
          <tr>
            <td colSpan={3} className="text-center py-5 text-muted-foreground">
              No configurations available.
            </td>
          </tr>
        )}

        {configurations.map((row) => (
          <tr key={row.id} className="border-b text-center align-middle">
            <td className="py-3 px-4 text-left">{row.key}</td>
            <td className="py-3 px-4 text-left">{row.value}</td>
            <td className="py-3 px-4 text-left">{row.sequence}</td>
            <td className="py-3 px-4 text-left">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChangeStatus?.(row.id, row?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
              >
                {row.status}
              </Button>
            </td>
            <td className="py-3 px-4">
              <Button variant="ghost" size="sm" onClick={() => onEdit?.(row)}>
                <Pen />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default React.memo(ConfigurationsTable);
