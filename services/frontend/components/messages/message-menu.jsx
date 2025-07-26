"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMessages } from "./message-provider";
import { getUserConversations } from "@/lib/chat-service"; // Adjust the import path as needed
import { useState } from "react";
// import chatService from "@/lib/chat-service"; // You'll need to create this

export function MessageMenu({ userId }) {
  const [unreadCount, setUnread] = useState(0);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Fetch real conversations
    const fetchConversations = async () => {
      try {
        const data = await getUserConversations();
        const conversations = data.content || data || [];
        setConversations(conversations);
        const unread = conversations.filter((c) => !c.readUser).length;
        setUnread(unread);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setConversations([]);
      }
    };

    fetchConversations();
  }, [userId]);

  //   useEffect(() => {
  //     if (!userId) return;
  //     notificationService
  //       .getNotifications({ page: 0, size: 20 })
  //       .then((data) => {
  //         const notis = data.content || [];
  //         setNotifications(notis);
  //         setUnread(notis.filter((n) => !n.isRead).length);
  //       })
  //       .catch(() => {
  //         setNotifications([]);
  //         setUnread(0);
  //       });
  //   }, [userId]);

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/dashboard/messages">
        <MessageSquare className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
