// Mock authentication functions for development

// Store users in localStorage
const USERS_KEY = 'campus_tour_users';
const CURRENT_USER_KEY = 'campus_tour_current_user';

// Initialize localStorage with default admin if empty
const initializeStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers = [
      {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

// Initialize on import
initializeStorage();

// Get all users
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Authentication functions
export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  }
  
  return { success: false, message: 'Invalid email or password' };
};

export const registerUser = (userData) => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email === userData.email)) {
    return { success: false, message: 'Email already in use' };
  }
  
  // Create new user
  const newUser = {
    id: 'user-' + Date.now(),
    ...userData,
    role: 'student' // Default role
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return { success: true, message: 'Registration successful' };
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

// Student management functions
export const createStudentAccount = (studentData) => {
  if (!studentData.username || !studentData.email || !studentData.password) {
    return { success: false, message: 'All fields are required' };
  }
  
  return registerUser({
    ...studentData,
    role: 'student'
  });
};

export const getAllStudents = () => {
  const users = getUsers();
  return users.filter(user => user.role === 'student');
};

export const deleteStudent = (id) => {
  const users = getUsers();
  const updatedUsers = users.filter(user => user.id !== id);
  
  if (users.length === updatedUsers.length) {
    return { success: false, message: 'Student not found' };
  }
  
  saveUsers(updatedUsers);
  return { success: true, message: 'Student deleted successfully' };
};