import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';

const QUESTIONS = [
  {
    id: 1,
    question: "Which of the following is true about Tailwind CSS v4?",
    options: [
      { key: "A", text: "It requires configuration via tailwind.config.js." },
      { key: "B", text: "It uses a native CSS-first configuration parser and `@import 'tailwindcss';` syntax." },
      { key: "C", text: "It drops support for dark: modifier variants." },
      { key: "D", text: "It compiles solely on runtime in the client-side browser." }
    ],
    answer: "B",
    explanation: "Tailwind CSS v4 introduces a new Rust-based engine that parses theme configurations directly in CSS files using standard CSS variables and directives rather than relying on a separate JavaScript tailwind.config.js file."
  },
  {
    id: 2,
    question: "What is the primary role of the React Fiber reconciler?",
    options: [
      { key: "A", text: "To directly paint DOM nodes on screen coordinates." },
      { key: "B", text: "To enable incremental rendering by splitting reconciliations into work units." },
      { key: "C", text: "To replace CSS styling stylesheets." },
      { key: "D", text: "To handle Axios networks request intercepts." }
    ],
    answer: "B",
    explanation: "React Fiber reconciler splits reconciliation work into units (fibers), allowing React to pause, reuse, or abort updates, optimizing frame rate consistency during heavy UI renders."
  },
  {
    id: 3,
    question: "How does React Router guard routes in ProtectedRoute configurations?",
    options: [
      { key: "A", text: "By using browser window.close() commands." },
      { key: "B", text: "By checking authentication context and returning a Navigate redirect component." },
      { key: "C", text: "By hashing passwords in local storage." },
      { key: "D", text: "By preventing webpack compile configurations." }
    ],
    answer: "B",
    explanation: "Protected Route guards check authorization context variables in their render scopes. If the user session is absent, it returns a `<Navigate to='/login' replace />` component, aborting access to child dashboard layouts."
  },
  {
    id: 4,
    question: "Which hook should you implement to execute cleanups when components unmount in React?",
    options: [
      { key: "A", text: "useMemo(() => data, [])" },
      { key: "B", text: "useEffect(() => { return () => cleanup(); }, [])" },
      { key: "C", text: "useCallback(() => fn, [])" },
      { key: "D", text: "useRef(null)" }
    ],
    answer: "B",
    explanation: "If you return a function from the callback passed to `useEffect`, React will call it when the component unmounts. An empty dependency array ensures this effect and its cleanup run only once on mount and unmount."
  },
  {
    id: 5,
    question: "In Axios configuration, what are 'interceptors' used for?",
    options: [
      { key: "A", text: "To intercept compile errors in Vite development servers." },
      { key: "B", text: "To mutate request headers (e.g. adding tokens) or response payloads globally." },
      { key: "C", text: "To prevent users from resizing browser screens." },
      { key: "D", text: "To compile index.css stylesheets." }
    ],
    answer: "B",
    explanation: "Axios interceptors let you run custom functions before requests go out or before responses are handled by `.then()`/`.catch()`, which is ideal for injecting authentication headers (e.g. Bearer tokens) or unifying network error handling."
  }
];

export default function QuizPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // mapping of question id to selected option key
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUESTIONS[currentIdx];

  const handleOptionSelect = (key) => {
    setSelectedOpt(key);
  };

  const handleNext = () => {
    // Save answer
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedOpt }));
    setSelectedOpt(null);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setAnswers({});
    setSelectedOpt(null);
    setIsFinished(false);
  };

  // Calculate results
  const scoreStats = () => {
    let correct = 0;
    let wrong = 0;
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.answer) {
        correct++;
      } else {
        wrong++;
      }
    });
    return {
      correct,
      wrong,
      score: Math.round((correct / QUESTIONS.length) * 100)
    };
  };

  const results = isFinished ? scoreStats() : null;

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

      {!isFinished ? (
        <Card isGlass={true} padding="lg" className="border-border/50 shadow-md">
          {/* Progress bar */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-xs font-semibold text-muted">
              <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(((currentIdx) / QUESTIONS.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-border/40 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
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
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOpt === opt.key;
              return (
                <label
                  key={opt.key}
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
                    onChange={() => handleOptionSelect(opt.key)}
                    className="sr-only"
                  />
                  <span className={`w-5 h-5 rounded-lg border text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-primary text-white border-primary' : 'border-border bg-background'
                  }`}>
                    {opt.key}
                  </span>
                  <span>{opt.text}</span>
                </label>
              );
            })}
          </div>

          {/* Nav trigger */}
          <div className="flex justify-end pt-2 border-t border-border/40">
            <Button
              onClick={handleNext}
              disabled={!selectedOpt}
              iconRight={<ArrowRight size={15} />}
            >
              {currentIdx === QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        </Card>
      ) : (
        // Results review screen
        <div className="space-y-6">
          <Card isGlass={true} padding="lg" className="border-border/50 text-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-transparent pointer-events-none" />
            
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 text-2xl mb-4 animate-bounce">
              <Award size={32} />
            </div>

            <h2 className="text-2xl font-bold font-display text-foreground">Quiz Results Summary</h2>
            <p className="text-sm text-muted mt-1 max-w-sm mx-auto">Great effort! Take a look at your grades and detailed answer explanations below.</p>

            {/* Score Stats Row */}
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-8 p-4 rounded-2xl border border-border bg-background/40">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-semibold text-muted uppercase">Final Score</span>
                <p className="text-2xl font-extrabold text-primary font-display">{results.score}%</p>
              </div>
              <div className="text-center space-y-1 border-l border-border/60">
                <span className="text-[10px] font-semibold text-muted uppercase">Correct</span>
                <p className="text-2xl font-extrabold text-secondary font-display">{results.correct}</p>
              </div>
              <div className="text-center space-y-1 border-l border-border/60">
                <span className="text-[10px] font-semibold text-muted uppercase">Incorrect</span>
                <p className="text-2xl font-extrabold text-red-500 font-display">{results.wrong}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={resetQuiz} variant="primary" iconLeft={<RefreshCw size={15} />}>
                Try Again
              </Button>
              <Link to="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </Card>

          {/* Detailed Explanations Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2 px-1">
              <BookOpen size={16} className="text-primary" />
              <span>Question-by-Question Review</span>
            </h3>

            {QUESTIONS.map((q) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.answer;
              
              return (
                <Card key={q.id} isGlass={true} padding="md" className="border-border/50">
                  <div className="space-y-4">
                    {/* Header check */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug max-w-lg">
                        {q.id}. {q.question}
                      </h4>
                      <span className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold border shrink-0 ${
                        isCorrect
                          ? 'bg-secondary/10 border-secondary/20 text-secondary'
                          : 'bg-red-500/10 border-red-500/20 text-red-500'
                      }`}>
                        {isCorrect ? (
                          <>
                            <CheckCircle2 size={12} /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> Incorrect
                          </>
                        )}
                      </span>
                    </div>

                    {/* Options list showing selections */}
                    <div className="grid gap-2 text-xs sm:grid-cols-2">
                      {q.options.map(opt => {
                        const isUserSelect = userAnswer === opt.key;
                        const isCorrectSelect = q.answer === opt.key;
                        
                        return (
                          <div
                            key={opt.key}
                            className={`
                              p-2.5 rounded-xl border text-[11px] flex items-center gap-2
                              ${isCorrectSelect
                                ? 'bg-secondary/15 border-secondary/25 text-secondary font-semibold'
                                : isUserSelect
                                  ? 'bg-red-500/15 border-red-500/25 text-red-500 font-semibold'
                                  : 'bg-background/30 border-border/50 text-muted'
                              }
                            `}
                          >
                            <span className={`w-4.5 h-4.5 rounded border text-[9px] font-bold flex items-center justify-center shrink-0 ${
                              isCorrectSelect
                                ? 'bg-secondary text-white border-secondary'
                                : isUserSelect
                                  ? 'bg-red-500 text-white border-red-500'
                                  : 'border-border bg-background'
                            }`}>
                              {opt.key}
                            </span>
                            <span className="truncate">{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* AI Explanation details */}
                    <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/10 flex gap-2.5">
                      <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-primary uppercase">AI Explanation</span>
                        <p className="text-[11px] text-muted leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>

                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
