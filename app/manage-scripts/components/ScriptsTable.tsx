"use client";

import Image from "next/image";
import { DollarSign, Pen, Pencil, Share2, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  scripts: any[];
  onGenerate: (script: any) => void;
};

export default function ScriptsTable({ scripts, onGenerate }: Props) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
          <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold">Scripts</h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Scripts (Overview)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {scripts.map((script, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{script.country_name}</TableCell>
                <TableCell className="font-medium">{script.overview}</TableCell>
                <TableCell className="font-medium">{script.status}</TableCell>
                <TableCell className="font-medium text-right">
                  <Button
                    variant="ghost"
                    title="Generate Video"
                    onClick={() => onGenerate(script)} // <-- call page function
                  >
                    <Wand2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
