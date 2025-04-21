import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import CategoryPage from './pages/CategoryPage.jsx'; 
import OccasionPage from './pages/OccasionPage.jsx';
import DestinationPage from './pages/DestinationPage.jsx';
import ExperiencePage from './pages/ExperiencePage.jsx';
import { HashRouter } from "react-router-dom";

import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/experiences/:categoryId" element={<ExperiencePage />} />
        <Route path="/occasions/:occasionId" element={<OccasionPage />} />
        <Route path="/destinations/:destinationId" element={<DestinationPage />} />
        <Route path="/categories/:categoryId" element={<CategoryPage />} />

      </Routes>
      </HashRouter>
  </React.StrictMode>
);