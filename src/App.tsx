import React from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { useInitialLoad } from './hooks';
import './styles/animations.css';

export default function App() {
  useInitialLoad();
  return <MainLayout />;
}