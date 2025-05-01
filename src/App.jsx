import React, { useState } from "react";
import Login from "./screens/Login";
import Signup from "./screens/SignUp";
import UserList from "./screens/UserList";
import Chat from "./screens/Chat";
import { auth } from "./config/firebase";

function App() {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {isLogin ? (
          <Login setUser={setUser} />
        ) : (
          <Signup setUser={setUser} />
        )}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-500"
        >
          {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        <UserList selectUser={setSelectedUser} />
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <Chat selectedUser={selectedUser} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
      <button
        onClick={() => {
          auth.signOut();
          setUser(null);
          setSelectedUser(null);
        }}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>
  );
}

export default App;
