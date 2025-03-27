import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Goals } from './components/Goals';
import { Settings } from './components/Settings';
import { Reports } from './components/Reports';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { PublicRoute } from './components/Auth/PublicRoute';
import { useThemeContext } from './contexts/ThemeContext';

// Importar providers de contexto
import { AuthProvider } from './contexts/AuthContext';
import { FinancialProvider } from './contexts/FinancialContext';
import { StoreProvider } from './contexts/StoreContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-dark-900 transition-colors duration-200 ${theme}`}>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterForm />
          </PublicRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <>
              <Header theme={theme} onToggleTheme={toggleTheme} />
              <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
                <Dashboard />
              </main>
            </>
          </ProtectedRoute>
        } />

        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <>
                <Header theme={theme} onToggleTheme={toggleTheme} />
                <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
                  <Goals />
                </main>
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <>
                <Header theme={theme} onToggleTheme={toggleTheme} />
                <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
                  <Reports />
                </main>
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <>
                <Header theme={theme} onToggleTheme={toggleTheme} />
                <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
                  <Settings />
                </main>
              </>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <FinancialProvider>
          <StoreProvider>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </StoreProvider>
        </FinancialProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;