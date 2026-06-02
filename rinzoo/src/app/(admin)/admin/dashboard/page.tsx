import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users2, MessageSquare, Package, Tag } from "lucide-react";

export const metadata = { title: "Dashboard — Rinzoo Admin" };

async function getStats() {
  const [totalLeads, pendingLeads, totalContacts, unreadContacts, totalProducts, activeOffers] =
    await Promise.all([
      db.distributorLead.count(),
      db.distributorLead.count({ where: { status: "PENDING" } }),
      db.contactSubmission.count(),
      db.contactSubmission.count({ where: { status: "UNREAD" } }),
      db.product.count({ where: { isActive: true } }),
      db.offer.count({ where: { isActive: true } }),
    ]);

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
        <CardHeader>
          <CardTitle className="text-base">Recent Distributor Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No leads yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">
                      {lead.businessName} · {lead.city}, {lead.state}
                    </p>
                  </div>
                  <Badge variant={STATUS_COLORS[lead.status]}>
                    {lead.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
