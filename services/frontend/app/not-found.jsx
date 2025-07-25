"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <img
        src="/error.svg"
        alt="Not Found"
        className="mb-3 w-48 h-48 object-contain"
      />
      <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2 text-primary">
        404 - Page Not Found
      </h1>
      <p className="mb-4 text-muted-foreground">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}
