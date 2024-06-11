import { useState } from "react";

const Album = ({ album, getAlbums, inputs, setInputs }) => {
  const [isClicked, setIsClicked] = useState(false);
  async function handleUpdate() {
    try {
      const formData = new FormData();
      formData.append("jacket", inputs.jacket);
      setInputs({});

      const response = await fetch(
        `${import.meta.env.VITE_API}/update/${album._id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        getAlbums();
        alert(`updated!`);
        setIsClicked(!isClicked);
      } else throw new Error("please choose a valid file");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }
  async function handleDelete() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/delete/${album._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        getAlbums();
        alert(`user ${album.title} has been successfully deleted!`);
      } else {
        throw new Error("something went wrong....");
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="card">
      {!isClicked && (
        <div className="img-container">
          <img width="100" height="100" src={album.jacket} />
          <button onClick={() => setIsClicked(!isClicked)}>Change image</button>
        </div>
      )}
      {isClicked && (
        <div className="update">
          <input
            type="file"
            onChange={(e) =>
              setInputs({ ...inputs, jacket: e.target.files[0] })
            }
            accept="image/*"
          />
          <div className="update-btn">
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setIsClicked(false)}>Back</button>
          </div>
        </div>
      )}
      <p>Artist: {album.artist}</p>
      <p>Title: {album.title}</p>
      <p>{album.year}</p>

      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default Album;
