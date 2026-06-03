"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Archive, CheckCheck, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ContactStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

interface Props {
  contactId: string;
  currentStatus: ContactStatus;
  email: string;
  phone?: string | null;
  subject?: string | null;
  name: string;
}

const STATUS_CONFIG: Record<ContactStatus, { label: string; variant: "warning" | "default" | "success" | "secondary" }> = {
  UNREAD:   { label: "Unread",   variant: "warning" },
  READ:     { label: "Read",     variant: "default" },
  REPLIED:  { label: "Replied",  variant: "success" },
  ARCHIVED: { label: "Archived", variant: "secondary" },
};

export function ContactStatusUpdater({ contactId, currentStatus, email, phone, subject, name }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cfg = STATUS_CONFIG[currentStatus];

  const update = async (newStatus: ContactStatus) => {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/contacts/${contactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        setError("Failed to update status");
        return;
      }
      startTransition(() => router.refresh());
    } finally {
      setSaving(false);
    }
  };

  const isLoading = saving || isPending;

  return (
    <div className="space-y-5">
      {/* Status */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</p>
        <Badge variant={cfg.variant} className="text-sm px-3 py-1">{cfg.label}</Badge>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Quick actions */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Actions</p>
        <div className="flex flex-col gap-2">
          {currentStatus === "UNREAD" && (
            <Button variant="outline" size="sm" onClick={() => update("READ")} disabled={isLoading} className="justify-start">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
              Mark as Read
            </Button>
          )}
          {(currentStatus === "UNREAD" || currentStatus === "READ") && (
            <Button variant="default" size="sm" onClick={() => update("REPLIED")} disabled={isLoading} className="justify-start">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
              Mark as Replied
            </Button>
          )}
          {currentStatus !== "ARCHIVED" && (
            <Button variant="outline" size="sm" onClick={() => update("ARCHIVED")} disabled={isLoading} className="justify-start text-gray-500">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
              Archive
            </Button>
          )}
          {currentStatus === "ARCHIVED" && (
            <Button variant="outline" size="sm" onClick={() => update("READ")} disabled={isLoading} className="justify-start">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
              Unarchive
            </Button>
          )}
        </div>
      </div>

      {/* Reply shortcuts */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Reply Via</p>
        <div className="flex flex-col gap-2">
          <a
            href={`mailto:${email}?subject=Re: ${encodeURIComponent(subject ?? "Your enquiry — Rinzoo")}&body=Dear ${encodeURIComponent(name)},%0A%0A`}
            className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Mail className="h-4 w-4 text-gray-400" />
            Reply by Email
          </a>
          {phone && (
            <a
              href={`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${name}, thank you for contacting Rinzoo.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border border-[#25d366] px-3 py-2 text-sm font-medium text-[#25d366] hover:bg-green-50 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Reply on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
