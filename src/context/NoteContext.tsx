import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../types';

interface NoteContextProps {
  notes: Note[];
  activeNote: Note | null;
  setActiveNote: (note: Note | null) => void;
  createNote: () => void;
  updateNote: (updatedNote: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  searchNotes: (query: string) => Note[];
  addTagToNote: (id: string, tag: string) => void;
  removeTagFromNote: (id: string, tag: string) => void;
}

const NoteContext = createContext<NoteContextProps | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider = ({ children }: NoteProviderProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(parsedNotes);
        
        // Set the most recently updated note as active
        if (parsedNotes.length > 0) {
          const mostRecentNote = [...parsedNotes].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0];
          setActiveNote(mostRecentNote);
        }
      } catch (error) {
        console.error('Error parsing saved notes:', error);
      }
    } else {
      // Create a welcome note if there are no saved notes
      const welcomeNote: Note = {
        id: uuidv4(),
        title: 'Welcome to Notepad',
        content: '# Welcome to your new Notepad!\n\nStart writing your notes here. You can use Markdown formatting for:\n\n- **Bold text**\n- *Italic text*\n- ## Headers\n- [Links](https://example.com)\n- And more!\n\nUse the sidebar to create new notes or switch between existing ones.',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['welcome'],
      };
      setNotes([welcomeNote]);
      setActiveNote(welcomeNote);
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };
    
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
  };

  const updateNote = (updatedFields: Partial<Note>) => {
    if (!activeNote) return;
    
    const updatedNote = {
      ...activeNote,
      ...updatedFields,
      updatedAt: new Date(),
    };
    
    setNotes(notes.map(note => 
      note.id === activeNote.id ? updatedNote : note
    ));
    
    setActiveNote(updatedNote);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    
    // If the active note is deleted, set the first available note as active
    if (activeNote && activeNote.id === id) {
      const remainingNotes = notes.filter(note => note.id !== id);
      setActiveNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
    }
  };

  const searchNotes = (query: string) => {
    if (!query.trim()) return notes;
    
    const lowerQuery = query.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) || 
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const addTagToNote = (id: string, tag: string) => {
    if (!tag.trim()) return;
    
    setNotes(notes.map(note => {
      if (note.id === id && !note.tags.includes(tag)) {
        const updatedNote = {
          ...note,
          tags: [...note.tags, tag],
          updatedAt: new Date()
        };
        
        // Update active note if it's the one being modified
        if (activeNote && activeNote.id === id) {
          setActiveNote(updatedNote);
        }
        
        return updatedNote;
      }
      return note;
    }));
  };

  const removeTagFromNote = (id: string, tag: string) => {
    setNotes(notes.map(note => {
      if (note.id === id) {
        const updatedNote = {
          ...note,
          tags: note.tags.filter(t => t !== tag),
          updatedAt: new Date()
        };
        
        // Update active note if it's the one being modified
        if (activeNote && activeNote.id === id) {
          setActiveNote(updatedNote);
        }
        
        return updatedNote;
      }
      return note;
    }));
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        activeNote,
        setActiveNote,
        createNote,
        updateNote,
        deleteNote,
        searchNotes,
        addTagToNote,
        removeTagFromNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};