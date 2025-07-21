"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, MessageCircle, ThumbsUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
// import { fetchNotifications } from "@/lib/notification-service";
import notificationService from "@/lib/notification-service";

export function NotificationMenu({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!userId) return;
    notificationService
      .getNotifications({ page: 0, size: 20 })
      .then((data) => {
        const notis = data.content || [];
        setNotifications(notis);
        setUnread(notis.filter((n) => !n.isRead).length);
      })
      .catch(() => {
        setNotifications([]);
        setUnread(0);
      });
  }, [userId]);

  // Handler for notification click
  const handleNotificationClick = async (e, n) => {
    console.log("Notification clicked:", n);
    e.preventDefault();
    if (!n.isRead) {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === n.id ? { ...item, isRead: true } : item
        )
      );
      setUnread((prev) => Math.max(0, prev - 1));
      try {
        await notificationService.markNotificationAsRead(n.id);
      } catch (err) {}
    }
    window.location.href = `/dashboard/forum/posts/${n.sourceId}`;
  };

  // Helper to pick icon based on notification type
  const getNotificationIcon = (n) => {
    // You can adjust this logic based on your notification model
    if (n.type === "comment") {
      return (
        <MessageCircle
          className={`h-5 w-5 ${!n.isRead ? "text-blue-500" : "text-gray-400"}`}
        />
      );
    }
    if (n.type === "like") {
      return (
        <ThumbsUp
          className={`h-5 w-5 ${
            !n.isRead ? "text-green-500" : "text-gray-400"
          }`}
        />
      );
    }
    // Default icon
    return (
      <AlertCircle
        className={`h-5 w-5 ${!n.isRead ? "text-yellow-500" : "text-gray-300"}`}
      />
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-y-auto"
      >
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              asChild
              className="px-0 py-0 border-none bg-transparent"
            >
              <Link
                href={`/dashboard/forum/posts/${n.sourceId}`}
                className={`flex flex-row items-center gap-2 w-full px-3 py-3 rounded-lg shadow-sm transition-all duration-150 border mb-2 hover:shadow-md group
                  ${
                    !n.isRead
                      ? "bg-gradient-to-r from-blue-50 to-white border-blue-200 dark:from-blue-900 dark:to-gray-900 dark:border-blue-900"
                      : "bg-white border-gray-100 dark:bg-gray-900 dark:border-gray-800"
                  }
                  hover:bg-blue-50/60 dark:hover:bg-blue-900/60
                `}
                style={{ textDecoration: "none" }}
                onClick={(e) => handleNotificationClick(e, n)}
              >
                {/* Context-aware icon for notification type */}
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-white/80 border border-gray-200 mr-2">
                  {getNotificationIcon(n)}
                </span>
                <span className="flex-1 flex flex-col min-w-0">
                  <span
                    className={`truncate font-medium text-sm leading-snug ${
                      !n.isRead
                        ? "text-blue-900 dark:text-blue-200"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {n.message}
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </span>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
