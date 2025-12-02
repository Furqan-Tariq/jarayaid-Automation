import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  onCreate?: (data: any, isEdit?: boolean) => void;
  editingConfig?: any | null;
};

const configTypes = [
  {
    label: "Intro Message",
    value: "INTRO",
  },
  {
    label: "Outro Message",
    value: "OUTRO",
  },
  {
    label: "Custom Message",
    value: "CUSTOM",
  },
];

function ConfigurationDialog({
  open,
  setOpen,
  onCreate,
  editingConfig,
}: Props) {
  const [configType, setConfigType] = useState(configTypes[0]?.value);
  const [configValue, setConfigValue] = useState("");
  const [sequence, setSequence] = useState("");

  useEffect(() => {
    if (editingConfig) {
      setConfigValue(editingConfig.value);
      setConfigType(editingConfig.key);
      setSequence(editingConfig.sequence)
    } else {
      setConfigValue("");
      setConfigType(configTypes[0]?.value);
      setSequence("")
    }
  }, [editingConfig]);
  const handleSubmit = () => {
    if (!configType.trim()) return;
    if (!configValue.trim()) return;

    if (onCreate) {
      onCreate(
        {
          id: editingConfig?.id,
          key: configType,
          value: configValue,
          sequence: parseInt(sequence)
        },
        Boolean(editingConfig),
      );
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {editingConfig ? "Edit" : "Add"} Joining Word
          </DialogTitle>
          <DialogDescription>Fill in details.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Message Type</label>
            <Select
              value={configType}
              onValueChange={(v) => setConfigType(v)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Pick a country" />
              </SelectTrigger>

              <SelectContent>
                {configTypes.map((d) => (
                  <SelectItem key={d.value} value={String(d.value)}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <Input
              placeholder="Joining Word"
              className="mt-1"
              value={configValue}
              onChange={(e) => setConfigValue(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Precedence</label>
            <Input
              placeholder="Precedence"
              className="mt-1"
              type="number"
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={handleSubmit}
          >
            {editingConfig ? "Edit" : "Add"} Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(ConfigurationDialog);
