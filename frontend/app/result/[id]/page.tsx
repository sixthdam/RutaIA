"use client";

import { ClientLayout } from "@/app/client-layout";
import ResultPageContent from "./result-content";

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ClientLayout>
      <ResultPageContent params={params} />
    </ClientLayout>
  );
}