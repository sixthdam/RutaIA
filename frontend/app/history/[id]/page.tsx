"use client";

import { ClientLayout } from "@/app/client-layout";
import HistoryDetailPageContent from "./history-detail-content";

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ClientLayout>
      <HistoryDetailPageContent params={params} />
    </ClientLayout>
  );
}