import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, createStudentAccount, getAllStudents, deleteStudent, logoutUser } from '../utils/auth';
import './admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // Temporarily comment out authentication check for testing
    // if (!isAuthenticated() || !isAdmin()) {
    //   navigate('/login');
    //   return;
    // }
    loadStudents();
  }, [navigate]);

  const loadStudents = () => {
    try {
      const allStudents = getAllStudents();
      setStudents(Array.isArray(allStudents) ? allStudents : []);
      console.log("Loaded students:", allStudents);
    } catch (error) {
      console.error("Error loading students:", error);
      setMessage({ text: "Error loading students", type: "error" });
    }
  };

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = createStudentAccount(studentData);
    
    if (result.success) {
      setStudentData({ username: '', email: '', password: '' });
      setMessage({ text: result.message, type: 'success' });
      loadStudents();
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const handleDeleteStudent = (id) => {
    const result = deleteStudent(id);
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      loadStudents();
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ text: '', type: '' })}>×</button>
        </div>
      )}
      
      <div className="admin-content">
        <div className="create-student-form">
          <h2>Create Student Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={studentData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={studentData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={studentData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit">Create Account</button>
          </form>
        </div>
        
        <div className="student-list">
          <h2>Student Accounts</h2>
          {students.length === 0 ? (
            <p>No student accounts found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.username}</td>
                    <td>{student.email}</td>
                    <td>
                      <button onClick={() => handleDeleteStudent(student.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;