// In-memory data storage
let users = [
  {id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123', mobile: '9876543210', address: '123 Main Street, Sector 5, Smart City', registeredDate: '2025-01-15', isBlocked: false},
  {id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password123', mobile: '9876543211', address: '456 Park Avenue, Sector 3, Smart City', registeredDate: '2025-02-10', isBlocked: false},
  {id: 3, name: 'Robert Johnson', email: 'robert@example.com', password: 'password123', mobile: '9876543212', address: '789 Lake View, Sector 7, Smart City', registeredDate: '2025-03-05', isBlocked: false}
];

const admin = {username: 'admin', email: 'admin@smartcity.com', password: 'admin123'};

let complaints = [
  {id: 1, complaintId: 'CMP-20250115-0001', userId: 1, userName: 'John Doe', department: 'Infrastructure', subject: 'Large pothole on Main Road', description: 'There is a large pothole on Main Road near Sector 5 causing traffic congestion and risk of accidents. Immediate repair needed.', location: 'Main Road, Sector 5', priority: 'High', status: 'In Progress', imageFile: null, filedDate: '2025-01-15', lastUpdated: '2025-01-20', remarks: 'Engineering team has been assigned. Work scheduled for next week.'},
  {id: 2, complaintId: 'CMP-20250120-0002', userId: 2, userName: 'Jane Smith', department: 'Sanitation', subject: 'Garbage not collected for 3 days', description: 'Garbage collection has been missed for the past 3 days in our area. The waste is accumulating and creating hygiene issues.', location: 'Green Park, Sector 3', priority: 'Medium', status: 'Pending', imageFile: null, filedDate: '2025-01-20', lastUpdated: '2025-01-20', remarks: ''},
  {id: 3, complaintId: 'CMP-20250122-0003', userId: 1, userName: 'John Doe', department: 'Street Lights', subject: 'Street light not working', description: 'Street light pole number 45 on Park Avenue has not been working for over a week making the area dark and unsafe at night.', location: 'Park Avenue, near Pole #45', priority: 'Low', status: 'Resolved', imageFile: null, filedDate: '2025-01-22', lastUpdated: '2025-01-25', remarks: 'Technician visited and replaced the faulty bulb. Issue has been resolved.'},
  {id: 4, complaintId: 'CMP-20250125-0004', userId: 3, userName: 'Robert Johnson', department: 'Water Supply', subject: 'Low water pressure', description: 'Water pressure is very low in our building. This has been ongoing for the past 2 weeks.', location: 'Lake View Apartments, Sector 7', priority: 'Medium', status: 'In Progress', imageFile: null, filedDate: '2025-01-25', lastUpdated: '2025-01-28', remarks: 'Water department is investigating the pipeline. Expected resolution in 3-4 days.'},
  {id: 5, complaintId: 'CMP-20250201-0005', userId: 2, userName: 'Jane Smith', department: 'Traffic', subject: 'Traffic signal malfunction', description: 'Traffic signal at Green Park intersection is not functioning properly, causing traffic jams during peak hours.', location: 'Green Park Intersection, Sector 3', priority: 'High', status: 'Pending', imageFile: null, filedDate: '2025-02-01', lastUpdated: '2025-02-01', remarks: ''}
];

let categories = ['Infrastructure', 'Sanitation', 'Traffic', 'Safety', 'Electricity', 'Water Supply', 'Street Lights', 'Others'];

let currentUser = null;
let isAdminLoggedIn = false;
let complaintIdCounter = 6;

// Utility Functions
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function showUserView(viewId) {
  document.querySelectorAll('.user-view').forEach(view => view.classList.remove('active'));
  document.getElementById(viewId + 'View').classList.add('active');
  
  if (viewId === 'dashboard') {
    updateUserDashboard();
  } else if (viewId === 'myComplaints') {
    displayMyComplaints();
  } else if (viewId === 'profile') {
    displayUserProfile();
  }
}

function showAdminView(viewId) {
  document.querySelectorAll('.admin-view').forEach(view => view.classList.remove('active'));
  document.getElementById(viewId + 'View').classList.add('active');
  
  if (viewId === 'dashboard') {
    updateAdminDashboard();
  } else if (viewId === 'manageComplaints') {
    displayAdminComplaints();
  } else if (viewId === 'manageUsers') {
    displayAllUsers();
  } else if (viewId === 'categories') {
    displayCategories();
  } else if (viewId === 'reports') {
    initializeReports();
  }
}

function getStatusBadgeClass(status) {
  const statusMap = {
    'Pending': 'status-pending',
    'In Progress': 'status-in-progress',
    'Resolved': 'status-resolved',
    'Closed': 'status-closed',
    'Rejected': 'status-rejected',
    'Open': 'status-open'
  };
  return statusMap[status] || 'status-pending';
}

function getPriorityBadgeClass(priority) {
  const priorityMap = {
    'Low': 'priority-low',
    'Medium': 'priority-medium',
    'High': 'priority-high'
  };
  return priorityMap[priority] || 'priority-medium';
}

function generateComplaintId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const counter = String(complaintIdCounter++).padStart(4, '0');
  return `CMP-${year}${month}${day}-${counter}`;
}

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Registration Handler
function handleRegister(event) {
  event.preventDefault();
  
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const mobile = document.getElementById('regMobile').value.trim();
  const address = document.getElementById('regAddress').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  
  // Validate passwords match
  if (password !== confirmPassword) {
    showToast('Passwords do not match!', 'error');
    return;
  }
  
  // Check if email already exists
  if (users.some(user => user.email === email)) {
    showToast('Email already registered!', 'error');
    return;
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    mobile,
    address,
    registeredDate: getCurrentDate(),
    isBlocked: false
  };
  
  users.push(newUser);
  showToast('Registration successful! Please login.', 'success');
  
  setTimeout(() => {
    document.getElementById('registerForm').reset();
    showPage('loginPage');
  }, 1500);
}

// Login Handler
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    showToast('Invalid email or password!', 'error');
    return;
  }
  
  if (user.isBlocked) {
    showToast('Your account has been blocked. Contact admin.', 'error');
    return;
  }
  
  currentUser = user;
  showToast(`Welcome back, ${user.name}!`, 'success');
  
  document.getElementById('loginForm').reset();
  showPage('userDashboard');
  updateUserDashboard();
}

// Admin Login Handler
function handleAdminLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;
  
  if (email === admin.email && password === admin.password) {
    isAdminLoggedIn = true;
    showToast('Admin login successful!', 'success');
    document.getElementById('adminLoginForm').reset();
    showPage('adminDashboard');
    updateAdminDashboard();
  } else {
    showToast('Invalid admin credentials!', 'error');
  }
}

// Logout Handler
function handleLogout() {
  currentUser = null;
  isAdminLoggedIn = false;
  showToast('Logged out successfully!', 'info');
  showPage('landingPage');
}

// Update User Dashboard
function updateUserDashboard() {
  if (!currentUser) return;
  
  document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.name}!`;
  
  const userComplaints = complaints.filter(c => c.userId === currentUser.id);
  const pending = userComplaints.filter(c => c.status === 'Pending' || c.status === 'Open').length;
  const resolved = userComplaints.filter(c => c.status === 'Resolved').length;
  const inProgress = userComplaints.filter(c => c.status === 'In Progress').length;
  
  document.getElementById('totalComplaintsUser').textContent = userComplaints.length;
  document.getElementById('pendingComplaintsUser').textContent = pending;
  document.getElementById('resolvedComplaintsUser').textContent = resolved;
  document.getElementById('inProgressComplaintsUser').textContent = inProgress;
  
  // Display recent complaints
  const recentComplaints = userComplaints.slice(0, 5);
  const tableBody = document.getElementById('recentComplaintsTable');
  tableBody.innerHTML = '';
  
  if (recentComplaints.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No complaints filed yet.</td></tr>';
  } else {
    recentComplaints.forEach(complaint => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${complaint.complaintId}</td>
        <td>${complaint.subject}</td>
        <td><span class="status-badge ${getStatusBadgeClass(complaint.status)}">${complaint.status}</span></td>
        <td>${complaint.filedDate}</td>
        <td><button class="btn btn--sm btn--primary" onclick="viewComplaintDetails(${complaint.id})">View Details</button></td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Populate department dropdown in file complaint form
  const deptSelect = document.getElementById('complaintDepartment');
  deptSelect.innerHTML = '<option value="">Select Department</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    deptSelect.appendChild(option);
  });
  
  // File upload handler
  document.getElementById('complaintImage').onchange = function(e) {
    const fileName = e.target.files[0]?.name || '';
    document.getElementById('imageFileName').textContent = fileName ? `Selected: ${fileName}` : '';
  };
}

// Password strength indicator
document.addEventListener('DOMContentLoaded', () => {
  const regPassword = document.getElementById('regPassword');
  if (regPassword) {
    regPassword.addEventListener('input', (e) => {
      const password = e.target.value;
      const strengthDiv = document.getElementById('passwordStrength');
      
      if (password.length === 0) {
        strengthDiv.textContent = '';
        return;
      }
      
      let strength = 'Weak';
      let color = '#f44336';
      
      if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        strength = 'Strong';
        color = '#4CAF50';
      } else if (password.length >= 6) {
        strength = 'Medium';
        color = '#FF9800';
      }
      
      strengthDiv.textContent = `Password strength: ${strength}`;
      strengthDiv.style.color = color;
    });
  }
});

// File Complaint Handler
function handleFileComplaint(event) {
  event.preventDefault();
  
  const department = document.getElementById('complaintDepartment').value;
  const subject = document.getElementById('complaintSubject').value.trim();
  const description = document.getElementById('complaintDescription').value.trim();
  const location = document.getElementById('complaintLocation').value.trim();
  const priority = document.getElementById('complaintPriority').value;
  const imageFile = document.getElementById('complaintImage').files[0]?.name || null;
  
  const newComplaint = {
    id: complaints.length + 1,
    complaintId: generateComplaintId(),
    userId: currentUser.id,
    userName: currentUser.name,
    department,
    subject,
    description,
    location,
    priority,
    status: 'Pending',
    imageFile,
    filedDate: getCurrentDate(),
    lastUpdated: getCurrentDate(),
    remarks: ''
  };
  
  complaints.push(newComplaint);
  showToast(`Complaint filed successfully! ID: ${newComplaint.complaintId}`, 'success');
  
  document.getElementById('complaintForm').reset();
  document.getElementById('imageFileName').textContent = '';
  
  setTimeout(() => {
    showUserView('dashboard');
  }, 2000);
}

// Display My Complaints
function displayMyComplaints() {
  if (!currentUser) return;
  
  filterUserComplaints();
}

function filterUserComplaints() {
  const statusFilter = document.getElementById('filterStatus').value;
  const searchTerm = document.getElementById('searchComplaint').value.toLowerCase();
  
  let userComplaints = complaints.filter(c => c.userId === currentUser.id);
  
  if (statusFilter !== 'All') {
    userComplaints = userComplaints.filter(c => c.status === statusFilter);
  }
  
  if (searchTerm) {
    userComplaints = userComplaints.filter(c => 
      c.complaintId.toLowerCase().includes(searchTerm) ||
      c.subject.toLowerCase().includes(searchTerm)
    );
  }
  
  const tableBody = document.getElementById('myComplaintsTable');
  tableBody.innerHTML = '';
  
  if (userComplaints.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No complaints found.</td></tr>';
  } else {
    userComplaints.forEach(complaint => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${complaint.complaintId}</td>
        <td>${complaint.subject}</td>
        <td>${complaint.department}</td>
        <td><span class="status-badge ${getStatusBadgeClass(complaint.status)}">${complaint.status}</span></td>
        <td>${complaint.filedDate}</td>
        <td><span class="status-badge ${getPriorityBadgeClass(complaint.priority)}">${complaint.priority}</span></td>
        <td><button class="btn btn--sm btn--primary" onclick="viewComplaintDetails(${complaint.id})">View Details</button></td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// View Complaint Details
function viewComplaintDetails(complaintId) {
  const complaint = complaints.find(c => c.id === complaintId);
  if (!complaint) return;
  
  const detailsContent = document.getElementById('complaintDetailsContent');
  detailsContent.innerHTML = `
    <h3>Complaint Details</h3>
    <div class="detail-row">
      <div class="detail-label">Complaint ID:</div>
      <div class="detail-value">${complaint.complaintId}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Status:</div>
      <div class="detail-value"><span class="status-badge ${getStatusBadgeClass(complaint.status)}">${complaint.status}</span></div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Department:</div>
      <div class="detail-value">${complaint.department}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Subject:</div>
      <div class="detail-value">${complaint.subject}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Description:</div>
      <div class="detail-value">${complaint.description}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Location:</div>
      <div class="detail-value">${complaint.location}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Priority:</div>
      <div class="detail-value"><span class="status-badge ${getPriorityBadgeClass(complaint.priority)}">${complaint.priority}</span></div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Date Filed:</div>
      <div class="detail-value">${complaint.filedDate}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Last Updated:</div>
      <div class="detail-value">${complaint.lastUpdated}</div>
    </div>
    ${complaint.imageFile ? `
    <div class="detail-row">
      <div class="detail-label">Attached Image:</div>
      <div class="detail-value">${complaint.imageFile}</div>
    </div>` : ''}
    ${complaint.remarks ? `
    <div class="detail-row">
      <div class="detail-label">Admin Remarks:</div>
      <div class="detail-value">${complaint.remarks}</div>
    </div>` : ''}
    <div class="timeline">
      <h4>Status Timeline</h4>
      <div class="timeline-item">
        <div class="timeline-dot ${complaint.status === 'Pending' || complaint.status === 'In Progress' || complaint.status === 'Resolved' || complaint.status === 'Closed' ? 'completed' : 'pending'}"></div>
        <span>Open</span>
      </div>
      <div class="timeline-item">
        <div class="timeline-dot ${complaint.status === 'In Progress' || complaint.status === 'Resolved' || complaint.status === 'Closed' ? 'completed' : complaint.status === 'Pending' ? 'current' : 'pending'}"></div>
        <span>In Progress</span>
      </div>
      <div class="timeline-item">
        <div class="timeline-dot ${complaint.status === 'Resolved' || complaint.status === 'Closed' ? 'completed' : complaint.status === 'In Progress' ? 'current' : 'pending'}"></div>
        <span>Resolved</span>
      </div>
      <div class="timeline-item">
        <div class="timeline-dot ${complaint.status === 'Closed' ? 'completed' : complaint.status === 'Resolved' ? 'current' : 'pending'}"></div>
        <span>Closed</span>
      </div>
    </div>
  `;
  
  showUserView('complaintDetails');
}

// Display User Profile
function displayUserProfile() {
  if (!currentUser) return;
  
  const profileContent = document.getElementById('profileContent');
  profileContent.innerHTML = `
    <div class="detail-row">
      <div class="detail-label">Name:</div>
      <div class="detail-value">${currentUser.name}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Email:</div>
      <div class="detail-value">${currentUser.email}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Mobile:</div>
      <div class="detail-value">${currentUser.mobile}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Address:</div>
      <div class="detail-value">${currentUser.address}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Member Since:</div>
      <div class="detail-value">${currentUser.registeredDate}</div>
    </div>
    <button class="btn btn--primary" onclick="showEditProfileModal()">Edit Profile</button>
    <button class="btn btn--secondary" onclick="changePassword()" style="margin-left: 8px;">Change Password</button>
  `;
}

function showEditProfileModal() {
  document.getElementById('editName').value = currentUser.name;
  document.getElementById('editMobile').value = currentUser.mobile;
  document.getElementById('editAddress').value = currentUser.address;
  document.getElementById('editProfileModal').classList.add('show');
}

function closeEditProfileModal() {
  document.getElementById('editProfileModal').classList.remove('show');
}

function handleEditProfile(event) {
  event.preventDefault();
  
  currentUser.name = document.getElementById('editName').value.trim();
  currentUser.mobile = document.getElementById('editMobile').value.trim();
  currentUser.address = document.getElementById('editAddress').value.trim();
  
  // Update user in array
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex] = currentUser;
  }
  
  // Update complaints with new user name
  complaints.forEach(c => {
    if (c.userId === currentUser.id) {
      c.userName = currentUser.name;
    }
  });
  
  showToast('Profile updated successfully!', 'success');
  closeEditProfileModal();
  displayUserProfile();
}

function changePassword() {
  const newPassword = prompt('Enter new password (minimum 6 characters):');
  if (newPassword && newPassword.length >= 6) {
    currentUser.password = newPassword;
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
    }
    showToast('Password changed successfully!', 'success');
  } else if (newPassword !== null) {
    showToast('Password must be at least 6 characters!', 'error');
  }
}

// Admin Dashboard
function updateAdminDashboard() {
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending' || c.status === 'Open').length;
  const today = getCurrentDate();
  const resolvedToday = complaints.filter(c => c.status === 'Resolved' && c.lastUpdated === today).length;
  const totalUsers = users.length;
  
  document.getElementById('totalComplaintsAdmin').textContent = totalComplaints;
  document.getElementById('pendingComplaintsAdmin').textContent = pendingComplaints;
  document.getElementById('resolvedToday').textContent = resolvedToday;
  document.getElementById('totalUsers').textContent = totalUsers;
  
  // Display recent complaints
  const recentComplaints = complaints.slice(-5).reverse();
  const tableBody = document.getElementById('adminRecentComplaintsTable');
  tableBody.innerHTML = '';
  
  recentComplaints.forEach(complaint => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${complaint.complaintId}</td>
      <td>${complaint.userName}</td>
      <td>${complaint.subject}</td>
      <td><span class="status-badge ${getStatusBadgeClass(complaint.status)}">${complaint.status}</span></td>
      <td>
        <button class="btn btn--sm btn--primary" onclick="openUpdateComplaintModal(${complaint.id})">Update</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  
  // Create department chart
  createDepartmentChart();
}

function createDepartmentChart() {
  const ctx = document.getElementById('departmentChart');
  if (!ctx) return;
  
  const departmentCounts = {};
  categories.forEach(cat => {
    departmentCounts[cat] = complaints.filter(c => c.department === cat).length;
  });
  
  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(departmentCounts),
      datasets: [{
        label: 'Number of Complaints',
        data: Object.values(departmentCounts),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Manage Complaints (Admin)
function displayAdminComplaints() {
  // Populate department filter
  const deptFilter = document.getElementById('adminFilterDept');
  deptFilter.innerHTML = '<option value="All">All Departments</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    deptFilter.appendChild(option);
  });
  
  filterAdminComplaints();
}

function filterAdminComplaints() {
  const statusFilter = document.getElementById('adminFilterStatus').value;
  const deptFilter = document.getElementById('adminFilterDept').value;
  const searchTerm = document.getElementById('adminSearchComplaint').value.toLowerCase();
  
  let filteredComplaints = [...complaints];
  
  if (statusFilter !== 'All') {
    filteredComplaints = filteredComplaints.filter(c => c.status === statusFilter);
  }
  
  if (deptFilter !== 'All') {
    filteredComplaints = filteredComplaints.filter(c => c.department === deptFilter);
  }
  
  if (searchTerm) {
    filteredComplaints = filteredComplaints.filter(c => 
      c.complaintId.toLowerCase().includes(searchTerm) ||
      c.userName.toLowerCase().includes(searchTerm) ||
      c.subject.toLowerCase().includes(searchTerm)
    );
  }
  
  const tableBody = document.getElementById('adminComplaintsTable');
  tableBody.innerHTML = '';
  
  if (filteredComplaints.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No complaints found.</td></tr>';
  } else {
    filteredComplaints.forEach(complaint => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${complaint.complaintId}</td>
        <td>${complaint.userName}</td>
        <td>${complaint.subject}</td>
        <td>${complaint.department}</td>
        <td><span class="status-badge ${getStatusBadgeClass(complaint.status)}">${complaint.status}</span></td>
        <td><span class="status-badge ${getPriorityBadgeClass(complaint.priority)}">${complaint.priority}</span></td>
        <td>${complaint.filedDate}</td>
        <td>
          <button class="btn btn--sm btn--primary" onclick="openUpdateComplaintModal(${complaint.id})">Update</button>
          <button class="btn btn--sm btn--outline" onclick="deleteComplaint(${complaint.id})" style="margin-left: 4px;">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
}

function openUpdateComplaintModal(complaintId) {
  const complaint = complaints.find(c => c.id === complaintId);
  if (!complaint) return;
  
  const modalContent = document.getElementById('updateComplaintContent');
  modalContent.innerHTML = `
    <form onsubmit="handleUpdateComplaint(event, ${complaintId})">
      <div class="detail-row">
        <div class="detail-label">Complaint ID:</div>
        <div class="detail-value">${complaint.complaintId}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">User:</div>
        <div class="detail-value">${complaint.userName}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Subject:</div>
        <div class="detail-value">${complaint.subject}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Status *</label>
        <select class="form-control" id="updateStatus" required>
          <option value="Open" ${complaint.status === 'Open' ? 'selected' : ''}>Open</option>
          <option value="Pending" ${complaint.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
          <option value="Closed" ${complaint.status === 'Closed' ? 'selected' : ''}>Closed</option>
          <option value="Rejected" ${complaint.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Priority *</label>
        <select class="form-control" id="updatePriority" required>
          <option value="Low" ${complaint.priority === 'Low' ? 'selected' : ''}>Low</option>
          <option value="Medium" ${complaint.priority === 'Medium' ? 'selected' : ''}>Medium</option>
          <option value="High" ${complaint.priority === 'High' ? 'selected' : ''}>High</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Admin Remarks</label>
        <textarea class="form-control" id="updateRemarks" rows="3">${complaint.remarks}</textarea>
      </div>
      <button type="submit" class="btn btn--primary">Save Changes</button>
      <button type="button" class="btn btn--secondary" onclick="closeUpdateModal()" style="margin-left: 8px;">Cancel</button>
    </form>
  `;
  
  document.getElementById('updateComplaintModal').classList.add('show');
}

function closeUpdateModal() {
  document.getElementById('updateComplaintModal').classList.remove('show');
}

function handleUpdateComplaint(event, complaintId) {
  event.preventDefault();
  
  const complaint = complaints.find(c => c.id === complaintId);
  if (!complaint) return;
  
  complaint.status = document.getElementById('updateStatus').value;
  complaint.priority = document.getElementById('updatePriority').value;
  complaint.remarks = document.getElementById('updateRemarks').value.trim();
  complaint.lastUpdated = getCurrentDate();
  
  showToast('Complaint updated successfully!', 'success');
  closeUpdateModal();
  filterAdminComplaints();
  updateAdminDashboard();
}

function deleteComplaint(complaintId) {
  if (confirm('Are you sure you want to delete this complaint?')) {
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index !== -1) {
      complaints.splice(index, 1);
      showToast('Complaint deleted successfully!', 'success');
      filterAdminComplaints();
      updateAdminDashboard();
    }
  }
}

// Manage Users (Admin)
function displayAllUsers() {
  filterUsers();
}

function filterUsers() {
  const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
  
  let filteredUsers = [...users];
  
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(u => 
      u.name.toLowerCase().includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm)
    );
  }
  
  const tableBody = document.getElementById('usersTable');
  tableBody.innerHTML = '';
  
  filteredUsers.forEach(user => {
    const userComplaints = complaints.filter(c => c.userId === user.id).length;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.mobile}</td>
      <td>${user.registeredDate}</td>
      <td>${userComplaints}</td>
      <td>
        <button class="btn btn--sm btn--primary" onclick="viewUserDetails(${user.id})">View</button>
        <button class="btn btn--sm ${user.isBlocked ? 'btn--secondary' : 'btn--outline'}" onclick="toggleBlockUser(${user.id})">
          ${user.isBlocked ? 'Unblock' : 'Block'}
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function viewUserDetails(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  const userComplaints = complaints.filter(c => c.userId === userId).length;
  alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nMobile: ${user.mobile}\nAddress: ${user.address}\nRegistered: ${user.registeredDate}\nTotal Complaints: ${userComplaints}\nStatus: ${user.isBlocked ? 'Blocked' : 'Active'}`);
}

function toggleBlockUser(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  user.isBlocked = !user.isBlocked;
  showToast(`User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully!`, 'success');
  filterUsers();
}

function exportUsers() {
  let csv = 'User ID,Name,Email,Mobile,Address,Registration Date,Total Complaints,Status\n';
  
  users.forEach(user => {
    const userComplaints = complaints.filter(c => c.userId === user.id).length;
    csv += `${user.id},"${user.name}",${user.email},${user.mobile},"${user.address}",${user.registeredDate},${userComplaints},${user.isBlocked ? 'Blocked' : 'Active'}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users_export.csv';
  a.click();
  window.URL.revokeObjectURL(url);
  
  showToast('Users exported to CSV!', 'success');
}

// Manage Categories (Admin)
function displayCategories() {
  const tableBody = document.getElementById('categoriesTable');
  tableBody.innerHTML = '';
  
  categories.forEach((cat, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cat}</td>
      <td>
        <button class="btn btn--sm btn--primary" onclick="editCategory(${index})">Edit</button>
        <button class="btn btn--sm btn--outline" onclick="deleteCategory(${index})" style="margin-left: 4px;">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function showAddCategoryModal() {
  document.getElementById('addCategoryModal').classList.add('show');
}

function closeAddCategoryModal() {
  document.getElementById('addCategoryModal').classList.remove('show');
  document.getElementById('newCategoryName').value = '';
}

function handleAddCategory(event) {
  event.preventDefault();
  
  const categoryName = document.getElementById('newCategoryName').value.trim();
  
  if (categories.includes(categoryName)) {
    showToast('Category already exists!', 'error');
    return;
  }
  
  categories.push(categoryName);
  showToast('Category added successfully!', 'success');
  closeAddCategoryModal();
  displayCategories();
}

function editCategory(index) {
  const newName = prompt('Enter new category name:', categories[index]);
  if (newName && newName.trim() !== '') {
    categories[index] = newName.trim();
    showToast('Category updated successfully!', 'success');
    displayCategories();
  }
}

function deleteCategory(index) {
  if (confirm(`Are you sure you want to delete "${categories[index]}"?`)) {
    categories.splice(index, 1);
    showToast('Category deleted successfully!', 'success');
    displayCategories();
  }
}

// Reports (Admin)
function initializeReports() {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  
  document.getElementById('reportStartDate').value = startDate.toISOString().split('T')[0];
  document.getElementById('reportEndDate').value = today.toISOString().split('T')[0];
}

function generateReport() {
  const startDate = document.getElementById('reportStartDate').value;
  const endDate = document.getElementById('reportEndDate').value;
  
  if (!startDate || !endDate) {
    showToast('Please select date range!', 'error');
    return;
  }
  
  const filteredComplaints = complaints.filter(c => {
    return c.filedDate >= startDate && c.filedDate <= endDate;
  });
  
  const total = filteredComplaints.length;
  const resolved = filteredComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;
  
  // Count by status
  const statusCounts = {
    'Pending': filteredComplaints.filter(c => c.status === 'Pending').length,
    'In Progress': filteredComplaints.filter(c => c.status === 'In Progress').length,
    'Resolved': filteredComplaints.filter(c => c.status === 'Resolved').length,
    'Closed': filteredComplaints.filter(c => c.status === 'Closed').length,
    'Rejected': filteredComplaints.filter(c => c.status === 'Rejected').length
  };
  
  // Count by department
  const deptCounts = {};
  categories.forEach(cat => {
    deptCounts[cat] = filteredComplaints.filter(c => c.department === cat).length;
  });
  
  const resultsDiv = document.getElementById('reportResults');
  resultsDiv.innerHTML = `
    <div class="stats-grid" style="margin-top: 24px;">
      <div class="stat-card" style="background: var(--color-bg-1);">
        <div class="stat-value">${total}</div>
        <div class="stat-label">Total Complaints</div>
      </div>
      <div class="stat-card" style="background: var(--color-bg-3);">
        <div class="stat-value">${resolutionRate}%</div>
        <div class="stat-label">Resolution Rate</div>
      </div>
      <div class="stat-card" style="background: var(--color-bg-2);">
        <div class="stat-value">${resolved}</div>
        <div class="stat-label">Resolved</div>
      </div>
      <div class="stat-card" style="background: var(--color-bg-4);">
        <div class="stat-value">${statusCounts['Pending']}</div>
        <div class="stat-label">Pending</div>
      </div>
    </div>
    <div style="margin-top: 32px;">
      <h4>Complaints by Status</h4>
      <canvas id="statusChart" style="max-height: 300px; margin-top: 16px;"></canvas>
    </div>
    <div style="margin-top: 32px;">
      <h4>Complaints by Department</h4>
      <canvas id="deptReportChart" style="max-height: 300px; margin-top: 16px;"></canvas>
    </div>
    <div style="margin-top: 32px;">
      <h4>Top Complaint Categories</h4>
      <table class="table" style="margin-top: 16px;">
        <thead>
          <tr>
            <th>Department</th>
            <th>Count</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(deptCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([dept, count]) => `
              <tr>
                <td>${dept}</td>
                <td>${count}</td>
                <td>${total > 0 ? ((count / total) * 100).toFixed(1) : 0}%</td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  // Create status pie chart
  const statusCtx = document.getElementById('statusChart');
  const existingStatusChart = Chart.getChart(statusCtx);
  if (existingStatusChart) {
    existingStatusChart.destroy();
  }
  
  new Chart(statusCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#FF9800', '#2196F3', '#4CAF50', '#9E9E9E', '#f44336']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true
    }
  });
  
  // Create department bar chart
  const deptCtx = document.getElementById('deptReportChart');
  const existingDeptChart = Chart.getChart(deptCtx);
  if (existingDeptChart) {
    existingDeptChart.destroy();
  }
  
  new Chart(deptCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(deptCounts),
      datasets: [{
        label: 'Number of Complaints',
        data: Object.values(deptCounts),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
  
  showToast('Report generated successfully!', 'success');
}

function exportReportPDF() {
  showToast('PDF export functionality - Report data prepared for download', 'info');
}