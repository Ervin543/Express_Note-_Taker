// Variables
let notes = [];
let activeNote = {};

// DOM elements
const noteTitle = document.querySelector(".note-title");
const noteText = document.querySelector(".note-textarea");
const saveNoteBtn = document.querySelector(".save-note");
const newNoteBtn = document.querySelector(".new-note");
const noteList = document.querySelector(".list-group");

// Functions
const renderActiveNote = () => {
  noteTitle.value = activeNote.title;
  noteText.value = activeNote.text;
};

const handleNoteSave = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    alert("Please enter a note title and text.");
  } else {
    activeNote.title = noteTitle.value;
    activeNote.text = noteText.value;
    saveNote();
    renderNoteList();
  }
};

const saveNote = () => {
  if (activeNote.id) {
    fetch(`/api/notes/${activeNote.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activeNote),
    })
      .then((res) => res.json())
      .then((data) => {
        getAndRenderNotes();
        renderActiveNote();
      });
  } else {
    fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activeNote),
    })
      .then((res) => res.json())
      .then((data) => {
        getAndRenderNotes();
        renderActiveNote();
      });
  }
};

const handleNoteDelete = (e) => {
  e.stopPropagation();
  const note = e.target.parentElement;
  const id = note.dataset.id;
  if (activeNote.id === id) {
    activeNote = {};
  }
  deleteNote(id);
  renderNoteList();
  renderActiveNote();
};

const deleteNote = (id) => {
  fetch(`/api/notes/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
};

const handleNoteView = (e) => {
  e.preventDefault();
  const note = e.target;
  activeNote = JSON.parse(note.dataset.json);
  renderActiveNote();
};

const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

const renderNoteList = () => {
  noteList.innerHTML = "";
  for (const note of notes) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.dataset.id = note.id;
    li.dataset.json = JSON.stringify(note);
    const h5 = document.createElement("h5");
    h5.textContent = note.title;
    const p = document.createElement("p");
    p.textContent = note.text;
    const i = document.createElement("i");
    i.classList.add("fas", "fa-trash-alt", "float-right", "delete-note");
    i.addEventListener("click", handleNoteDelete);
    li.appendChild(h5);
    li.appendChild(p);
    li.appendChild(i);
    li.addEventListener("click", handleNoteView);
    noteList.appendChild(li);
  }
};

const getAndRenderNotes = () => {
  return fetch("/api/notes")
    .then((res) => res.json())
    .then((data) => {
      notes = data;
      renderNoteList();
    });
};

// Event Listeners
saveNoteBtn.addEventListener("click", handleNoteSave);
newNoteBtn.addEventListener("click", handleNewNoteView);

// Initialization
getAndRenderNotes();
renderActiveNote();
