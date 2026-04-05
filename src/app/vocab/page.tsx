"use client";

import { useState } from "react";
import Link from "next/link";
import { useVocab } from "@/context/VocabContext";

const ALL_CATEGORIES = ["all", "greetings", "food", "travel", "shopping", "numbers", "daily", "work", "other"];

export default function VocabPage() {
  const { entries } = useVocab();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = entries.filter((entry) => {
    const matchesCategory = category === "all" || entry.category === category;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      entry.chinese.includes(q) ||
      entry.pinyin.toLowerCase().includes(q) ||
      entry.english.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Vocabulary</h1>
      <p className="text-muted mb-6">
        {entries.length} word{entries.length !== 1 ? "s" : ""} in your journal
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by Chinese, pinyin, or English..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
        >
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-lg">No words found.</p>
          <p className="text-sm mt-1">
            {entries.length === 0 ? (
              <Link href="/add" className="text-primary hover:underline">
                Add your first word
              </Link>
            ) : (
              "Try adjusting your search or filter."
            )}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((entry) => (
            <Link
              key={entry.id}
              href={`/vocab/${entry.id}`}
              className="block p-4 bg-surface rounded-xl border border-border hover:border-primary/40 hover:shadow-sm transition group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold group-hover:text-primary-dark transition-colors">
                    {entry.chinese}
                  </span>
                  <div>
                    <p className="text-sm text-muted">{entry.pinyin}</p>
                    <p className="text-foreground">{entry.english}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary-dark font-medium">
                    {entry.category}
                  </span>
                  {entry.mastered && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent font-medium">
                      mastered
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
