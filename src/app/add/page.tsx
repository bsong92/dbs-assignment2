"use client";

import { useState } from "react";
import { useVocab } from "@/context/VocabContext";

const CATEGORIES = ["greetings", "food", "travel", "shopping", "numbers", "daily", "work", "other"];

export default function AddWordPage() {
  const { addEntry } = useVocab();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    chinese: "",
    pinyin: "",
    english: "",
    example: "",
    category: "other",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.chinese.trim() || !form.pinyin.trim() || !form.english.trim()) return;

    addEntry({
      chinese: form.chinese.trim(),
      pinyin: form.pinyin.trim(),
      english: form.english.trim(),
      example: form.example.trim() || undefined,
      category: form.category,
    });

    setForm({ chinese: "", pinyin: "", english: "", example: "", category: "other" });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-2">Add New Word</h1>
      <p className="text-muted mb-8">
        Add a Chinese word or phrase you want to remember.
      </p>

      {success && (
        <div className="mb-6 p-4 bg-primary/15 border border-primary/30 rounded-xl text-primary-dark font-medium text-center">
          Word added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="chinese" className="block text-sm font-semibold mb-1.5">
            Chinese Characters <span className="text-accent">*</span>
          </label>
          <input
            id="chinese"
            name="chinese"
            type="text"
            value={form.chinese}
            onChange={handleChange}
            placeholder="e.g. 你好"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
          />
        </div>

        <div>
          <label htmlFor="pinyin" className="block text-sm font-semibold mb-1.5">
            Pinyin <span className="text-accent">*</span>
          </label>
          <input
            id="pinyin"
            name="pinyin"
            type="text"
            value={form.pinyin}
            onChange={handleChange}
            placeholder="e.g. nǐ hǎo"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
          />
        </div>

        <div>
          <label htmlFor="english" className="block text-sm font-semibold mb-1.5">
            English Meaning <span className="text-accent">*</span>
          </label>
          <input
            id="english"
            name="english"
            type="text"
            value={form.english}
            onChange={handleChange}
            placeholder="e.g. hello"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
          />
        </div>

        <div>
          <label htmlFor="example" className="block text-sm font-semibold mb-1.5">
            Example Sentence <span className="text-muted text-xs">(optional)</span>
          </label>
          <textarea
            id="example"
            name="example"
            value={form.example}
            onChange={handleChange}
            placeholder="e.g. 你好，我叫Brian。"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold mb-1.5">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors text-lg cursor-pointer"
        >
          Add Word
        </button>
      </form>
    </div>
  );
}
