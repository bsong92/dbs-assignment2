"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useVocab, VocabEntry } from "@/context/VocabContext";

type Mode = "flashcard" | "quiz";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function FlashcardMode({ entries }: { entries: VocabEntry[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [deck] = useState(() => shuffle(entries));

  if (deck.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-xl font-medium">No words to review.</p>
        <Link href="/add" className="text-primary hover:underline font-semibold mt-2 inline-block">
          Add some words first →
        </Link>
      </div>
    );
  }

  const current = deck[index % deck.length];
  const progress = index + 1;
  const total = deck.length;

  return (
    <div className="max-w-md mx-auto">
      <p className="text-sm text-muted text-center mb-5 font-medium">
        Card {((index % total) + 1)} of {total}
      </p>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full min-h-[300px] bg-surface rounded-2xl border-2 border-border hover:border-primary/30 transition-all duration-300 p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg group"
      >
        {!flipped ? (
          <>
            <p className="text-6xl font-extrabold mb-4 group-hover:scale-105 transition-transform">
              {current.chinese}
            </p>
            <p className="text-sm text-muted font-medium">Tap to reveal</p>
          </>
        ) : (
          <>
            <p className="text-4xl font-extrabold mb-2">{current.chinese}</p>
            <p className="text-lg text-muted mb-1">{current.pinyin}</p>
            <p className="text-xl font-medium">{current.english}</p>
            {current.example && (
              <p className="text-sm text-muted mt-4 italic">&ldquo;{current.example}&rdquo;</p>
            )}
          </>
        )}
      </button>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => { setFlipped(false); setIndex((i) => Math.max(0, i - 1)); }}
          disabled={index === 0}
          className="flex-1 py-3 px-4 rounded-xl font-bold bg-stone-100 text-foreground hover:bg-stone-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
        >
          ← Previous
        </button>
        <button
          onClick={() => { setFlipped(false); setIndex((i) => i + 1); }}
          className="flex-1 py-3 px-4 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          {progress >= total ? "Restart" : "Next →"}
        </button>
      </div>
    </div>
  );
}

function QuizMode({ entries }: { entries: VocabEntry[] }) {
  const questions = useMemo(() => {
    if (entries.length < 2) return [];
    const shuffled = shuffle(entries);
    return shuffled.map((entry) => {
      const wrongOptions = shuffle(entries.filter((e) => e.id !== entry.id)).slice(0, 3);
      const options = shuffle([
        { text: entry.english, correct: true },
        ...wrongOptions.map((w) => ({ text: w.english, correct: false })),
      ]);
      return { entry, options };
    });
  }, [entries]);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (entries.length < 2) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-xl font-medium">Need at least 2 words for quiz mode.</p>
        <Link href="/add" className="text-primary hover:underline font-semibold mt-2 inline-block">
          Add more words →
        </Link>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-16 max-w-sm mx-auto">
        <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-extrabold text-primary">{percent}%</span>
        </div>
        <p className="text-2xl font-extrabold mb-2">
          {score === questions.length ? "Perfect!" : score >= questions.length * 0.7 ? "Great job!" : "Keep practicing!"}
        </p>
        <p className="text-muted mb-8">
          You got {score} out of {questions.length} correct.
        </p>
        <button
          onClick={() => { setCurrentQ(0); setSelected(null); setScore(0); setFinished(false); }}
          className="py-3 px-8 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          Try Again
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (q.options[i].correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) setFinished(true);
    else { setCurrentQ((c) => c + 1); setSelected(null); }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-stone-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-sm text-muted text-center mb-5 font-medium">
        Question {currentQ + 1} of {questions.length}
      </p>

      <div className="bg-surface rounded-2xl border border-border p-8 text-center mb-6">
        <p className="text-5xl font-extrabold mb-2">{q.entry.chinese}</p>
        <p className="text-muted font-medium">{q.entry.pinyin}</p>
      </div>

      <p className="text-sm font-bold text-muted uppercase tracking-widest mb-3">
        What does this mean?
      </p>

      <div className="grid gap-2.5">
        {q.options.map((option, i) => {
          let style = "bg-surface border-border hover:border-primary/30 hover:shadow-sm";
          if (selected !== null) {
            if (option.correct) {
              style = "bg-green-50 border-green-500 text-green-800 shadow-sm";
            } else if (i === selected && !option.correct) {
              style = "bg-red-50 border-red-500 text-red-800 shadow-sm";
            } else {
              style = "bg-surface border-border opacity-40";
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left p-4 rounded-xl border-2 font-semibold transition-all duration-200 cursor-pointer disabled:cursor-default ${style}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full mt-5 py-3 px-4 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          {currentQ + 1 >= questions.length ? "See Results" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

export default function ReviewPage() {
  const { entries } = useVocab();
  const [mode, setMode] = useState<Mode>("flashcard");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Review</h1>
        <p className="text-muted text-lg">Practice and reinforce your vocabulary.</p>
      </div>

      <div className="flex gap-2 justify-center">
        {(["flashcard", "quiz"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer capitalize ${
              mode === m
                ? "bg-primary text-white shadow-sm"
                : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-hover"
            }`}
          >
            {m === "flashcard" ? "Flashcards" : "Quiz"}
          </button>
        ))}
      </div>

      {mode === "flashcard" ? <FlashcardMode entries={entries} /> : <QuizMode entries={entries} />}
    </div>
  );
}
