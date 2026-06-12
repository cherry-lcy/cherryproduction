import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import './index.css';
import router from './router';
import { RouterProvider } from "react-router-dom";
import SEO from './components/SEO';
import './locales/i18n';
import { LanguageProvider } from './contexts/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <RouterProvider router={router}>
        <SEO/>
      </RouterProvider>
    </LanguageProvider>
  </React.StrictMode>
);
