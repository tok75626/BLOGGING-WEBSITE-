import { create } from "zustand";
import axios from "axios";

interface BlogState {
  posts: any[];
  currentPost: any | null;
  loading: boolean;
  generating: boolean;
  fetchPosts: (search?: string, page?: number) => Promise<void>;
  generateAI: (type: "title" | "content" | "summary" | "tags", data: any) => Promise<any>;
}

export const useBlog = create<BlogState>((set) => ({
  posts: [],
  currentPost: null,
  loading: false,
  generating: false,
  fetchPosts: async (search = "", page = 1) => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`/api/posts?search=${search}&page=${page}`);
      set({ posts: data.posts, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  generateAI: async (type, data) => {
    set({ generating: true });
    try {
      const { data: result } = await axios.post(`/api/ai/${type}`, data);
      set({ generating: false });
      return result;
    } catch (error) {
      set({ generating: false });
      throw error;
    }
  },
}));
