import { gql, useQuery } from "@apollo/client";

// GraphQL query
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      name
      email
    }
  }
`;

const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        <p>{error.message || "Failed to fetch user data"}</p>
      </div>
    );
  }

  const userData = data?.me;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to your Dashboard
        </h1>

        {userData && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Your Profile</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="mb-2">
                <span className="font-medium">Name:</span> {userData.name}
              </p>
              <p className="mb-2">
                <span className="font-medium">Email:</span> {userData.email}
              </p>
              <p>
                <span className="font-medium">User ID:</span> {userData.id}
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-xl font-semibold mb-3">What's Next?</h2>
          <p className="text-gray-600 mb-4">
            This is a simple GraphQL-based application with authentication. You
            can build upon this foundation to create more complex features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium text-blue-700 mb-2">Create Posts</h3>
              <p className="text-sm text-gray-600">
                Add functionality to create and manage posts
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <h3 className="font-medium text-green-700 mb-2">User Profiles</h3>
              <p className="text-sm text-gray-600">
                Enhance user profiles with more details
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-md">
              <h3 className="font-medium text-purple-700 mb-2">
                Social Features
              </h3>
              <p className="text-sm text-gray-600">
                Add comments, likes, and sharing functionality
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
