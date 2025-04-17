import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import CategoryPage from './pages/CategoryPage.jsx'; // ✅ adjust path if needed
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);