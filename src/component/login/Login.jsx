import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { auth, db } from "../libere/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Upload from "../libere/Upload";

function Login() {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in successfully!");
    } catch (err) {
      console.log("Login error:", err);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");

    if (!email || !password || !username) {
      toast.error("Please fill out all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgurl = await Upload(avatar.file);
      await setDoc(doc(db, "users", res.user.uid), {
        username: username,
        email,
        avatar: imgurl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userschats", res.user.uid), {
        chats: [],
      });

      toast.success("User registered successfully!");
    } catch (err) {
      console.log("Registration error:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="email" name="email" placeholder="Email..." required />
          <input type="password" name="password" placeholder="Password..." required />
          <button disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
        </form>
      </div>

      <div className="separator"></div>

      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an image
          </label>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
            id="file"
            accept="image/*"
          />
          <input type="email" name="email" placeholder="Email..." required />
          <input type="text" name="username" placeholder="Username..." required />
          <input type="password" name="password" placeholder="Password..." required />
          <button disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
