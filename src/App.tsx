import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Settings, 
  LogOut, 
  UserCircle,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import Dashboard from './components/Dashboard';
import Presensi from './components/Presensi';
import Admin from './components/Admin';
import Login from './components/Login';

// Mock Auth for now since Firebase is not yet configured
// In real app, this will use Firebase Auth
export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'presensi' | 'admin'>('dashboard');
  const [user, setUser] = useState<{ username: string; role: 'admin' | 'guru' } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check for saved session
  useEffect(() => {
    const savedUser = localStorage.getItem('presensi_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: { username: string; role: 'admin' | 'guru' }) => {
    setUser(userData);
    localStorage.setItem('presensi_user', JSON.stringify(userData));
    toast.success(`Selamat datang, ${userData.username}!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('presensi_user');
    setCurrentPage('dashboard');
    toast.info('Anda telah keluar.');
  };

  if (!user && currentPage === 'admin') {
    return <Login onLogin={handleLogin} onCancel={() => setCurrentPage('dashboard')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'presensi':
        return <Presensi user={user} />;
      case 'admin':
        return <Admin user={user} />;
      default:
        return <Dashboard />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'presensi', label: 'Presensi', icon: ClipboardCheck },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Toaster position="top-right" />
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800">Presensi Smadita</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-4">
          <div className="hidden md:flex items-center gap-3 mb-8 px-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <ClipboardCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">Presensi Smadita</h1>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as any);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${currentPage === item.id 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <item.icon className={`w-5 h-5 ${currentPage === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t">
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.username}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setCurrentPage('admin')}
              >
                Login Admin
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
