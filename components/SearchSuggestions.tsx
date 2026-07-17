import { useEffect, useRef, useState } from "react";
import API from "../utils/api";

type Suggestion = {
  value: string;
  label: string;
  description?: string;
  type?: string;
};

interface SearchSuggestionsProps {
  query: string;
  onSelect: (value: string) => void;
}

export default function SearchSuggestions({ query, onSelect }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await API.get("/ai/suggestions", {
          params: { q: query.trim() },
        });

        const data = res.data?.data || [];
        setSuggestions(Array.isArray(data) ? data : []);
        setOpen(Array.isArray(data) && data.length > 0);
      } catch (error) {
        console.error("Search suggestion error:", error);
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!open && !loading) {
    return null;
  }

  return (
    <div ref={containerRef} className="absolute inset-x-0 top-full z-20 mt-2 rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
      {loading ? (
        <div className="p-4 text-sm text-slate-500 dark:text-slate-300">Looking for relevant topics…</div>
      ) : suggestions.length === 0 ? (
        <div className="p-4 text-sm text-slate-500 dark:text-slate-300">No suggestions found. Try keywords like Solar, Plastic Recycling or Urban Farming.</div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {suggestions.map((suggestion) => (
            <button
              key={`${suggestion.type}-${suggestion.value}`}
              type="button"
              onClick={() => {
                onSelect(suggestion.value);
                setOpen(false);
              }}
              className="w-full px-4 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{suggestion.value}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{suggestion.label}</p>
                </div>
                {suggestion.type && (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {suggestion.type}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
