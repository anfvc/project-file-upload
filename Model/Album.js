import { Schema, model } from "mongoose";

const albumSchema = new Schema(
  {
    jacket: {
      type: String,
      required: true,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/320px-User-avatar.svg.png",
    },
    artist: {
      type: String,
        required: true,
        // unique: true, //! this disallows us from adding albums from the same artist 
    },
    year: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true
    }
  },
  { versionKey: false }
);

const Album= model("album", albumSchema);
export default Album;
