"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVocab } from "@/context/VocabContext";

export default function VocabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getEntry, toggleMastered, deleteEntry } = useVocab();
  const router = useRouter();
  const entry = getEntry(id);

  if (!entry) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-bold mb-2">Word not found</p>
        <p className="text-muted mb-4">This word may have been deleted.</p>
        <Link href="/vocab" className="text-primary hover:underline font-medium">
          Back to vocabulary
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteEntry(entry.id);
    router.push("/vocab");
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/vocab"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        &larr; Back to vocabulary
      </Link>

      <div className="bg-surface rounded-2xl border border-border p-8">
        <div className="text-center mb-6">
          <p className="text-6xl font-bold mb-3">{entry.chinese}</p>
          <p className="text-xl text-muted">{entry.pinyin}</p>
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
              Meaning
            </p>
            <p className="text-lg">{entry.english}</p>
          </div>

          {entry.example && (
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                Example
              </p>
              <p className="text-lg italic">{entry.example}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                Category
              </p>
              <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {entry.category}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
              Status
            </p>
            <p className="text-sm">
              {entry.mastered ? "Mastered" : "Learning"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => toggleMastered(entry.id)}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-colors cursor-pointer ${
              entry.mastered
                ? "bg-muted/20 text-foreground hover:bg-muted/30"
                : "bg-primary hover:bg-primary-dark text-white"
            }`}
          >
            {entry.mastered ? "Unmark Mastered" : "Mark as Mastered"}
          </button>
          <button
            onClick={handleDelete}
            className="py-2.5 px-4 rounded-xl font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
