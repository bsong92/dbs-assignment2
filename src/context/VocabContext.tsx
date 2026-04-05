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
  // Greetings & basics (mastered - you know these well)
  {
    id: "1",
    chinese: "你好",
    pinyin: "nǐ hǎo",
    english: "hello",
    example: "你好，我叫Brian。",
    category: "greetings",
    mastered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    chinese: "谢谢",
    pinyin: "xiè xie",
    english: "thank you",
    example: "谢谢你的帮助。",
    category: "greetings",
    mastered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    chinese: "不客气",
    pinyin: "bú kè qi",
    english: "you're welcome",
    example: "谢谢！不客气。",
    category: "greetings",
    mastered: true,
    createdAt: new Date().toISOString(),
  },
  // Food & drink
  {
    id: "4",
    chinese: "水",
    pinyin: "shuǐ",
    english: "water",
    example: "我想喝水。",
    category: "food",
    mastered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    chinese: "吃饭",
    pinyin: "chī fàn",
    english: "to eat (a meal)",
    example: "我们一起吃饭吧。",
    category: "food",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    chinese: "好吃",
    pinyin: "hǎo chī",
    english: "delicious",
    example: "这个菜很好吃！",
    category: "food",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    chinese: "点菜",
    pinyin: "diǎn cài",
    english: "to order food",
    example: "我们可以点菜了吗？",
    category: "food",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  // Shopping
  {
    id: "8",
    chinese: "多少钱",
    pinyin: "duō shao qián",
    english: "how much (money)?",
    example: "这个多少钱？",
    category: "shopping",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "9",
    chinese: "太贵了",
    pinyin: "tài guì le",
    english: "too expensive",
    example: "这个太贵了，有便宜的吗？",
    category: "shopping",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "10",
    chinese: "便宜",
    pinyin: "pián yi",
    english: "cheap / inexpensive",
    example: "这家店的东西很便宜。",
    category: "shopping",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  // Travel
  {
    id: "11",
    chinese: "去",
    pinyin: "qù",
    english: "to go",
    example: "我们去公园吧。",
    category: "travel",
    mastered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "12",
    chinese: "地铁站",
    pinyin: "dì tiě zhàn",
    english: "subway station",
    example: "地铁站在哪里？",
    category: "travel",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "13",
    chinese: "迷路了",
    pinyin: "mí lù le",
    english: "to be lost",
    example: "我迷路了，你能帮我吗？",
    category: "travel",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  // Daily life
  {
    id: "14",
    chinese: "上班",
    pinyin: "shàng bān",
    english: "to go to work",
    example: "我每天早上八点上班。",
    category: "daily",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "15",
    chinese: "休息",
    pinyin: "xiū xi",
    english: "to rest / to take a break",
    example: "你累了，休息一下吧。",
    category: "daily",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "16",
    chinese: "已经",
    pinyin: "yǐ jīng",
    english: "already",
    example: "我已经吃过饭了。",
    category: "daily",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "17",
    chinese: "应该",
    pinyin: "yīng gāi",
    english: "should / ought to",
    example: "你应该多喝水。",
    category: "daily",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  // More intermediate phrases
  {
    id: "18",
    chinese: "听不懂",
    pinyin: "tīng bù dǒng",
    english: "can't understand (by listening)",
    example: "他说得太快了，我听不懂。",
    category: "daily",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "19",
    chinese: "没关系",
    pinyin: "méi guān xi",
    english: "it doesn't matter / no problem",
    example: "对不起！没关系。",
    category: "greetings",
    mastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "20",
    chinese: "越来越",
    pinyin: "yuè lái yuè",
    english: "more and more",
    example: "我的中文越来越好了。",
    category: "daily",
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
