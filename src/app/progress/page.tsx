"use client";

import { useVocab } from "@/context/VocabContext";

export default function ProgressPage() {
  const { entries } = useVocab();

  const totalWords = entries.length;
  const masteredWords = entries.filter((e) => e.mastered).length;
  const learningWords = totalWords - masteredWords;
  const masteryPercent = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

  // Category breakdown
  const categories = [...new Set(entries.map((e) => e.category))].sort();
  const categoryStats = categories.map((cat) => {
    const words = entries.filter((e) => e.category === cat);
    const mastered = words.filter((e) => e.mastered).length;
    return {
      name: cat,
      total: words.length,
      mastered,
      percent: words.length > 0 ? Math.round((mastered / words.length) * 100) : 0,
    };
  });

  // Recently mastered
  const recentlyMastered = entries
    .filter((e) => e.mastered)
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Progress</h1>
      <p className="text-muted mb-8">Track your Chinese learning journey.</p>

      {/* Overall mastery */}
      <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Overall Mastery</h2>
          <span className="text-2xl font-bold text-primary-dark">
            {masteryPercent}%
          </span>
        </div>
        <div className="w-full h-4 bg-muted/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${masteryPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 text-sm text-muted">
          <span>{masteredWords} mastered</span>
          <span>{learningWords} learning</span>
          <span>{totalWords} total</span>
        </div>
      </div>

      {/* Word status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface rounded-xl border border-border p-5 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 mb-2">
            <span className="text-xl">&#10003;</span>
          </div>
          <p className="text-2xl font-bold text-primary-dark">{masteredWords}</p>
          <p className="text-sm text-muted">Mastered</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/15 mb-2">
            <span className="text-xl">&#9998;</span>
          </div>
          <p className="text-2xl font-bold text-accent">{learningWords}</p>
          <p className="text-sm text-muted">Still Learning</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">By Category</h2>
        {categoryStats.length === 0 ? (
          <p className="text-muted text-center py-4">No categories yet.</p>
        ) : (
          <div className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium capitalize">
                    {cat.name}
                  </span>
                  <span className="text-xs text-muted">
                    {cat.mastered}/{cat.total} mastered ({cat.percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-muted/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently mastered */}
      {recentlyMastered.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="text-lg font-bold mb-4">Mastered Words</h2>
          <div className="grid gap-2">
            {recentlyMastered.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-primary/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold">{entry.chinese}</span>
                  <span className="text-sm text-muted">{entry.pinyin}</span>
                </div>
                <span className="text-sm text-foreground">{entry.english}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
