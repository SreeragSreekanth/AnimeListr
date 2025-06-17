import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminForumDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('posts');

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}forum/posts/`);
      setPosts(res.data.results);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}forum/comments/`);
      setComments(res.data.results);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}forum/reports/`);
      setReports(res.data.results);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'posts') fetchPosts();
    if (tab === 'comments') fetchComments();
    if (tab === 'reports') fetchReports();
  }, [tab]);

  const handleDelete = async (id, type) => {
    if (!user?.access || !window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}forum/${type}/${id}/`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
      });
      if (tab === 'posts') fetchPosts();
      if (tab === 'comments') fetchComments();
      if (tab === 'reports') fetchReports();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const renderTable = (items, type) => (
    <table className="min-w-full bg-white border">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 border">ID</th>
          <th className="p-2 border">Content</th>
          <th className="p-2 border">Author</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-t">
            <td className="p-2 border">{item.id}</td>
            <td className="p-2 border">{item.title || item.body}</td>
            <td className="p-2 border">{item.author_username || '-'}</td>
            <td className="p-2 border">
              <button
                onClick={() => handleDelete(item.id, type)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Forum Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('posts')} className={`px-4 py-2 rounded ${tab === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Posts</button>
        <button onClick={() => setTab('comments')} className={`px-4 py-2 rounded ${tab === 'comments' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Comments</button>
        <button onClick={() => setTab('reports')} className={`px-4 py-2 rounded ${tab === 'reports' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Reports</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          {tab === 'posts' && renderTable(posts, 'posts')}
          {tab === 'comments' && renderTable(comments, 'comments')}
          {tab === 'reports' && renderTable(reports, 'reports')}
        </>
      )}
    </div>
  );
};

export default AdminForumDashboard;
