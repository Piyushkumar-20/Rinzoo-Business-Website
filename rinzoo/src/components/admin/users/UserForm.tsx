"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ADMIN_ROLES = [
  { value: "super_admin",       label: "Super Admin" },
  { value: "marketing_manager", label: "Marketing Manager" },
  { value: "sales_manager",     label: "Sales Manager" },
  { value: "content_manager",   label: "Content Manager" },
];

const createSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  roleName: z.string().min(1, "Select a role"),
});

const editSchema = z.object({
  name: z.string().min(2, "Name is required"),
  roleName: z.string().min(1, "Select a role"),
  password: z.string().min(8, "At least 8 characters").optional().or(z.literal("")),
  isActive: z.boolean(),
});

type CreateData = z.infer<typeof createSchema>;
type EditData = z.infer<typeof editSchema>;

interface Props {
  userId?: string;
  defaultValues?: Partial<EditData & { email: string }>;
}

export function UserForm({ userId, defaultValues }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!userId;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateData | EditData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(isEdit ? editSchema : createSchema) as any,
    defaultValues: isEdit
      ? {
          name: defaultValues?.name ?? "",
          roleName: defaultValues?.roleName ?? "sales_manager",
          password: "",
          isActive: defaultValues?.isActive ?? true,
        }
      : {
          name: "",
          email: "",
          password: "",
          roleName: "sales_manager",
        },
  });

  const onSubmit = async (data: CreateData | EditData) => {
    setServerError(null);
    const url = isEdit ? `/api/v1/admin/users/${userId}` : "/api/v1/admin/users";
    const method = isEdit ? "PUT" : "POST";

    const payload = isEdit
      ? {
          name: (data as EditData).name,
          roleName: data.roleName,
          isActive: (data as EditData).isActive,
          ...((data as EditData).password ? { password: (data as EditData).password } : {}),
        }
      : data;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      setServerError(json?.error?.message ?? "Something went wrong");
      return;
    }

    router.push("/admin/users");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Account Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input {...register("name")} placeholder="Arjun Sharma" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {!isEdit && (
              <div className="space-y-1.5">
                <Label>Email Address *</Label>
                <Input {...register("email" as keyof (CreateData | EditData))} type="email" placeholder="arjun@rinzoo.in" />
                {"email" in errors && <p className="text-xs text-red-500">{(errors as Record<string, {message?: string}>).email?.message}</p>}
              </div>
            )}
            {isEdit && (
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input value={defaultValues?.email ?? ""} disabled className="bg-gray-50 text-gray-500" />
                <p className="text-xs text-gray-400">Email cannot be changed</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{isEdit ? "New Password (leave blank to keep)" : "Password *"}</Label>
              <Input
                {...register("password" as keyof (CreateData | EditData))}
                type="password"
                placeholder={isEdit ? "Leave blank to keep current" : "Min. 8 characters"}
              />
              {"password" in errors && <p className="text-xs text-red-500">{(errors as Record<string, {message?: string}>).password?.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Role *</Label>
              <select
                {...register("roleName")}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ADMIN_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              {errors.roleName && <p className="text-xs text-red-500">{errors.roleName.message}</p>}
            </div>
          </div>

          {isEdit && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                {...register("isActive" as keyof (CreateData | EditData))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Account active</Label>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
