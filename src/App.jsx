import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import Confetti from "react-confetti";
import "./App.css";

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "pastel",
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [memories, setMemories] = useState(() => {
    const savedMemories = localStorage.getItem("memories");
    return savedMemories ? JSON.parse(savedMemories) : [];
  });
  const [newMemory, setNewMemory] = useState({
    img: "",
    title: "",
    caption: "",
  });
  const [preview, setPreview] = useState(null);

  const correctPassword = "drake";

  useEffect(() => {
    localStorage.setItem("memories", JSON.stringify(memories));
    localStorage.setItem("theme", theme);
  }, [memories, theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setNewMemory({ ...newMemory, img: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addMemory = () => {
    if (newMemory.img && newMemory.title) {
      const newEntry = {
        ...newMemory,
        id: Date.now(),
        date: new Date().toLocaleString(),
      };
      setMemories([...memories, newEntry]);
      setNewMemory({ img: "", title: "", caption: "" });
      setPreview(null);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      alert("Please add an image and title!");
    }
  };

  const deleteMemory = (id) => {
    setMemories(memories.filter((memory) => memory.id !== id));
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
              <img src={memory.img} alt={memory.title} />
              <Carousel.Caption>
                <h3>{memory.title}</h3>
                <p>{memory.caption}</p>
                <span className="timestamp">Added on: {memory.date}</span>
                <button onClick={() => deleteMemory(memory.id)}>
                  🗑️ Delete
                </button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p className="no-memories">
          No memories added yet. Start by adding one below!
        </p>
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
        <button onClick={addMemory}>Add Memory</button>
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
