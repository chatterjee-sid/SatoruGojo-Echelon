import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Toast from './components/Toast';
import { fetchHistory, type HistoricalThreat } from './services/api';

const App: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [initialHistory, setInitialHistory] = useState<HistoricalThreat[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchHistory();
        setInitialHistory(data);
        setIsOffline(false);
      } catch (err) {
        setIsOffline(true);
      }
    };
    loadData();
  }, []);

  return (
    <ThemeProvider>
      <Layout>
        <Dashboard initialHistory={initialHistory} />
      </Layout>
      <Toast
        message="System Offline: Backend connection failed"
        isVisible={isOffline}
        onClose={() => setIsOffline(false)}
      />
    </ThemeProvider>
  );
};

export default App;
