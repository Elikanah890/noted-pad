import React, { useState, useEffect, useRef } from 'react';
import { Tag, Plus, X, Save, Trash, Bookmark } from 'lucide-react';
import { useNotes } from '../../context/NoteContext';
import MarkdownPreview from './MarkdownPreview';

interface NoteEditorProps {
  isMobile: boolean;
  toggleSidebar: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ isMobile, toggleSidebar }) => {
  const { activeNote, updateNote, deleteNote, addTagToNote, removeTagFromNote } = useNotes();
  const [newTag, setNewTag] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [autoSaveIndicator, setAutoSaveIndicator] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<number | null>(null);
  
  // Focus on the title input when a new note is created
  useEffect(() => {
    if (activeNote && !activeNote.title && titleRef.current) {
      titleRef.current.focus();
    }
  }, [activeNote?.id]);

  // Handle auto-saving with debounce
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeNote) return;
    
    updateNote({ title: e.target.value });
    triggerAutoSave();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeNote) return;
    
    updateNote({ content: e.target.value });
    triggerAutoSave();
  };

  const handleDeleteNote = () => {
    if (!activeNote) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(activeNote.id);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim() && activeNote) {
      addTagToNote(activeNote.id, newTag.trim());
      setNewTag('');
      triggerAutoSave();
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (!activeNote) return;
    
    removeTagFromNote(activeNote.id, tag);
    triggerAutoSave();
  };

  const triggerAutoSave = () => {
    setAutoSaveIndicator('Saving...');
    
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      setAutoSaveIndicator('Saved');
      
      setTimeout(() => {
        setAutoSaveIndicator('');
      }, 1500);
    }, 1000) as unknown as number;
  };

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <Bookmark className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No note selected</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Select a note from the sidebar or create a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
      {/* Editor Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              isPreviewMode
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {autoSaveIndicator}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDeleteNote}
            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:bg-opacity-30 rounded-full transition-colors"
            title="Delete note"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isPreviewMode ? (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {activeNote.title || 'Untitled Note'}
            </h1>
            <MarkdownPreview content={activeNote.content} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <input
              ref={titleRef}
              type="text"
              placeholder="Note Title"
              value={activeNote.title}
              onChange={handleTitleChange}
              className="w-full mb-4 text-2xl font-bold bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            
            {/* Tags Input */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              {activeNote.tags.map(tag => (
                <div
                  key={tag}
                  className="flex items-center px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900 dark:bg-opacity-40 text-blue-700 dark:text-blue-300 text-xs"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            
            <textarea
              placeholder="Start writing..."
              value={activeNote.content}
              onChange={handleContentChange}
              className="w-full h-[calc(100vh-250px)] p-2 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-0 font-mono text-md leading-relaxed resize-none"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;