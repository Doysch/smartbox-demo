import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import CategoryPage from './pages/CategoryPage.jsx'; 
import OccasionPage from './pages/OccasionPage.jsx';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/experiences/:categoryId" element={<CategoryPage />} />
        <Route path="/occasions/:occasionId" element={<OccasionPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);