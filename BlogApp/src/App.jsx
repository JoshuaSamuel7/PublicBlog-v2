import { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Components/Header';
import BlogEntries from './Components/BlogEntries';
import EditBlogs from './Components/EditBlogs';
import AboutUs from './Components/AboutUs';
import { AuthContext, AuthProvider } from './Components/AuthContext';
import Login from './Components/Login';
import Signup from './Components/SignUp';
import PeopleList from './Components/PeopleList';
import IndividualBlog from './Components/IndividualBlog';
import BlogEntryForm from './Components/BlogEntryForm';
import Profile from './Components/Profile';
import Spinner from './Components/Spinner';
import './App.css';

const AppWrapper = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/current_user', { withCredentials: true })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.log('No user logged in');
      })
      .finally(() => {
        setLoading(false); // Set loading to false once data is fetched
      });
  }, []);
  if (loading) {
    return <div className="loading"><Spinner/></div>; // Placeholder or spinner
  }
  return (
    <div className="app-wrapper">
      <Header user={user} setUser={setUser} />
      <div className="content-wrapper">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/" element={<div className='container'><BlogEntries /></div>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/posts/:id" element={<IndividualBlog />} />
          <Route path="/add-blogs" element={user ? <BlogEntryForm user={user} /> : <Navigate to="/login" />} />
          <Route path="/edit-blogs" element={user ? <EditBlogs user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
