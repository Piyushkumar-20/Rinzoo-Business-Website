import { db } from "@/lib/db";
import type { Action, Subject } from "./rbac-constants";

export type { Action, Subject };
export { ROLE_PERMISSIONS } from "./rbac-constants";

// Server-side DB permission check (used in API routes)
export async function can(
  userId: string,
  action: Action,
  subject: Subject
): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId, isActive: true },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  if (!user) return false;

  return user.role.permissions.some(
    (rp) => rp.permission.action === action && rp.permission.subject === subject
  );
}

// Zero-DB check from session token permissions array
export function canFromSession(
  permissions: string[],
  action: Action,
  subject: Subject
): boolean {
  return permissions.includes(`${action}:${subject}`);
}
