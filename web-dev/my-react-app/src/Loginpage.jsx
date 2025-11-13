
function Loginpage() {

  const checkSubmit = async (e) => {
    // Disable default form submission behavior
    e.preventDefault();


    // Get input values
    let email = document.getElementById("emailField").value;
    let password = document.getElementById("passwordField").value;

    // Create an object with the registration details
    const registrationDetails = {
      email,
      password,
    };

    // Prevent submission if any field is empty
    if (email === "" || password === "") {
      alert("Please fill in all fields.");
      return;
    }
    else {
      alert("Login successful!");
    }



    // // Send registration details to backend as json
    // try {
    //   const response = await fetch("#", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(registrationDetails),
    //   });

    //   // Handle response
    //   if (response.ok) {
    //     const result = await response.json();
    //     console.log(result);
    //     alert("Login successful!");
    //   } else {
    //     const result = await response.json();
    //     console.log(result);
    //     alert(result.error);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   alert("Submission error.");
    // }
  }

  return (
    <div className="login-body">
      <h1>Login</h1>
      {/* Login details submission*/}
      <form onSubmit={checkSubmit}>

        <input type="text" id="emailField" placeholder="Enter email..." required />

        <input type="text" id="passwordField" placeholder="Enter password..." required />

        <button type="submit" id="submit-button">Submit</button>
      </form>
    </div>
  );

}

export default Loginpage;