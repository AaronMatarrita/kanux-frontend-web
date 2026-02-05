"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export interface FeedPost {
  id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    name?: string;
    avatar?: string;
  } | null;
  commentsCount: number;
  reactionsCount: number;
  comments: unknown[];
  reactions: unknown[];
  isOwner: boolean;
  isLikedByMe: boolean;
}

interface FeedProps {
  posts: FeedPost[];
}

export const Feed: React.FC<FeedProps> = ({ posts }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60),
      );
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year:
            date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
      }
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomColor = (id: string) => {
    const colors = [
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
      "bg-gradient-to-br from-emerald-500 to-emerald-600",
      "bg-gradient-to-br from-violet-500 to-violet-600",
      "bg-gradient-to-br from-sky-500 to-sky-600",
      "bg-gradient-to-br from-rose-500 to-rose-600",
      "bg-gradient-to-br from-amber-500 to-amber-600",
    ];
    const index =
      id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-xl">Publicaciones</CardTitle>
          <CardDescription>Últimas actualizaciones de tu red</CardDescription>
        </div>
        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
          {posts.length} posts
        </span>
      </CardHeader>

      <CardContent className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-xl ${getRandomColor(post.author?.id || post.id)} flex items-center justify-center text-white font-semibold text-base shadow-sm`}
                  >
                    {post.author?.avatar ? (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name || "User"}
                        fill
                        className="rounded-xl object-cover"
                        sizes="48px"
                        priority={false}
                      />
                    ) : (
                      getInitials(post.author?.name)
                    )}
                  </div>
                  {post.isOwner && (
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground border-2 border-background flex items-center justify-center">
                      <svg
                        className="h-3 w-3"
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
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-foreground">
                      {post.author?.name || "Anónimo"}
                    </h3>
                    {post.reactionsCount + post.commentsCount > 10 && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                        Tendencia
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                    <span>{formatDate(post.created_at)}</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{post.commentsCount} comentarios</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">
                      {post.reactionsCount}
                    </p>
                    Reacciones
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">
                      {post.commentsCount}
                    </p>
                    Comentarios
                  </div>
                </div>
              </div>

              <button className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-muted cursor-pointer">
                Ver publicación
              </button>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No hay publicaciones aún
            </h3>
            <p className="text-muted-foreground">
              Cuando existan nuevas publicaciones en tu red, aparecerán aquí.
            </p>
          </div>
        )}
      </CardContent>

      {posts.length > 0 && (
        <CardFooter className="border-t">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <span>
              Mostrando{" "}
              <span className="text-foreground font-semibold">
                {posts.length}
              </span>{" "}
              {posts.length === 1 ? "publicación" : "publicaciones"}
            </span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs">Actualizaciones activas</span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
