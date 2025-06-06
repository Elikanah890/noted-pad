import React from 'react';
import { Note } from '../../types';
import { useNotes } from '../../context/NoteContext';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const { activeNote, setActiveNote, deleteNote } = useNotes();

  const handleNoteClick = (note: Note) => {
    setActiveNote(note);
  };

  return (
    <div className="space-y-1 px-3">
      {notes.length === 0 ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <p>No notes found</p>
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className={`p-3 rounded-md cursor-pointer transition-colors ${
              activeNote?.id === note.id
                ? 'bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleNoteClick(note)}
          >
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {note.title || 'Untitled Note'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
              {note.content.replace(/#{1,6}\s|[*_~`]|\[.*\]\(.*\)/g, '') || 'No content'}
            </p>
            <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
              <span>{formatDistanceToNow(note.updatedAt)}</span>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap ml-2 gap-1">
                  {note.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
                      +{note.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NoteList;