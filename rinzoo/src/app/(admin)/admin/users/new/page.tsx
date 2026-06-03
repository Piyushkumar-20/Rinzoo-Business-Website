import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { UserForm } from "@/components/admin/users/UserForm";

export const metadata = { title: "New Admin User — Rinzoo Admin" };

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-2">
          <ChevronLeft className="h-4 w-4" /> Back to Users
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">New Admin User</h2>
        <p className="text-sm text-gray-500 mt-1">
          Create a staff account with role-based access to the admin panel.
        </p>
      </div>
      <UserForm />
    </div>
  );
}
