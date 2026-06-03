"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  offerId: string;
  offerTitle: string;
}

export function DeleteOfferButton({ offerId, offerTitle }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete offer "${offerTitle}"? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/admin/offers/${offerId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/offers");
        router.refresh();
      } else {
        alert("Failed to delete offer. Please try again.");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      Delete Offer
    </Button>
  );
}
