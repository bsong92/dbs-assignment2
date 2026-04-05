"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface VocabEntry {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  example?: string;
  category: string;
  mastered: boolean;
  createdAt: string;
}

interface VocabContextType {
  entries: VocabEntry[];
  addEntry: (entry: Omit<VocabEntry, "id" | "mastered" | "createdAt">) => void;
  updateEntry: (id: string, updates: Partial<VocabEntry>) => void;
  deleteEntry: (id: string) => void;
  toggleMastered: (id: string) => void;
  getEntry: (id: string) => VocabEntry | undefined;
}

const SEED_DATA: VocabEntry[] = [
  {
    id: "1",
    chinese: "你好",
    pinyin: "nǐ hǎo",
    english: "hello",
    example: "你好，我叫Brian。",
    category: "greetings",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    chinese: "谢谢",
    pinyin: "xiè xie",
    english: "thank you",
    example: "谢谢你的帮助。",
    category: "greetings",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    chinese: "水",
    pinyin: "shuǐ",
    english: "water",
    example: "我想喝水。",
    category: "food",
    mastered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    chinese: "吃饭",
    pinyin: "chī fàn",
    english: "to eat (a meal)",
    example: "我们一起吃饭吧。",
    category: "food",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    chinese: "去",
    pinyin: "qù",
    english: "to go",
    example: "我们去公园吧。",
    category: "travel",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    chinese: "多少钱",
    pinyin: "duō shao qián",
    english: "how much (money)?",
    example: "这个多少钱？",
    category: "shopping",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
];

const VocabContext = createContext<VocabContextType | undefined>(undefined);

export function VocabProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<VocabEntry[]>(SEED_DATA);

  const addEntry = (entry: Omit<VocabEntry, "id" | "mastered" | "createdAt">) => {
    const newEntry: VocabEntry = {
      ...entry,
      id: Date.now().toString(),
      mastered: false,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const updateEntry = (id: string, updates: Partial<VocabEntry>) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleMastered = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, mastered: !e.mastered } : e))
    );
  };

  const getEntry = (id: string) => entries.find((e) => e.id === id);

  return (
    <VocabContext.Provider
      value={{ entries, addEntry, updateEntry, deleteEntry, toggleMastered, getEntry }}
    >
      {children}
    </VocabContext.Provider>
  );
}

export function useVocab() {
  const context = useContext(VocabContext);
  if (!context) {
    throw new Error("useVocab must be used within a VocabProvider");
  }
  return context;
}
