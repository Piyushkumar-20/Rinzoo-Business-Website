import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactFilters } from "@/components/admin/contacts/ContactFilters";
import { MessageSquare, MailOpen } from "lucide-react";
import type { Prisma } from "@prisma/client";

export const metadata = { title: "Contacts — Rinzoo Admin" };

type SearchParams = { status?: string; q?: string; page?: string };

const STATUS_STYLES: Record<string, { variant: "warning" | "default" | "success" | "secondary" }> = {
  UNREAD:   { variant: "warning" },
  READ:     { variant: "default" },
  REPLIED:  { variant: "success" },
  ARCHIVED: { variant: "secondary" },
};

async function getContacts(searchParams: SearchParams) {
  const { status, q, page = "1" } = searchParams;
  const pageNum = Math.max(1, parseInt(page));
  const pageSize = 25;

  const where: Prisma.ContactSubmissionWhereInput = {
    ...(status ? { status: status as Prisma.EnumContactStatusFilter } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { subject: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [contacts, total, unreadCount] = await Promise.all([
    db.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, name: true, email: true, phone: true,
        subject: true, message: true, status: true, createdAt: true,
      },
    }),
    db.contactSubmission.count({ where }),
    db.contactSubmission.count({ where: { status: "UNREAD" } }),
  ]);

  return { contacts, total, pageNum, pageSize, unreadCount };
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { contacts, total, pageNum, pageSize, unreadCount } = await getContacts(sp);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Contact Inbox</h2>
            {unreadCount > 0 && (
              <span className="inline-flex h-6 items-center justify-center rounded-full bg-[#e91e63] px-2 text-xs font-bold text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Messages from the contact form</p>
        </div>
      </div>

      {/* Filters */}
      <ContactFilters unreadCount={unreadCount} />

      {/* Results count */}
      <p className="text-sm text-gray-500">
        {total === 0 ? "No messages found" : `${total} message${total !== 1 ? "s" : ""}`}
        {sp.status ? ` · ${sp.status.toLowerCase()}` : ""}
      </p>

      {/* Messages list */}
      {contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MailOpen className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-900">
              {sp.status === "UNREAD" ? "No unread messages" : "No messages found"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {sp.status ? "Try a different filter." : "Messages from the contact form will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {contacts.map((c) => {
              const style = STATUS_STYLES[c.status] ?? { variant: "secondary" as const };
              const isUnread = c.status === "UNREAD";
              return (
                <Link
                  key={c.id}
                  href={`/admin/contacts/${c.id}`}
                  className={`flex items-center justify-between px-5 py-4 transition-colors group ${isUnread ? "bg-blue-50/50 hover:bg-blue-50" : "bg-white hover:bg-gray-50"}`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Unread dot */}
                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${isUnread ? "bg-[#e91e63]" : "bg-transparent"}`} />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm truncate ${isUnread ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                          {c.name}
                        </p>
                        <span className="text-gray-300">·</span>
                        <p className="text-xs text-gray-500 truncate hidden sm:block">{c.email}</p>
                      </div>
                      <p className={`text-sm truncate mt-0.5 ${isUnread ? "font-medium text-gray-800" : "text-gray-600"}`}>
                        {c.subject || "(No subject)"}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5 max-w-sm">
                        {c.message.slice(0, 100)}{c.message.length > 100 ? "…" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <p className="hidden sm:block text-xs text-gray-400 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short",
                      })}
                    </p>
                    <Badge variant={style.variant} className="text-xs">{c.status}</Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {pageNum} of {totalPages}</p>
          <div className="flex gap-2">
            {pageNum > 1 && (
              <Link href={`?${new URLSearchParams({ ...sp, page: String(pageNum - 1) })}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </Link>
            )}
            {pageNum < totalPages && (
              <Link href={`?${new URLSearchParams({ ...sp, page: String(pageNum + 1) })}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
