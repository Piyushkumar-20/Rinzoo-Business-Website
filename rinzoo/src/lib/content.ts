import { cache } from "react";
import { db } from "@/lib/db";
import { CONTENT_SECTIONS, mergeSectionDefaults, type SectionContent } from "@/lib/content-schema";

/**
 * Server-side content reader for the public site.
 * Returns every section merged with its schema defaults, so the site renders
 * correctly even before any content has been edited (safe fallback).
 */
export const getSiteContent = cache(async (): Promise<Record<string, SectionContent>> => {
  const result: Record<string, SectionContent> = {};
  try {
    const rows = await db.pageSection.findMany({ where: { page: "home" } });
    const byKey = new Map(rows.map((r) => [r.sectionKey, r]));
    for (const section of CONTENT_SECTIONS) {
      const row = byKey.get(section.key);
      const stored = (row?.content as Record<string, unknown> | undefined) ?? null;
      // A section hidden via isPublished=false forces visible:false
      const merged = mergeSectionDefaults(section.key, stored);
      if (row && row.isPublished === false) merged.visible = false;
      result[section.key] = merged;
    }
  } catch {
    // DB unavailable (e.g. at build) — return pure defaults
    for (const section of CONTENT_SECTIONS) {
      result[section.key] = mergeSectionDefaults(section.key, null);
    }
  }
  return result;
});

/** Convenience: is a section visible? */
export function isVisible(content: Record<string, SectionContent>, key: string): boolean {
  return content[key]?.visible !== false;
}
