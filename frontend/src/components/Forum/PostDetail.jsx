import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, getToken } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}forum/posts/${id}/`);
      setPost(res.data);
      setComments(res.data.comments || []);
      setEditedContent(res.data.content);
    } catch (err) {
      console.error("Failed to load post", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}forum/posts/${id}/comments/`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setNewComment("");
      fetchPost();
    } catch (err) {
      console.error("Failed to submit comment", err);
      setError("You must be logged in to comment.");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}forum/posts/${id}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      navigate("/forum");
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const handleEditPost = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}forum/posts/${id}/`,
        { title: post.title, content: editedContent },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setPost(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  const handleReport = async (targetType, targetId) => {
    const reason = prompt("Enter a reason for reporting:");
    if (!reason) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}forum/reports/`,
        {
          target_type: targetType,
          target_id: targetId,
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      alert("Reported successfully. Thank you.");
    } catch (err) {
      console.error("Failed to report", err);
      alert("Failed to report. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}forum/posts/${id}/comments/${commentId}/`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      fetchPost();
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}forum/posts/${id}/comments/${commentId}/`,
        { content: editedCommentContent },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setEditingCommentId(null);
      setEditedCommentContent("");
      fetchPost();
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (!post) return <div className="p-6 text-gray-500">Loading post...</div>;

  const isOwner = user?.username === post.author_username || user?.is_staff;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {editMode ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="5"
            className="w-full border rounded p-3 text-lg"
          />
          <div className="mt-3 space-x-2">
            <button
              onClick={handleEditPost}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-indigo-700">{post.title}</h1>
          <p className="text-gray-700 mt-4 whitespace-pre-line">{post.content}</p>
          <p className="text-sm text-gray-500 mt-2">👤 {post.author_username}</p>
          {user && user.username !== post.author_username && (
            <button
              onClick={() => handleReport("post", post.id)}
              className="text-sm text-red-500 mt-1"
            >
              🚩 Report Post
            </button>
          )}

          {isOwner && (
            <div className="mt-4 space-x-4">
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-600 font-semibold"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDeletePost}
                className="text-red-600 font-semibold"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </>
      )}

      <hr className="my-6" />

      <h2 className="text-xl font-semibold text-indigo-600 mb-2">
        Comments ({comments.length})
      </h2>

      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => {
            const canEdit =
              user?.username === comment.author_username || user?.is_staff;
            return (
              <div key={comment.id} className="bg-gray-50 p-3 rounded border">
                {editingCommentId === comment.id ? (
                  <>
                    <textarea
                      className="w-full border p-2"
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                    />
                    <div className="mt-2 space-x-2 text-sm">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="text-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-800">{comment.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      👤 {comment.author_username}
                    </p>
                    <div className="mt-1 text-sm text-gray-500 space-x-4">
                      {canEdit && (
                        <>
                          <button
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditedCommentContent(comment.content);
                            }}
                            className="text-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {user && user.username !== comment.author_username && (
                        <button
                          onClick={() => handleReport("comment", comment.id)}
                          className="text-red-500"
                        >
                          🚩 Report
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

{user ? (
  user.username !== post.author_username ? (
    <form onSubmit={handleCommentSubmit} className="space-y-2">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows="3"
        className="w-full border rounded p-2"
        placeholder="Write a comment..."
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Add Comment
      </button>
    </form>
  ) : (
    <p className="text-gray-500 italic mt-4">
      You cannot comment on your own post.
    </p>
  )
) : (
  <p className="text-gray-500 mt-4 italic">Login to comment on this post.</p>
)}

    </div>
  );
};

export default PostDetail;
