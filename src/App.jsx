import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import Confetti from "react-confetti";
import { storage, db } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
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

  // Real-time data sync
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "memories"), (snapshot) => {
      const fetchedMemories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemories(fetchedMemories);
    });

    return () => unsubscribe();
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Handle image upload
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

  // Add memory with Firebase upload
  const addMemory = async () => {
    if (newMemory.img && newMemory.title) {
      setUploading(true);

      try {
        const imageRef = ref(storage, `images/${newMemory.img.name}`);
        await uploadBytes(imageRef, newMemory.img);
        const imageUrl = await getDownloadURL(imageRef);

        await addDoc(collection(db, "memories"), {
          title: newMemory.title,
          caption: newMemory.caption,
          img: imageUrl,
          date: new Date().toLocaleString(),
        });

        setNewMemory({ img: null, title: "", caption: "" });
        setPreview(null);
        setUploading(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } catch (error) {
        console.error("Error uploading memory:", error);
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
              <img src={memory.img} alt={memory.title} className="carousel-img" />
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
        {preview && (
          <img src={preview} alt="Preview" className="image-preview" />
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Title"
          value={newMemory.title}
          onChange={(e) =>
            setNewMemory({ ...newMemory, title: e.target.value })
          }
        />
        <textarea
          placeholder="Caption"
          value={newMemory.caption}
          onChange={(e) =>
            setNewMemory({ ...newMemory, caption: e.target.value })
          }
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
