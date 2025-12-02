import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  onCreate?: (data: any, isEdit?: boolean) => void;
  editingJoiningWord?: any | null;
};

function JoiningWordDialog({
  open,
  setOpen,
  onCreate,
  editingJoiningWord,
}: Props) {
  const [word, setWord] = useState("");

  useEffect(() => {
    if (editingJoiningWord) {
      setWord(editingJoiningWord.joining_word);
    } else {
      setWord("");
    }
  }, [editingJoiningWord]);
  const handleSubmit = () => {
    if (!word.trim()) return;

    if (onCreate) {
      onCreate(
        {
          id: editingJoiningWord?.id,
          joining_word: word,
        },
        Boolean(editingJoiningWord),
      );
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {editingJoiningWord ? "Edit" : "Add"} Joining Word
          </DialogTitle>
          <DialogDescription>Fill in details.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Joining Word</label>
            <Input placeholder="Joining Word" className="mt-1" value={word} onChange={(e) => setWord(e.target.value)} />
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
            {editingJoiningWord ? "Edit" : "Create"} Joining Word
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(JoiningWordDialog);
