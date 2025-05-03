import { gql, useQuery } from "@apollo/client";

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

const Dashboard = () => {
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
  if (userError || postsError) {
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
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No posts available yet.
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
