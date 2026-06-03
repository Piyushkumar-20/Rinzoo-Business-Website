import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users2, MessageSquare, Package, Tag, ArrowRight } from "lucide-react";

export const metadata = { title: "Dashboard — Rinzoo Admin" };

async function getStats() {
  // 4 queries instead of 6 — groupBy collapses status counts into single round-trips
  const [leadGroups, contactGroups, totalProducts, activeOffers] = await Promise.all([
    db.distributorLead.groupBy({ by: ["status"], _count: { _all: true } }),
    db.contactSubmission.groupBy({ by: ["status"], _count: { _all: true } }),
    db.product.count({ where: { isActive: true } }),
    db.offer.count({ where: { isActive: true } }),
  ]);

  const totalLeads    = leadGroups.reduce((s, g) => s + g._count._all, 0);
  const pendingLeads  = leadGroups.find((g) => g.status === "PENDING")?._count._all ?? 0;
  const totalContacts = contactGroups.reduce((s, g) => s + g._count._all, 0);
  const unreadContacts = contactGroups.find((g) => g.status === "UNREAD")?._count._all ?? 0;

  return { totalLeads, pendingLeads, totalContacts, unreadContacts, totalProducts, activeOffers };
}

async function getRecentLeads() {
  return db.distributorLead.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, businessName: true, city: true, state: true, status: true, createdAt: true },
  });
}

const STATUS_COLORS = {
  PENDING: "warning",
  REVIEWING: "default",
  APPROVED: "success",
  REJECTED: "destructive",
} as const;

export default async function DashboardPage() {
  const session = await auth();
  const [stats, recentLeads] = await Promise.all([getStats(), getRecentLeads()]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name?.split(" ")[0]}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening with Rinzoo today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
            <Users2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalLeads}</p>
            {stats.pendingLeads > 0 && (
              <p className="text-xs text-amber-600 mt-1">{stats.pendingLeads} pending review</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Contact Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalContacts}</p>
            {stats.unreadContacts > 0 && (
              <p className="text-xs text-blue-600 mt-1">{stats.unreadContacts} unread</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Products</CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Offers</CardTitle>
            <Tag className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.activeOffers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Distributor Leads</CardTitle>
          <Link href="/admin/leads" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No leads yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">
                      {lead.businessName} · {lead.city}, {lead.state}
                    </p>
                  </div>
                  <Badge variant={STATUS_COLORS[lead.status]}>
                    {lead.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
