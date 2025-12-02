import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pen, RefreshCcw } from "lucide-react";

type JoiningWord = {
  id: number;
  joining_word: string;
  status: "ACTIVE" | "INACTIVE";
};

type Props = {
  joiningWords: JoiningWord[];
  onEdit?: (word: JoiningWord) => void;
  onChangeStatus?: (id: number, status: string) => void;
};

function JoiningWordsTable({ joiningWords, onEdit, onChangeStatus }: Props) {
  return (
    <table className="w-full min-w-[500px] table-fixed text-sm">
      <colgroup>
        <col className="w-[70%]" />
        <col className="w-[15%]" />
        <col className="w-[15%]" />
      </colgroup>

      <thead className="sticky top-0 bg-card z-10">
        <tr className="border-b border-border">
          <th className="py-3 px-4 text-left font-semibold">Word</th>
          <th className="py-3 px-4 text-left font-semibold">Status</th>
          <th className="py-3 px-4 text-center font-semibold">Actions</th>
        </tr>
      </thead>

      <tbody>
        {joiningWords.length === 0 && (
          <tr>
            <td colSpan={3} className="text-center py-5 text-muted-foreground">
              No joining words added yet.
            </td>
          </tr>
        )}

        {joiningWords.map((row) => (
          <tr key={row.id} className="border-b text-center align-middle">
            <td className="py-3 px-4 text-left">{row.joining_word}</td>
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

export default React.memo(JoiningWordsTable);
