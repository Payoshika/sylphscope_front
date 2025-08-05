import React, { useState, useEffect } from "react";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Textarea from "../../components/inputComponents/Textarea";
import Button from "../../components/basicComponents/Button";
import SearchableDropdown from "../../components/inputComponents/SearchableDropdown";
import { ArrowLeft03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Student } from "../../types/student";
import type { GrantProgram } from "../../types/grantProgram";
import type { Message as MessageType } from "../../types/message";
import { useOutletContext } from "react-router-dom";
import { getAppliedGrantProgram } from "../../services/GrantProgramService";
import { getMessagesForStudent, createNewMessage, addMessageContentToMessage } from "../../services/StudentService";

const Message: React.FC = () => {
  const { student } = useOutletContext<{ student: Student }>();
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newReceiver, setNewReceiver] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [grantPrograms, setGrantPrograms] = useState<GrantProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  // Fetch messages and grant programs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [appliedPrograms, studentMessages] = await Promise.all([
          getAppliedGrantProgram(student.id),
          getMessagesForStudent(student.id)
        ]);
        
        setGrantPrograms(appliedPrograms.filter(program => program.contactPerson));
        setMessages(studentMessages);

        // Select first message by default if available and no message is currently selected
        if (studentMessages.length > 0 && !selectedMessage && !isCreating) {
          setSelectedMessage(studentMessages[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch messages");
      } finally {
        setIsLoading(false);
      }
    };

    if (student?.id) {
      fetchData();
    }
  }, [student?.id, selectedMessage, isCreating]);

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
        senderName: student.firstName + " " + student.lastName,
        receiverName: selectedMessage.providerStaffName,
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
    
    const selectedProgram = grantPrograms.find(program => program.contactPerson?.id === newReceiver);
    if (selectedProgram && selectedProgram.contactPerson) {
      try {
        setIsSending(true);
        
        // Create new message with content
        const newMessageData = await createNewMessage(
          {
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            providerId: selectedProgram.providerId,
            providerStaffId: selectedProgram.contactPerson.id,
            providerStaffName: `${selectedProgram.contactPerson.firstName} ${selectedProgram.contactPerson.lastName}`,
            grantProgramId: selectedProgram.id,
            grantProgramTitle: selectedProgram.title
          },
          {
            senderName: `${student.firstName} ${student.lastName}`,
            receiverName: `${selectedProgram.contactPerson.firstName} ${selectedProgram.contactPerson.lastName}`,
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

  const receiverOptions = grantPrograms
    .filter(program => program.contactPerson)
    .map(program => ({
      value: program.contactPerson!.id,
      label: `${program.contactPerson!.firstName} ${program.contactPerson!.lastName} (${program.title})`
    }));

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Messages"
        headline="Check your messages and reply to organisations"
        student={true}
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
                <div className="message-list-org">{msg.providerName}</div>
                <div className="message-list-sender">
                  {msg.messages.length > 0 ? msg.messages[msg.messages.length - 1].senderName : ""}
                </div>
                <div className="message-list-latest">
                  {msg.messages.length > 0 ? msg.messages[msg.messages.length - 1].text : "No messages yet"}
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
                  label="Receiver"
                  value={newReceiver}
                  onChange={setNewReceiver}
                  options={receiverOptions}
                  placeholder="Select receiver..."
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
                <p>{selectedMessage.providerName} - {selectedMessage.providerStaffName}</p>
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
