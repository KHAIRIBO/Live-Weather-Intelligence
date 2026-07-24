'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, User, MapPin, Globe, Loader2, Sparkles, ExternalLink } from 'lucide-react';

interface Comment {
  id: number;
  name: string;
  comment: string;
  city: string;
  country: string | null;
  created_at: string;
}

interface CommentsSectionProps {
  currentCity: string;
  currentCountry: string | null;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ currentCity, currentCountry }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'current'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = filterMode === 'current' 
        ? `/api/comments?city=${encodeURIComponent(currentCity)}`
        : '/api/comments';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to load comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while fetching comments.');
    } finally {
      setIsLoading(false);
    }
  }, [filterMode, currentCity]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          comment: text.trim(),
          city: currentCity,
          country: currentCountry,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit comment');
      }

      // Clear input and reload comments
      setText('');
      setSuccess(true);
      fetchComments();

      // Reset success status after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (nameStr: string) => {
    return nameStr
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';
  };

  const getRandomGradient = (nameStr: string) => {
    const gradients = [
      'from-sky-400 to-indigo-500',
      'from-amber-400 to-pink-500',
      'from-emerald-400 to-teal-500',
      'from-purple-400 to-indigo-500',
      'from-rose-400 to-orange-500',
    ];
    let sum = 0;
    for (let i = 0; i < nameStr.length; i++) {
      sum += nameStr.charCodeAt(i);
    }
    return gradients[sum % gradients.length];
  };

  return (
    <div className="w-full rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-2xl p-6 lg:p-8 relative overflow-hidden transition-all hover:border-sky-500/20">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Community Comments <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium">Live</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Share and see discussions about local weather conditions.</p>
          </div>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center p-1 bg-slate-950/60 rounded-xl border border-white/5 backdrop-blur-md">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'all'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Cities
          </button>
          <button
            onClick={() => setFilterMode('current')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              filterMode === 'current'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3 h-3" />
            {currentCity}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Comment Form */}
        <div className="lg:col-span-5 bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-sm font-semibold text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              Write a Comment
            </h3>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="commenter-name" className="text-xs font-medium text-slate-400 block">Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="commenter-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all font-medium"
                />
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1.5">
              <label htmlFor="comment-text" className="text-xs font-medium text-slate-400 block">Comment</label>
              <textarea
                id="comment-text"
                rows={4}
                placeholder={`Tell us about the weather in ${currentCity}... Is it hot? Windy? Rainy?`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={1000}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all resize-none font-medium leading-relaxed"
              />
            </div>

            {/* Form Info Badge */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 py-1 bg-slate-900/40 px-3 rounded-lg border border-white/5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Commenting for: </span>
              <strong className="text-sky-300 font-semibold">{currentCity}{currentCountry ? `, ${currentCountry}` : ''}</strong>
            </div>

            {/* Status alerts */}
            {error && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                ✓ Comment posted successfully!
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !text.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:shadow-sky-500/35 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Comment
                </>
              )}
            </button>
          </form>

          {/* Promotion/Studio Link */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <a
              href="https://khairibouzakher.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/5 to-indigo-500/5 border border-sky-500/10 text-xs font-semibold text-sky-300 hover:text-white hover:border-sky-500/30 transition-all"
            >
              <span>Visit khairibouzakher.studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Comments List */}
        <div className="lg:col-span-7 flex flex-col min-h-[350px] max-h-[480px]">
          {isLoading && comments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
              <p className="text-xs">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3 border border-dashed border-white/10 rounded-2xl p-6 text-center">
              <MessageSquare className="w-10 h-10 text-slate-600" />
              <div>
                <p className="text-sm font-semibold text-slate-400">No comments yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Be the first to share details for {filterMode === 'current' ? currentCity : 'the community'}!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getRandomGradient(comment.name)} flex items-center justify-center text-white text-xs font-bold shadow-md shadow-black/20`}>
                        {getInitials(comment.name)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{comment.name}</h4>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {new Date(comment.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Location Badge */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[10px] text-sky-300 font-semibold max-w-[120px] truncate">
                      <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span className="truncate">{comment.city}</span>
                    </div>
                  </div>

                  {/* Comment text */}
                  <p className="text-sm text-slate-300 font-medium leading-relaxed break-words pl-1">
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
