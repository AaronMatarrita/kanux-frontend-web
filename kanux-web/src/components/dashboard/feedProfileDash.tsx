"use client";

import React from "react";
import Image from "next/image";

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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Publicaciones
            </h2>
            <p className="text-gray-600 mt-1 font-medium">
              Últimas actualizaciones de tu red
            </p>
          </div>
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl">
            <span className="text-sm font-semibold text-gray-700">
              {posts.length} posts
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {posts.map((post) => (
          <article
            key={post.id}
            className="px-8 py-7 hover:bg-gray-50/50 transition-all duration-200"
          >
            {/* Author */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-2xl ${getRandomColor(post.author?.id || post.id)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                  >
                    {post.author?.avatar ? (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name || "User"}
                        fill
                        className="rounded-2xl object-cover"
                        sizes="56px"
                        priority={false}
                      />
                    ) : (
                      getInitials(post.author?.name)
                    )}
                  </div>
                  {post.isOwner && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
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
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {post.author?.name || "Anonymous"}
                    </h3>
                    {post.reactionsCount + post.commentsCount > 10 && (
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full">
                        Tendencia
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-gray-500 font-medium">
                      {formatDate(post.created_at)}
                    </span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500 font-medium">
                      {post.commentsCount} comentarios
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-800 text-lg leading-relaxed font-medium tracking-wide whitespace-pre-line">
                {post.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-rose-500"
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
                    {post.isLikedByMe && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
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
                    <p className="font-bold text-gray-900">
                      {post.reactionsCount}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Reacciones
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-500"
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
                  <div>
                    <p className="font-bold text-gray-900">
                      {post.commentsCount}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Comentarios
                    </p>
                  </div>
                </div>

                {post.reactionsCount === 0 && post.commentsCount === 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">0</p>
                      <p className="text-xs text-gray-500 font-medium">
                        Interacciones
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-semibold text-gray-700">
                    Ver publicación
                  </span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="px-8 py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
            <svg
              className="w-12 h-12 text-gray-400"
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No posts available
          </h3>
          <p className="text-gray-600 max-w-md mx-auto font-medium">
            When new posts are published in your network, they will appear here.
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="px-8 py-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-medium">
              Showing{" "}
              <span className="text-gray-900 font-bold">{posts.length}</span>{" "}
              {posts.length === 1 ? "post" : "posts"}
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 font-medium">
                Live updates active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
