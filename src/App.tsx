import React from 'react';
import './App.css';
import Dashboard from "./views/Dashboard";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from "./views/Login";

function App() {
    return (
        <Router>
            <Route path="/" exact component={Login}></Route>
            <Route path="/dashboard" component={Dashboard}></Route>
        </Router>
    );
}

export default App;
