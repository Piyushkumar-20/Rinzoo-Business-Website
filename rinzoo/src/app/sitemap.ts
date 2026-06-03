import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://rinzoo.in";

// Static public pages
const STATIC_ROUTES = [
  { path: "/",              changeFrequency: "weekly",  priority: 1.0  },
  { path: "/about",         changeFrequency: "monthly", priority: 0.8  },
  { path: "/products",      changeFrequency: "weekly",  priority: 0.9  },
  { path: "/why-choose-us", changeFrequency: "monthly", priority: 0.7  },
  { path: "/offers",        changeFrequency: "daily",   priority: 0.9  },
  { path: "/distributor",   changeFrequency: "monthly", priority: 0.8  },
  { path: "/contact",       changeFrequency: "monthly", priority: 0.6  },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Dynamic: active products
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    productEntries = products.map((p) => ({
      url: `${BASE_URL}/products#${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB might be unavailable during build — return static only
  }

  return [...staticEntries, ...productEntries];
}
