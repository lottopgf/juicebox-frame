"use client";

import { Providers } from "@/app/[projectId]/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export default function MiniAppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-dvh">
      <body className="dark h-full">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
