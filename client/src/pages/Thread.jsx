import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function Thread() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reply, setReply] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const postData = await api.get(`/posts/${id}`);
        const commentData = await api.get(`/comments?post_id=${id}`);

        setPost(postData);
        setComments(commentData.comments ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  async function submitReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;

    setPosting(true);
    try {
      const newComment = await api.post('/comments', {
        post_id: id,
        body: reply,
        is_anonymous: true
      });

      setComments((prev) => [...prev, newComment]);
      setReply('');
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div>
      {/* MAIN POST */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h2>{post.title}</h2>
        {post.body && <p>{post.body}</p>}
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          @{post.author_handle ?? 'anon'}
        </p>

        <div style={{ marginTop: 10, fontSize: 14 }}>
          ♥ {post.like_count ?? 0} · 💬 {post.comment_count ?? 0}
        </div>
      </div>

      {/* REPLY BOX */}
      <form className="card" onSubmit={submitReply} style={{ marginBottom: 16 }}>
        <textarea
          placeholder="Write a reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button className="btn" disabled={posting}>
          {posting ? 'Posting...' : 'Reply'}
        </button>
      </form>

      {/* COMMENTS */}
      <div>
        <h3>Replies</h3>

        {comments.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>No replies yet</p>
        )}

        {comments.map((c) => (
          <div key={c.id} className="card" style={{ marginBottom: 10 }}>
            <p>{c.body}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              @{c.author_handle ?? 'anon'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
