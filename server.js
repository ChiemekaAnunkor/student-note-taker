const { channel } = require("diagnostics_channel");
const express = require("express");
const fs = require("fs");
const path = require("path");
const bd = require("./db/notes.json");
const uid = require("./helper/uid");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//get for front end

app.post("/api/notes", (req, res) => {
  console.log(req.body);
  console.info(req.body);

  if (req.body && req.body.title) {
    const { title, text } = req.body;
    const newData = {
      title,
      text,
      uid: uid(),
    };
    const response = {
      status: "success",
      body: newData,
    };
    console.log(response);

    fs.readFile("./db/notes.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsednotes = JSON.parse(data);

        // Add a new review
        parsednotes.push(newData);

        // Write updated reviews back to the file
        fs.writeFile(
          "./db/notes.json",
          JSON.stringify(parsednotes, null, 4), /// took this code form the teacher????? what does it
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated reviews!")
        );
      }
    });

    console.info(`${req.method} was recieved`);
    console.log(response);
    res.status(201).json(response);
    // res.render("/public/index.html");
  } else {
    res.status(500).send("invalid entry, must enter atleast a title");
  }
});

//delete

app.delete("/api/notes/:uid", (req, res) => {
  const { uid } = req.params;
  fs.readFile("./db/notes.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      let parsednotes = JSON.parse(data);

      const deleted = parsednotes.find((note) => (note.uid = uid));
      if (deleted) {
        parsednotes = parsednotes.filter((note) => note.uid !== uid);
        // Write updated reviews back to the file
        fs.writeFile(
          "./db/notes.json",
          JSON.stringify(parsednotes, null, 4), /// took this code form the teacher????? what does it
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated reviews!")
        );
        const response = {
          status: "success",
          body: deleted,
        };
        console.log(response);

        res.status(201).json(response);
      } else {
        res
          .status(404)
          .json({ message: " Note you are looking for does not exist" });
      }
    }
  });
});

app.get("/api/notes", (req, res) => {
  console.info(`${req.method} was recieved`);
  res.status(200).json(bd);
});

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.listen(process.env.PORT || 3001, () =>
  console.log(`App listening at http://localhost:3001`)
);
