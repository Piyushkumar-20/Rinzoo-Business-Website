import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadStatusUpdater } from "@/components/admin/leads/LeadStatusUpdater";
import {
  ChevronLeft, User, Building2, Mail, Phone, MapPin,
  BarChart3, Tag, Calendar, Globe
} from "lucide-react";

export const metadata = { title: "Lead Detail — Rinzoo Admin" };

type Params = { params: Promise<{ id: string }> };

const STATUS_STYLES: Record<string, { variant: "warning" | "default" | "success" | "destructive" }> = {
  PENDING:   { variant: "warning" },
  REVIEWING: { variant: "default" },
  APPROVED:  { variant: "success" },
  REJECTED:  { variant: "destructive" },
};

async function getLead(id: string) {
  return db.distributorLead.findUnique({
    where: { id },
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
  });
}

function InfoRow({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-medium text-blue-600 hover:underline break-all">{value}</a>
        ) : (
          <p className="text-sm font-medium text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
}

export default async function LeadDetailPage({ params }: Params) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const statusStyle = STATUS_STYLES[lead.status] ?? { variant: "secondary" as const };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Leads
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
            <Badge variant={statusStyle.variant}>{lead.status}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">{lead.businessName}</p>
        </div>
        <div className="shrink-0 text-right hidden sm:block">
          <p className="text-xs text-gray-400">Submitted</p>
          <p className="text-sm font-medium text-gray-700">
            {new Date(lead.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Lead information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoRow icon={User}     label="Full Name"  value={lead.name} />
              <InfoRow icon={Building2} label="Business"  value={lead.businessName} />
              <InfoRow icon={Mail}     label="Email"      value={lead.email}  href={`mailto:${lead.email}`} />
              <InfoRow icon={Phone}    label="Phone"      value={lead.phone}  href={`tel:${lead.phone}`} />
              <InfoRow icon={MapPin}   label="Location"   value={`${lead.city}, ${lead.state} — ${lead.pincode}`} />
              <InfoRow icon={Globe}    label="Source"     value={lead.source} />
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Business Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {lead.annualTurnoverRange && (
                <InfoRow icon={BarChart3} label="Annual Turnover" value={lead.annualTurnoverRange} />
              )}
              {lead.currentBrands && (
                <InfoRow icon={Tag} label="Current Brands" value={lead.currentBrands} />
              )}
              {lead.reviewedAt && (
                <InfoRow
                  icon={Calendar}
                  label="Reviewed At"
                  value={new Date(lead.reviewedAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                />
              )}
            </CardContent>
          </Card>

          {/* Message */}
          {lead.message && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Message from Applicant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{lead.message}</p>
              </CardContent>
            </Card>
          )}

          {/* Review note (read-only view) */}
          {lead.reviewNote && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-base text-amber-800">Internal Review Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">{lead.reviewNote}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — Actions panel */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadStatusUpdater
                leadId={lead.id}
                currentStatus={lead.status}
                currentNote={lead.reviewNote}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
