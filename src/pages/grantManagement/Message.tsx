import React, { useState, useEffect } from "react";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Textarea from "../../components/inputComponents/Textarea";
import Button from "../../components/basicComponents/Button";
import SearchableDropdown from "../../components/inputComponents/SearchableDropdown";

interface MessageSummary {
  id: string;
  student: string;
  grantProgram: string;
  latest: string;
}

interface MessageDetail {
  id: string;
  student: string;
  grantProgram: string;
  conversation: { from: string; content: string; time: string }[];
}

const mockMessages: MessageSummary[] = [
  { id: "1", student: "John Smith", grantProgram: "Engineering Scholarship", latest: "Thank you for your application!" },
  { id: "2", student: "Jane Doe", grantProgram: "Computer Science Grant", latest: "Please provide your transcript." },
  { id: "3", student: "Alice Johnson", grantProgram: "Mathematics Award", latest: "Your application is under review." },
];

const mockDetail: MessageDetail = {
  id: "1",
  student: "John Smith",
  grantProgram: "Engineering Scholarship",
  conversation: [
    { from: "You", content: "Thank you for your application!", time: "2024-06-01 10:00" },
    { from: "John Smith", content: "Thank you for the update!", time: "2024-06-01 10:05" },
  ],
};

const mockStudents = [
  { id: "student1", name: "John Smith" },
  { id: "student2", name: "Jane Doe" },
  { id: "student3", name: "Alice Johnson" },
];

interface MessageProps {
  userName: string;
}

const Message: React.FC<MessageProps> = ({ userName }) => {
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [reply, setReply] = useState("");
  const [conversation, setConversation] = useState(mockDetail.conversation);
  const [showChatMobile, setShowChatMobile] = useState(false); // for xs screens
  const [isCreating, setIsCreating] = useState(false);
  const [newStudent, setNewStudent] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Show first message by default
  useEffect(() => {
    if (mockMessages.length > 0 && !selectedMessage && !isCreating) {
      setSelectedMessage(mockDetail);
      setConversation(mockDetail.conversation);
    }
  }, [selectedMessage, isCreating]);

  const handleSelectMessage = (id: string) => {
    // In real app, fetch message detail by id
    setSelectedMessage(mockDetail);
    setConversation(mockDetail.conversation);
    setShowChatMobile(true);
    setIsCreating(false);
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

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedMessage(null);
    setShowChatMobile(true);
    setNewStudent("");
    setNewMessage("");
  };

  const handleSendNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent || !newMessage.trim()) return;
    // In real app, send new message
    alert(`Message sent to ${mockStudents.find(s => s.id === newStudent)?.name}: ${newMessage}`);
    setIsCreating(false);
    setNewStudent("");
    setNewMessage("");
    setShowChatMobile(false);
  };

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Messages"
        headline="Check your messages and reply to students"
        student={false}
      />
      <div className="message-2col-layout">
        {/* Message List (left col) */}
        <div
          className={`message-list-col${showChatMobile ? " hide-xs" : ""}`}
        >
          <Button
            text="+ Create New Message"
            variant="primary"
            fullWidth
            onClick={handleCreateNew}
            size="regular"
          />
          <div className="message-list">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`message-list-item${selectedMessage?.id === msg.id && !isCreating ? " selected" : ""}`}
                onClick={() => handleSelectMessage(msg.id)}
              >
                <div className="message-list-org">{msg.student}</div>
                <div className="message-list-sender">{msg.grantProgram}</div>
                <div className="message-list-latest">{msg.latest}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat Box (right col) */}
        <div
          className={`message-chat-col${showChatMobile ? " show-xs" : ""}`}
        >
          {isCreating ? (
            <div className="message-box">
              <div className="message-back-btn-wrapper">
                <Button
                  text="← Back"
                  variant="ghost"
                  size="regular"
                  onClick={() => setShowChatMobile(false)}
                  type="button"
                />
              </div>
              <div className="message-box-header">
                <strong>New Message</strong>
              </div>
              <form onSubmit={handleSendNew} className="message-reply-form">
                <SearchableDropdown
                  id="student-searchable"
                  name="student-searchable"
                  label="Student"
                  value={newStudent}
                  onChange={setNewStudent}
                  options={mockStudents.map(s => ({ value: s.id, label: s.name }))}
                  placeholder="Select student..."
                  required
                  searchFunction={(query, options) =>
                    options.filter(opt =>
                      opt.label.toLowerCase().includes(query.toLowerCase())
                    )
                  }
                />
                <Textarea
                  id="new-message-content"
                  name="new-message-content"
                  label="Message"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  required
                />
                <div className="message-send-btn-wrapper">
                  <Button
                    text="Send Message"
                    variant="primary"
                    size="regular"
                    type="submit"
                  />
                </div>
              </form>
            </div>
          ) : selectedMessage ? (
            <div className="message-box">
              {/* Back button for xs screens */}
              <div className="message-back-btn-wrapper">
                <Button
                  text="← Back"
                  variant="ghost"
                  size="regular"
                  onClick={() => setShowChatMobile(false)}
                  type="button"
                />
              </div>
              <div className="message-box-header">
                <strong>{selectedMessage.student}</strong> - {selectedMessage.grantProgram}
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
                <div className="message-send-btn-wrapper">
                  <Button
                    text="Send Reply"
                    variant="primary"
                    size="regular"
                    type="submit"
                  />
                </div>
              </form>
            </div>
          ) : (
            <div className="message-box message-box-placeholder">
              <div className="message-box-header">Select a message to view the conversation</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message; 