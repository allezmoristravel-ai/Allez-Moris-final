"use client";

import { Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Extract the video ID from a YouTube link (youtube.com/watch?v=ID or youtu.be/ID).
 * Extra parameters such as &t=30s or ?si=... are ignored. Returns null if unparseable.
 */
export const getYouTubeVideoId = (link?: string | null): string | null => {
    if (!link || link.trim() === "") return null;
    try {
        const trimmed = link.trim();
        const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
        const host = url.hostname.replace(/^(www\.|m\.)/, "");
        let id: string | null = null;
        if (host === "youtu.be") {
            id = url.pathname.split("/")[1] || null;
        } else if (host === "youtube.com" && url.pathname === "/watch") {
            id = url.searchParams.get("v");
        }
        return id && /^[\w-]{11}$/.test(id) ? id : null;
    } catch {
        return null;
    }
};

interface YouTubeEmbedProps {
    url?: string | null;
    title: string;
}

export default function YouTubeEmbed({ url, title }: YouTubeEmbedProps) {
    const { t } = useTranslation();
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;

    return (
        <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Youtube className="w-6 h-6 text-primary" />
                {t("activity.videoPreview")}
            </h2>
            <div className="rounded-xl overflow-hidden border border-border/50 shadow-md aspect-video">
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title={title}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </div>
    );
}
