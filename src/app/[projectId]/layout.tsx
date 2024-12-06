"use client";

import { Providers } from "@/app/[projectId]/providers";
import "./globals.css";

export default function MiniAppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
