import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Buffer } from 'buffer'; // Ensure this import is added if using Buffer for image data
import './IndividualBlog.css';

const IndividualBlog = ({ user }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/posts/${id}`, { withCredentials: true })
      .then(response => {
        setPost(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the post!', error);
        setError('There was an error fetching the post.');
        setLoading(false);
      });
  }, [id]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <div className="individual-blog">
      {post && (
        <div className="blog-entry">
          <h1 className="blogtit">{post.title}</h1>
          {post.image && (
            <img 
              src={`data:${post.image.contentType};base64,${Buffer.from(post.image.data).toString('base64')}`} 
              alt={post.title} 
              className="blog-image"
            />
          )}
          <p>{post.bcont}</p>
          <p>{"-"+post.name}</p>
        </div>
      )}
    </div>
  );
};

export default IndividualBlog;
