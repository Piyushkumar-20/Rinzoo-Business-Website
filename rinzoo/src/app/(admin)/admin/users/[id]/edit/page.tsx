import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { UserForm } from "@/components/admin/users/UserForm";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Edit User — Rinzoo Admin" };

type Params = { params: Promise<{ id: string }> };

export default async function EditUserPage({ params }: Params) {
  const { id } = await params;
  const session = await auth();

  const user = await db.user.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!user) notFound();
  if (user.role.name === "user") notFound(); // Can't edit regular users from here

  const isSelf = user.id === session?.user?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-2">
            <ChevronLeft className="h-4 w-4" /> Back to Users
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            {isSelf && <Badge variant="default" className="text-xs">Your Account</Badge>}
            {!user.isActive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
          </div>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
        </div>
      </div>

      <UserForm
        userId={user.id}
        defaultValues={{
          name: user.name,
          email: user.email,
          roleName: user.role.name,
          isActive: user.isActive,
        }}
      />
    </div>
  );
}
