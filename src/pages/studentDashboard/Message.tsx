import React, { useState } from "react";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Textarea from "../../components/inputComponents/Textarea";

interface MessageSummary {
  id: string;
  organisation: string;
  sender: string;
  latest: string;
}

interface MessageDetail {
  id: string;
  organisation: string;
  sender: string;
  conversation: { from: string; content: string; time: string }[];
}

const mockMessages: MessageSummary[] = [
  { id: "1", organisation: "Graham Ker Foundation", sender: "John Doe", latest: "Thank you for your application!" },
  { id: "2", organisation: "UofG Charity", sender: "Jane Smith", latest: "Please provide your transcript." },
  { id: "3", organisation: "Grant Provider C", sender: "Alice Lee", latest: "Your application is under review." },
];

const mockDetail: MessageDetail = {
  id: "1",
  organisation: "Graham Ker Foundation",
  sender: "John Doe",
  conversation: [
    { from: "John Doe", content: "Thank you for your application!", time: "2024-06-01 10:00" },
    { from: "You", content: "Thank you for the update!", time: "2024-06-01 10:05" },
  ],
};

interface MessageProps {
    userName: string;
}

const Message: React.FC<MessageProps> = ({ userName }) => {
  const [activeTab, setActiveTab] = useState<"list" | "box">("list");
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [reply, setReply] = useState("");
  const [conversation, setConversation] = useState(mockDetail.conversation);

  const handleSelectMessage = (id: string) => {
    // In real app, fetch message detail by id
    setSelectedMessage(mockDetail);
    setConversation(mockDetail.conversation);
    setActiveTab("box");
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setConversation((prev) => [
      ...prev,
      { from: "You", content: reply, time: new Date().toLocaleString() },
    ]);
    setReply("");
  };

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Messages"
        headline="Check your messages and reply to organisations"
        student={true}
      />
      <div className="message-tabs">
        <button
          className={`message-tab-btn${activeTab === "list" ? " active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          Message List
        </button>
        <button
          className={`message-tab-btn${activeTab === "box" ? " active" : ""}`}
          onClick={() => setActiveTab("box")}
          disabled={!selectedMessage}
        >
          Message Box
        </button>
      </div>
      {activeTab === "list" && (
        <div className="message-list">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className="message-list-item"
              onClick={() => handleSelectMessage(msg.id)}
            >
              <div className="message-list-org">{msg.organisation}</div>
              <div className="message-list-sender">{msg.sender}</div>
              <div className="message-list-latest">{msg.latest}</div>
            </div>
          ))}
        </div>
      )}
      {activeTab === "box" && selectedMessage && (
        <div className="message-box">
          <div className="message-box-header">
            <strong>{selectedMessage.organisation}</strong> - {selectedMessage.sender}
          </div>
          <div className="message-conversation">
            {conversation.map((msg, idx) => (
              <div key={idx} className="message-conversation-item">
                <span className="message-conversation-from">{msg.from}:</span>
                <span className="message-conversation-content">{msg.content}</span>
                <span className="message-conversation-time">{msg.time}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleReply} className="message-reply-form">
            <Textarea
              id="reply-content"
              name="reply-content"
              label="Reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              required
            />
            <button type="submit" className="btn btn--primary" style={{ marginTop: "1rem" }}>
              Send Reply
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Message;
