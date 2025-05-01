import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

function UserList({ selectUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs
        .map(doc => doc.data())
        .filter(user => user.uid !== auth.currentUser.uid);
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4 bg-white h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      {users.map(user => (
        <div
          key={user.uid}
          onClick={() => selectUser(user)}
          className="flex items-center gap-3 p-2 hover:bg-gray-200 cursor-pointer rounded-lg"
        >
          <img
            src={user.profileImage}
            alt="user"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-gray-800 font-medium">
            {user.firstName} {user.lastName}
          </span>
        </div>
      ))}
    </div>
  );
}

export default UserList;

