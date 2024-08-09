import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import Spinner from './Spinner';
import './EditBlogs.css';

const EditBlogs = ({ user }) => {
    const currentUsername = user.username;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editImage, setEditImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/posts/author/${currentUsername}`,{ withCredentials: true })
            .then(response => {
                setLoading(false);
                setPosts(response.data);
            })
            .catch(error => {
                console.error("There was an error retrieving the posts!", error);
            });
    }, [currentUsername]);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/api/posts/${id}`)
            .then(() => {
                setPosts(posts.filter(post => post._id !== id));
            })
            .catch(error => {
                console.error("There was an error deleting the post!", error);
            });
    };

    const handleEdit = (post) => {
        setEditMode(post._id);
        setEditTitle(post.title);
        setEditContent(post.bcont);
        setEditImage(null); // Reset new image
        setPreviewImage(post.image ? `data:${post.image.contentType};base64,${Buffer.from(post.image.data).toString('base64')}` : null);
    };

    const handleSave = async (id) => {
        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('bcont', editContent);
        if (editImage) {
            formData.append('image', editImage);
        }

        try {
            const response = await axios.put(`http://localhost:8000/api/posts/${id}`,{ withCredentials: true }, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setPosts(posts.map(post => (post._id === id ? response.data : post)));
            setEditMode(null);
        } catch (error) {
            console.error("There was an error updating the post!", error);
        }
    };

    const handleCancel = () => {
        setEditMode(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImage(file);
            setPreviewImage(URL.createObjectURL(file)); // Create a preview URL for the new image
        }
    };

    if (loading) return <div className='spin'><Spinner/></div>
    return (
        <div>
            <div className='scroll-container'>
                <h1>Edit Your Blog Posts</h1>
                <div className='blog-entries-edit'>
                    {posts.map(post => (
                        <div key={post._id} className="blog-entry-edit">
                            {editMode === post._id ? (
                                <>
                                    <p>Title:</p>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className='editable'
                                    />
                                    <p>Content:</p>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className='editable'
                                    />
                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="Blog"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <br />
                                    <button onClick={() => handleSave(post._id)} className='edit-btn'>Save</button>
                                    <button onClick={handleCancel} className='delete-btn'>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <h2 className='blogtitle'>{post.title}</h2>
                                    <p>{post.bcont}</p>
                                    {post.image && (
                                        <img
                                            src={`data:${post.image.contentType};base64,${Buffer.from(post.image.data).toString('base64')}`}
                                            alt="Blog"
                                        />
                                    )}
                                    <button onClick={() => handleEdit(post)} className='edit-btn'>Edit</button>
                                    <button onClick={() => handleDelete(post._id)} className='delete-btn'>Delete</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditBlogs;
