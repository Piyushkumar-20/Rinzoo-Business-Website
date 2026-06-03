import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, UserCog, ShieldCheck, ShieldOff } from "lucide-react";

export const metadata = { title: "Users — Rinzoo Admin" };

const ROLE_COLORS: Record<string, string> = {
  super_admin:       "bg-purple-100 text-purple-700",
  marketing_manager: "bg-blue-100   text-blue-700",
  sales_manager:     "bg-green-100  text-green-700",
  content_manager:   "bg-orange-100 text-orange-700",
  user:              "bg-gray-100   text-gray-600",
};

const ROLE_LABELS: Record<string, string> = {
  super_admin:       "Super Admin",
  marketing_manager: "Marketing",
  sales_manager:     "Sales",
  content_manager:   "Content",
  user:              "User",
};

async function getUsers() {
  return db.user.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    include: { role: { select: { name: true, label: true } } },
  });
}

export default async function UsersPage() {
  const session = await auth();
  const users = await getUsers();
  const adminUsers = users.filter((u) => u.role.name !== "user");
  const regularUsers = users.filter((u) => u.role.name === "user");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            {adminUsers.length} admin staff · {regularUsers.length} registered users
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="h-4 w-4" />
            New Admin User
          </Link>
        </Button>
      </div>

      {/* Admin staff */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Admin Staff</h3>
        {adminUsers.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No admin users yet.</p>
        ) : (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {adminUsers.map((user) => {
                const isSelf = user.id === session?.user?.id;
                return (
                  <div key={user.id} className="flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d1f4a] text-sm font-bold text-white shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          {isSelf && (
                            <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-medium">You</span>
                          )}
                          {!user.isActive && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              <ShieldOff className="h-3 w-3" /> Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {user.lastLoginAt && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Last login: {new Date(user.lastLoginAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[user.role.name] ?? "bg-gray-100 text-gray-700"}`}>
                        {ROLE_LABELS[user.role.name] ?? user.role.label}
                      </span>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/users/${user.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Registered users (public signups) */}
      {regularUsers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Registered Users ({regularUsers.length})
          </h3>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {regularUsers.slice(0, 10).map((user) => (
                  <div key={user.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400">
                        Joined {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                      <Badge variant="secondary" className="text-xs">User</Badge>
                    </div>
                  </div>
                ))}
                {regularUsers.length > 10 && (
                  <div className="px-5 py-3 text-xs text-gray-400 text-center">
                    +{regularUsers.length - 10} more users
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
