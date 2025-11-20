import { useState } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Registerpage() {
  const navigator = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => validator.isEmail(email);

  const checkSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return alert("Please fill in all fields.");
    if (!validateEmail(email)) return alert("Please enter a valid email address.");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      alert("Registration successful!");
      navigator("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-body">
      <h1>Register</h1>

      <form onSubmit={checkSubmit}>
        <input
          type="text"
          id="nameField"
          placeholder="Enter name..."
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          id="emailField"
          placeholder="Enter email..."
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          id="passwordField"
          placeholder="Enter password..."
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" id="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default Registerpage;
