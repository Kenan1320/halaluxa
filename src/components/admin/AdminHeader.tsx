
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Bell, Search, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminHeader = () => {
  const { mode, setMode } = useTheme();
  
  const toggleTheme = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <header className={`h-16 px-6 border-b flex items-center justify-between ${
      mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className={`relative w-full ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className={`w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 ${
              mode === 'dark'
                ? 'bg-gray-700 border-gray-600 focus:ring-blue-600'
                : 'bg-gray-100 border-gray-200 focus:ring-blue-400'
            }`}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className={mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}
        >
          {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}
        >
          <Bell size={20} />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className={mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            <p className="font-medium">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
