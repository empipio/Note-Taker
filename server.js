const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");
const uuid = require("./helpers/uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//readme suggests need * but doesn't jump to next page when this happens
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//jumps to notes page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//get all notes
app.get("/api/notes", function (req, res) {
  //want to read most up to date version of file
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNotes = JSON.parse(data);
      res.json(parsedNotes);
    }
  });
  //then return it
});

//get specific note
app.get("/api/notes/:id", function (req, res) {
  const { title, text, id } = req.body;
  res.json(notes[req.body.id]);
});

//this works on insomnia but not when deployed
app.post("/api/notes/", function (req, res) {
  const { title, text, id } = req.body;
  const newNote = {
    title,
    text,
    id: uuid(),
  };
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

app.delete("/api/notes/:id", function (req, res) {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNotes = JSON.parse(data);
      const paramID = req.params.id;
      const noteIndex = parsedNotes.findIndex((note) => note.id == paramID);
      parsedNotes.splice(noteIndex, 1);
      console.log(parsedNotes);
      fs.writeFileSync("./db/db.json", JSON.stringify(parsedNotes));
      res.json(parsedNotes);

      //get id from query parameter
      //read file and look for matching id
      //array.findindex to get element in array to remove
      //remove element from array - array.splice
      //rewrite file with new array

      // for (let i = 0; i < notes.length; i++) {
      //   if (notes[i].id == req.body.id) {
      //     notes.splice(req.body.id, 1);
      //     fs.writeFileSync("./db/db.json", JSON.stringify(notes), (writeErr) =>
      //       writeErr
      //         ? console.error(writeErr)
      //         : console.info("Successfully deleted note")
      //     );
      //   }
    }
  });
});

app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));

//click save->post request?
//get request to get existing notes? -> data persistence activity
//also get request to move note from column to main page but code for this should already be written so just request to do
//work out delete request
//fs is involved somewhere, I think in data persistence/saving the notes to db.json
//generate id for each note? uuid function seen in activities?

//only got api/notes so don't think need routes folder/modularization?

// The following API routes should be created:

// GET /api/notes should read the db.json file and return all saved notes as JSON.

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new
// note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that
//could do this for you).

//DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete. To delete a note, you'll
//need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to
// the db.json file.
