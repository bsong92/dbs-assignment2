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

  const addWord = (word: string) => {
    setSentence((prev) => [...prev, word]);
  };

  const removeWord = (index: number) => {
    setSentence((prev) => prev.filter((_, i) => i !== index));
  };

  const clear = () => setSentence([]);

  const reshuffleWords = () => {
    setShuffledWords(shuffle(entries.map((e) => e.chinese)));
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-lg">No words to practice with.</p>
        <Link href="/add" className="text-primary hover:underline">
          Add some words first
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-sm text-muted mb-4">
        Click words below to build a sentence. Practice forming Chinese phrases!
      </p>

      {/* Sentence area */}
      <div className="min-h-[100px] bg-surface rounded-2xl border-2 border-dashed border-border p-4 mb-4">
        {sentence.length === 0 ? (
          <p className="text-muted text-center py-6">
            Click words below to start building a sentence...
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sentence.map((word, i) => (
              <button
                key={`${word}-${i}`}
                onClick={() => removeWord(i)}
                className="px-3 py-2 bg-primary/15 text-primary font-bold text-lg rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer"
                title="Click to remove"
              >
                {word}
              </button>
            ))}
          </div>
        )}
      </div>

      {sentence.length > 0 && (
        <div className="mb-4 p-3 bg-surface rounded-xl border border-border">
          <p className="text-sm text-muted mb-1">Your sentence:</p>
          <p className="text-2xl font-bold">{sentence.join("")}</p>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <button
          onClick={clear}
          disabled={sentence.length === 0}
          className="px-4 py-2 rounded-xl font-medium bg-muted/20 text-foreground hover:bg-muted/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Clear
        </button>
        <button
          onClick={reshuffleWords}
          className="px-4 py-2 rounded-xl font-medium bg-muted/20 text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
        >
          Shuffle Words
        </button>
      </div>

      {/* Word bank */}
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
        Word Bank
      </p>
      <div className="flex flex-wrap gap-2">
        {shuffledWords.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => addWord(word)}
            className="px-3 py-2 bg-surface border border-border rounded-xl text-lg font-medium hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
          >
            {word}
          </button>
        ))}
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
        <p className="text-lg">No example sentences available.</p>
        <p className="text-sm mt-1">
          Add words with example sentences to play the reconstruction game.
        </p>
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
    if (idx !== -1) {
      setSelected((prev) => [...prev, char]);
    }
  };

  const handleUndo = () => {
    if (checked) return;
    setSelected((prev) => prev.slice(0, -1));
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
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">
          Sentence {(index % sentenceEntries.length) + 1} of{" "}
          {sentenceEntries.length}
        </p>
        {total > 0 && (
          <p className="text-sm font-medium text-primary">
            Score: {score}/{total}
          </p>
        )}
      </div>

      {/* Hint: show the English meaning */}
      <div className="bg-surface rounded-xl border border-border p-4 mb-4 text-center">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
          Translate this into Chinese
        </p>
        <p className="text-lg font-medium">{current.english}</p>
        <p className="text-sm text-muted mt-1">
          Word: {current.chinese} ({current.pinyin})
        </p>
      </div>

      {/* Build area */}
      <div className="min-h-[80px] bg-surface rounded-2xl border-2 border-dashed border-border p-4 mb-4">
        {selected.length === 0 ? (
          <p className="text-muted text-center py-4">
            Click characters below in the correct order...
          </p>
        ) : (
          <div className="flex flex-wrap gap-1 justify-center">
            {selected.map((char, i) => (
              <span
                key={`${char}-${i}`}
                className={`px-2.5 py-1.5 text-xl font-bold rounded-lg ${
                  checked
                    ? isCorrect
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                    : "bg-primary/15 text-primary"
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
          className={`mb-4 p-3 rounded-xl text-center font-medium ${
            isCorrect
              ? "bg-green-500/10 text-green-400 border border-green-500/30"
              : "bg-red-500/10 text-red-400 border border-red-500/30"
          }`}
        >
          {isCorrect ? (
            "Correct!"
          ) : (
            <>
              <p>Not quite. The correct sentence is:</p>
              <p className="text-lg font-bold mt-1">{current.example}</p>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {!checked ? (
          <>
            <button
              onClick={handleUndo}
              disabled={selected.length === 0}
              className="px-4 py-2 rounded-xl font-medium bg-muted/20 text-foreground hover:bg-muted/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Undo
            </button>
            <button
              onClick={handleCheck}
              disabled={remaining.length > 0}
              className="flex-1 py-2 rounded-xl font-medium bg-primary hover:bg-primary-dark text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Check
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-2 rounded-xl font-medium bg-primary hover:bg-primary-dark text-white transition-colors cursor-pointer"
          >
            Next Sentence
          </button>
        )}
      </div>

      {/* Scrambled characters */}
      {!checked && (
        <>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Characters
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {remaining.map((char, i) => (
              <button
                key={`${char}-${i}`}
                onClick={() => handleSelect(char)}
                className="px-3 py-2 bg-surface border border-border rounded-xl text-xl font-medium hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
              >
                {char}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PracticePage() {
  const { entries } = useVocab();
  const [mode, setMode] = useState<Mode>("free");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Sentence Practice</h1>
      <p className="text-muted mb-6">
        Build sentences with your vocabulary words.
      </p>

      <div className="flex gap-2 mb-8 justify-center">
        <button
          onClick={() => setMode("free")}
          className={`px-5 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
            mode === "free"
              ? "bg-primary text-white"
              : "bg-surface border border-border text-foreground hover:bg-muted/10"
          }`}
        >
          Free Practice
        </button>
        <button
          onClick={() => setMode("reconstruct")}
          className={`px-5 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
            mode === "reconstruct"
              ? "bg-primary text-white"
              : "bg-surface border border-border text-foreground hover:bg-muted/10"
          }`}
        >
          Reconstruction
        </button>
      </div>

      {mode === "free" ? (
        <FreePractice entries={entries} />
      ) : (
        <ReconstructGame entries={entries} />
      )}
    </div>
  );
}
