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
        <p className="text-lg">No words to review.</p>
        <Link href="/add" className="text-primary hover:underline">
          Add some words first
        </Link>
      </div>
    );
  }

  const current = deck[index % deck.length];
  const progress = index + 1;
  const total = deck.length;

  const handleNext = () => {
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (index > 0) {
      setFlipped(false);
      setIndex((i) => i - 1);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <p className="text-sm text-muted text-center mb-4">
        Card {((index % total) + 1)} of {total}
      </p>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full min-h-[280px] bg-surface rounded-2xl border-2 border-border hover:border-primary/40 transition-all p-8 flex flex-col items-center justify-center cursor-pointer"
      >
        {!flipped ? (
          <>
            <p className="text-5xl font-bold mb-4">{current.chinese}</p>
            <p className="text-sm text-muted">Tap to reveal</p>
          </>
        ) : (
          <>
            <p className="text-3xl font-bold mb-2">{current.chinese}</p>
            <p className="text-lg text-muted mb-1">{current.pinyin}</p>
            <p className="text-xl">{current.english}</p>
            {current.example && (
              <p className="text-sm text-muted mt-3 italic">{current.example}</p>
            )}
          </>
        )}
      </button>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="flex-1 py-2.5 px-4 rounded-xl font-medium bg-muted/20 text-foreground hover:bg-muted/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-2.5 px-4 rounded-xl font-medium bg-primary hover:bg-primary-dark text-white transition-colors cursor-pointer"
        >
          {progress >= total ? "Restart" : "Next"}
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
      const wrongOptions = shuffle(
        entries.filter((e) => e.id !== entry.id)
      ).slice(0, 3);
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
        <p className="text-lg">Need at least 2 words for quiz mode.</p>
        <Link href="/add" className="text-primary hover:underline">
          Add more words
        </Link>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <p className="text-5xl font-bold mb-4">
          {score}/{questions.length}
        </p>
        <p className="text-xl text-muted mb-2">
          {score === questions.length
            ? "Perfect score!"
            : score >= questions.length * 0.7
            ? "Great job!"
            : "Keep practicing!"}
        </p>
        <p className="text-muted mb-6">
          You got {score} out of {questions.length} correct.
        </p>
        <button
          onClick={() => {
            setCurrentQ(0);
            setSelected(null);
            setScore(0);
            setFinished(false);
          }}
          className="py-2.5 px-6 rounded-xl font-medium bg-primary hover:bg-primary-dark text-white transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (q.options[optionIndex].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <p className="text-sm text-muted text-center mb-4">
        Question {currentQ + 1} of {questions.length}
      </p>

      <div className="bg-surface rounded-2xl border border-border p-8 text-center mb-6">
        <p className="text-4xl font-bold mb-2">{q.entry.chinese}</p>
        <p className="text-muted">{q.entry.pinyin}</p>
      </div>

      <p className="text-sm font-semibold text-muted mb-3">
        What does this mean?
      </p>

      <div className="grid gap-2">
        {q.options.map((option, i) => {
          let style = "bg-surface border-border hover:border-primary/40";
          if (selected !== null) {
            if (option.correct) {
              style = "bg-green-500/10 border-green-500 text-green-400";
            } else if (i === selected && !option.correct) {
              style = "bg-red-500/10 border-red-500 text-red-400";
            } else {
              style = "bg-surface border-border opacity-50";
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left p-3.5 rounded-xl border-2 font-medium transition-all cursor-pointer disabled:cursor-default ${style}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full mt-4 py-2.5 px-4 rounded-xl font-medium bg-primary hover:bg-primary-dark text-white transition-colors cursor-pointer"
        >
          {currentQ + 1 >= questions.length ? "See Results" : "Next Question"}
        </button>
      )}
    </div>
  );
}

export default function ReviewPage() {
  const { entries } = useVocab();
  const [mode, setMode] = useState<Mode>("flashcard");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Review</h1>
      <p className="text-muted mb-6">Practice and reinforce your vocabulary.</p>

      <div className="flex gap-2 mb-8 justify-center">
        <button
          onClick={() => setMode("flashcard")}
          className={`px-5 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
            mode === "flashcard"
              ? "bg-primary text-white"
              : "bg-surface border border-border text-foreground hover:bg-muted/10"
          }`}
        >
          Flashcards
        </button>
        <button
          onClick={() => setMode("quiz")}
          className={`px-5 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
            mode === "quiz"
              ? "bg-primary text-white"
              : "bg-surface border border-border text-foreground hover:bg-muted/10"
          }`}
        >
          Quiz
        </button>
      </div>

      {mode === "flashcard" ? (
        <FlashcardMode entries={entries} />
      ) : (
        <QuizMode entries={entries} />
      )}
    </div>
  );
}
