import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadFilters } from "@/components/admin/leads/LeadFilters";
import { Users2, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { Prisma } from "@prisma/client";

export const metadata = { title: "Leads — Rinzoo Admin" };

type SearchParams = { status?: string; q?: string; page?: string };

const STATUS_STYLES: Record<string, { variant: "warning" | "default" | "success" | "destructive" | "secondary" }> = {
  PENDING:   { variant: "warning" },
  REVIEWING: { variant: "default" },
  APPROVED:  { variant: "success" },
  REJECTED:  { variant: "destructive" },
};

async function getLeads(searchParams: SearchParams) {
  const { status, q, page = "1" } = searchParams;
  const pageNum = Math.max(1, parseInt(page));
  const pageSize = 25;

  const where: Prisma.DistributorLeadWhereInput = {
    ...(status ? { status: status as Prisma.EnumLeadStatusFilter } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { businessName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [leads, total, stats] = await Promise.all([
    db.distributorLead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, name: true, businessName: true, email: true,
        phone: true, city: true, state: true, status: true,
        source: true, createdAt: true,
      },
    }),
    db.distributorLead.count({ where }),
    Promise.all([
      db.distributorLead.count(),
      db.distributorLead.count({ where: { status: "PENDING" } }),
      db.distributorLead.count({ where: { status: "APPROVED" } }),
      db.distributorLead.count({ where: { status: "REJECTED" } }),
    ]),
  ]);

  const [total_all, pending, approved, rejected] = stats;
  return { leads, total, pageNum, pageSize, stats: { total_all, pending, approved, rejected } };
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { leads, total, pageNum, pageSize, stats } = await getLeads(sp);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Distributor Leads</h2>
        <p className="text-sm text-gray-500 mt-1">Applications from potential distributors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total_all, icon: Users2, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <LeadFilters />

      {/* Results count */}
      <p className="text-sm text-gray-500">
        {total === 0 ? "No leads found" : `${total} lead${total !== 1 ? "s" : ""} found`}
        {sp.status ? ` · filtered by ${sp.status.toLowerCase()}` : ""}
        {sp.q ? ` · "${sp.q}"` : ""}
      </p>

      {/* Leads list */}
      {leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Users2 className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-900">No leads match your filters</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting the search or filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {leads.map((lead) => {
              const style = STATUS_STYLES[lead.status] ?? { variant: "secondary" as const };
              return (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{lead.name}</p>
                      <p className="text-xs text-gray-500 truncate">{lead.businessName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{lead.city}, {lead.state} · {lead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div className="hidden sm:block text-right">
                      <p className="text-xs text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{lead.source.toLowerCase()}</p>
                    </div>
                    <Badge variant={style.variant} className="text-xs">{lead.status}</Badge>
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
          <p className="text-sm text-gray-500">
            Page {pageNum} of {totalPages}
          </p>
          <div className="flex gap-2">
            {pageNum > 1 && (
              <Link
                href={`?${new URLSearchParams({ ...sp, page: String(pageNum - 1) })}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Link>
            )}
            {pageNum < totalPages && (
              <Link
                href={`?${new URLSearchParams({ ...sp, page: String(pageNum + 1) })}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
