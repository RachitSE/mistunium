import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import Confetti from "react-confetti";
import axios from "axios";
import "./App.css";

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "pastel"
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState({
    img: null,
    title: "",
    caption: "",
  });
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const correctPassword = "drake";

  // Fetch images directly from Cloudinary
  const fetchMemories = async () => {
    try {
      const response = await axios.get("api/memories");

      console.log("Fetched memories:", response.data); // Log the raw response

      const fetchedMemories = response.data.map((item, index) => ({
        id: item.public_id || item.asset_id || `memory-${index}`, // Ensure a unique ID
        img: item.secure_url,
        title: item.context?.custom?.title || "Untitled",
        caption: item.context?.custom?.caption || "No caption added",
        date: item.created_at ? new Date(item.created_at).toLocaleString() : "Invalid Date",
      }));

      console.log("Mapped memories:", fetchedMemories); // Log the mapped data

      setMemories(fetchedMemories);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/memories", {
          params: {
            context: true, // Ask for context data
          },
        });
        console.log("Fetched memories:", response.data);
        setMemories(response.data);
      } catch (error) {
        console.error("Error fetching memories:", error);
      }
    };

    fetchMemories();
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setNewMemory({ ...newMemory, img: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file, title, caption) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("context", `title=${title}|caption=${caption}`);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      console.log("Cloudinary upload response:", response.data); // Log the full response

      return response.data; // Return the full response
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      alert("Failed to upload image. Check console for details.");
      return null;
    }
  };

  const addMemory = async () => {
    if (newMemory.img && newMemory.title) {
      setUploading(true);

      try {
        const uploadResponse = await uploadToCloudinary(newMemory.img, newMemory.title, newMemory.caption);

        if (uploadResponse) {
          const newEntry = {
            id: uploadResponse.public_id || `memory-${Date.now()}`,
            title: newMemory.title,
            caption: newMemory.caption,
            img: uploadResponse.secure_url,
            date: new Date().toLocaleString(),
          };

          console.log("New entry added:", newEntry); // Log the new entry

          setMemories((prev) => [...prev, newEntry]);
          setNewMemory({ img: null, title: "", caption: "" });
          setPreview(null);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);

          fetchMemories(); // Refresh the list
        }
      } catch (error) {
        console.error("Error adding memory:", error);
      } finally {
        setUploading(false);
      }
    } else {
      alert("Please add an image and title!");
    }
  };

  const handleLogin = () => {
    if (password === correctPassword) {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  };

  if (!loggedIn) {
    return (
      <div className="login-container">
        <h1>Memory Gallery Login</h1>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {loginError && <p className="error">{loginError}</p>}
      </div>
    );
  }

  return (
    <div className={`app-container ${theme}`}>
      {showConfetti && <Confetti />}
      <header className="header">
        <h1>Welcome to THE Memory Gallery 🌸</h1>
        <p>Cherish memories forever</p>
      </header>

      {memories.length > 0 ? (
        <Carousel className="carousel" interval={3000} pause="hover">
          {memories.map((memory) => (
            <Carousel.Item key={memory.id}>
              <img
                src={memory.img}
                alt={memory.title}
                className="carousel-img"
              />
              <Carousel.Caption>
                <h3>{memory.title}</h3>
                <p>{memory.caption}</p>
                <span className="timestamp">Added on: {memory.date}</span>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p className="no-memories">No memories added yet. Start by adding one below!</p>
      )}

      <div className="memory-form">
        <h2>Add a New Memory</h2>
        {preview && <img src={preview} alt="Preview" className="image-preview" />}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Title"
          value={newMemory.title}
          onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
        />
        <textarea
          placeholder="Caption"
          value={newMemory.caption}
          onChange={(e) => setNewMemory({ ...newMemory, caption: e.target.value })}
        />
        <button onClick={addMemory} disabled={uploading}>
          {uploading ? "Uploading..." : "Add Memory"}
        </button>
      </div>

      <div className="theme-switcher">
        <button onClick={() => changeTheme("pastel")}>🌸 Pastel</button>
        <button onClick={() => changeTheme("silver")}>⚪ Silver</button>
        <button onClick={() => changeTheme("dark")}>🌙 Dark</button>
      </div>
    </div>
  );
}

export default App;
