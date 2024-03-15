import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './SignIn';
import Dashboard from './Dashboard';
import Ingredients from './Ingredients';
import Equipment from './Equipment';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/equipment" element={<Equipment />} />
      </Routes>
    </Router>
  );
};

export default App;
