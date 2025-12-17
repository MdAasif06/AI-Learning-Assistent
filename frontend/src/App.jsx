import React from "react";
import { BrowserRouter as Router,Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import DashboardPage from "./pages/Dashboard/DashboardPage"
import DocumentListPage from "./pages/documents/DocumentList"
import DocumentDetailPage from "./pages/documents/DocumentDetails"
import FlashCardListPage from "./pages/FlashCards/FlashCardList"
import FlashcardPage from "./pages/FlashCards/FlashCardPage"
import QuizTakePage from "./pages/Quizzes/QuizzTakePage"
import QuizResultPage from "./pages/Quizzes/QuizzResultPage"
import Profile from "./pages/profile/ProfilePage"



const App = () => {
  const isAuthenticated = true;
  const loading = false;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  return(
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace/>:<Navigate to="/login" replace/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>

        {/* protected routes */}
        <Route element={<ProtectedRoute/>}>
         <Route path="/dashboard" element={<DashboardPage/>}/>
         <Route path="/documents" element={<DocumentListPage/>}/>
         <Route path="/documents/:id" element={<DocumentDetailPage/>}/>
         <Route path="/flashcards" element={<FlashCardListPage/>}/>
         <Route path="/documents/:id/flescards" element={<FlashcardPage/>}/>
         <Route path="/quizzes/:quizId" element={<QuizTakePage/>}/>
         <Route path="/quizzes/:quizId/results" element={<QuizResultPage/>}/>
         <Route path="/profile" element={<Profile/>}/>
        </Route>

        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </Router>
  )
};

export default App;
