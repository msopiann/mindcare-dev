"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAdminChatUsers } from "@/hooks/use-admin-chat-api";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboardChatUserStats() {
  const { data: userStats = [], isLoading, refetch } = useAdminChatUsers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p>Loading user statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Usage Monitoring</h2>
        <Button onClick={() => refetch()}>Refresh</Button>
      </div>

      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">User</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-2 text-right text-sm font-medium">
                Sessions
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium">
                Messages
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium">
                Last Activity
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {userStats.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 text-right">{user.sessionCount}</td>
                <td className="px-4 py-2 text-right">{user.totalMessages}</td>
                <td className="px-4 py-2 text-right text-sm text-gray-500">
                  {user.lastActivity
                    ? formatDistanceToNow(new Date(user.lastActivity), {
                        addSuffix: true,
                      })
                    : "Never"}
                </td>
                <td className="px-4 py-2 text-center">
                  <Link
                    href={`/admin/dashboard/chat/users/${user.id}`}
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
            {userStats.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
