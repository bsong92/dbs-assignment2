"use client";

import Link from "next/link";
import { useVocab } from "@/context/VocabContext";

export default function DashboardPage() {
  const { entries } = useVocab();

  const totalWords = entries.length;
  const masteredWords = entries.filter((e) => e.mastered).length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const addedToday = entries.filter(
    (e) => e.createdAt.slice(0, 10) === todayStr
  ).length;
  const recentEntries = entries.slice(0, 5);

  const categories = [...new Set(entries.map((e) => e.category))];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Welcome back!</h1>
        <p className="text-muted text-lg">
          Keep building your Chinese vocabulary, one word at a time.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface rounded-xl border border-border p-5 text-center">
          <p className="text-3xl font-bold text-primary">{totalWords}</p>
          <p className="text-sm text-muted mt-1">Total Words</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 text-center">
          <p className="text-3xl font-bold text-primary">{masteredWords}</p>
          <p className="text-sm text-muted mt-1">Mastered</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 text-center">
          <p className="text-3xl font-bold text-accent">{addedToday}</p>
          <p className="text-sm text-muted mt-1">Added Today</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 text-center">
          <p className="text-3xl font-bold text-foreground">{categories.length}</p>
          <p className="text-sm text-muted mt-1">Categories</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Link
          href="/add"
          className="flex-1 py-3 px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors text-center"
        >
          + Add Word
        </Link>
        <Link
          href="/review"
          className="flex-1 py-3 px-6 bg-accent hover:bg-accent/80 text-white font-semibold rounded-xl transition-colors text-center"
        >
          Start Review
        </Link>
      </div>

      {/* Recent Words */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Words</h2>
          <Link href="/vocab" className="text-sm text-primary hover:underline font-medium">
            View all &rarr;
          </Link>
        </div>

        {recentEntries.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-xl border border-border">
            <p className="text-muted">No words yet.</p>
            <Link href="/add" className="text-primary hover:underline text-sm">
              Add your first word
            </Link>
          </div>
        ) : (
          <div className="grid gap-2">
            {recentEntries.map((entry) => (
              <Link
                key={entry.id}
                href={`/vocab/${entry.id}`}
                className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border hover:border-primary/40 transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold group-hover:text-primary transition-colors">
                    {entry.chinese}
                  </span>
                  <span className="text-muted text-sm">{entry.pinyin}</span>
                  <span className="text-foreground">{entry.english}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {entry.category}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
