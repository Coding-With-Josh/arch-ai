import React from "react";

export default function StatusPage() {
  // In production, these values may come from a monitoring API.
  const status = {
    uptime: "99.99%",
    api: "Operational",
    website: "Operational",
    database: "Operational",
  };

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-8">System Status</h1>
      <ul className="space-y-4 text-lg">
        <li>
          <strong>Uptime:</strong> {status.uptime}
        </li>
        <li>
          <strong>API:</strong> {status.api}
        </li>
        <li>
          <strong>Website:</strong> {status.website}
        </li>
        <li>
          <strong>Database:</strong> {status.database}
        </li>
      </ul>
      <p className="mt-8 text-muted-foreground">
        Last updated: {new Date().toLocaleString()}
      </p>
    </div>
  );
}
