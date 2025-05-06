import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";

const getChatId = (uid1, uid2) => {
  return uid1 > uid2 ? uid1 + uid2 : uid2 + uid1;
};

function Chat({ selectedUser, goBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const map = {};
      usersSnapshot.forEach((doc) => {
        map[doc.id] = doc.data();
      });
      setUsersMap(map);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const chatId = getChatId(auth.currentUser.uid, selectedUser.uid);
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, [selectedUser]);

  const sendMessage = async () => {
    if (text.trim() === "") return;
    const chatId = getChatId(auth.currentUser.uid, selectedUser.uid);
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-3">
        <button
          onClick={goBack}
          className="md:hidden text-blue-500 text-2xl focus:outline-none"
        >
          ←
        </button>
        <img
          src={selectedUser.profileImage}
          alt="user"
          className="w-10 h-10 rounded-full object-cover"
        />
        <h3 className="font-semibold text-lg truncate">
          {selectedUser.firstName} {selectedUser.lastName}
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg, idx) => {
          const user = usersMap[msg.senderId] || {};
          const isCurrentUser = msg.senderId === auth.currentUser.uid;
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 max-w-[70%] ${isCurrentUser ? "ml-auto flex-row-reverse" : "flex-row"
                }`}
            >
              <img
                src={user.profileImage || "https://via.placeholder.com/40"}
                alt="sender"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div
                className={`px-4 py-2 rounded-lg ${isCurrentUser ? "bg-green-200" : "bg-white"
                  }`}
              >

                <div className="break-words">{msg.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t bg-gray-100 flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full border"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
