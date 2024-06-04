import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import useAuthContext from './hooks/useAuthContext';
import BudgetOptimizationPage from './pages/BudgetOptimizationPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MoreCategoryInfoPage from './pages/MoreCategoryInfoPage';
import NotFoundPage from './pages/NotFoundPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  const {user} = useAuthContext()
  return (
    <div className="App">
        <Header/>
          <Routes>
            <Route path='/sign-up' element={!user ? <SignUpPage/> : <Navigate to='/'/>}/>
            <Route path='/login' element={!user ? <LoginPage/> : <Navigate to='/'/>}/>
            <Route path='/' element={user ? <HomePage/> : <Navigate to='/login'/>}/>
            <Route path='/budget-optimization' element={user ? <BudgetOptimizationPage/> : <Navigate to='/login'/>}/>
            <Route path='/more-category-info' element={user ? <MoreCategoryInfoPage/> : <Navigate to='/login'/>}/>
            <Route path="*" element={<NotFoundPage />}/>
          </Routes>
    </div>
  );
}

export default App;
