import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = data;

    if (!email || !password) {
      alert('Please enter your email and password');
      return;
    }

    fetch('https://moniteer-backend.infinityymedia.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then((res) => {
        if (res.status === 200) {
          res.headers.forEach((value, name) => {
            if (name === 'set-cookie') {
              const jwtToken = value.split(';')[0].split('=')[1];
              document.cookie = `jwt=${jwtToken}; path=/; expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString()};`;
              alert("User successfully logged in")
              navigate("/")
              
            } else if (res.status === 400) {
              alert('Please fill in your form');
            } else if (res.status === 401) {
              alert('Invalid credentials');
            }
          })
            .catch((error) => {
              alert(`Error: ${error.message}`);
            });
        };

        return (
          <div className="loginpageContainer">
            <form method="POST" onSubmit={handleSubmit} className="logininfoContainer">
              <p>Email:</p>
              <input type="email" name="email" onChange={handleChange} />
              <p>Password:</p>
              <input type="password" name="password" onChange={handleChange} />
              <button type="submit">Login</button>
            </form>
          </div>
        );
      };

    export default Login;
