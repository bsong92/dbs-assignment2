"use client";

import { useVocab } from "@/context/VocabContext";

export default function ProgressPage() {
  const { entries } = useVocab();

  const totalWords = entries.length;
  const masteredWords = entries.filter((e) => e.mastered).length;
  const learningWords = totalWords - masteredWords;
  const masteryPercent = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

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

  const recentlyMastered = entries.filter((e) => e.mastered).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Progress</h1>
        <p className="text-muted text-lg">Track your Chinese learning journey.</p>
      </div>

      {/* Overall mastery */}
      <div className="bg-surface rounded-2xl border border-border p-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-muted uppercase tracking-widest mb-1">
              Overall Mastery
            </p>
            <p className="text-5xl font-extrabold text-primary">{masteryPercent}%</p>
          </div>
          <div className="text-right text-sm text-muted space-y-0.5">
            <p><span className="font-bold text-foreground">{masteredWords}</span> mastered</p>
            <p><span className="font-bold text-foreground">{learningWords}</span> learning</p>
            <p><span className="font-bold text-foreground">{totalWords}</span> total</p>
          </div>
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${masteryPercent}%` }}
          />
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface rounded-2xl border border-border p-6 text-center hover:shadow-md hover:border-border-hover transition-all">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light mb-3">
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-3xl font-extrabold text-primary">{masteredWords}</p>
          <p className="text-sm text-muted font-medium mt-1">Mastered</p>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-6 text-center hover:shadow-md hover:border-border-hover transition-all">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-light mb-3">
            <span className="text-2xl">✎</span>
          </div>
          <p className="text-3xl font-extrabold text-accent">{learningWords}</p>
          <p className="text-sm text-muted font-medium mt-1">Still Learning</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-surface rounded-2xl border border-border p-8">
        <p className="text-sm font-bold text-muted uppercase tracking-widest mb-6">
          By Category
        </p>
        {categoryStats.length === 0 ? (
          <p className="text-muted text-center py-8 font-medium">No categories yet.</p>
        ) : (
          <div className="space-y-5">
            {categoryStats.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold capitalize">{cat.name}</span>
                  <span className="text-xs text-muted font-medium">
                    {cat.mastered}/{cat.total} · {cat.percent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
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
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="p-6 pb-0">
            <p className="text-sm font-bold text-muted uppercase tracking-widest">
              Mastered Words
            </p>
          </div>
          <div className="divide-y divide-border mt-4">
            {recentlyMastered.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 px-6"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold w-14 text-center">{entry.chinese}</span>
                  <span className="text-sm text-muted">{entry.pinyin}</span>
                </div>
                <span className="text-sm font-medium">{entry.english}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
