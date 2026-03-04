import React, { useState, useEffect } from "react";
import { api } from "../../api/axiosInstance";
import { USER_ROUTES } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";

const Friends = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchAllUsers();
    // fetchFriends();
    // fetchRequests();
  }, [user]);

  const fetchAllUsers = async () => {
    try {
      const res = await api.get(USER_ROUTES.SEARCH);

      const users = res?.data?.data || [];

      setAllUsers(users.filter((u) => u._id !== user?._id));
    } catch (err) {
      console.error(err);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await api.get(USER_ROUTES.FOLLOWING(user._id));

      setFriends(res?.data?.users || []);
    } catch {
      setFriends([]);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get(USER_ROUTES.FOLLOWERS(user._id));

      setRequests(res?.data?.users || []);
    } catch {
      setRequests([]);
    }
  };

  const handleAddFriend = async (userId) => {
    setAdding((prev) => ({ ...prev, [userId]: true }));
    try {
      await api.post(USER_ROUTES.FOLLOW(userId));
      // Optionally, refresh lists
      setRequests((prev) => [...prev, allUsers.find((u) => u._id === userId)]);
    } catch {
      // handle error
    } finally {
      setAdding((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const Avatar = ({ name }) => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
      {name?.[0] || "U"}
    </div>
  );

  const UserCard = ({ user, action, adding }) => (
    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition">
      <div className="flex items-center gap-3">
        <Avatar name={user.firstName} />

        <span className="text-sm font-medium text-[var(--color-text)]">
          {user.firstName} {user.lastName}
        </span>
      </div>

      {action && (
        <button
          onClick={action}
          className="px-3 py-1.5 text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition"
          disabled={adding}
        >
          {adding ? "Adding..." : "Add Friend"}
        </button>
      )}
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="card p-5 flex-1">
      <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
        {title}
      </h2>

      <div className="space-y-3">{children}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">
        Friends
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* All Users */}
        <Section title="Find Friends">
          {loading ? (
            <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
          ) : allUsers.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              No users found
            </p>
          ) : (
            allUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                action={() => handleAddFriend(user._id)}
                adding={adding[user._id]}
              />
            ))
          )}
        </Section>

        {/* Friends List */}
        <Section title="Your Friends">
          {loading ? (
            <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
          ) : friends.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              No friends yet
            </p>
          ) : (
            friends.map((friend) => <UserCard key={friend._id} user={friend} />)
          )}
        </Section>

        {/* Requests */}
        <Section title="Friend Requests">
          {loading ? (
            <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              No requests
            </p>
          ) : (
            requests.map((req) => <UserCard key={req._id} user={req} />)
          )}
        </Section>
      </div>
    </div>
  );
};

export default Friends;
