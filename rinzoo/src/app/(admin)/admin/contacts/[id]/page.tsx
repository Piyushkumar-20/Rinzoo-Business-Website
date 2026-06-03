import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactStatusUpdater } from "@/components/admin/contacts/ContactStatusUpdater";
import { ChevronLeft, User, Mail, Phone, MessageSquare, Calendar } from "lucide-react";

export const metadata = { title: "Contact Message — Rinzoo Admin" };

type Params = { params: Promise<{ id: string }> };

const STATUS_STYLES: Record<string, { variant: "warning" | "default" | "success" | "secondary" }> = {
  UNREAD:   { variant: "warning" },
  READ:     { variant: "default" },
  REPLIED:  { variant: "success" },
  ARCHIVED: { variant: "secondary" },
};

async function getContact(id: string) {
  // Mark as READ automatically when opened
  const contact = await db.contactSubmission.findUnique({ where: { id } });
  if (!contact) return null;

  // Auto-mark UNREAD → READ on first open
  if (contact.status === "UNREAD") {
    await db.contactSubmission.update({ where: { id }, data: { status: "READ" } });
    return { ...contact, status: "READ" as const };
  }
  return contact;
}

export default async function ContactDetailPage({ params }: Params) {
  const { id } = await params;
  const contact = await getContact(id);
  if (!contact) notFound();

  const statusStyle = STATUS_STYLES[contact.status] ?? { variant: "secondary" as const };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/contacts"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Inbox
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-gray-900">
                {contact.subject || "(No subject)"}
              </h2>
              <Badge variant={statusStyle.variant}>{contact.status}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              From {contact.name} · {new Date(contact.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Message content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Sender info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sender Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Name</p>
                  <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-sm font-medium text-blue-600 hover:underline break-all">
                    {contact.email}
                  </a>
                </div>
              </div>
              {contact.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Phone</p>
                    <a href={`tel:${contact.phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Received</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(contact.createdAt).toLocaleString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message body */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-5">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {contact.message}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Replied timestamp */}
          {contact.repliedAt && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
              Replied on{" "}
              {new Date(contact.repliedAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </div>
          )}
        </div>

        {/* Right — Actions */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactStatusUpdater
                contactId={contact.id}
                currentStatus={contact.status as "UNREAD" | "READ" | "REPLIED" | "ARCHIVED"}
                email={contact.email}
                phone={contact.phone}
                subject={contact.subject}
                name={contact.name}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
