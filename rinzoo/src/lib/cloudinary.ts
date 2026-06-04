import crypto from "crypto";

/**
 * Cloudinary integration using the signed REST API (no SDK dependency).
 * Credentials come from CLOUDINARY_URL (cloudinary://<key>:<secret>@<cloud_name>),
 * which is the single authoritative value from the Cloudinary dashboard.
 */

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

function getConfig(): CloudinaryConfig {
  const url = process.env.CLOUDINARY_URL;
  if (url) {
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (m) return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  }
  // Fallback to discrete vars if someone prefers them
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (cloudName && apiKey && apiSecret) return { cloudName, apiKey, apiSecret };

  throw new Error("Cloudinary is not configured. Set CLOUDINARY_URL in your environment.");
}

export function isCloudinaryConfigured(): boolean {
  try {
    getConfig();
    return true;
  } catch {
    return false;
  }
}

/** Sign params (alphabetically sorted) with the API secret — SHA-1 hex. */
function sign(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

export interface UploadResult {
  url: string;
  publicId: string;
  width: number | null;
  height: number | null;
  bytes: number;
  format: string;
  resourceType: string;
}

/**
 * Upload an image. `file` may be a base64 data URI (data:image/png;base64,....)
 * or a remote URL. Stored under the given folder.
 */
export async function uploadToCloudinary(file: string, folder = "rinzoo"): Promise<UploadResult> {
  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const signature = sign({ folder, timestamp }, apiSecret);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as {
    secure_url: string;
    public_id: string;
    width?: number;
    height?: number;
    bytes: number;
    format: string;
    resource_type: string;
  };

  return {
    url: json.secure_url,
    publicId: json.public_id,
    width: json.width ?? null,
    height: json.height ?? null,
    bytes: json.bytes,
    format: json.format,
    resourceType: json.resource_type,
  };
}

/** Permanently delete an asset by its public_id. */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const signature = sign({ public_id: publicId, timestamp }, apiSecret);

  const form = new FormData();
  form.append("public_id", publicId);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[cloudinary] destroy failed (${res.status}): ${text}`);
  }
}
