import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';
import { useDispatch } from 'react-redux';
import * as sessionActions from "./store/session";
import Navigation from './components/Navigation';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Routes>
          <Route path="/loginOLD" element={<LoginFormPage />} />
          <Route path="/signup" element={<SignupFormPage />} />
          <Route path='/' element={<h1>Hello World</h1>} />
        </Routes>
      )
      }
    </>
  );
}

export default App;
