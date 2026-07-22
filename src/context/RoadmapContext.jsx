import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const RoadmapContext = createContext();

export const RoadmapProvider = ({ children }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchActiveRoadmap = async () => {
    try {
      const response = await api.get('/goals');
      if (response.success && response.goals && response.goals.length > 0) {
        // Fetch detailed roadmap for the first (most recent) goal
        const latestGoal = response.goals[0];
        const detailResponse = await api.get(`/goals/${latestGoal._id || latestGoal.id}`);
        if (detailResponse.success && detailResponse.goal && detailResponse.plan) {
          const formattedRoadmap = {
            id: detailResponse.goal._id || detailResponse.goal.id,
            goal: detailResponse.goal.goal,
            domain: detailResponse.goal.domain,
            skillLevel: detailResponse.goal.skillLevel,
            deadline: detailResponse.goal.deadline,
            hoursPerDay: detailResponse.goal.hoursPerDay,
            status: detailResponse.goal.status,
            progress: latestGoal.progress || 0,
            streak: 5,
            hoursStudied: 14.5,
            weeks: detailResponse.plan.weeks
          };
          setRoadmap(formattedRoadmap);
        }
      } else {
        setRoadmap(null);
      }
    } catch (err) {
      console.warn("Failed to load active roadmap from database:", err.message);
      setRoadmap(null);
    }
  };

  // Fetch roadmap on mount and whenever authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchActiveRoadmap();
    } else {
      setRoadmap(null);
    }
  }, [isAuthenticated]);

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
    try {
      const response = await api.post('/goals', {
        goal: goalDetails.goal,
        domain: goalDetails.domain || 'Software Engineering',
        skillLevel: goalDetails.skillLevel || 'Intermediate',
        deadline: goalDetails.deadline,
        hoursPerDay: Number(goalDetails.hoursPerDay || 2)
      });

      if (response.success && response.goal && response.plan) {
        const goalId = response.goal._id || response.goal.id;
        const formattedRoadmap = {
          id: goalId,
          goal: response.goal.goal,
          domain: response.goal.domain,
          skillLevel: response.goal.skillLevel,
          deadline: response.goal.deadline,
          hoursPerDay: response.goal.hoursPerDay,
          status: response.goal.status,
          progress: 0,
          streak: 5,
          hoursStudied: 14.5,
          weeks: response.plan.weeks
        };
        setRoadmap(formattedRoadmap);
        return formattedRoadmap;
      }
    } catch (err) {
      console.error("Roadmap generation failed:", err.message);
      throw new Error(err.message || "Failed to generate AI learning plan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTaskComplete = async (weekId, taskId) => {
    if (!roadmap) return;

    let currentStatus = 'pending';
    roadmap.weeks.forEach((week) => {
      week.tasks.forEach((task) => {
        if (task.id === taskId) {
          currentStatus = task.status;
        }
      });
    });

    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    try {
      const response = await api.patch(`/goals/${roadmap.id}/tasks/${taskId}`, {
        status: nextStatus
      });

      if (response.success && response.plan) {
        const updatedWeeks = response.plan.weeks;
        const newProgress = recalculateProgress(updatedWeeks);
        setRoadmap((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            weeks: updatedWeeks,
            progress: newProgress,
            hoursStudied: nextStatus === 'completed' 
              ? Number((prev.hoursStudied + 1.2).toFixed(1)) 
              : prev.hoursStudied
          };
        });
      }
    } catch (err) {
      console.error("Failed to toggle task completion status:", err.message);
    }
  };

  const skipTask = async (weekId, taskId) => {
    if (!roadmap) return;

    let currentStatus = 'pending';
    roadmap.weeks.forEach((week) => {
      week.tasks.forEach((task) => {
        if (task.id === taskId) {
          currentStatus = task.status;
        }
      });
    });

    const nextStatus = currentStatus === 'skipped' ? 'pending' : 'skipped';

    try {
      const response = await api.patch(`/goals/${roadmap.id}/tasks/${taskId}`, {
        status: nextStatus
      });

      if (response.success && response.plan) {
        const updatedWeeks = response.plan.weeks;
        const newProgress = recalculateProgress(updatedWeeks);
        setRoadmap((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            weeks: updatedWeeks,
            progress: newProgress
          };
        });
      }
    } catch (err) {
      console.error("Failed to skip task:", err.message);
    }
  };

  const toggleWeekExpand = (weekId) => {
    if (!roadmap) return;

    const updatedWeeks = roadmap.weeks.map((w) =>
      w.id === weekId ? { ...w, isExpanded: !w.isExpanded } : w
    );

    setRoadmap((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        weeks: updatedWeeks
      };
    });
  };

  const resetRoadmap = async () => {
    if (!roadmap) return;
    try {
      await api.delete(`/goals/${roadmap.id}`);
      setRoadmap(null);
    } catch (err) {
      console.error("Failed to delete roadmap:", err.message);
    }
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
        resetRoadmap,
        refreshRoadmap: fetchActiveRoadmap
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
