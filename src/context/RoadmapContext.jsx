import React, { createContext, useContext, useState, useEffect } from 'react';

const RoadmapContext = createContext();

const ROADMAP_STORAGE_KEY = 'learnmate_roadmap';

export const RoadmapProvider = ({ children }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(ROADMAP_STORAGE_KEY);
    if (saved) {
      try {
        setRoadmap(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse roadmap data", e);
      }
    }
  }, []);

  // Save to local storage on change
  const saveRoadmap = (data) => {
    setRoadmap(data);
    if (data) {
      localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(ROADMAP_STORAGE_KEY);
    }
  };

  // Helper to generate dynamic weeks based on user goal
  const createMockRoadmap = (goalData) => {
    const { goal, skillLevel, deadline, hoursPerDay, learningStyle } = goalData;
    
    // Generate structured items tailored to the user's input
    const subject = goal || 'Full-Stack Engineering';
    
    return {
      goal: subject,
      skillLevel,
      deadline,
      hoursPerDay,
      learningStyle,
      progress: 0,
      streak: 5,
      hoursStudied: 14.5,
      milestone: `Complete first portfolio project in ${subject}`,
      weeks: [
        {
          id: 'w-1',
          title: `Week 1: Fundamentals of ${subject}`,
          description: `Core concepts, configuration, and structural syntax setup for ${subject}.`,
          isExpanded: true,
          tasks: [
            {
              id: 't-1-1',
              title: `Introduction to ${subject} concepts & architecture`,
              duration: '45 mins',
              status: 'completed', // start with some completed tasks to show charts nicely!
              type: 'theory',
              resources: [
                { name: 'Official Guide', url: 'https://example.com/docs' },
                { name: 'Video: Absolute Beginner Crash Course', url: 'https://youtube.com' }
              ]
            },
            {
              id: 't-1-2',
              title: `Build your first basic application module`,
              duration: '90 mins',
              status: 'completed',
              type: 'practical',
              resources: [
                { name: 'Github Sandbox template', url: 'https://github.com' }
              ]
            },
            {
              id: 't-1-3',
              title: `Explore best practices & directory structure conventions`,
              duration: '60 mins',
              status: 'pending',
              type: 'theory',
              resources: [
                { name: 'Style Guide & Linter setup docs', url: 'https://example.com/style' }
              ]
            }
          ]
        },
        {
          id: 'w-2',
          title: `Week 2: Intermediate Implementation & State Flow`,
          description: `Dive into data structures, event loops, hooks and error handling patterns.`,
          isExpanded: false,
          tasks: [
            {
              id: 't-2-1',
              title: `State synchronization & memory profiling`,
              duration: '90 mins',
              status: 'pending',
              type: 'practical',
              resources: [
                { name: 'Performance Optimization articles', url: 'https://example.com/perf' }
              ]
            },
            {
              id: 't-2-2',
              title: `Handle error boundaries & debug logs`,
              duration: '45 mins',
              status: 'pending',
              type: 'practical',
              resources: [
                { name: 'Debugging walkthrough video', url: 'https://youtube.com' }
              ]
            },
            {
              id: 't-2-3',
              title: `Mid-term progress validation quiz`,
              duration: '30 mins',
              status: 'pending',
              type: 'quiz',
              resources: [
                { name: 'Practice Questions list', url: 'https://example.com/quiz' }
              ]
            }
          ]
        },
        {
          id: 'w-3',
          title: `Week 3: Advanced Integrations & API Clients`,
          description: `Fetch remote servers, configure Axios requests, and implement secure route guards.`,
          isExpanded: false,
          tasks: [
            {
              id: 't-3-1',
              title: `Asynchronous actions and concurrency resolution`,
              duration: '120 mins',
              status: 'pending',
              type: 'practical',
              resources: [
                { name: 'MDN Web docs: Promises & Async', url: 'https://developer.mozilla.org' }
              ]
            },
            {
              id: 't-3-2',
              title: `Setup network interceptors & token storage`,
              duration: '75 mins',
              status: 'pending',
              type: 'theory',
              resources: [
                { name: 'Axios interceptor tutorial', url: 'https://axios-http.com' }
              ]
            }
          ]
        },
        {
          id: 'w-4',
          title: `Week 4: Final Deployment & Projects`,
          description: `Compile optimized production assets, run benchmarks, and publish active repos.`,
          isExpanded: false,
          tasks: [
            {
              id: 't-4-1',
              title: `Run production builds and asset optimizations`,
              duration: '60 mins',
              status: 'pending',
              type: 'practical',
              resources: [
                { name: 'Build tools documentation', url: 'https://example.com/build' }
              ]
            },
            {
              id: 't-4-2',
              title: `Demonstrate portfolio project to peers`,
              duration: '120 mins',
              status: 'pending',
              type: 'practical',
              resources: [
                { name: 'Project Checklist document', url: 'https://example.com/checklist' }
              ]
            }
          ]
        }
      ]
    };
  };

  // Recalculates the roadmap progress based on task states
  const recalculateProgress = (currentWeeks) => {
    let totalTasks = 0;
    let completedTasks = 0;
    
    currentWeeks.forEach((week) => {
      week.tasks.forEach((task) => {
        if (task.status !== 'skipped') {
          totalTasks++;
          if (task.status === 'completed') {
            completedTasks++;
          }
        }
      });
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const generateRoadmap = async (goalDetails) => {
    setIsGenerating(true);
    // Simulate complex AI scheduling algorithm
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    const mockPlan = createMockRoadmap(goalDetails);
    mockPlan.progress = recalculateProgress(mockPlan.weeks);
    saveRoadmap(mockPlan);
    setIsGenerating(false);
    return mockPlan;
  };

  const toggleTaskComplete = (weekId, taskId) => {
    if (!roadmap) return;

    const updatedWeeks = roadmap.weeks.map((week) => {
      if (week.id === weekId) {
        const updatedTasks = week.tasks.map((task) => {
          if (task.id === taskId) {
            const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
            return { ...task, status: nextStatus };
          }
          return task;
        });
        return { ...week, tasks: updatedTasks };
      }
      return week;
    });

    const newProgress = recalculateProgress(updatedWeeks);
    const updatedRoadmap = {
      ...roadmap,
      weeks: updatedWeeks,
      progress: newProgress,
      // increase studied hours dynamically when completing tasks!
      hoursStudied: newProgress > roadmap.progress ? Number((roadmap.hoursStudied + 1.2).toFixed(1)) : roadmap.hoursStudied
    };

    saveRoadmap(updatedRoadmap);
  };

  const skipTask = (weekId, taskId) => {
    if (!roadmap) return;

    const updatedWeeks = roadmap.weeks.map((week) => {
      if (week.id === weekId) {
        const updatedTasks = week.tasks.map((task) => {
          if (task.id === taskId) {
            const nextStatus = task.status === 'skipped' ? 'pending' : 'skipped';
            return { ...task, status: nextStatus };
          }
          return task;
        });
        return { ...week, tasks: updatedTasks };
      }
      return week;
    });

    const newProgress = recalculateProgress(updatedWeeks);
    saveRoadmap({
      ...roadmap,
      weeks: updatedWeeks,
      progress: newProgress
    });
  };

  const toggleWeekExpand = (weekId) => {
    if (!roadmap) return;
    
    const updatedWeeks = roadmap.weeks.map(w => 
      w.id === weekId ? { ...w, isExpanded: !w.isExpanded } : w
    );
    saveRoadmap({
      ...roadmap,
      weeks: updatedWeeks
    });
  };

  const resetRoadmap = () => {
    saveRoadmap(null);
  };

  return (
    <RoadmapContext.Provider
      value={{
        roadmap,
        isGenerating,
        generateRoadmap,
        toggleTaskComplete,
        skipTask,
        toggleWeekExpand,
        resetRoadmap
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};
