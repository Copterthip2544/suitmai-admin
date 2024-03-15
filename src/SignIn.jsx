import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import logo from './image/Logo.png';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, navigate to the dashboard or any other protected route
        navigate('/dashboard', { replace: true });
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Successfully signed in with email and password');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error signing in with email and password:', error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Successfully signed up with email and password');
      // You can handle the sign-up process here
    } catch (error) {
      console.error('Error signing up with email and password:', error.message);
    }
  };

  return (
    <div className="form-signin-container">
      <div className='Logo'>
        <img src={logo} alt="Logo" />
      </div>
      {isSignIn ? (
        <div className="email-sign-in">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="sign-in-btn" onClick={handleSignIn}>
            Sign In
          </button>
          <p style={{ color: '#000000'}}>
            Don't have an account?{' '}
            <span onClick={() => setIsSignIn(false)}>
              <ins>Sign Up</ins>
            </span>
          </p>
        </div>
      ) : (
        <div className="email-sign-up">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="sign-up-btn" onClick={handleSignUp}>
            Sign Up
          </button>
          <p style={{ color: '#000000'}}>
            Already have an account?{' '}
            <span onClick={() => setIsSignIn(true)}>
              <ins>Sign In</ins>
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignIn;
