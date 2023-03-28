const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Get all notes
router.get('/notes', (req, res) => {
  const dbPath = path.join(__dirname, '../db/db.json');
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to read data from the file' });
    }

    const notes = JSON.parse(data);
    return res.json(notes);
  });
});

// Add a new note
router.post('/notes', (req, res) => {
  const dbPath = path.join(__dirname, '../db/db.json');
  const newNote = req.body;
  newNote.id = Date.now();

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to read data from the file' });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to write data to the file' });
      }

      return res.json(newNote);
    });
  });
});

// Delete a note by id
router.delete('/notes/:id', (req, res) => {
  const dbPath = path.join(__dirname, '../db/db.json');
  const id = parseInt(req.params.id);
  
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to read data from the file' });
    }

    const notes = JSON.parse(data);
    const updatedNotes = notes.filter(note => note.id !== id);

    fs.writeFile(dbPath, JSON.stringify(updatedNotes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to write data to the file' });
      }

      return res.json(updatedNotes);
    });
  });
});

module.exports = router;
