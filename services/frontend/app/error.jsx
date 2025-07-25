// /services/frontend/app/error.jsx
"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-red-600">
        Something went wrong!
      </h2>
      <p className="mb-4 text-muted-foreground">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  );
}
