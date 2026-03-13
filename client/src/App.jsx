import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { connectSocket } from './services/socketService';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Alerts from './pages/Alerts';
import RescueOps from './pages/RescueOps';
import Resources from './pages/Resources';
import Reports from './pages/Reports';

const SIDEBAR_WIDTH = 220;

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Connect socket on app start
    connectSocket();
  }, []);

  return (
    <div style={{ background: '#050a0e', minHeight: '100vh' }}>
      <Navbar onMenuToggle={() => setSidebarOpen(p => !p)} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ paddingTop: '88px' }}>
        <div className="hidden lg:block" style={{ marginLeft: SIDEBAR_WIDTH }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/rescue" element={<RescueOps />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
        <div className="lg:hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/rescue" element={<RescueOps />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </main>

      <Toaster position="top-right"
        toastOptions={{
          style: {
            background: '#0d1f35',
            color: '#e8f4f8',
            border: '1px solid #1a3a52',
            fontFamily: 'Exo 2, sans-serif',
            fontSize: '13px',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
