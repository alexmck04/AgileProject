import { Link } from "react-router-dom";


function Welcomepage() {
  return (
    <div className="login-body">
      <p>Welcome to the video game sales web portal.</p>
      <div id="button-container">
        <div>
          <Link to="/login">
            <button >Login</button>
          </Link>
        </div>
        <div>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcomepage;