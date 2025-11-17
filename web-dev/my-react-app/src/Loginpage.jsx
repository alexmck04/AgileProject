import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function Loginpage() {
  const navigator = useNavigate();

  const checkSubmit = async (e) => {
    e.preventDefault();

    let email = document.getElementById("emailField").value;
    let password = document.getElementById("passwordField").value;

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Try logging in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful!");

      // Navigate to Chartspage on success
      navigator("/charts");

    } catch (error) {
      console.error(error);

      if (error.code === "auth/user-not-found") {
        alert("No account found with that email.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  return (
    <div className="login-body">
      <h1>Login</h1>

      <form onSubmit={checkSubmit}>
        <input type="text" id="emailField" placeholder="Enter email..." required />
        <input type="password" id="passwordField" placeholder="Enter password..." required />
        <button type="submit" id="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default Loginpage;


//...