"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function EditSourceDialog({
  open,
  onClose,
  row,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  row: any;
  onSave: (updatedRow: any) => void;
}) {
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (row) setForm(row);
  }, [row]);

  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Source</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          <div>
            <label className="text-sm font-medium">Source</label>
            <Input
              value={form.source}
              onChange={(e) => update("source", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">News Source</label>
            <Input
              value={form.news_source}
              onChange={(e) => update("news_source", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Article Count</label>
            <Input
              type="number"
              value={form.article_count}
              onChange={(e) => update("article_count", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Sequence</label>
            <Input
              type="number"
              value={form.sequence}
              onChange={(e) => update("sequence", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
            >
              <option value="Website">Website</option>
              <option value="Newspaper">Newspaper</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(form);
              onClose();
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
