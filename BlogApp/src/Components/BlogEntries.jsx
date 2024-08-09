import React, { useEffect, useState } from 'react';
import './BlogEntries.css';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Link } from 'react-router-dom';
import PeopleList from './PeopleList.jsx';

const BlogEntries = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserListVisible, setIsUserListVisible] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/posts',{ withCredentials: true });
        setPosts(response.data);
      } catch (error) {
        console.error('There was an error fetching the posts!', error);
        setError('There was an error fetching the posts!');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users',{ withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        console.error('There was an error fetching the users!', error);
        setError('There was an error fetching the users!');
      }
    };

    fetchPosts();
    fetchUsers();
  }, []);

  const truncateContent = (content, maxWords) => {
    const words = content.split(' ');
    if (words.length <= maxWords) return content;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleUserSelect = async (userName) => {
    setSelectedUser(userName);
    setIsLoading(true);

    try {
      const response = await axios.get(`http://localhost:8000/api/posts/author/${userName}`);
      setPosts(response.data);
    } catch (error) {
      console.error('There was an error fetching the posts by author!', error);
      setError('There was an error fetching the posts by author!');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.bcont.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserList = () => {
    setIsUserListVisible(!isUserListVisible);
  };

  const closeUserList = () => {
    setIsUserListVisible(false);
  };

  return (
    <div className="blog-entries-container">
      <div className="main-content">
        {isLoading ? (
          <p className='load'>Loading...</p>
        ) : (
          <>
            <h1>Blog Posts</h1>
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-bar"
              />
              <button onClick={toggleUserList} className="author-search-button">Search by Author</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="blog-entries">
              {filteredPosts.map(post => (
                <div key={post._id} className="blog-entry">
                  <h2>
                    <Link className="blogtitle" to={`/posts/${post._id}`}>{post.title}</Link><h4> {" - " + post.name}</h4>
                  </h2>
                  {post.image && (
                    <img 
                      src={`data:${post.image.contentType};base64,${Buffer.from(post.image.data.data).toString('base64')}`} 
                      alt={post.title} 
                    />
                  )}
                  <p>
                    {truncateContent(post.bcont, 50)} {post.bcont.split(' ').length > 50 && <Link to={`/posts/${post._id}`}>Read more</Link>}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={`sidebar ${isUserListVisible ? 'visible' : ''}`}>
        <button onClick={closeUserList} className="close-button">Close</button>
        <PeopleList users={users} onSelectUser={handleUserSelect} />
      </div>
    </div>
  );
};

export default BlogEntries;
