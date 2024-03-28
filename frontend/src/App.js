import './App.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import BudgetOptimizationPage from './pages/BudgetOptimizationPage';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Header/>
           
              <Routes>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/' element={<PrivateRoute><HomePage/></PrivateRoute>}/>
                <Route path='/budget-optimization' element={<PrivateRoute><BudgetOptimizationPage/></PrivateRoute>}/>
              </Routes>
          
        </AuthProvider> 
      </BrowserRouter>
    </div>
  );
}

export default App;
