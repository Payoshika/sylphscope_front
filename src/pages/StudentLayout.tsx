import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Student } from "../types/student";
import { getStudentByUserId, updateStudentByStudentId } from "../services/StudentService";

const StudentLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;
      try {
        //student are coming back as array
        const studentRes = await getStudentByUserId(user.id);
        setStudent(studentRes);
      } catch (err) {
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [user]);
  
  const updateStudent = async (studentData: Student) => {
    if (!student?.id) return null;
    try {
      const updated = await updateStudentByStudentId(student.id, studentData);
      setStudent(updated);
      return updated;
    } catch (err) {
      // Optionally handle error
      throw err;
    }
  };


  if (isLoading || loading) {
    return (
      <div className="grid">
        <div className="card">
          <div className="card__body">
            <p className="text-center">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not student, redirect to signin or another page
  if (!student) {
    return <Navigate to="/signin" replace />;
  }

  // Pass student as context to children
  return (
    <Outlet context={{ student, setStudent, updateStudent }} />
  );
};

export default StudentLayout;