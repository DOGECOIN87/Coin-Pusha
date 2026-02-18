import React from 'react';
import DexPage from './pages/DexPage';

// Simple routing since we primarily need to show the DEX page
// In a full app, we would use React Router
const App: React.FC = () => {
  return (
    <>
      <DexPage />
    </>
  );
};

export default App;