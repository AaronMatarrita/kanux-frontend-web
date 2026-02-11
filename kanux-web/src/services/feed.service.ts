/**
 * Feed Service
 * Access layer for feed microservice (ms-feed)
 *
 * All requests are proxied through API Gateway at /feed
 */

import { httpClient } from "@/services/http";

// ============================================================================
// Request DTOs
// ============================================================================

export interface CreatePostRequest {
  content: string;
}

export interface UpdatePostRequest {
  content: string;
}

export interface CreateCommentRequest {
  post_id: string;
  content: string;
}

// ============================================================================
// Response DTOs
// ============================================================================

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  comments_count?: number;
  reactions_count?: number;
  [key: string]: unknown;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  type: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface CreatePostResponse {
  message: string;
  data: Post;
}

export interface UpdatePostResponse {
  message: string;
  data: Post;
}

export interface DeletePostResponse {
  message: string;
  [key: string]: unknown;
}

export interface CreateCommentResponse {
  message: string;
  data: Comment;
}

export interface DeleteCommentResponse {
  message: string;
  [key: string]: unknown;
}

export interface ReactionToggleResponse {
  [key: string]: unknown;
}

// ============================================================================
// Service
// ============================================================================

export const feedService = {
  // ========== Posts ==========

  /**
   * POST /feed/feed/post
   * Create a new post (requires auth)
   */
  createPost: async (data: CreatePostRequest): Promise<CreatePostResponse> => {
    const res = await httpClient.post<CreatePostResponse>(
      "/feed/feed/post",
      data,
    );
    return res.data;
  },

  /**
   * PUT /feed/feed/:postId/update
   * Update a post (requires auth)
   */
  updatePost: async (
    postId: string,
    data: UpdatePostRequest,
  ): Promise<UpdatePostResponse> => {
    const res = await httpClient.put<UpdatePostResponse>(
      `/feed/feed/${postId}/update`,
      data,
    );
    return res.data;
  },

  /**
   * DELETE /feed/feed/post/:postId
   * Delete a post (requires auth)
   */
  deletePost: async (postId: string): Promise<DeletePostResponse> => {
    const res = await httpClient.delete<DeletePostResponse>(
      `/feed/feed/post/${postId}`,
    );
    return res.data;
  },

  /**
   * GET /feed/feed/my-post
   * Get current user's posts (requires auth)
   */
  getMyPosts: async (): Promise<Post[]> => {
    const res = await httpClient.get<Post[]>("/feed/feed/my-post");
    return res.data;
  },

  /**
   * GET /feed/feed/all-posts
   * Get all posts (requires auth)
   */
  getAllPosts: async (): Promise<Post[]> => {
    const res = await httpClient.get<Post[]>("/feed/feed/all-posts");
    return res.data;
  },

  // ========== Comments ==========

  /**
   * POST /feed/feed/:postId/comment
   * Create a comment on a post (requires auth)
   */
  createComment: async (
    postId: string,
    data: Omit<CreateCommentRequest, "post_id">,
  ): Promise<CreateCommentResponse> => {
    const res = await httpClient.post<CreateCommentResponse>(
      `/feed/feed/${postId}/comment`,
      {
        ...data,
        post_id: postId,
      },
    );
    return res.data;
  },

  /**
   * DELETE /feed/feed/comment/:commentId
   * Delete a comment (requires auth)
   */
  deleteComment: async (commentId: string): Promise<DeleteCommentResponse> => {
    const res = await httpClient.delete<DeleteCommentResponse>(
      `/feed/feed/comment/${commentId}`,
    );
    return res.data;
  },

  /**
   * GET /feed/feed/:postId/all-comment
   * Get all comments for a post (requires auth)
   */
  getCommentsByPost: async (postId: string): Promise<Comment[]> => {
    const res = await httpClient.get<Comment[]>(
      `/feed/feed/${postId}/all-comment`,
    );
    return res.data;
  },

  // ========== Reactions ==========

  /**
   * POST /feed/feed/:postId/reaction
   * Toggle a reaction on a post (requires auth)
   */
  toggleReaction: async (postId: string): Promise<ReactionToggleResponse> => {
    const res = await httpClient.post<ReactionToggleResponse>(
      `/feed/feed/${postId}/reaction`,
      {},
    );
    return res.data;
  },
};
