import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import GoalSetupPage from '../pages/GoalSetupPage';
import RoadmapPage from '../pages/RoadmapPage';
import StudySessionPage from '../pages/StudySessionPage';
import QuizPage from '../pages/QuizPage';
import AIMentorPage from '../pages/AIMentorPage';
import NotificationsPage from '../pages/NotificationsPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import AchievementsPage from '../pages/AchievementsPage';
import CalendarPage from '../pages/CalendarPage';
import NotFoundPage from '../pages/NotFoundPage';
import CoursesPage from '../pages/CoursesPage';
import FlashcardsPage from '../pages/FlashcardsPage';
import DashboardLayout from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="goal-setup" element={<GoalSetupPage />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="study" element={<StudySessionPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="tutor" element={<AIMentorPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="flashcards" element={<FlashcardsPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
