import validator from "validator";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


function Registerpage() {
  const navigator = useNavigate();

  const validateEmail = (email) => {
    return validator.isEmail(email);
  };

  const checkSubmit = async (e) => {
    e.preventDefault();

    let name = document.getElementById("nameField").value;
    let email = document.getElementById("emailField").value;
    let password = document.getElementById("passwordField").value;

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      //Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      //Store additional details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date(),
      });

      alert("Registration successful!");
      navigator("/login");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="login-body">
      <h1>Register</h1>

      <form onSubmit={checkSubmit}>
        <input type="text" id="nameField" placeholder="Enter name..." required />

        <input type="text" id="emailField" placeholder="Enter email..." required />

        <input type="password" id="passwordField" placeholder="Enter password..." required />

        <button type="submit" id="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default Registerpage;
