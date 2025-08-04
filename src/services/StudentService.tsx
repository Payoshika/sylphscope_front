import { apiClient } from "../utility/ApiClient";
import type { Student } from "../types/student";
import type { Message, MessageContent } from "../types/message";

export const getStudentByUserId = async (userId: string): Promise<Student> => {
    const response = await apiClient.get<Student>(`/api/students/user/${userId}`);
    if (!response.data) {
        throw new Error("Student not found");
    }
    return response.data;
};

export const getStudentById = async (studentId: string): Promise<Student> => {
    const response = await apiClient.get<Student>(`/api/students/${studentId}`);
    if (!response.data) {
        throw new Error("Student not found");
    }
    return response.data;
};

export const updateStudentByStudentId = async (studentId: string, student: Student): Promise<Student> => {
    console.log("updating student")
    console.log(student);
    const response = await apiClient.put<Student>(`/api/students/${studentId}`, student);
    if (!response.data) {
        throw new Error("Failed to update student");
    }
    return response.data;
};

export const getMessagesForStudent = async (studentId: string): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(`/api/messages/student/${studentId}`);
    if (!response.data) {
        throw new Error("Failed to fetch messages");
    }
    return response.data;
};

interface CreateMessageRequest {
    message: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'providerName'> & { messages: never[] };
    messageContent: Omit<MessageContent, 'id' | 'messageId' | 'createdAt' | 'updatedAt'>;
}

export const createNewMessage = async (
    messageData: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'providerName'>,
    messageContent: Omit<MessageContent, 'id' | 'messageId' | 'createdAt' | 'updatedAt'>
): Promise<Message> => {
    const requestBody: CreateMessageRequest = {
        message: {
            ...messageData,
            messages: []
        },
        messageContent: messageContent
    };
    console.log("requestBody", requestBody);

    const response = await apiClient.post<Message>('/api/messages/create-with-content', requestBody);
    
    if (!response.data) {
        throw new Error("Failed to create message");
    }
    return response.data;
};

export const addMessageContentToMessage = async (
    messageId: string,
    messageContent: Omit<MessageContent, 'id' | 'messageId' | 'createdAt' | 'updatedAt'>
): Promise<MessageContent> => {
    const response = await apiClient.post<MessageContent>(
        `/api/messages/${messageId}/add-content`,
        messageContent
    );
    
    if (!response.data) {
        throw new Error("Failed to add message content");
    }
    return response.data;
};

