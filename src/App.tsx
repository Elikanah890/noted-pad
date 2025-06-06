import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import NoteEditor from './components/Notes/NoteEditor';
import ThemeToggle from './components/UI/ThemeToggle';
import { NoteProvider } from './context/NoteContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider>
      <NoteProvider>
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          {/* Header */}
          <header className="h-14 px-4 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                Notepad
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 flex overflow-hidden">
            <Sidebar
              isMobile={isMobile}
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
            <NoteEditor
              isMobile={isMobile}
              toggleSidebar={toggleSidebar}
            />
          </main>
        </div>
      </NoteProvider>
    </ThemeProvider>
  );
}

export default App;