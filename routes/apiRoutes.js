const express = require('express');
const router = express.Router();
const db = require('../db/db.json');
const fs = require('fs');

// Get all notes
router.get('/notes', (req, res) => {
  return res.json(db);
});

// Add a new note
router.post('/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = Date.now();
  db.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(db));
  return res.json(newNote);
});

// Delete a note by id
router.delete('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedDb = db.filter(note => note.id !== id);
  fs.writeFileSync('./db/db.json', JSON.stringify(updatedDb));
  return res.json(updatedDb);
});

module.exports = router;
