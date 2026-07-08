"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatResponseType, sendChatMessage } from "@/lib/chatApi";

const SERVICES_SUBCATEGORY_MAP: Record<string, string> = {
  rentals: "rental",
  accommodation: "stay",
  transport: "airport-transfer",
};

const VALID_ACTIVITIES_SUBCATEGORIES = new Set(["sea", "land", "air"]);

async function buildRedirectUrl(
  intent: string | null | undefined,
  category: string | null | undefined,
  subcategory: string | null | undefined,
  activity_id: string | null | undefined,
  lang: string,
): Promise<string | null> {
  const cat = intent?.toLowerCase();

  // If activity_id provided, validate it exists in Strapi before redirecting
  if (activity_id) {
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "https://phenomenal-growth-682e298e29.strapiapp.com";
      const res = await fetch(
        `${strapiUrl}/api/activities?filters[slug][$eq]=${encodeURIComponent(activity_id)}&pagination[pageSize]=1&fields[0]=slug`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.data?.length > 0) {
          return `/${lang}/activity/${activity_id}`;
        }
      }
    } catch {
      // Validation failed — fall through to category redirect
    }
  }

  if (cat === "activities") {
    const sub = category?.toLowerCase();
    if (sub && VALID_ACTIVITIES_SUBCATEGORIES.has(sub)) {
      const base = `/${lang}/activities/${sub}`;
      return subcategory ? `${base}?subcategory=${encodeURIComponent(subcategory)}` : base;
    }
    return `/${lang}/activities`;
  }

  if (cat === "services") {
    const sub = category?.toLowerCase();
    const mappedSub = sub ? SERVICES_SUBCATEGORY_MAP[sub] : undefined;
    return mappedSub ? `/${lang}/services/${mappedSub}` : `/${lang}/services`;
  }

  if (cat === "contact") return `/${lang}#contact`;
  if (cat === "about") return `/${lang}/about`;
  if (cat === "home") return `/${lang}`;

  return null;
}


interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("chatbot_dismissed");
    if (!dismissed) {
      setIsOpen(true);
    }
  }, []);

  // Warm-up ping on mount to reduce first-interaction latency
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/health`, { method: "GET" })
      .catch(() => {/* silent */});
  }, []);

  // Initialisation du message de bienvenue
  useEffect(() => {
    if (messages.length === 0 && t) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: t('chatbot.welcomeMessage', "Bonjour ! Comment puis-je vous aider pour votre voyage ?"),
        },
      ]);
    }
  }, [t, messages.length]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    if (isOpen) {
      sessionStorage.setItem("chatbot_dismissed", "true");
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (predefinedMessage?: string) => {
    // Si predefinedMessage est un event (click), on l'ignore, sinon on l'utilise
    const text = typeof predefinedMessage === 'string' ? predefinedMessage : inputMessage;

    if (!text.trim()) return;

    // 1. Ajouter le message utilisateur à l'UI
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage(""); // Clear input
    setIsLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const mockForm = {
        user_context: {
          name: "Guest",
          travel_style: "Discovery",
          language: i18n.language || "en"
        },
        trip_details: {
          destination: ["Mauritius"],
          duration_days: 1,
          start_date: today,
          end_date: today,
          adults: 2,
          children: []
        },
        logistics: {},
        preferences: {},
        metadata: { source: "chatbot_widget" }
      };

      // 2. Appel API avec le payload corrigé
      const response: ChatResponseType = await sendChatMessage({
        message: text,
        thread_id: threadId,
        current_page_url: window.location.href,
        current_form: mockForm,
        lang: i18n.language || "en",
      });

      // 3. Mise à jour du thread ID
      if (response.thread_id && response.thread_id !== threadId) {
        setThreadId(response.thread_id);
      }

      // 4. Ajouter la réponse du bot
      const botResponse: ChatMessage = {
        id: Date.now().toString() + "-bot",
        sender: "bot",
        text: response.response,
      };
      setMessages((prev) => [...prev, botResponse]);

      // 5. Handle redirection based on intent/category/subcategory/activity_id from backend
      if (response.intent || response.activity_id) {
        const lang = i18n.language || "en";
        const redirectUrl = await buildRedirectUrl(
          response.intent,
          response.category,
          response.subcategory,
          response.activity_id,
          lang,
        );
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          sender: "bot",
          text: t('chatbot.messages.errorSendingMessage', "Désolé, une erreur est survenue."),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  const suggestedQuestions = t ? [
    t('chatbot.defaultQuestions.question1'),
    t('chatbot.defaultQuestions.question2'),
    t('chatbot.defaultQuestions.question3'),
  ] : [];

  if (!t) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Bouton d'ouverture (Flottant) */}
      {!isOpen && (
        <Button
          className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          onClick={toggleChat}
          aria-label="Ouvrir le chat"
        >
          <MessageSquare className="w-7 h-7" />
        </Button>
      )}

      {isOpen && (
        <div className="absolute bottom-0 right-0 w-96 h-[32rem] bg-background rounded-lg shadow-xl flex flex-col">
          <div className="bg-primary text-primary-foreground p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2"> {/* Added a div to wrap image and title */}
              <img src="/ravi_assistant.png" alt="Ravi the assistant" className="-my-3 h-24 w-auto object-contain" />
              <h3 className="text-lg font-semibold">{t('chatbot.title')}</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleChat} className="text-primary-foreground">
              X
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "mb-2 p-2 rounded-lg max-w-[80%]",
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-gray-200 text-gray-800 mr-auto"
                )}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div
                className={cn(
                  "mb-2 p-2 rounded-lg max-w-[80%] bg-gray-200 text-gray-800 mr-auto"
                )}
              >
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-col gap-1.5">
              {suggestedQuestions.slice(0, 2).map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 text-center"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="border-t p-3 flex items-center">
            <Input
              type="text"
              placeholder={t('chatbot.inputPlaceholder')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 mr-2"
              disabled={isLoading}
            />
            <Button onClick={() => handleSendMessage()} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}