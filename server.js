const express = require('express');
const path = require('path');
const fs = require('fs');
const notesData = require('./db/db.json')

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(notesData);
});

app.post('/api/notes', (req, res) => {
    const dbPath = path.join(__dirname, './db/db.json');
    const newNote = req.body;
    newNote.id = Date.now();
    notesData.push(newNote);
    fs.writeFile(dbPath, JSON.stringify(notesData), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to write data to the file' });
        }
        res.json(notesData);
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const dbPath = path.join(__dirname, './db/db.json');
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

            res.json(updatedNotes);
        });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
