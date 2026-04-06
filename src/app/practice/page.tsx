"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useVocab, VocabEntry } from "@/context/VocabContext";

type Mode = "free" | "reconstruct";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function FreePractice({ entries }: { entries: VocabEntry[] }) {
  const [sentence, setSentence] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState(() =>
    shuffle(entries.map((e) => e.chinese))
  );

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-xl font-medium">No words to practice with.</p>
        <Link href="/add" className="text-primary hover:underline font-semibold mt-2 inline-block">
          Add some words first →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <p className="text-sm text-muted font-medium">
        Click words below to build a sentence. Click a word in your sentence to remove it.
      </p>

      {/* Sentence area */}
      <div className="min-h-[120px] bg-surface rounded-2xl border-2 border-dashed border-border p-5">
        {sentence.length === 0 ? (
          <p className="text-muted text-center py-8 font-medium">
            Click words below to start building...
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sentence.map((word, i) => (
              <button
                key={`${word}-${i}`}
                onClick={() => setSentence((prev) => prev.filter((_, idx) => idx !== i))}
                className="px-4 py-2.5 bg-primary-light text-primary-dark font-bold text-lg rounded-xl hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer active:scale-95"
                title="Click to remove"
              >
                {word}
              </button>
            ))}
          </div>
        )}
      </div>

      {sentence.length > 0 && (
        <div className="p-4 bg-surface rounded-2xl border border-border">
          <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Your sentence</p>
          <p className="text-3xl font-extrabold tracking-tight">{sentence.join("")}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setSentence([])}
          disabled={sentence.length === 0}
          className="px-5 py-2.5 rounded-xl font-bold bg-stone-100 text-foreground hover:bg-stone-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
        >
          Clear
        </button>
        <button
          onClick={() => setShuffledWords(shuffle(entries.map((e) => e.chinese)))}
          className="px-5 py-2.5 rounded-xl font-bold bg-stone-100 text-foreground hover:bg-stone-200 transition-all cursor-pointer active:scale-[0.98]"
        >
          Shuffle
        </button>
      </div>

      {/* Word bank */}
      <div>
        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Word Bank</p>
        <div className="flex flex-wrap gap-2">
          {shuffledWords.map((word, i) => (
            <button
              key={`${word}-${i}`}
              onClick={() => setSentence((prev) => [...prev, word])}
              className="px-4 py-2.5 bg-surface border border-border rounded-xl text-lg font-semibold hover:border-primary/40 hover:bg-primary-light/50 transition-all cursor-pointer active:scale-95"
            >
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReconstructGame({ entries }: { entries: VocabEntry[] }) {
  const sentenceEntries = useMemo(
    () => shuffle(entries.filter((e) => e.example)),
    [entries]
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  if (sentenceEntries.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-xl font-medium">No example sentences available.</p>
        <p className="text-sm mt-2">Add words with example sentences to play.</p>
      </div>
    );
  }

  const current = sentenceEntries[index % sentenceEntries.length];
  const originalChars = current.example!.replace(/[。！？，、]/g, "").split("");
  const scrambled = useMemo(
    () => shuffle([...originalChars]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index]
  );

  const remaining = [...scrambled];
  selected.forEach((char) => {
    const idx = remaining.indexOf(char);
    if (idx !== -1) remaining.splice(idx, 1);
  });

  const isCorrect = selected.join("") === originalChars.join("");

  const handleSelect = (char: string) => {
    if (checked) return;
    const idx = remaining.indexOf(char);
    if (idx !== -1) setSelected((prev) => [...prev, char]);
  };

  const handleCheck = () => {
    setChecked(true);
    setTotal((t) => t + 1);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setIndex((i) => i + 1);
    setSelected([]);
    setChecked(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted font-medium">
          Sentence {(index % sentenceEntries.length) + 1} of {sentenceEntries.length}
        </p>
        {total > 0 && (
          <p className="text-sm font-bold text-primary">
            Score: {score}/{total}
          </p>
        )}
      </div>

      <div className="bg-surface rounded-2xl border border-border p-6 text-center">
        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">
          Reconstruct this sentence
        </p>
        <p className="text-xl font-semibold">{current.english}</p>
        <p className="text-sm text-muted mt-1.5">
          {current.chinese} · {current.pinyin}
        </p>
      </div>

      <div className="min-h-[80px] bg-surface rounded-2xl border-2 border-dashed border-border p-4">
        {selected.length === 0 ? (
          <p className="text-muted text-center py-4 font-medium">
            Click characters in the correct order...
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {selected.map((char, i) => (
              <span
                key={`${char}-${i}`}
                className={`px-3 py-2 text-xl font-bold rounded-lg ${
                  checked
                    ? isCorrect
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                    : "bg-primary-light text-primary-dark"
                }`}
              >
                {char}
              </span>
            ))}
          </div>
        )}
      </div>

      {checked && (
        <div
          className={`p-4 rounded-2xl text-center font-bold ${
            isCorrect
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {isCorrect ? "✓ Correct!" : (
            <>
              <p>Not quite. The correct sentence is:</p>
              <p className="text-xl mt-1">{current.example}</p>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {!checked ? (
          <>
            <button
              onClick={() => setSelected((prev) => prev.slice(0, -1))}
              disabled={selected.length === 0}
              className="px-5 py-2.5 rounded-xl font-bold bg-stone-100 text-foreground hover:bg-stone-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
            >
              Undo
            </button>
            <button
              onClick={handleCheck}
              disabled={remaining.length > 0}
              className="flex-1 py-2.5 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
            >
              Check
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-2.5 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
          >
            Next Sentence →
          </button>
        )}
      </div>

      {!checked && (
        <div>
          <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Characters</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {remaining.map((char, i) => (
              <button
                key={`${char}-${i}`}
                onClick={() => handleSelect(char)}
                className="px-4 py-2.5 bg-surface border border-border rounded-xl text-xl font-semibold hover:border-primary/40 hover:bg-primary-light/50 transition-all cursor-pointer active:scale-95"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PracticePage() {
  const { entries } = useVocab();
  const [mode, setMode] = useState<Mode>("free");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Sentence Practice</h1>
        <p className="text-muted text-lg">Build sentences with your vocabulary words.</p>
      </div>

      <div className="flex gap-2 justify-center">
        {(["free", "reconstruct"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
              mode === m
                ? "bg-primary text-white shadow-sm"
                : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-hover"
            }`}
          >
            {m === "free" ? "Free Practice" : "Reconstruction"}
          </button>
        ))}
      </div>

      {mode === "free" ? <FreePractice entries={entries} /> : <ReconstructGame entries={entries} />}
    </div>
  );
}
