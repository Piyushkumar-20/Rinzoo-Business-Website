import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users2, MessageSquare, Package, Tag,
  TrendingUp, CheckCircle2, Clock, XCircle,
  Globe, BarChart3,
} from "lucide-react";

export const metadata = { title: "Analytics — Rinzoo Admin" };

// ── Data helpers ──────────────────────────────────────────────────────────────

function getLast6Months(): { label: string; key: string }[] {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
  }
  return months;
}

function groupByMonth(items: { createdAt: Date }[], months: { label: string; key: string }[]) {
  const counts = Object.fromEntries(months.map((m) => [m.key, 0]));
  items.forEach((item) => {
    const d = new Date(item.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (key in counts) counts[key]++;
  });
  return months.map((m) => ({ label: m.label, value: counts[m.key] }));
}

function countBy<T extends Record<string, unknown>>(items: T[], key: keyof T) {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const val = String(item[key]);
    counts[val] = (counts[val] ?? 0) + 1;
  });
  return counts;
}

function getStartOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

// ── Sub-components (pure server components) ───────────────────────────────────

function KpiCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BarChart({ data, color = "bg-blue-500" }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-36 w-full">
      {data.map((d) => {
        const pct = Math.round((d.value / max) * 100);
        return (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] font-semibold text-gray-500">{d.value > 0 ? d.value : ""}</span>
            <div className="w-full flex items-end" style={{ height: "100px" }}>
              <div
                className={`w-full rounded-t-md transition-all ${color}`}
                style={{ height: pct === 0 ? "2px" : `${pct}%`, opacity: pct === 0 ? 0.2 : 1 }}
              />
            </div>
            <span className="text-[10px] text-gray-400">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ProgressList({
  data, total, colors,
}: {
  data: Record<string, number>;
  total: number;
  colors: Record<string, string>;
}) {
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a);
  return (
    <div className="space-y-3">
      {entries.map(([key, count]) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700 capitalize">{key.toLowerCase().replace("_", " ")}</span>
              <span className="text-xs text-gray-500">{count} ({pct}%)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className={`h-2 rounded-full transition-all ${colors[key] ?? "bg-gray-400"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      {entries.length === 0 && <p className="text-xs text-gray-400 italic">No data yet</p>}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default async function AnalyticsPage() {
  const months = getLast6Months();
  const sixMonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
  const startOfMonth = getStartOfMonth();

  const [
    leads,
    contacts,
    totalProducts,
    activeOffers,
    leadsThisMonth,
    contactsThisMonth,
    topCities,
    topStates,
  ] = await Promise.all([
    db.distributorLead.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, status: true, source: true, city: true, state: true },
    }),
    db.contactSubmission.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, status: true },
    }),
    db.product.count({ where: { isActive: true } }),
    db.offer.count({ where: { isActive: true } }),
    db.distributorLead.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.contactSubmission.count({ where: { createdAt: { gte: startOfMonth } } }),
    // Top cities (all time)
    db.distributorLead.groupBy({ by: ["city"], _count: { city: true }, orderBy: { _count: { city: "desc" } }, take: 5 }),
    db.distributorLead.groupBy({ by: ["state"], _count: { state: true }, orderBy: { _count: { state: "desc" } }, take: 5 }),
  ]);

  // Aggregations
  const allLeads = await db.distributorLead.findMany({ select: { status: true, source: true } });
  const totalLeads = allLeads.length;
  const totalContacts = await db.contactSubmission.count();
  const unreadContacts = await db.contactSubmission.count({ where: { status: "UNREAD" } });

  const approvedLeads = allLeads.filter((l) => l.status === "APPROVED").length;
  const conversionRate = totalLeads > 0 ? Math.round((approvedLeads / totalLeads) * 100) : 0;

  const leadsByMonth = groupByMonth(leads, months);
  const contactsByMonth = groupByMonth(contacts, months);
  const leadStatusCounts = countBy(leads, "status");
  const leadSourceCounts = countBy(leads, "source");
  const contactStatusCounts = countBy(contacts, "status");

  // All-time counts
  const allLeadStatuses = countBy(allLeads, "status");
  const allLeadSources = countBy(allLeads, "source");

  const STATUS_COLORS: Record<string, string> = {
    PENDING:   "bg-amber-400",
    REVIEWING: "bg-blue-400",
    APPROVED:  "bg-green-500",
    REJECTED:  "bg-red-400",
    UNREAD:    "bg-amber-400",
    READ:      "bg-blue-400",
    REPLIED:   "bg-green-500",
    ARCHIVED:  "bg-gray-400",
  };

  const SOURCE_COLORS: Record<string, string> = {
    WEB:      "bg-blue-500",
    WHATSAPP: "bg-green-500",
    REFERRAL: "bg-purple-500",
    PHONE:    "bg-orange-500",
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">Business overview and performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Total Leads"     value={totalLeads}      sub={`+${leadsThisMonth} this month`}    icon={Users2}       color="bg-blue-50 text-blue-600" />
        <KpiCard label="Conversion Rate" value={`${conversionRate}%`} sub={`${approvedLeads} approved`}  icon={TrendingUp}   color="bg-green-50 text-green-600" />
        <KpiCard label="Total Messages"  value={totalContacts}   sub={`${unreadContacts} unread`}          icon={MessageSquare} color="bg-pink-50 text-[#e91e63]" />
        <KpiCard label="New This Month"  value={leadsThisMonth}  sub="distributor leads"                   icon={BarChart3}    color="bg-indigo-50 text-indigo-600" />
        <KpiCard label="Active Products" value={totalProducts}   sub="listed on site"                     icon={Package}      color="bg-amber-50 text-amber-600" />
        <KpiCard label="Active Offers"   value={activeOffers}    sub="shown to customers"                  icon={Tag}          color="bg-purple-50 text-purple-600" />
      </div>

      {/* Leads trend + status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users2 className="h-4 w-4 text-gray-400" />
              Leads — Last 6 Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={leadsByMonth} color="bg-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Status (All Time)</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressList data={allLeadStatuses} total={totalLeads} colors={STATUS_COLORS} />
            {totalLeads > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span>Total: {totalLeads}</span>
                <span className="text-green-600 font-medium">{conversionRate}% conversion</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contacts trend + status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              Contact Messages — Last 6 Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={contactsByMonth} color="bg-pink-500" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Message Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressList data={contactStatusCounts} total={contacts.length} colors={STATUS_COLORS} />
            {contacts.length === 0 && (
              <p className="text-xs text-gray-400 italic mt-2">No messages in the last 6 months</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lead sources + Geography */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressList data={allLeadSources} total={totalLeads} colors={SOURCE_COLORS} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              Top Cities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {topCities.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No data yet</p>
              ) : topCities.map((c, i) => (
                <div key={c.city} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-xs font-bold text-gray-400">#{i + 1}</span>
                    <span className="text-sm text-gray-700">{c.city}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {c._count.city}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              Top States
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {topStates.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No data yet</p>
              ) : topStates.map((s, i) => (
                <div key={s.state} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-xs font-bold text-gray-400">#{i + 1}</span>
                    <span className="text-sm text-gray-700">{s.state}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {s._count.state}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick insights */}
      {totalLeads > 0 && (
        <Card className="border-blue-100 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-base text-blue-900">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              {allLeadStatuses["PENDING"] > 0 && (
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                  <strong>{allLeadStatuses["PENDING"]}</strong> leads are waiting for review
                </li>
              )}
              {conversionRate >= 50 && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  Strong conversion rate of <strong>{conversionRate}%</strong>
                </li>
              )}
              {unreadContacts > 0 && (
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#e91e63] shrink-0" />
                  <strong>{unreadContacts}</strong> contact {unreadContacts === 1 ? "message" : "messages"} unread
                </li>
              )}
              {leadsThisMonth > 0 && (
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500 shrink-0" />
                  <strong>{leadsThisMonth}</strong> new leads this month
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
