"use client"

import { OperationsDashboard } from "@/components/operations-dashboard"
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    // Add global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      // Prevent the default browser behavior which would log the error
      event.preventDefault();
    };

    // Add the event listener
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return <OperationsDashboard />
}
