import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface Author {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: Author;
}

// GraphQL queries
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      name
      email
    }
  }
`;

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      id
      title
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`;

const Dashboard = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_CURRENT_USER);
  const {
    loading: postsLoading,
    error: postsError,
    data: postsData,
  } = useQuery(GET_ALL_POSTS);
  const [createPost, { loading: createPostLoading }] = useMutation(
    CREATE_POST,
    {
      refetchQueries: [{ query: GET_ALL_POSTS }], // Refetch posts after creating a new one
      onCompleted: () => {
        setShowPostForm(false);
        setPostTitle("");
        setPostContent("");
      },
    }
  );
  // Combined loading state
  const isLoading = userLoading || postsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle errors
  if (userError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        <p>
          {userError?.message || postsError?.message || "Failed to fetch data"}
        </p>
      </div>
    );
  }

  const user = userData?.me as User | undefined;
  const posts = (postsData?.posts || []) as Post[];

  // Format date function with error handling
  const formatDate = (dateString: string): string => {
    try {
      // First, check if the date string is valid
      if (!dateString) return "Unknown date";

      // Try to parse the date - this handles ISO strings and other common formats
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return new Intl.DateTimeFormat("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Date error";
    }
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (postTitle.trim() && postContent.trim()) {
      createPost({
        variables: {
          title: postTitle,
          content: postContent,
        },
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to your Dashboard
        </h1>

        {user && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Your Profile</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="mb-2">
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p className="mb-2">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">User ID:</span> {user.id}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Posts</h2>
          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            {showPostForm ? "Cancel" : "Create New Post"}
          </button>
        </div>

        {/* Create Post Form */}
        {showPostForm && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Create a New Post</h3>
            <form onSubmit={handleSubmitPost}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={createPostLoading}
                className={`px-4 py-2 rounded-md text-white ${
                  createPostLoading
                    ? "bg-gray-400"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {createPostLoading ? "Posting..." : "Submit Post"}
              </button>
            </form>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="mb-4">No posts yet. Be the first to create one!</p>
            <button
              onClick={() => setShowPostForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Create your first post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post: Post) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    By <span className="font-medium">{post.author.name}</span>
                  </div>
                  <div>{formatDate(post.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
