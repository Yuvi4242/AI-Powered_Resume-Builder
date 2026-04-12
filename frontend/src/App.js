import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PageTransition from './components/PageTransition';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeList from './pages/ResumeList';
import AIToolsDashboard from './pages/AIToolsDashboard';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Templates from './pages/Templates';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import Resources from './pages/Resources';
import ResourceDetails from './pages/ResourceDetails';
import { SearchProvider } from './context/SearchContext';
import { ToastProvider } from './context/ToastContext';
import ChatWidget from './components/ChatWidget';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <SearchProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="App overflow-x-hidden transition-colors duration-300 min-h-screen bg-gray-50 dark:bg-gray-900">
              <Routes>
              <Route 
                path="/login" 
                element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PageTransition>
                    <Signup />
                  </PageTransition>
                } 
              />
              <Route 
                path="/forgot-password" 
                element={
                  <PageTransition>
                    <ForgotPassword />
                  </PageTransition>
                } 
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Dashboard />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/builder"
                element={
                  <ProtectedRoute withLayout={false}>
                    <PageTransition>
                      <ResumeBuilder />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resumes"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <ResumeList />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-tools"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <AIToolsDashboard />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/templates" 
                element={
                  <ProtectedRoute>
                    <PageTransition><Templates /></PageTransition>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <PageTransition><Profile /></PageTransition>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <PageTransition><Settings /></PageTransition>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <ProtectedRoute>
                    <PageTransition><About /></PageTransition>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resources" 
                element={
                  <ProtectedRoute>
                    <PageTransition><Resources /></PageTransition>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resources/:id" 
                element={
                  <ProtectedRoute>
                    <PageTransition><ResourceDetails /></PageTransition>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/" 
                element={
                  <PageTransition>
                    <Landing />
                  </PageTransition>
                } 
              />
            </Routes>
            {/* Resume Copilot — floating AI assistant (visible when logged in) */}
            {localStorage.getItem('token') && <ChatWidget />}
          </div>
        </Router>
        </AuthProvider>
      </SearchProvider>
    </ToastProvider>
  );
}

export default App;
