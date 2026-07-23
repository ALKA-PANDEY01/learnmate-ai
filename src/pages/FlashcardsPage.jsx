import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Heart,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trash2,
  Bookmark,
  CheckCircle,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';
import api from '../services/api';
import { useRoadmap } from '../context/RoadmapContext';

export default function FlashcardsPage() {
  const { roadmap } = useRoadmap();
  
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingTopic, setGeneratingTopic] = useState('');
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, favorites, review

  const fetchFlashcards = async () => {
    try {
      const response = await api.get('/flashcards', {
        params: {
          goalId: roadmap?.id
        }
      });
      if (response.success && response.flashcards) {
        setFlashcards(response.flashcards);
      }
    } catch (err) {
      console.warn("Failed to load flashcards:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [roadmap]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!generatingTopic || !roadmap) return;

    setIsGenerating(true);
    try {
      const response = await api.post('/flashcards/generate', {
        goalId: roadmap.id,
        topic: generatingTopic
      });
      if (response.success && response.flashcards) {
        setFlashcards(prev => [...response.flashcards, ...prev]);
        setGeneratingTopic('');
        setCurrentIdx(0);
        setIsFlipped(false);
        alert(`Successfully generated 5 new flashcards for "${generatingTopic}"!`);
      }
    } catch (err) {
      console.error(err);
      alert("AI Flashcard generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleFavorite = async (id, isFav) => {
    try {
      const response = await api.patch(`/flashcards/${id}`, { favorite: !isFav });
      if (response.success) {
        setFlashcards(prev =>
          prev.map(f => (f._id === id ? { ...f, favorite: !isFav } : f))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRateSpacedRepetition = async (id, difficulty) => {
    try {
      const response = await api.patch(`/flashcards/${id}`, { difficulty });
      if (response.success) {
        setFlashcards(prev =>
          prev.map(f => (f._id === id ? { ...f, difficulty } : f))
        );
        // Advance to next card automatically for seamless flow
        handleNext();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?")) return;

    try {
      const response = await api.delete(`/flashcards/${id}`);
      if (response.success) {
        setFlashcards(prev => prev.filter(f => f._id !== id));
        if (currentIdx >= Math.max(1, flashcards.length - 1)) {
          setCurrentIdx(0);
        }
        setIsFlipped(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIdx(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIdx(prev => (prev < filteredCards.length - 1 ? prev + 1 : 0));
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIdx(prev => (prev > 0 ? prev - 1 : filteredCards.length - 1));
  };

  // Filter conditions
  const filteredCards = flashcards.filter(card => {
    // Tab filters
    if (activeTab === 'favorites' && !card.favorite) return false;
    if (activeTab === 'review') {
      const isDue = new Date(card.nextReviewDate) <= new Date();
      if (!isDue) return false;
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        card.question.toLowerCase().includes(query) ||
        card.answer.toLowerCase().includes(query) ||
        card.category.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const activeCard = filteredCards[currentIdx];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-pulse">
        <div className="h-8 bg-border/40 w-1/3 rounded-lg" />
        <div className="h-64 bg-border/30 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      <SEO title="Flashcards" description="Review study cards dynamically generated by AI with spaced repetition." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
            <Bookmark className="text-primary" size={24} />
            <span>AI Flashcard Decks</span>
          </h1>
          <p className="text-sm text-muted">
            Create card decks using Gemini, review concepts, and study with spaced repetition.
          </p>
        </div>
      </div>

      {/* Generate Flashcards Form */}
      {roadmap ? (
        <Card isGlass={true} padding="md" className="border-border/50 bg-primary/5">
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-bold text-foreground">Generate New Deck on Topic</label>
              <input
                type="text"
                placeholder="e.g. React hooks memoization, async middleware"
                value={generatingTopic}
                onChange={e => setGeneratingTopic(e.target.value)}
                disabled={isGenerating}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isGenerating || !generatingTopic}
              variant="primary"
              className="h-10 px-6 font-semibold"
              iconLeft={isGenerating ? <RefreshCw className="animate-spin" size={15} /> : <Sparkles size={15} />}
            >
              {isGenerating ? 'Generating 5 cards...' : 'Generate with AI'}
            </Button>
          </form>
        </Card>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs flex gap-3 items-center">
          <AlertTriangle className="shrink-0" size={16} />
          <span>Please create or select an active goal first to generate flashcard decks.</span>
        </div>
      )}

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-card/45 border border-border/50 p-2 rounded-2xl">
        <div className="flex bg-background/60 p-1 rounded-xl border text-xs font-semibold">
          {[
            { key: 'all', label: 'All Cards' },
            { key: 'favorites', label: 'Favorites ❤️' },
            { key: 'review', label: 'Due for Review ⏳' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setCurrentIdx(0); setIsFlipped(false); }}
              className={`px-4 py-1.5 rounded-lg transition-colors ${
                activeTab === tab.key ? 'bg-primary text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-muted" size={15} />
          <input
            type="text"
            placeholder="Search deck..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentIdx(0); setIsFlipped(false); }}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted"
          />
        </div>
      </div>

      {/* Main Flashcard View */}
      {filteredCards.length > 0 && activeCard ? (
        <div className="space-y-6">
          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 w-full cursor-pointer h-72 group"
          >
            <div className={`
              relative w-full h-full duration-500 preserve-3d transition-transform rounded-3xl border border-border/80 shadow-lg p-6 flex flex-col justify-between
              ${isFlipped ? 'rotate-y-180 bg-secondary/5 border-secondary/25' : 'bg-card'}
            `}>
              {/* CARD FRONT */}
              <div className="absolute inset-0 backface-hidden p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted uppercase">
                  <span>Topic: {activeCard.category}</span>
                  <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                    Front
                  </span>
                </div>
                <div className="text-center py-4 px-2">
                  <h3 className="text-lg font-bold font-display text-foreground leading-snug">
                    {activeCard.question}
                  </h3>
                </div>
                <div className="text-center text-[10px] text-muted font-semibold tracking-wider uppercase">
                  Click to Flip & Reveal Answer
                </div>
              </div>

              {/* CARD BACK */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted uppercase">
                  <span>Category: {activeCard.category}</span>
                  <span className="bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full">
                    Back
                  </span>
                </div>
                <div className="text-center py-4 px-2">
                  <p className="text-sm text-foreground/90 leading-relaxed font-semibold">
                    {activeCard.answer}
                  </p>
                </div>
                <div className="text-center text-[10px] text-muted font-semibold tracking-wider uppercase">
                  Click to Flip to Question
                </div>
              </div>
            </div>
          </div>

          {/* Spaced Repetition Rating Panel (only shows when card is flipped!) */}
          {isFlipped && (
            <div className="p-4 rounded-2xl bg-card border border-border/50 flex flex-col sm:flex-row gap-3 items-center justify-between text-center sm:text-left animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">How well did you know this?</h4>
                <p className="text-[10px] text-muted">Spaced repetition updates study schedules automatically.</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); handleRateSpacedRepetition(activeCard._id, 'hard'); }}
                  className="text-red-500 border-red-500/20 hover:bg-red-500/10 text-xs px-4"
                >
                  Hard ❌
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); handleRateSpacedRepetition(activeCard._id, 'medium'); }}
                  className="text-primary border-primary/20 hover:bg-primary/10 text-xs px-4"
                >
                  Medium ⚡
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); handleRateSpacedRepetition(activeCard._id, 'easy'); }}
                  className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 text-xs px-4"
                >
                  Easy ✓
                </Button>
              </div>
            </div>
          )}

          {/* Flashcards Navigation Row */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="glass"
                size="sm"
                onClick={handleShuffle}
                iconLeft={<RefreshCw size={13} />}
              >
                Shuffle
              </Button>
              <Button
                variant="glass"
                size="sm"
                className={`text-red-500 border-red-500/15 ${activeCard.favorite ? 'bg-red-500/10' : ''}`}
                onClick={() => handleToggleFavorite(activeCard._id, activeCard.favorite)}
                iconLeft={<Heart size={13} fill={activeCard.favorite ? 'currentColor' : 'none'} />}
              >
                {activeCard.favorite ? 'Unfavorite' : 'Favorite'}
              </Button>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-muted">
              <button
                onClick={handlePrevious}
                className="p-2 rounded-xl hover:bg-card border border-border/50 text-foreground"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{currentIdx + 1} of {filteredCards.length}</span>
              <button
                onClick={handleNext}
                className="p-2 rounded-xl hover:bg-card border border-border/50 text-foreground"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:bg-red-500/10"
              onClick={() => handleDeleteCard(activeCard._id)}
              iconLeft={<Trash2 size={13} />}
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-16 border border-border/50 text-center space-y-4">
          <div className="text-4xl">🎴</div>
          <p className="text-sm font-semibold text-muted">No flashcards found matching filters.</p>
          <p className="text-xs text-muted/80 max-w-sm mx-auto">Generate dynamic Q&A study cards based on your active roadmap topic using the AI builder at the top.</p>
        </div>
      )}
    </div>
  );
}
