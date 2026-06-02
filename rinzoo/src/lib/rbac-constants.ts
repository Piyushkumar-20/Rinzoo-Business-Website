export type Action = "create" | "read" | "update" | "delete" | "export" | "approve";
export type Subject =
  | "product"
  | "offer"
  | "lead"
  | "contact"
  | "user"
  | "media"
  | "settings"
  | "analytics";

export const ROLE_PERMISSIONS: Record<string, Array<{ action: Action; subject: Subject }>> = {
  super_admin: [
    { action: "create", subject: "product" },
    { action: "read", subject: "product" },
    { action: "update", subject: "product" },
    { action: "delete", subject: "product" },
    { action: "create", subject: "offer" },
    { action: "read", subject: "offer" },
    { action: "update", subject: "offer" },
    { action: "delete", subject: "offer" },
    { action: "create", subject: "lead" },
    { action: "read", subject: "lead" },
    { action: "update", subject: "lead" },
    { action: "delete", subject: "lead" },
    { action: "export", subject: "lead" },
    { action: "approve", subject: "lead" },
    { action: "read", subject: "contact" },
    { action: "update", subject: "contact" },
    { action: "delete", subject: "contact" },
    { action: "create", subject: "user" },
    { action: "read", subject: "user" },
    { action: "update", subject: "user" },
    { action: "delete", subject: "user" },
    { action: "create", subject: "media" },
    { action: "read", subject: "media" },
    { action: "delete", subject: "media" },
    { action: "read", subject: "settings" },
    { action: "update", subject: "settings" },
    { action: "read", subject: "analytics" },
    { action: "export", subject: "analytics" },
  ],
  marketing_manager: [
    { action: "create", subject: "product" },
    { action: "read", subject: "product" },
    { action: "update", subject: "product" },
    { action: "create", subject: "offer" },
    { action: "read", subject: "offer" },
    { action: "update", subject: "offer" },
    { action: "delete", subject: "offer" },
    { action: "read", subject: "lead" },
    { action: "export", subject: "lead" },
    { action: "read", subject: "contact" },
    { action: "create", subject: "media" },
    { action: "read", subject: "media" },
    { action: "delete", subject: "media" },
    { action: "read", subject: "analytics" },
    { action: "export", subject: "analytics" },
  ],
  sales_manager: [
    { action: "read", subject: "product" },
    { action: "read", subject: "offer" },
    { action: "read", subject: "lead" },
    { action: "update", subject: "lead" },
    { action: "export", subject: "lead" },
    { action: "approve", subject: "lead" },
    { action: "read", subject: "contact" },
    { action: "update", subject: "contact" },
    { action: "export", subject: "contact" },
    { action: "read", subject: "analytics" },
  ],
  content_manager: [
    { action: "create", subject: "product" },
    { action: "read", subject: "product" },
    { action: "update", subject: "product" },
    { action: "read", subject: "offer" },
    { action: "update", subject: "offer" },
    { action: "create", subject: "media" },
    { action: "read", subject: "media" },
    { action: "delete", subject: "media" },
  ],
};
