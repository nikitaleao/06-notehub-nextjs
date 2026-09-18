'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { NewNote } from '@/types/note';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tag = formData.get('tag') as string;

    if (!title || !content || !tag) return;

    mutation.mutate({ title, content, tag });
    form.reset();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <input
        name="title"
        type="text"
        placeholder="Note Title"
        className={css.input}
        required
      />
      <textarea
        name="content"
        placeholder="Note Content"
        className={css.textarea}
        required
      />
      <select name="tag" className={css.select} required defaultValue="Work">
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Meeting">Meeting</option>
        <option value="Shopping">Shopping</option>
        <option value="Todo">Todo</option>
      </select>
      <button
        type="submit"
        className={css.button}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Creating...' : 'Add Note'}
      </button>
    </form>
  );
}
