"use client";

import { ReactNode } from "react";
import { Providers } from "@/components/Providers";

export function ClientLayout({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}