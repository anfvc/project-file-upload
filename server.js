import express from "express";
import mongoose from "mongoose";
import Album from "./Model/Album.js";
import cors from "cors";
import multer from "multer";
import path from "path"
import { fileURLToPath } from "url"

const app = express();
//*get the current file and directory

const __filename = fileURLToPath(import.meta.url); //absolute path to the current file
const __dirname = path.dirname(__filename); //directory name of the current file

app.use(express.static(path.join(__dirname, "frontend/dist"))); //specify the path for our frontend (current directory + path we want to get in)

//* Server our files statically from the server side

//* Multer configuration:

let storage;
if (process.env.NODE_ENV === "development") {
  storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./frontend/public/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
    limits: { fileSize: 150000 }, // 150kb
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./frontend/dist/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
    limits: { fileSize: 150000 }, // 150kb
  });
}

const upload = multer({ storage: storage });


app.use(express.json());
app.use(cors());

//* Store your own MongoDB connection string in .env file!
try {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  console.log("Database is connected! 🐱");
} catch (error) {
  console.log(error.message);
  console.log("Database connection failed... :(");
}

//* Default route
app.get("/", async (req, res) => {
  const albums = await Album.find();
  res.status(200).json(albums);
});

app.post("/add", upload.single("jacket"), async (req, res, next) => {
  try {
    let newAlbum = new Album(req.body);
    if (req.file) {
      newAlbum.jacket = req.file.filename;
      await newAlbum.save();
      res.status(200).json(newAlbum);
    }
  } catch (error) {
    next(error);
  }
});

app.delete("/delete/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const toDelete = await Album.findByIdAndDelete(id);
    res.status(200).json(toDelete);
  } catch (error) {
    next(error);
  }
});

app.patch("/update/:id", upload.single("jacket"), async (req, res, next) => {
  const id = req.params.id;
  try {
    let toUpdate = await Album.findByIdAndUpdate(
      id,
      { jacket: req.file.filename },
      { new: true }
    );

    res.status(200).json(toUpdate);
  } catch (error) {
    next(error);
  }
});

//All other requests except for the 4 server routes above
app.get("*", (req, res, next) => {
  res.sendFile(__dirname + "/frontend/dist/assets/index.html");
});

//* Global Error Handling
app.use(function errorHandler(err, req, res, next) {
  console.log("error handler is running...");
  res.status(err.status || 400).send({
    error: {
      message: err.message,
      status: err.status,
    },
  });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});
