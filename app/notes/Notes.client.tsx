'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import css from './Notes.module.css';

export default function NotesClient() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', search],
    queryFn: () => fetchNotes(search),
  });

  const notesList = Array.isArray(data) ? data : [];

  return (
    <main className={css.main}>
      <div className={css.container}>
        <NoteForm />
        <SearchBox value={search} onChange={setSearch} />
        {isLoading && <p>Loading, please wait...</p>}
        {isError && <p>Something went wrong while fetching notes.</p>}
        {!isLoading && !isError && <NoteList notes={notesList} />}
      </div>
    </main>
  );
}
