"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./Theme";
import { Toaster } from "sonner";
import type { Session } from "next-auth";

export const Providers = ({ children, session }: { children: React.ReactNode; session: Session | null }) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
};
