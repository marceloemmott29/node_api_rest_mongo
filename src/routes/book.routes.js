const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Middleware
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'El id no es valido' });
  }

  try {
    book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.book = book;
  next();
};

// Obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    if (books.length === 0) {
      return res.status(204).send('No hay libros en la base de datos');
    }
    res.json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Crear un libro
router.post('/', async (req, res) => {
  const { title, author, genre, publication_date } = req.body;
  if (!title || !author || !genre || !publication_date) {
    return res
      .status(400)
      .json({ message: 'Por favor, llena todos los campos' });
  }

  const newBook = new Book({
    title,
    author,
    genre,
    publication_date,
  });

  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Obtener un libro
router.get('/:id', getBook, (req, res) => {
  const data = {
    result: {
      message: 'Libro encontrado',
      book: res.book,
    },
  };
  res.json(data);
});

router.put('/:id', getBook, async (req, res) => {
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', getBook, async (req, res) => {
  if (
    !req.body.title &&
    !req.body.author &&
    !req.body.genre &&
    !req.body.publication_date
  ) {
    return res.status(400).json({ message: 'No hay datos para actualizar' });
  }
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// eliminar libro
router.delete('/:id', getBook, async (req, res) => {
  try {
    const book = res.book;
    await book.deleteOne({
      _id: book._id,
    
    });
    res.json({ message: `el libro eliminado es ${book.title}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
