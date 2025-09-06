import React from "react";

export default function SystemMetrics({ userData }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">System Metrics</h2>
      <p>
        <strong>Total Users:</strong> {userData?.totalUsers ?? 0}
      </p>
      <p>
        <strong>Active Projects:</strong> {userData?.activeProjects ?? 0}
      </p>
      <p>
        <strong>Pending Requests:</strong> {userData?.pendingRequests ?? 0}
      </p>
    </div>
  );
}
