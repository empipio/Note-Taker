const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");
const uuid = require("./helpers/uuid");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//GET route for landing page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//GET route for notes page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//GET all notes
app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNotes = JSON.parse(data);
      res.json(parsedNotes);
    }
  });
});

//GET specific note
app.get("/api/notes/:id", function (req, res) {
  const { title, text, id } = req.body;
  res.json(notes[req.body.id]);
});

//POST route to add a new note
app.post("/api/notes/", function (req, res) {
  const { title, text, id } = req.body;
  const newNote = {
    title,
    text,
    //each note is given a unique id using uuid function
    id: uuid(),
  };
  //new note pushed into parsedNotes array and file then rewritten
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNotes = JSON.parse(data);
      parsedNotes.push(newNote);
      fs.writeFileSync("./db/db.json", JSON.stringify(parsedNotes));
      const response = {
        status: "success",
        body: newNote,
      };
      res.json(response);
    }
  });
});

//delete selected note using id as query parameter
app.delete("/api/notes/:id", function (req, res) {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNotes = JSON.parse(data);
      const paramID = req.params.id;
      //findIndex finds the index of element in the parsedNotes array which has an id matching that in the query parameter
      const noteIndex = parsedNotes.findIndex((note) => note.id == paramID);
      //note removed from array by splicing, which mutates original array
      parsedNotes.splice(noteIndex, 1);
      //db.json then rewritten once note deleted
      fs.writeFileSync("./db/db.json", JSON.stringify(parsedNotes));
      res.json(parsedNotes);
    }
  });
});

app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));
