// ============================================================
// pages/home/Home.jsx — Social feed page
//
// - Fetches posts from API on mount (with dummy fallback)
// - Displays post cards with like/comment actions
// - Shows loading skeleton while fetching
// ============================================================

import { useState, useEffect, useContext } from "react";
import { api } from "../../api/axiosInstance";
import { POST_ROUTES } from "../../utils/constants";
import { AppContext } from "../../context/AppContext";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

// ---------- Dummy data (used when API is not available) ----------
// const DUMMY_POSTS = [
//     {
//         _id: '1',
//         author: { name: 'Alice Chen', avatar: null },
//         content: 'Just shipped a new feature! 🚀 The new dashboard is live. Check it out and let me know what you think.',
//         likes: 42,
//         comments: 8,
//         createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
//         liked: false,
//     },
//     {
//         _id: '2',
//         author: { name: 'Bob Martinez', avatar: null },
//         content: 'Working on some exciting open-source projects this weekend. React + Vite is such a joy to work with. Anyone else building something cool?',
//         likes: 27,
//         comments: 14,
//         createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 min ago
//         liked: true,
//     },
//     {
//         _id: '3',
//         author: { name: 'Sara Kim', avatar: null },
//         content: 'Reminder: good code is not just about functionality — it\'s about readability, maintainability, and empathy for the next developer. 💡',
//         likes: 89,
//         comments: 23,
//         createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hrs ago
//         liked: false,
//     },
// ]

// ---------- Time ago helper ----------
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ---------- PostCard component ----------
const PostCard = ({ post, onLike }) => {
  return (
    <article className="card p-5 animate-fade-in">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {post.author?.[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {post.author.firstName}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {timeAgo(post.createdAt)}
          </p>
        </div>
        {/* More options */}
        <button className="ml-auto p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <p className="text-sm text-[var(--color-text)] leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-[var(--color-border)]">
        {/* Like */}
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            post.liked
              ? "text-pink-400"
              : "text-[var(--color-text-muted)] hover:text-pink-400"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill={post.liked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {post.likes}
        </button>

        {/* Comment */}
        <button className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-indigo-400 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {post.comments}
        </button>

        {/* Share */}
        <button className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-green-400 transition-colors ml-auto">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share
        </button>
      </div>
    </article>
  );
};

// ---------- Create Post box ----------
const CreatePost = ({ onPost }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    // API call example — POST /posts
    try {
      await api.post(POST_ROUTES.CREATE, { content });
      onPost();
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.[0] || "U"}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={2}
            className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] resize-none focus:outline-none"
          />
        </div>
        <div className="flex justify-end mt-3 pt-3 border-t border-[var(--color-border)]">
          <Button
            type="submit"
            loading={loading}
            disabled={!content.trim()}
            size="sm"
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

// ---------- Home Page ----------
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch feed on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get(POST_ROUTES.GET_ALL);

      let postsArr = [];
      if (Array.isArray(res)) {
        postsArr = res;
      } else if (res && Array.isArray(res.data)) {
        postsArr = res.data;
      } else if (res?.data?.data) {
        postsArr = res.data.data;
      }

      setPosts(postsArr);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
    // API call: POST /posts/:id/like
    try {
      await api.post(POST_ROUTES.LIKE(postId));
    } catch {
      // Revert on failure
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                liked: !p.liked,
                likes: p.liked ? p.likes - 1 : p.likes + 1,
              }
            : p,
        ),
      );
    }
  };

  const handleNewPost = (postData) => {
    const newPost = {
      _id: Date.now().toString(),
      author: postData.author || { name: "You" },
      content: postData.content,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      liked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Home Feed
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          See what&apos;s happening in your network
        </p>
      </div>

      {/* Create post */}
      <CreatePost onPost={fetchPosts} />

      {/* Feed */}
      {loading ? (
        <Loader text="Loading feed..." />
      ) : posts.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-[var(--color-text-muted)]">
            No posts yet. Be the first to share something!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onLike={handleLike} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
