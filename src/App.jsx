import React, { useState, useEffect } from "react";
import Login from "./screens/Login";
import Signup from "./screens/SignUp";
import UserList from "./screens/UserList";
import Chat from "./screens/Chat";
import { auth } from "./config/firebase";

function App() {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
    setSelectedUser(null);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {!isMobile ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 min-w-[220px] max-w-[300px] border-r border-gray-200 flex flex-col">
            <UserList selectUser={setSelectedUser} />
            <div className="border-t p-2 bg-white">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <Chat selectedUser={selectedUser} goBack={() => setSelectedUser(null)} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a user to start chatting
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {!selectedUser ? (
            <UserList selectUser={setSelectedUser} />
          ) : (
            <Chat selectedUser={selectedUser} goBack={() => setSelectedUser(null)} />
          )}
          <div className="border-t p-2 bg-white">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
