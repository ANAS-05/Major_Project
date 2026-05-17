import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Send,
  Plus,
  MessageSquare,
  User,
  Trash2,
  Settings,
  Share2,
  Sparkles,
  Menu,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Flight prices to Mumbai",
    messages: [
      {
        id: "1",
        role: "user",
        content: "What are the flight prices from Hyderabad to Mumbai?",
        timestamp: new Date(Date.now() - 86400000),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "Based on our AI analysis, flights from Hyderabad (HYD) to Mumbai (BOM) typically range from ₹3,500 to ₹8,500 depending on the date and airline. The best time to book is 2-3 weeks in advance for optimal pricing. Would you like me to check specific dates?",
        timestamp: new Date(Date.now() - 86300000),
      },
    ],
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: "conv-2",
    title: "Hotel recommendations",
    messages: [
      {
        id: "3",
        role: "user",
        content: "Recommend luxury hotels in Hyderabad",
        timestamp: new Date(Date.now() - 172800000),
      },
      {
        id: "4",
        role: "assistant",
        content:
          "Here are some top luxury hotels in Hyderabad:\n\n1. Taj Falaknuma Palace - ₹18,500/night\n2. ITC Kohenur - ₹12,000/night\n3. Trident Hyderabad - ₹9,800/night\n\nAll offer world-class amenities including spas, fine dining, and concierge services.",
        timestamp: new Date(Date.now() - 172700000),
      },
    ],
    timestamp: new Date(Date.now() - 172800000),
  },
];

const welcomeMessages = [
  {
    title: "Flight Price Prediction",
    description: "Get AI-powered price forecasts for your routes",
    icon: Plane,
  },
  {
    title: "Hotel Recommendations",
    description: "Discover the best stays across Indian cities",
    icon: Sparkles,
  },
  {
    title: "Travel Planning",
    description: "Plan your perfect trip with smart suggestions",
    icon: MessageSquare,
  },
];

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, scrollToBottom]);

  const handleNewChat = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: "New Chat",
      messages: [],
      timestamp: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        const emptyConv: Conversation = {
          id: `conv-${Date.now()}`,
          title: "New Chat",
          messages: [],
          timestamp: new Date(),
        };
        setActiveConvId(emptyConv.id);
        return [emptyConv];
      }
      if (activeConvId === id) {
        setActiveConvId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    // Update local state with user message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConvId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              title:
                conv.messages.length === 0
                  ? input.trim().slice(0, 30) + (input.trim().length > 30 ? "..." : "")
                  : conv.title,
            }
          : conv
      )
    );

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.reply || "I'm sorry, I couldn't process that request.",
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConvId
            ? { ...conv, messages: [...conv.messages, assistantMessage] }
            : conv
        )
      );
    } catch {
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConvId
            ? { ...conv, messages: [...conv.messages, errorMessage] }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <Plane className="size-5 text-primary" />
          <span className="text-lg font-bold text-foreground">
            Journey<span className="text-primary">It</span>
          </span>
        </Link>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={handleNewChat}
          className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
        >
          <Plus className="size-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 mb-2">
          Recent
        </p>
        <div className="space-y-1">
          <AnimatePresence>
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors group",
                    activeConvId === conv.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <MessageSquare className="size-4 shrink-0" />
                  <span className="flex-1 truncate">{conv.title}</span>
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        {user ? (
          <div className="flex items-center gap-3">
            <Avatar className="size-8 border border-border">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {(user.displayName || user.email || "?")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.displayName || user.email?.split("@")[0]}
              </p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        ) : (
          <Link to="/login">
            <Button variant="outline" size="sm" className="w-full border-border text-muted-foreground">
              <User className="size-4 mr-2" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0 border-border">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-muted-foreground"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <div className="flex items-center gap-2">
              <Bot className="size-5 text-primary" />
              <h1 className="text-sm font-semibold text-foreground">JourneyIt AI</h1>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-0 text-[10px]"
              >
                Beta
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex">
              <Settings className="size-4 mr-2" />
              Config
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex">
              <Share2 className="size-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              className="border-border text-foreground"
            >
              <Plus className="size-4 mr-2" />
              New Chat
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Empty State / Welcome */}
            {activeConversation?.messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="flex justify-center mb-6">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="size-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to JourneyIt AI
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Your intelligent travel assistant. Ask me about flights, hotels, prices, or travel tips.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {welcomeMessages.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => {
                        setInput(item.description);
                      }}
                      className="p-4 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/30 transition-all text-left"
                    >
                      <item.icon className="size-5 text-primary mb-3" />
                      <p className="text-sm font-medium text-foreground mb-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <AnimatePresence>
              {activeConversation?.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    "flex gap-3 mb-6",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="size-8 mt-0.5 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        <Bot className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] sm:max-w-[70%]",
                      message.role === "user" ? "order-1" : "order-2"
                    )}
                  >
                    <Card
                      className={cn(
                        "border-0 shadow-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-card border border-border"
                      )}
                    >
                      <div className="px-4 py-3">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </Card>
                    <p
                      className={cn(
                        "text-[10px] text-muted-foreground mt-1",
                        message.role === "user" ? "text-right" : "text-left"
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="size-8 mt-0.5 shrink-0 order-2">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 mb-6"
              >
                <Avatar className="size-8 mt-0.5 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    <Bot className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="border border-border bg-card shadow-sm">
                  <div className="px-4 py-3 flex items-center gap-1">
                    <span className="size-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="size-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="size-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </Card>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 border-t border-border bg-card/50 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 bg-background border border-input rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-ring">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask JourneyIt AI about flights, hotels, or travel tips..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-h-[20px] max-h-[120px] py-0.5"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "size-8 rounded-lg shrink-0 transition-colors",
                  input.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Send className="size-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              JourneyIt AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
