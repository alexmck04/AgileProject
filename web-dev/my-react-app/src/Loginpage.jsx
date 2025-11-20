import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Loginpage() {
  const navigator = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;
      const ref = doc(db, "users", user.uid);
      await getDoc(ref); // ensures Firestore is ready

      navigator("/home");
    } catch (error) {
      if (error.code === "auth/user-not-found") alert("No account found.");
      else if (error.code === "auth/wrong-password") alert("Incorrect password.");
      else alert(error.message);
    }
  };

  return (
    <div className="login-body">
      <h1>Login</h1>

      <form onSubmit={checkSubmit}>
        <input
          type="email"
          placeholder="Enter email..."
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter password..."
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Loginpage;
