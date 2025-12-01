"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bulletin } from "./types";

type Props = {
  b: Bulletin;
  expanded: boolean;
  toggle: () => void;
  setStatus: (s: "APPROVED" | "REJECTED") => void;
  getStatusColor: (s: string) => string;
  getVideoColor: (s: string) => string;
};

export default function BulletinHeader({
  b,
  expanded,
  toggle,
  setStatus,
  getStatusColor,
  getVideoColor,
}: Props) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
      {/* Left side */}
      <button
        onClick={toggle}
        className="flex flex-1 items-center gap-3 text-left hover:opacity-80 transition-opacity"
      >
        <ChevronDown
          size={20}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-sm w-full">
          <div>
            <p className="font-mono text-xs text-muted-foreground">ID</p>
            <p className="font-semibold text-foreground">{b.id}</p>
          </div>

          <div>
            <p className="font-mono text-xs text-muted-foreground">Country</p>
            <p className="font-semibold text-foreground">{b.country_name}</p>
          </div>

          <div>
            <p className="font-mono text-xs text-muted-foreground">Category</p>
            <p className="font-semibold text-foreground">{b.category}</p>
          </div>

          <div>
            <p className="font-mono text-xs text-muted-foreground">Created</p>
            <p className="font-semibold text-foreground">
              {new Date(b.datetime).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span
              className={`px-3 py-1 rounded text-xs font-semibold h-fit ${getStatusColor(b.approval_status)}`}
            >
              {b.approval_status === "APPROVED" ? "Approved" : b.approval_status === "REJECTED" ? "Rejected" : "Pending"}
            </span>

            <span
              className={`px-3 py-1 rounded text-xs font-semibold h-fit ${getVideoColor(b.video_gen_status)}`}
            >
              {b.video_gen_status === "PENDING" ? "Pending" : b.video_gen_status}
            </span>
          </div>
        </div>
      </button>

      {/* Buttons */}
        <div className="flex-shrink-0 flex items-center gap-2 self-end md:self-auto">
          {b.approval_status === "PENDING" ? (
        <>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 w-24"
            onClick={() => setStatus("APPROVED")}
          >
            Approved
          </Button>

          <Button
            size="sm"
            variant="destructive"
            className="w-24"
            onClick={() => setStatus("REJECTED")}
          >
            Rejected
          </Button>
        </>
      ) :
      <div className="w-[200px]">
        <span className="px-3 py-1 rounded text-xs font-semibold">
          N/A
        </span>
      </div>}
        </div>
    </div>
  );
}
