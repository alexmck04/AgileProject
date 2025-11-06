import validator from "validator";
import { useNavigate } from "react-router-dom";


function Registerpage() {
  const navigator = useNavigate();

  // Function to validate email format
  const validateEmail = (email) => {;
	return validator.isEmail(email)
};

  const checkSubmit = async (e) => {
    // Disable default form submission behavior
    e.preventDefault();

    // Get input values
    let name = document.getElementById("nameField").value;
    let email = document.getElementById("emailField").value;
    let password = document.getElementById("passwordField").value;

    // Prevent submission if any field is empty
    if (name === "" || email === "" || password === "") {
      alert("Please fill in all fields.");
      return;
    }

    // Validate email format and alert if invalid
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Create an object with the registration details
    const registrationDetails = {
      email,
      password,
      name,
    };
    alert("Registration successful!");
    navigator("/login");



    
//     // send registration details to backend as json
//     try {
//       const response = await fetch("#", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(registrationDetails),
//       });

//       // Handle response
//       if (response.ok) {
//         const result = await response.json();
//         console.log(result);

//         alert("Registration successful!");
//         navigator("/login");

     
//       } else {
//         const result = await response.json();
//         console.log(result);
//         alert(result.error);
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Submission error.");
//     }
  };



  return (
    <div className="login-body">
      <h1>Register</h1>
      {/* Registration details submission*/}
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