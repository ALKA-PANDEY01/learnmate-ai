import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Award,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  BookOpen,
  ArrowLeft,
  AlertTriangle,
  Play
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';
import api from '../services/api';
import { useRoadmap } from '../context/RoadmapContext';

export default function QuizPage() {
  const { roadmap, refreshRoadmap } = useRoadmap();
  
  // Quiz flow states
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  
  const [remediated, setRemediated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptDetails, setAttemptDetails] = useState(null);

  // Pre-fill topic if roadmap has pending tasks
  useEffect(() => {
    if (roadmap && roadmap.weeks) {
      // Find first pending task to suggest
      for (const week of roadmap.weeks) {
        const pending = week.tasks?.find(t => t.status === 'pending');
        if (pending) {
          setTopic(pending.title);
          break;
        }
      }
    }
  }, [roadmap]);

  const handleStartQuiz = async () => {
    if (!topic || !roadmap) return;

    setLoading(true);
    try {
      const response = await api.post('/quizzes/generate', {
        goalId: roadmap.id,
        topic
      });

      if (response.success && response.quiz) {
        // Standardize structure for options (handling arrays of strings or objects)
        const formatted = response.quiz.map(q => ({
          ...q,
          options: q.options.map(o => typeof o === 'string' ? o : o.text || '')
        }));
        setQuestions(formatted);
        setQuizStarted(true);
        setCurrentIdx(0);
        setAnswers({});
        setSelectedOpt(null);
        setIsFinished(false);
      }
    } catch (err) {
      alert("Failed to generate quiz. Make sure your Gemini API keys are configured correctly.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionText) => {
    setSelectedOpt(optionText);
  };

  const handleNext = async () => {
    if (!selectedOpt) return;

    const currentQuestion = questions[currentIdx];
    const updatedAnswers = { ...answers, [currentQuestion.id]: selectedOpt };
    setAnswers(updatedAnswers);
    setSelectedOpt(null);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      setIsSubmitting(true);

      try {
        const response = await api.post('/quizzes/submit', {
          goalId: roadmap.id,
          topic,
          questions,
          answers: updatedAnswers
        });

        if (response.success) {
          setAttemptDetails(response.attempt);
          setRemediated(response.remediated);
          if (response.remediated) {
            await refreshRoadmap();
          }
        }
      } catch (err) {
        console.error("Failed to submit quiz results", err.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setIsFinished(false);
    setQuestions([]);
    setAnswers({});
    setSelectedOpt(null);
    setAttemptDetails(null);
  };

  const currentQuestion = questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      <SEO title="Knowledge Quiz" description="Take quizzes, validate understanding, and explore detailed explanations." />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
          Knowledge Quiz 🧠
        </h1>
        <p className="text-sm text-muted">
          Validate your core frontend development and AI agent concepts.
        </p>
      </div>

      {!quizStarted && (
        <Card isGlass={true} padding="lg" className="border-border/50 shadow-md space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold font-display text-foreground">Generate a Practice Quiz</h3>
            <p className="text-xs text-muted leading-relaxed">
              Input any topic from your learning path. Gemini will dynamically generate a 5-question test with multiple choice, true/false, and fill-in-the-blanks challenges.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-foreground">Quiz Subject / Topic</label>
            <input
              type="text"
              placeholder="e.g. React hooks, Redux middlewares, Mongoose indexes"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted"
            />
          </div>

          <Button
            onClick={handleStartQuiz}
            disabled={loading || !topic || !roadmap}
            className="w-full h-11 font-bold"
            iconLeft={loading ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
          >
            {loading ? 'Generating Dynamic Quiz Questions...' : 'Start Dynamic Quiz'}
          </Button>
        </Card>
      )}

      {quizStarted && !isFinished && currentQuestion && (
        <Card isGlass={true} padding="lg" className="border-border/50 shadow-md">
          {/* Progress bar */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-xs font-semibold text-muted">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span>{Math.round(((currentIdx) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-border/40 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
              <HelpCircle size={16} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground font-display leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              currentQuestion.options.map((opt, i) => {
                const isSelected = selectedOpt === opt;
                return (
                  <label
                    key={i}
                    className={`
                      flex items-center gap-3 p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all duration-200
                      ${isSelected
                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                        : 'border-border/60 hover:bg-card/70 text-muted hover:text-foreground'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="quiz-option"
                      checked={isSelected}
                      onChange={() => handleOptionSelect(opt)}
                      className="sr-only"
                    />
                    <span className={`w-5 h-5 rounded-lg border text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary text-white border-primary' : 'border-border bg-background'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </label>
                );
              })
            ) : (
              // Handle fill in the blank response text box
              <input
                type="text"
                placeholder="Type your answer here..."
                value={selectedOpt || ''}
                onChange={e => setSelectedOpt(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted"
              />
            )}
          </div>

          {/* Nav trigger */}
          <div className="flex justify-end pt-2 border-t border-border/40">
            <Button
              onClick={handleNext}
              disabled={!selectedOpt}
              iconRight={<ArrowRight size={15} />}
            >
              {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        </Card>
      )}

      {quizStarted && isFinished && (
        <div className="space-y-6">
          <Card isGlass={true} padding="lg" className="border-border/50 text-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-transparent pointer-events-none" />
            
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 text-2xl mb-4 animate-bounce">
              <Award size={32} />
            </div>

            <h2 className="text-2xl font-bold font-display text-foreground">Quiz Results Summary</h2>
            <p className="text-sm text-muted mt-1 max-w-sm mx-auto">Great effort! Take a look at your grades and detailed answer explanations below.</p>

            {/* Remediation Nudge Alert */}
            {remediated && (
              <div className="max-w-md mx-auto mt-6 p-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 text-amber-500 text-left text-xs flex gap-3 items-start animate-in slide-in-from-top-4 duration-300">
                <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <p className="font-bold">Adaptive Remediation Triggered</p>
                  <p className="text-muted leading-relaxed">
                    Because you scored below 60%, LearnMate AI has updated your active roadmap with focused revision tasks and recommended resources in your next week layout.
                  </p>
                  <Link to="/dashboard/roadmap" className="inline-block font-semibold underline mt-1 text-primary">
                    View Revised Roadmap
                  </Link>
                </div>
              </div>
            )}

            {/* Score Stats Row */}
            {attemptDetails && (
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-8 p-4 rounded-2xl border border-border bg-background/40">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-semibold text-muted uppercase">Final Score</span>
                  <p className="text-2xl font-extrabold text-primary font-display">{attemptDetails.score}%</p>
                </div>
                <div className="text-center space-y-1 border-l border-border/60">
                  <span className="text-[10px] font-semibold text-muted uppercase">Correct</span>
                  <p className="text-2xl font-extrabold text-secondary font-display">{attemptDetails.correctAnswers}</p>
                </div>
                <div className="text-center space-y-1 border-l border-border/60">
                  <span className="text-[10px] font-semibold text-muted uppercase">Total Questions</span>
                  <p className="text-2xl font-extrabold text-foreground font-display">{attemptDetails.totalQuestions}</p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={resetQuiz} variant="primary" iconLeft={<RefreshCw size={15} />}>
                Try Another Topic
              </Button>
              <Link to="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </Card>

          {/* Detailed Explanations Review */}
          {attemptDetails?.feedback && (
            <div className="space-y-4">
              <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2 px-1">
                <BookOpen size={16} className="text-primary" />
                <span>AI Detailed Explanations</span>
              </h3>

              <Card isGlass={true} padding="md" className="border-border/50">
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex gap-2.5">
                  <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-primary uppercase">Tutor Explanations & Review Tips</span>
                    <p className="text-xs text-foreground/95 leading-relaxed whitespace-pre-line">
                      {attemptDetails.feedback.explanation}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
