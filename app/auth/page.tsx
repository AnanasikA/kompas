import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthScreen } from "@/features/auth/AuthScreen";

export const metadata: Metadata = { title: "Załóż konto — Kompas" };

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-paper" />}>
      <AuthScreen />
    </Suspense>
  );
}
