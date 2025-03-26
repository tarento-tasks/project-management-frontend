import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import NewProject from './pages/NewProject/NewProject';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import FormComponent from './components/Forms/FormComponent';


function App() {
  return (
    <Router>
      
        <Routes>
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/new-project" element={<NewProject />} /> 
          <Route path="/" element={<LoginPage />} />
          <Route path="/" element={<Header />} />
          <Route path="/admin/new-project" element={<NewProject />} /> 
           
           <Route path="/admin/new-project" element={<NewProject />} /> */}
           <Route path="/admin/new-project" element={<NewProject />} /> 
          
           
        </Routes>
      
    </Router>
  );
}

export default App;


