const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
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
