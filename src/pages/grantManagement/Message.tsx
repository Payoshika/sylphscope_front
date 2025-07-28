import React, { useState, useEffect } from "react";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Textarea from "../../components/inputComponents/Textarea";
import Button from "../../components/basicComponents/Button";
import SearchableDropdown from "../../components/inputComponents/SearchableDropdown";
import { ArrowLeft03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { ProviderStaff } from "../../types/user";
import type { Message as MessageType, MessageContent } from "../../types/message";
import type { ManagedStudentsEntry } from "../../services/ProviderService";
import { useOutletContext } from "react-router-dom";
import { getMessagesByProviderStaffId, getListOfStudentforProvider } from "../../services/ProviderService";
import { createNewMessage, addMessageContentToMessage } from "../../services/StudentService";
import type { Student } from "../../types/student";

const Message: React.FC = () => {
  const { providerStaff } = useOutletContext<{ providerStaff: ProviderStaff }>();
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newReceiver, setNewReceiver] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [managedStudents, setManagedStudents] = useState<ManagedStudentsEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  // Fetch messages and managed students
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [staffMessages, studentsList] = await Promise.all([
          getMessagesByProviderStaffId(providerStaff.id),
          getListOfStudentforProvider(providerStaff.providerId)
        ]);
        
        setMessages(staffMessages);
        setManagedStudents(studentsList);

        // Select first message by default if available and no message is currently selected
        if (staffMessages.length > 0 && !selectedMessage && !isCreating) {
          setSelectedMessage(staffMessages[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch messages");
      } finally {
        setIsLoading(false);
      }
    };

    if (providerStaff?.id) {
      fetchData();
    }
  }, [providerStaff?.id, selectedMessage, isCreating]);

  const handleSelectMessage = (message: MessageType) => {
    setSelectedMessage(message);
    setShowChatMobile(true);
    setIsCreating(false);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedMessage) return;

    try {
      setIsReplying(true);

      const messageContent = {
        senderName: `${providerStaff.firstName} ${providerStaff.lastName}`,
        receiverName: selectedMessage.studentName,
        text: reply
      };

      // Add reply to the message
      const newContent = await addMessageContentToMessage(selectedMessage.id, messageContent);

      // Update both selected message and messages list
      const updatedMessage = {
        ...selectedMessage,
        messages: [...selectedMessage.messages, newContent],
        updatedAt: new Date().toISOString()
      };

      setSelectedMessage(updatedMessage);
      setMessages(prev => prev.map(msg => 
        msg.id === selectedMessage.id ? updatedMessage : msg
      ));

      setReply("");
    } catch (err) {
      alert("Failed to send reply. Please try again.");
    } finally {
      setIsReplying(false);
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedMessage(null);
    setShowChatMobile(true);
    setNewReceiver("");
    setNewMessage("");
  };

  const handleSendNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReceiver || !newMessage.trim()) return;
    
    const [grantProgramId, studentId] = newReceiver.split('|');
    const selectedEntry = managedStudents.find(entry => entry.grantProgram.id === grantProgramId);
    const selectedStudent = selectedEntry?.students.find(student => student.id === studentId);

    if (selectedEntry && selectedStudent) {
      try {
        setIsSending(true);
        
        // Create new message with content
        const newMessageData = await createNewMessage(
          {
            studentId: selectedStudent.id,
            studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
            providerId: selectedEntry.grantProgram.providerId,
            providerStaffId: providerStaff.id,
            providerStaffName: `${providerStaff.firstName} ${providerStaff.lastName}`,
            grantProgramId: selectedEntry.grantProgram.id,
            grantProgramTitle: selectedEntry.grantProgram.title
          },
          {
            senderName: `${providerStaff.firstName} ${providerStaff.lastName}`,
            receiverName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
            text: newMessage
          }
        );

        // Update messages list with new message
        setMessages(prev => [...prev, newMessageData]);
        
        setIsCreating(false);
        setNewReceiver("");
        setNewMessage("");
        setShowChatMobile(false);
      } catch (err) {
        alert("Failed to send message. Please try again.");
      } finally {
        setIsSending(false);
      }
    }
  };

  if (isLoading) {
    return <div className="content">Loading messages...</div>;
  }

  if (error) {
    return <div className="content">Error: {error}</div>;
  }

  const receiverOptions = managedStudents.flatMap(entry => 
    entry.students.map((student: Student) => ({
      value: `${entry.grantProgram.id}|${student.id}`,
      label: `${student.firstName} ${student.lastName} (${entry.grantProgram.title})`
    }))
  );

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Messages"
        headline="Check your messages and reply to students"
        provider={true}
      />
      <div className="message-2col-layout">
        {/* Message List (left col) */}
        <div
          className={`message-list-col${showChatMobile ? " hide-xs" : ""}`}
        >
          <Button
            text={"+\u00A0\u00A0Create New Message"}
            variant="primary"
            fullWidth
            onClick={handleCreateNew}
            size="regular"
          />
          <div className="message-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-list-item${selectedMessage?.id === msg.id && !isCreating ? " selected" : ""}`}
                onClick={() => handleSelectMessage(msg)}
              >
                <div className="message-list-org">Name : {msg.studentName}</div>
                <div className="message-list-sender">
                  Applied for : {msg.grantProgramTitle}
                </div>
                <div className="message-list-latest">
                  Messages : {msg.messages.length > 0 ? msg.messages[msg.messages.length - 1].text : "No messages yet"}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="message-list-empty">
                <p>No messages available</p>
              </div>
            )}
          </div>
        </div>
        {/* Chat Box (right col) */}
        <div
          className={`message-chat-col${showChatMobile ? " show-xs" : ""}`}
        >
          {isCreating ? (
            <div className="message-box">
              <div className="message-box-header">
                <button
                  type="button"
                  className="btn btn-ghost btn-regular message-back-btn"
                  onClick={() => setShowChatMobile(false)}
                >
                  <HugeiconsIcon icon={ArrowLeft03Icon} size={24} />
                </button>
                <p>New Message</p>
              </div>
              <form onSubmit={handleSendNew} className="message-reply-form">
                <SearchableDropdown
                  id="receiver-searchable"
                  name="receiver-searchable"
                  label="Student"
                  value={newReceiver}
                  onChange={setNewReceiver}
                  options={receiverOptions}
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
                    text={isSending ? "Sending..." : "Send Message"}
                    variant="primary"
                    size="regular"
                    type="submit"
                    disabled={isSending}
                  />
                </div>
              </form>
            </div>
          ) : selectedMessage ? (
            <div className="message-box">
              <div className="message-box-header">
                <button
                  type="button"
                  className="btn btn-ghost btn-regular message-back-btn"
                  onClick={() => setShowChatMobile(false)}
                >
                  <HugeiconsIcon icon={ArrowLeft03Icon} size={24} />
                </button>
                <p>{selectedMessage.studentName} - {selectedMessage.grantProgramTitle}</p>
              </div>
              <div className="message-conversation">
                {selectedMessage.messages.map((msg) => (
                  <div key={msg.id} className="message-conversation-item">
                    <span className="message-conversation-from">{msg.senderName}:</span>
                    <span className="message-conversation-content">{msg.text}</span>
                    <span className="message-conversation-time">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
                {selectedMessage.messages.length === 0 && (
                  <div className="message-conversation-empty">
                    <p>No messages yet</p>
                  </div>
                )}
              </div>
              <form onSubmit={handleReply} className="message-reply-form">
                <Textarea
                  id="reply-content"
                  name="reply-content"
                  label="Create message"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  required
                  disabled={isReplying}
                />
                <div className="message-send-btn-wrapper">
                  <Button
                    text={isReplying ? "Sending..." : "Send Message"}
                    variant="primary"
                    size="regular"
                    type="submit"
                    disabled={isReplying}
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