import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setName(snap.data().name);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return null;

  return (
    <div className="homepage-container">

      <h1 className="homepage-title">Welcome, {name}!</h1>

      <p className="homepage-text">
        This system provides tools to explore and analyze video game sales data.
        You can browse interactive charts to discover trends by genre, platform,
        and region, or use the Game Sales Predictor to estimate a game's expected
        sales based on its attributes.
      </p>

      <p className="homepage-text">
        Use the navigation bar above to get started.
      </p>
    </div>
  );
}

export default HomePage;
