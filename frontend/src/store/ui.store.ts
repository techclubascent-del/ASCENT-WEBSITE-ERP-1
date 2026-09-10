"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Zustand — global UI state
//
// Only truly global, cross-cutting UI state belongs here.
// Feature-specific state stays local (useState) or in URL params.
// Server state (API data) belongs in TanStack Query — NOT here.
// ─────────────────────────────────────────────────────────────────────────────
import { create } from "zustand";

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
