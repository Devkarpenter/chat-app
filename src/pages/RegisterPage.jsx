import React, { useState } from 'react'
import { useAuth } from '../utils/AuthContext'
import { Link } from 'react-router-dom'

const RegisterPage = () => {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password1: '',
    password2: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const { handleRegister } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleRegister(e, credentials);
    if (success) {
      setSuccessMessage("Registration successful! You can now log in.");
      setCredentials({ name: '', email: '', password1: '', password2: '' });
    }
  };

  return (
    <div className="auth--container">
      <div className="form--wrapper">

        {successMessage && (
          <div className="success-message">
            <p style={{ color: 'green', marginBottom: '15px' }}>
              {successMessage} <Link to="/login">Login now</Link>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field--wrapper">
            <label>Name:</label>
            <input
              required
              type="text"
              name="name"
              value={credentials.name}
              placeholder="Enter your name..."
              onChange={handleInputChange}
            />
          </div>

          <div className="field--wrapper">
            <label>Email:</label>
            <input
              required
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={credentials.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="field--wrapper">
            <label>Password:</label>
            <input
              required
              type="password"
              name="password1"
              placeholder="Enter a password..."
              value={credentials.password1}
              onChange={handleInputChange}
            />
          </div>

          <div className="field--wrapper">
            <label>Confirm password:</label>
            <input
              required
              type="password"
              name="password2"
              placeholder="Confirm your password..."
              value={credentials.password2}
              onChange={handleInputChange}
            />
          </div>

          <div className="field--wrapper">
            <input
              className="btn btn--lg btn--main"
              type="submit"
              value="Register"
            />
          </div>
        </form>

        <p>Already have an account? Login <Link to="/login">here</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
