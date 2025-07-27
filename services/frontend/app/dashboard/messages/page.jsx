"use client";

import { useState, useEffect, use } from "react";
import {
  getUserConversations,
  getMessages,
  sendMessage as sendMessageApi,
  getMentorConversations,
  markConversationAsRead as markConversationAsReadAPI, // Add this import
} from "@/lib/chat-service";
import { getAllMentors } from "@/lib/mentor-service";
import { useMessages } from "@/components/messages/message-provider";
import { X, GraduationCap, BookOpen } from "lucide-react";
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
  SearchIcon,
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
  const { user, isLoading: authLoading } = useAuth();
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
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState(false);
  const [showMentorProfile, setShowMentorProfile] = useState(false);
  const { markConversationAsRead } = useMessages();

  // Fetch conversations and mentors on mount, only if user is loaded
  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      setError(null);
      const fetchConversations = async () => {
        try {
          let conversationsRes = [];
          conversationsRes = await getUserConversations();
          const mentorsRes = await getAllMentors();
          setConversations(
            Array.isArray(conversationsRes) ? conversationsRes : []
          );
          setMentors(Array.isArray(mentorsRes) ? mentorsRes : []);
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
  }, [authLoading, user]);

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

  const getMentorAvatarSrc = (mentorId, gender) => {
    console.log("User ID: ", mentorId);
    console.log("Page Gender: ", gender);
    if (!mentorId) return "/placeholder.svg";
    let folder = "common";
    let count = 2;
    if (gender === "male") {
      folder = "male";
      count = 12;
    } else if (gender === "female") {
      folder = "female";
      count = 11;
    }
    const idx = (mentorId % count) + 1;
    return `/mentorAvatars/${folder}/${folder}_${idx}.png`;
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getAvatarSrc = (userId, gender) => {
    // console.log("User ID: ", userId);
    // console.log("Page Gender: ", gender);
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

  // Add this computed value for filtered mentors
  const filteredMentors = mentors.filter((m) => {
    // Search filter
    const searchMatch =
      m.name?.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      m.universityName?.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      m.fieldOfStudyName?.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      m.bio?.toLowerCase().includes(mentorSearch.toLowerCase());

    // Verification filter
    const verificationMatch =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && m.isVerified);

    // University filter
    const universityMatch =
      !universityFilter ||
      (user?.universityName && m.universityName === user.universityName);

    return searchMatch && verificationMatch && universityMatch;
  });

  const handleSendMessage = async () => {
    if (!user || !messageText.trim() || !activeConversation) return;
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

  // Update the handleConversationSelect function
  const handleConversationSelect = async (conversation) => {
    if (!conversation.readUser) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversation.id ? { ...conv, readUser: true } : conv
        )
      );
      // Mark as read in context (this will update the badge count)
      markConversationAsRead(conversation.id);

      // Make API call to mark as read in backend
      try {
        await markConversationAsReadAPI(conversation.id);
        console.log("Conversation marked as read successfully");
      } catch (error) {
        console.error("Failed to mark conversation as read:", error);
        // Optionally, you could revert the local state change if API fails
        // but for better UX, we'll keep the optimistic update
      }
    }
    setActiveConversation(conversation);
  };

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      (conversation.mentorName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (conversation.lastMessage || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread") return matchesSearch && !conversation.readUser;

    return matchesSearch;
  });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-lg font-medium mb-2">
            You must be logged in to view your messages.
          </h3>
          <p className="text-muted-foreground">
            Please log in to access your conversations.
          </p>
        </div>
      </div>
    );
  }

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
            <h2 className="text-xl font-bold">Find your mentor here</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMentorSearch(true)}
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
            {/* <Button className="mt-4" onClick={() => setShowMentorSearch(true)}>
              <MessageSquare className="mr-2 h-4 w-25" />
              Find a Mentor
            </Button> */}
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search conversations..."
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
                  } ${conversation.readUser ? "bg-primary/5" : ""}`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={conversation.avatar || "/placeholder.svg"}
                      alt={conversation.mentorName}
                    />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate">
                        {conversation.mentorName}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </div>
                    <div className="flex items-center mt-1 space-x-2">
                      {conversation.type === "mentor" && (
                        <Badge variant="outline" className="text-xs py-0 h-5">
                          Mentor
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!conversation.readUser && (
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
                  alt={activeConversation.mentorName}
                />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium flex items-center">
                  {activeConversation.mentorName}
                </div>
                <div className="text-xs text-muted-foreground">Mentor</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMentorProfile(true)}
                title="View Profile"
              >
                <User className="h-5 w-5" />
              </Button>
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
          {/* <ScrollArea className="flex-1 p-4"> */}
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
                      message.mentorSender ? "justify-start" : "justify-end"
                    }`}
                  >
                    {message.mentorSender && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={getMentorAvatarSrc(
                            message.mentorId,
                            message.mentorGender
                          )}
                          alt={message.mentorName}
                        />
                        <AvatarFallback>
                          {message.mentorName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      {/* Sender name */}
                      <div
                        className={`text-xs text-muted-foreground mb-1 ${
                          message.mentorSender ? "text-left" : "text-right"
                        }`}
                      >
                        {message.mentorSender
                          ? message.senderName || activeConversation.mentorName
                          : "You"}
                      </div>
                      {/* Timestamp */}
                      <div
                        className={`text-xs text-muted-foreground mt-1 ${
                          message.mentorSender ? "" : "text-right"
                        }`}
                      >
                        {new Date(message.sentAt).toLocaleTimeString()}
                      </div>
                      {/* Message bubble */}
                      <div
                        className={`rounded-lg px-4 py-2 max-w-md ${
                          message.mentorSender
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p>{message.message}</p>
                      </div>
                    </div>
                    {/* Show avatar for user messages on the right */}
                    {!message.mentorSender && (
                      <Avatar className="h-8 w-8 ml-2">
                        <AvatarImage
                          src={getAvatarSrc(
                            message.userId,
                            message.senderGender
                          )}
                          alt={user?.name}
                        />
                        <AvatarFallback>
                          {user?.name?.[0] || "U"}
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
              {/* <div ref={messagesEndRef} /> */}
            </div>
          </div>
          {/* </ScrollArea> */}

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
            Find a Mentor
          </Button>
        </div>
      )}

      {/* Mentor Search Modal/Panel */}
      {showMentorSearch && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b shrink-0">
              <div>
                <h2 className="text-2xl font-bold">Find Your Perfect Mentor</h2>
                <p className="text-muted-foreground mt-1">
                  Connect with experienced mentors to guide your academic
                  journey
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMentorSearch(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b space-y-4 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, university, field of study, or expertise..."
                  value={mentorSearch}
                  onChange={(e) => setMentorSearch(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Filter options */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={verificationFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVerificationFilter("all")}
                >
                  All Mentors
                </Button>
                <Button
                  variant={
                    verificationFilter === "verified" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setVerificationFilter("verified")}
                >
                  Verified Only
                </Button>
                <Button
                  variant={universityFilter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUniversityFilter(!universityFilter)}
                >
                  Same University
                </Button>
              </div>
            </div>

            {/* Results - Scrollable Area */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <div className="p-6">
                  {filteredMentors.length > 0 ? (
                    <div className="space-y-4">
                      {filteredMentors.map((m) => (
                        <div
                          key={m.id}
                          className="group border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
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
                                  startConversation(m.id)
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
                          <div className="flex gap-4">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                              <Avatar className="h-16 w-16">
                                <AvatarImage
                                  src={m.avatar || "/placeholder.svg"}
                                  alt={m.name}
                                />
                                <AvatarFallback className="text-lg font-semibold">
                                  {m.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {m.isVerified && (
                                <div className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="h-3 w-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  {/* Name and verification */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                                      {m.name}
                                    </h3>
                                    {m.isVerified ? (
                                      <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      >
                                        Verified
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="text-yellow-600 border-yellow-500"
                                      >
                                        Unverified
                                      </Badge>
                                    )}
                                  </div>

                                  {/* University and Field */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                      <div className="h-4 w-4 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                        <GraduationCap className="h-3 w-3 text-primary" />
                                      </div>
                                      <span className="text-sm text-muted-foreground truncate">
                                        <span className="font-medium">
                                          University:
                                        </span>{" "}
                                        {m.universityName || "N/A"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="h-4 w-4 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                        <BookOpen className="h-3 w-3 text-primary" />
                                      </div>
                                      <span className="text-sm text-muted-foreground truncate">
                                        <span className="font-medium">
                                          Field:
                                        </span>{" "}
                                        {m.fieldOfStudyName || "N/A"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Bio */}
                                  {m.bio && (
                                    <p className="flex items-center justify-between text-sm text-muted-foreground mb-3 line-clamp-2">
                                      {m.bio}
                                    </p>
                                  )}

                                  {/* Links and Actions */}
                                  <div className="flex items-center justify-between">
                                    {m.linkedin && (
                                      <a
                                        href={m.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zM8 8h3.6v2.4h.05c.5-.94 1.7-1.95 3.5-1.95 3.75 0 4.45 2.45 4.45 5.65V24h-4v-7.6c0-1.8-.05-4.1-2.5-4.1-2.5 0-2.9 1.95-2.9 4v7.7H8V8z" />
                                        </svg>
                                        LinkedIn Profile
                                      </a>
                                    )}

                                    <Button
                                      size="sm"
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      Start Conversation
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        No mentors found
                      </h3>
                      <p className="text-muted-foreground">
                        {mentorSearch
                          ? `No results for "${mentorSearch}". Try adjusting your search or filters.`
                          : "Try adjusting your search criteria or filters."}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setMentorSearch("");
                          setVerificationFilter("all");
                          setUniversityFilter(false);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-muted/30 shrink-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {filteredMentors.length} of {mentors.length} mentors
                </span>
                <div className="flex items-center gap-1">
                  <span>Powered by</span>
                  <span className="font-semibold text-primary">GradPilot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mentor Profile Modal */}
      {showMentorProfile && activeConversation && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Mentor Profile</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMentorProfile(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={activeConversation.avatar || "/placeholder.svg"}
                      alt={activeConversation.mentorName}
                    />
                    <AvatarFallback className="text-xl font-semibold">
                      {activeConversation.mentorName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {activeConversation.mentorIsVerified && (
                    <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">
                      {activeConversation.mentorName}
                    </h3>
                    {activeConversation.mentorIsVerified ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-yellow-600 border-yellow-500"
                      >
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">University</p>
                      <p className="text-sm text-muted-foreground">
                        {activeConversation.mentorUniversityName || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Field of Study</p>
                      <p className="text-sm text-muted-foreground">
                        {activeConversation.mentorFieldOfStudyName || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {activeConversation.mentorBio && (
                  <div>
                    <p className="text-sm font-medium mb-2">About</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activeConversation.mentorBio}
                    </p>
                  </div>
                )}

                {/* LinkedIn */}
                {activeConversation.mentorLinkedin && (
                  <div>
                    <p className="text-sm font-medium mb-2">Links</p>
                    <a
                      href={activeConversation.mentorLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zM8 8h3.6v2.4h.05c.5-.94 1.7-1.95 3.5-1.95 3.75 0 4.45 2.45 4.45 5.65V24h-4v-7.6c0-1.8-.05-4.1-2.5-4.1-2.5 0-2.9 1.95-2.9 4v7.7H8V8z" />
                      </svg>
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-muted/30">
              <Button
                className="w-full"
                onClick={() => setShowMentorProfile(false)}
              >
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
