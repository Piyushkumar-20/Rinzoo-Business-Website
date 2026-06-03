"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type LeadStatus = "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";

interface Props {
  leadId: string;
  currentStatus: LeadStatus;
  currentNote: string | null;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; variant: "warning" | "default" | "success" | "destructive"; icon: React.ElementType }> = {
  PENDING:   { label: "Pending",   variant: "warning",     icon: Clock },
  REVIEWING: { label: "Reviewing", variant: "default",     icon: Eye },
  APPROVED:  { label: "Approved",  variant: "success",     icon: CheckCircle2 },
  REJECTED:  { label: "Rejected",  variant: "destructive", icon: XCircle },
};

const TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  PENDING:   ["REVIEWING"],
  REVIEWING: ["APPROVED", "REJECTED"],
  APPROVED:  ["REJECTED"],
  REJECTED:  ["REVIEWING"],
};

export function LeadStatusUpdater({ leadId, currentStatus, currentNote }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState(currentNote ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cfg = STATUS_CONFIG[currentStatus];
  const Icon = cfg.icon;
  const nextStatuses = TRANSITIONS[currentStatus] ?? [];

  const update = async (newStatus: LeadStatus) => {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reviewNote: note || undefined }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json?.error?.message ?? "Failed to update");
        return;
      }
      startTransition(() => router.refresh());
    } finally {
      setSaving(false);
    }
  };

  const saveNote = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewNote: note }),
      });
      if (!res.ok) {
        setError("Failed to save note");
        return;
      }
      startTransition(() => router.refresh());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Current status */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Status</p>
        <Badge variant={cfg.variant} className="gap-1.5 text-sm px-3 py-1">
          <Icon className="h-4 w-4" />
          {cfg.label}
        </Badge>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Status actions */}
      {nextStatuses.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Update Status</p>
          <div className="flex flex-col gap-2">
            {nextStatuses.map((s) => {
              const c = STATUS_CONFIG[s];
              const Ic = c.icon;
              return (
                <Button
                  key={s}
                  variant={s === "APPROVED" ? "default" : s === "REJECTED" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => update(s)}
                  disabled={saving || isPending}
                  className="justify-start"
                >
                  {(saving || isPending) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Ic className="h-4 w-4" />
                  )}
                  Mark as {c.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Review note */}
      <div>
        <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Review Note</Label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Internal notes about this lead…"
          rows={4}
          className="mt-2 text-sm"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={saveNote}
          disabled={saving || isPending}
          className="mt-2 w-full"
        >
          {(saving || isPending) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Save Note
        </Button>
      </div>
    </div>
  );
}
