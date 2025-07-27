"use client";

import { useState, useEffect, use } from "react";
import {
  getMessages,
  sendMessage as sendMessageApi,
  getMentorConversations,
} from "@/lib/mentor-chat-service";
import {
  MessageSquare,
  Search,
  MoreVertical,
  Send,
  Paperclip,
  ChevronLeft,
  Phone,
  Video,
  Info,
  User,
  Star,
  Trash,
  Archive,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth-context";
import { useRef } from "react";

export default function MessagesPage() {
  const { mentor, isLoading: authLoading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [mentors, setMentors] = useState([]);
  const [mentorSearch, setMentorSearch] = useState("");
  const [showMentorSearch, setShowMentorSearch] = useState(false);
  const [error, setError] = useState(null);
  const messagesContainerRef = useRef(null);

  // Fetch conversations and mentors on mount, only if user is loaded
  useEffect(() => {
    if (!authLoading && mentor) {
      setLoading(true);
      setError(null);
      const fetchConversations = async () => {
        try {
          let conversationsRes = [];
          conversationsRes = await getMentorConversations();

          setConversations(
            Array.isArray(conversationsRes) ? conversationsRes : []
          );
          // setMentors(Array.isArray(mentorsRes) ? mentorsRes : []);
        } catch (err) {
          setError("Failed to load conversations or mentors.");
          setConversations([]);
          setMentors([]);
        } finally {
          setLoading(false);
        }
      };
      fetchConversations();
    }
  }, [authLoading, mentor]);

  const getAvatarSrc = (userId, gender) => {
    console.log("User ID: ", userId);
    console.log("Page Gender: ", gender);
    if (!userId || !gender) return "/placeholder.svg";
    let folder = "common";
    let count = 2;
    if (gender === "male") {
      folder = "male";
      count = 43;
    } else if (gender === "female") {
      folder = "female";
      count = 24;
    }
    const idx = (userId % count) + 1;
    return `/avatars/${folder}/${folder}_${idx}.png`;
  };

  // Fetch messages when activeConversation changes
  useEffect(() => {
    console.log("Active conversation changed:", activeConversation);
    if (activeConversation) {
      getMessages(activeConversation.id).then((data) => {
        setMessages(Array.isArray(data) ? data : []);
      });
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  const handleSendMessage = async () => {
    if (!mentor || !messageText.trim() || !activeConversation) return;
    try {
      await sendMessageApi({
        conversationId: activeConversation.id,
        text: messageText,
        type: "TEXT",
      });
      setMessageText("");
      // Refresh messages
      getMessages(activeConversation.id).then((data) => {
        setMessages(data || []);
      });
    } catch (err) {
      setError("Failed to send message.");
    }
  };

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
  };

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      (conversation.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (conversation.lastMessage || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread") return matchesSearch && conversation.unread;
    if (activeTab === "mentors")
      return conversation.type === "mentor" && matchesSearch;
    if (activeTab === "students")
      return matchesSearch && conversation.type === "student";

    return matchesSearch;
  });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center h-full text-center">
  //       <div>
  //         <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
  //         <h3 className="text-lg font-medium mb-2">
  //           You must be logged in to view your messages.
  //         </h3>
  //         <p className="text-muted-foreground">
  //           Please log in to access your conversations.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-lg border">
      {/* Conversation List */}
      <div
        className={`w-full md:w-80 border-r ${
          activeConversation ? "hidden md:block" : "block"
        }`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <div variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="divide-y">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-start p-4 gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                    activeConversation?.id === conversation.id ? "bg-muted" : ""
                  } ${conversation.readMentor ? "bg-primary/5" : ""}`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={conversation.avatar || "/placeholder.svg"}
                      alt={conversation.name}
                    />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate">
                        {conversation.userName}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </div>
                    <div className="flex items-center mt-1 space-x-2">
                      {conversation.type === "mentor" && (
                        <Badge variant="outline" className="text-xs py-0 h-5">
                          Student
                        </Badge>
                      )}
                    </div>
                  </div>
                  {conversation.readMentor && (
                    <Badge className="ml-auto">New</Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No conversations found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "Start a new conversation or adjust your filters"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Conversation/Chat View */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 md:hidden"
                onClick={() => setActiveConversation(null)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage
                  src={activeConversation.avatar || "/placeholder.svg"}
                  alt={activeConversation.name}
                />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium flex items-center">
                  {activeConversation.userName}
                </div>
                <div className="text-xs text-muted-foreground">Student</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveConversation(null)}
                title="Close conversation"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 p-4 overflow-y-auto"
            style={{ minHeight: 0 }}
          >
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end ${
                      message.mentorSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!message.mentorSender && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={getAvatarSrc(
                            message.userId,
                            message.senderGender
                          )}
                          alt={mentor?.name}
                        />
                        <AvatarFallback>
                          {message.senderName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      {/* Sender name */}
                      <div
                        className={`text-xs text-muted-foreground mb-1 ${
                          !message.mentorSender ? "text-left" : "text-right"
                        }`}
                      >
                        {!message.mentorSender
                          ? message.senderName || activeConversation.mentorName
                          : "You"}
                      </div>
                      {/* Timestamp */}
                      <div
                        className={`text-xs text-muted-foreground mt-1 ${
                          !message.mentorSender ? "" : "text-right"
                        }`}
                      >
                        {new Date(message.sentAt).toLocaleTimeString()}
                      </div>
                      {/* Message bubble */}
                      <div
                        className={`rounded-lg px-4 py-2 max-w-md ${
                          !message.mentorSender
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p>{message.message}</p>
                      </div>
                    </div>
                    {/* Show avatar for user messages on the right */}
                    {message.mentorSender && (
                      <Avatar className="h-8 w-8 ml-2">
                        <AvatarImage
                          src={getAvatarSrc(
                            message.mentorId,
                            message.receiverGender
                          )}
                          alt={mentor?.name}
                        />
                        <AvatarFallback>
                          {mentor?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-4 text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">Select a conversation</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            Choose a conversation from the list or start a new one to begin
            messaging
          </p>
          <Button className="mt-4" onClick={() => setShowMentorSearch(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            New Message
          </Button>

          {/* Mentor Search Modal/Panel */}
          {showMentorSearch && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowMentorSearch(false)}
                  aria-label="Close"
                >
                  X
                </button>
                <h2 className="text-lg font-bold mb-2">Find a Mentor</h2>
                <Input
                  placeholder="Search mentors by name, university, or expertise..."
                  value={mentorSearch}
                  onChange={(e) => setMentorSearch(e.target.value)}
                  className="mb-4"
                />
                <div className="max-h-64 overflow-y-auto divide-y">
                  {mentors
                    .filter(
                      (m) =>
                        m.name
                          ?.toLowerCase()
                          .includes(mentorSearch.toLowerCase()) ||
                        m.universityName
                          ?.toLowerCase()
                          .includes(mentorSearch.toLowerCase())
                    )
                    .map((m) => (
                      <div
                        key={m.id}
                        className="py-2 flex items-center gap-3 cursor-pointer hover:bg-muted/50 px-2 rounded transition"
                        onClick={async () => {
                          // Check if conversation exists
                          const existing = conversations.find(
                            (c) => c.mentorId === m.id
                          );
                          if (existing) {
                            setActiveConversation(existing);
                            setShowMentorSearch(false);
                          } else {
                            // Start new conversation (API call)
                            try {
                              const newConv = await import(
                                "@/lib/chat-service"
                              ).then(({ startConversation }) =>
                                startConversation(mentor.id, m.id)
                              );
                              setConversations((prev) => [...prev, newConv]);
                              setActiveConversation(newConv);
                              setShowMentorSearch(false);
                            } catch (err) {
                              setError("Failed to start conversation.");
                            }
                          }
                        }}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={m.avatar || "/placeholder.svg"}
                            alt={m.name}
                          />
                          <AvatarFallback>{m.name?.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0 text-left ml-3">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{m.name}</div>
                            {!m.isVerified && (
                              <span className="text-xs text-yellow-600 border border-yellow-500 px-1 py-0.5 rounded">
                                Unverified
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">University:</span>{" "}
                            {m.universityName || "N/A"}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Field:</span>{" "}
                            {m.fieldOfStudyName || "N/A"}
                          </div>

                          {m.bio && (
                            <div className="text-xs text-muted-foreground truncate">
                              {m.bio}
                            </div>
                          )}

                          {m.linkedin && (
                            <div className="text-xs mt-1">
                              <a
                                href={m.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zM8 8h3.6v2.4h.05c.5-.94 1.7-1.95 3.5-1.95 3.75 0 4.45 2.45 4.45 5.65V24h-4v-7.6c0-1.8-.05-4.1-2.5-4.1-2.5 0-2.9 1.95-2.9 4v7.7H8V8z" />
                                </svg>
                                LinkedIn
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  {mentors.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No mentors found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
