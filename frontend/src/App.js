import Navbar from "./Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import Login from "./Login";
import Register from "./Register";
import Account from "./Account";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Profile />}/>
        <Route path="/admin" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/profile" element={<Account />}/>
      </Routes>
    </>
  );
}

export default App;
