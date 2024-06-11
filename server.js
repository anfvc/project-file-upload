import express from "express";
import mongoose from "mongoose";
import Album from "./Model/Album.js";
import cors from "cors";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./frontend/public/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: { fileSize: 150000 }, // 150kb
});

const upload = multer({ storage: storage });

const app = express();

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
    let toUpdate = await Album.findByIdAndUpdate(id, { jacket: req.file.filename }, { new: true });

    res.status(200).json(toUpdate);
  } catch (error) {
    next(error);
  }
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

app.listen(3002, () => {
  console.log("Server is listening to port 3002");
});
