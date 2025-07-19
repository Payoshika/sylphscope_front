import { apiClient } from "../utility/ApiClient";
import type { Student } from "../types/student";

export const getStudentByUserId = async (userId: string): Promise<Student> => {
    const response = await apiClient.get<Student>(`/api/students/user/${userId}`);
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