import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminForumDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Posts");


  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        console.error("No access token found.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [postRes, reportRes, commentRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}forum/posts/`, config),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}forum/reports/`, config),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}forum/comments/`, config),
      ]);

      setPosts(postRes.data.results);
      setReports(reportRes.data.results);
      setComments(commentRes.data.results);
    } catch (err) {
      console.error("Error fetching admin forum data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPostTitleById = (id) => {
    const post = posts.find((p) => p.id === id);
    return post ? post.title : `Post #${id}`;
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    const token = getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let endpoint = '';
      if (type === 'post') endpoint = `forum/posts/${id}/`;
      else if (type === 'comment') endpoint = `forum/comments/${id}/`;
      else if (type === 'report') endpoint = `forum/reports/${id}/`;

      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, config);
      fetchData(); // Refresh
    } catch (err) {
      console.error(`Failed to delete ${type}:`, err);
    }
  };

  const handleView = (type, id) => {
    if (type === 'post') navigate(`/forum/posts/${id}`);
    else if (type === 'report') alert(`No report view page yet`);
  };

  const renderActions = (type, id, showView = true) => (
    <td className="border p-2">
      {showView && (
        <button className="text-blue-600 mr-2" onClick={() => handleView(type, id)}>View</button>
      )}
      <button className="text-red-600" onClick={() => handleDelete(type, id)}>Delete</button>
    </td>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Forum Dashboard</h1>
  
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6">
            {["Posts", "Comments", "Reports"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
  
          {/* Tab Content */}
          {activeTab === "Posts" && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Posts</h2>
              <table className="min-w-full border bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Title</th>
                    <th className="border p-2">Author</th>
                    <th className="border p-2">Created</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="border p-2">{post.id}</td>
                      <td className="border p-2">{post.title}</td>
                      <td className="border p-2">{post.author_username || '-'}</td>
                      <td className="border p-2">{new Date(post.created_at).toLocaleString()}</td>
                      {renderActions('post', post.id)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
  
          {activeTab === "Comments" && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Comments</h2>
              <table className="min-w-full border bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Post Title</th>
                    <th className="border p-2">Author</th>
                    <th className="border p-2">Content</th>
                    <th className="border p-2">Created</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr key={comment.id}>
                      <td className="border p-2">{comment.id}</td>
                      <td className="border p-2">{getPostTitleById(comment.post)}</td>
                      <td className="border p-2">{comment.author_username || '-'}</td>
                      <td className="border p-2">{comment.content}</td>
                      <td className="border p-2">{new Date(comment.created_at).toLocaleString()}</td>
                      {renderActions('comment', comment.id, false)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
  
          {activeTab === "Reports" && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Reports</h2>
              <table className="min-w-full border bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">User</th>
                    <th className="border p-2">Post</th>
                    <th className="border p-2">Comment</th>
                    <th className="border p-2">Reason</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Created</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td className="border p-2">{report.id}</td>
                      <td className="border p-2">{report.user}</td>
                      <td className="border p-2">
                        {report.post ? getPostTitleById(report.post) : '-'}
                      </td>
                      <td className="border p-2">
                        {report.comment ? report.comment : '-'}
                      </td>
                      <td className="border p-2">{report.reason}</td>
                      <td className="border p-2">{report.description}</td>
                      <td className="border p-2">{new Date(report.created_at).toLocaleString()}</td>
                      {renderActions('report', report.id)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </>
      )}
    </div>
  );  
};

export default AdminForumDashboard;
