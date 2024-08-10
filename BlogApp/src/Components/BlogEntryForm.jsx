import React, { useState } from 'react';
import axios from 'axios';
import './BlogEntryForm.css';
import { useNavigate } from "react-router-dom";

const BlogEntryForm = ({ user }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('name', user.name);
    formData.append('title', title);
    formData.append('bcont', content);
    formData.append('image', image);

    axios.post('https://publicblog-server-v2.vercel.app/api/posts', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(response => {
      setTitle('');
      setContent('');
      setImage(null);
      alert('Post created successfully!');
      navigate("/");
    })
    .catch(error => {
      console.error('There was an error creating the post!', error);
      setIsSubmitting(false); // Re-enable button if there's an error
    });
  };

  return (
    <form className="blog-entry-form" onSubmit={handleSubmit}>
      <h1>Add Your Blog</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        maxLength={1400}
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      ></textarea>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Add Blog Entry'}
      </button>
    </form>
  );
};

export default BlogEntryForm;
