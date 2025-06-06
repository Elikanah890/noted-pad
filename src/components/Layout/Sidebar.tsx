import React, { useState } from 'react';
import { PlusCircle, Search, Tag, X, Menu, ArrowLeft } from 'lucide-react';
import { useNotes } from '../../context/NoteContext';
import { Note } from '../../types';
import NoteList from '../Notes/NoteList';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, toggleSidebar }) => {
  const { notes, createNote, searchNotes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Get all unique tags from notes
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredNotes(searchNotes(query));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredNotes([]);
  };

  const filterByTag = (tag: string | null) => {
    setActiveTag(tag);
    if (tag) {
      setFilteredNotes(notes.filter(note => note.tags.includes(tag)));
    } else {
      setFilteredNotes([]);
    }
  };

  const displayedNotes = searchQuery.trim() !== '' || activeTag !== null 
    ? filteredNotes
    : notes;

  const sidebarClass = `
    h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
    transition-all duration-300 ease-in-out
    ${isMobile 
      ? isOpen 
        ? 'fixed inset-y-0 left-0 w-64 z-50' 
        : 'fixed inset-y-0 -left-64 w-64 z-50' 
      : 'w-64 min-w-64'
    }
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClass}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Notes</h1>
          {isMobile && (
            <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
        
        <div className="p-3">
          <button
            onClick={createNote}
            className="w-full flex items-center justify-center py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Note
          </button>
        </div>
        
        <div className="relative px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        {allTags.length > 0 && (
          <div className="px-3 pb-2">
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => filterByTag(activeTag === tag ? null : tag)}
                  className={`px-2 py-1 rounded-md text-xs transition-colors ${
                    activeTag === tag
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto pt-2">
          <NoteList notes={displayedNotes} />
        </div>
      </aside>
      
      {/* Mobile toggle button */}
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-md shadow-md"
        >
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        </button>
      )}
    </>
  );
};

export default Sidebar;