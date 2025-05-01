import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

const getChatId = (uid1, uid2) => {
  return uid1 > uid2 ? uid1 + uid2 : uid2 + uid1;
};

function Chat({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

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
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h3 className="font-semibold text-lg">{selectedUser.displayName}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[60%] px-4 py-2 rounded-lg ${
              msg.senderId === auth.currentUser.uid
                ? "bg-green-200 self-end ml-auto"
                : "bg-white self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
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
