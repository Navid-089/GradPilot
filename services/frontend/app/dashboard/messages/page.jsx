"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MessagesPage() {
  const [conversations, setConversations] = useState(dummyConversations)
  const [activeConversation, setActiveConversation] = useState(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return

    const newMessage = {
      id: Date.now(),
      content: messageText,
      timestamp: "Just now",
      sender: "me",
    }

    const updatedConversations = conversations.map((conversation) => {
      if (conversation.id === activeConversation.id) {
        return {
          ...conversation,
          messages: [...conversation.messages, newMessage],
          lastMessage: messageText,
          lastMessageTime: "Just now",
          unread: false,
        }
      }
      return conversation
    })

    setConversations(updatedConversations)
    setMessageText("")

    // Update active conversation
    const updatedActiveConversation = updatedConversations.find(
      (conversation) => conversation.id === activeConversation.id,
    )
    setActiveConversation(updatedActiveConversation)
  }

  const handleConversationSelect = (conversation) => {
    // Mark as read
    const updatedConversations = conversations.map((c) => {
      if (c.id === conversation.id) {
        return { ...c, unread: false }
      }
      return c
    })

    setConversations(updatedConversations)
    setActiveConversation(conversation)
  }

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && conversation.unread
    if (activeTab === "professors") return matchesSearch && conversation.type === "professor"
    if (activeTab === "students") return matchesSearch && conversation.type === "student"
    if (activeTab === "starred") return matchesSearch && conversation.starred

    return matchesSearch
  })

  return (
    <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-lg border">
      {/* Conversation List */}
      <div className={`w-full md:w-80 border-r ${activeConversation ? "hidden md:block" : "block"}`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
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

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="professors">Professors</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
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
                  } ${conversation.unread ? "bg-primary/5" : ""}`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate">{conversation.name}</div>
                      <div className="text-xs text-muted-foreground">{conversation.lastMessageTime}</div>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</div>
                    <div className="flex items-center mt-1 space-x-2">
                      {conversation.type === "professor" && (
                        <Badge variant="outline" className="text-xs py-0 h-5">
                          Professor
                        </Badge>
                      )}
                      {conversation.starred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                    </div>
                  </div>
                  {conversation.unread && <Badge className="ml-auto">New</Badge>}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No conversations found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? `No results for "${searchQuery}"` : "Start a new conversation or adjust your filters"}
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
                <AvatarImage src={activeConversation.avatar || "/placeholder.svg"} alt={activeConversation.name} />
                <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium flex items-center">
                  {activeConversation.name}
                  {activeConversation.starred && <Star className="h-4 w-4 ml-2 fill-yellow-400 text-yellow-400" />}
                </div>
                <div className="text-xs text-muted-foreground">
                  {activeConversation.type === "professor" ? "Professor" : "Student"}
                  {activeConversation.university && ` • ${activeConversation.university}`}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Star className="mr-2 h-4 w-4" />
                    <span>{activeConversation.starred ? "Unstar" : "Star"} Conversation</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center">
                    <Archive className="mr-2 h-4 w-4" />
                    <span>Archive</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center text-red-500">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete Conversation</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {activeConversation.messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                  {message.sender !== "me" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage
                        src={activeConversation.avatar || "/placeholder.svg"}
                        alt={activeConversation.name}
                      />
                      <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg px-4 py-2 max-w-md ${
                        message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    <div
                      className={`text-xs text-muted-foreground mt-1 ${message.sender === "me" ? "text-right" : ""}`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

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
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!messageText.trim()}>
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
            Choose a conversation from the list or start a new one to begin messaging
          </p>
          <Button className="mt-4">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      )}
    </div>
  )
}

const dummyConversations = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'd be happy to discuss your research interests. When would be a good time for a call?",
    lastMessageTime: "10:30 AM",
    unread: true,
    type: "professor",
    university: "Stanford University",
    starred: true,
    messages: [
      {
        id: 1,
        content:
          "Hello, I'm interested in your research on machine learning applications in healthcare. I was wondering if you have any openings for graduate students next fall?",
        timestamp: "Yesterday, 4:30 PM",
        sender: "me",
      },
      {
        id: 2,
        content:
          "Hello! Thank you for your interest in our lab. We are indeed looking for new graduate students with experience in ML and an interest in healthcare applications.",
        timestamp: "Today, 9:15 AM",
        sender: "other",
      },
      {
        id: 3,
        content:
          "That's great to hear! I have experience with neural networks and have worked on a project analyzing medical imaging data.",
        timestamp: "Today, 9:45 AM",
        sender: "me",
      },
      {
        id: 4,
        content: "I'd be happy to discuss your research interests. When would be a good time for a call?",
        timestamp: "10:30 AM",
        sender: "other",
      },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Have you decided which universities you're applying to?",
    lastMessageTime: "Yesterday",
    unread: false,
    type: "student",
    university: "MIT",
    starred: false,
    messages: [
      {
        id: 1,
        content: "Hey, how's your application process going?",
        timestamp: "Yesterday, 2:15 PM",
        sender: "other",
      },
      {
        id: 2,
        content: "It's going well! I'm finalizing my statement of purpose this week.",
        timestamp: "Yesterday, 2:30 PM",
        sender: "me",
      },
      {
        id: 3,
        content: "Have you decided which universities you're applying to?",
        timestamp: "Yesterday, 2:45 PM",
        sender: "other",
      },
    ],
  },
  {
    id: 3,
    name: "Prof. Robert Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I've reviewed your research proposal and have some feedback to share.",
    lastMessageTime: "Monday",
    unread: true,
    type: "professor",
    university: "UC Berkeley",
    starred: true,
    messages: [
      {
        id: 1,
        content:
          "Dear Professor Williams, I'm attaching my research proposal for your review. I would greatly appreciate your feedback.",
        timestamp: "Monday, 9:00 AM",
        sender: "me",
      },
      {
        id: 2,
        content: "I've reviewed your research proposal and have some feedback to share.",
        timestamp: "Monday, 4:30 PM",
        sender: "other",
      },
    ],
  },
  {
    id: 4,
    name: "Aisha Rahman",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The GRE prep group is meeting this Saturday at 2pm. Can you make it?",
    lastMessageTime: "Tuesday",
    unread: false,
    type: "student",
    university: "Georgia Tech",
    starred: false,
    messages: [
      {
        id: 1,
        content: "Hi! Are you still interested in joining our GRE prep group?",
        timestamp: "Tuesday, 10:00 AM",
        sender: "other",
      },
      {
        id: 2,
        content: "Yes, definitely! When is the next meeting?",
        timestamp: "Tuesday, 11:30 AM",
        sender: "me",
      },
      {
        id: 3,
        content: "The GRE prep group is meeting this Saturday at 2pm. Can you make it?",
        timestamp: "Tuesday, 12:15 PM",
        sender: "other",
      },
    ],
  },
  {
    id: 5,
    name: "Dr. Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Your application to our lab has been received. We'll review it and get back to you soon.",
    lastMessageTime: "Last week",
    unread: false,
    type: "professor",
    university: "Carnegie Mellon",
    starred: false,
    messages: [
      {
        id: 1,
        content:
          "Dear Dr. Rodriguez, I'm writing to express my interest in joining your research lab as a graduate student next fall.",
        timestamp: "Last week, Monday",
        sender: "me",
      },
      {
        id: 2,
        content: "Your application to our lab has been received. We'll review it and get back to you soon.",
        timestamp: "Last week, Wednesday",
        sender: "other",
      },
    ],
  },
]
