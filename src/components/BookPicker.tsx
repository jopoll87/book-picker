import { useState, useEffect } from 'react';
import type { Book } from '../interfaces/Book';
import { books as booksData } from '../data/books';

const BookPicker = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [pickAnotherCount, setPickAnotherCount] = useState(0);
  const [lastPickDate, setLastPickDate] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooks(booksData);
    const today = new Date().toLocaleDateString();
    const storedLastPickDate = localStorage.getItem('lastPickDate');
    const storedPickAnotherCount = localStorage.getItem('pickAnotherCount');

    if (storedLastPickDate === today) {
      setLastPickDate(storedLastPickDate);
      setPickAnotherCount(Number(storedPickAnotherCount));
    } else {
      localStorage.setItem('lastPickDate', today);
      localStorage.setItem('pickAnotherCount', '0');
    }
  }, []);

  const pickRandomBook = () => {
    const randomIndex = Math.floor(Math.random() * books.length);
    setSelectedBook(books[randomIndex]);
  };

  const handleSelectBook = () => {
    if (selectedBook) {
      setBooks(books.filter((book) => book.id !== selectedBook.id));
      setSelectedBook(null);
    }
  };

  const handlePickAnotherBook = () => {
    const today = new Date().toLocaleDateString();
    if (lastPickDate !== today) {
      setLastPickDate(today);
      setPickAnotherCount(0);
      localStorage.setItem('lastPickDate', today);
      localStorage.setItem('pickAnotherCount', '0');
    }

    if (pickAnotherCount < 2) {
      setPickAnotherCount(pickAnotherCount + 1);
      localStorage.setItem('pickAnotherCount', (pickAnotherCount + 1).toString());
      pickRandomBook();
    } else {
      alert("You've reached your daily limit for picking another book.");
    }
  };

  return (
    <div>
      <h1>Book Picker</h1>
      {selectedBook ? (
        <div>
          <h2>Your next read is:</h2>
          <h3>{selectedBook.title}</h3>
          <button onClick={handleSelectBook}>Select Book</button>
          <button onClick={handlePickAnotherBook}>Pick Another Book</button>
        </div>
      ) : (
        <button onClick={pickRandomBook}>Pick a Book</button>
      )}
    </div>
  );
};

export default BookPicker;
