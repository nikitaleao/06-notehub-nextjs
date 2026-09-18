'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import css from './Notes.module.css';

export default function NotesClient() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 300);

  const onSearchInput = (value: string) => {
    setSearch(value);
    handleSearchChange(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    placeholderData: keepPreviousData,
  });

  const notesList = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.topBar}>
          <SearchBox value={search} onChange={onSearchInput} />

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}

          <button
            type="button"
            className={css.createBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Create note +
          </button>
        </div>

        {isLoading && <p>Loading, please wait...</p>}
        {isError && <p>Something went wrong while fetching notes.</p>}
        {!isLoading && !isError && <NoteList notes={notesList} />}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      </div>
    </main>
  );
}
