// ==================== GLOBAL VARIABLES ====================
let students = [];
let editId = null;

// ==================== ANIMATED BACKGROUND ====================
function createBubbles() {
    const bg = document.getElementById('animatedBg');
    if (!bg) return;
    
    for (let i = 0; i < 50; i++) {
        const bubble = document.createElement('span');
        const size = Math.random() * 50 + 10;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDelay = Math.random() * 15 + 's';
        bubble.style.animationDuration = Math.random() * 10 + 10 + 's';
        bg.appendChild(bubble);
    }
}

// ==================== CRUD OPERATIONS ====================

// Load students from localStorage
function loadStudents() {
    const stored = localStorage.getItem('students');
    if (stored) {
        students = JSON.parse(stored);
    } else {
        // Sample data
        students = [
            { id: 1, name: 'John Doe', regNo: 'REG001', email: 'john@example.com', course: 'JavaScript', phone: '0712345678' },
            { id: 2, name: 'Jane Smith', regNo: 'REG002', email: 'jane@example.com', course: 'Python', phone: '0723456789' },
            { id: 3, name: 'Mike Johnson', regNo: 'REG003', email: 'mike@example.com', course: 'Web Development', phone: '0734567890' }
        ];
        saveToLocalStorage();
    }
    displayStudents();
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Display students in table
function displayStudents(filteredStudents = null) {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;
    
    const dataToShow = filteredStudents || students;
    
    if (dataToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No students found. Add a student!</td></tr>';
        updateStudentCount(0);
        return;
    }
    
    tbody.innerHTML = '';
    dataToShow.forEach(student => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${student.id}</td>
            <td><strong>${student.name}</strong></td>
            <td>${student.regNo}</td>
            <td>${student.email}</td>
            <td><span class="stats-badge">${student.course}</span></td>
            <td>${student.phone}</td>
            <td class="action-btns">
                <button class="btn-edit" onclick="editStudent(${student.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
    });
    
    updateStudentCount(dataToShow.length);
}

// Update student count display
function updateStudentCount(count) {
    const countEl = document.getElementById('studentCount');
    if (countEl) {
        countEl.innerHTML = `Total Students: ${count}`;
    }
}

// Add new student (CREATE)
function addStudent() {
    const name = document.getElementById('studentName')?.value;
    const regNo = document.getElementById('studentRegNo')?.value;
    const email = document.getElementById('studentEmail')?.value;
    const course = document.getElementById('studentCourse')?.value;
    const phone = document.getElementById('studentPhone')?.value;
    
    if (!name || !regNo || !email || !course || !phone) {
        alert('❌ Please fill in all fields!');
        return;
    }
    
    // Check if regNo already exists
    if (students.some(s => s.regNo === regNo)) {
        alert('❌ Registration number already exists!');
        return;
    }
    
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    const newStudent = {
        id: newId,
        name: name,
        regNo: regNo,
        email: email,
        course: course,
        phone: phone
    };
    
    students.push(newStudent);
    saveToLocalStorage();
    displayStudents();
    clearForm();
    alert(`✅ Student "${name}" added successfully!`);
}

// Edit student (UPDATE - Load data into form)
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    editId = id;
    document.getElementById('studentId').value = student.id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentRegNo').value = student.regNo;
    document.getElementById('studentEmail').value = student.email;
    document.getElementById('studentCourse').value = student.course;
    document.getElementById('studentPhone').value = student.phone;
    
    // Change button to Update
    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn) {
        saveBtn.innerHTML = '<i class="fas fa-pen"></i> Update Student';
        saveBtn.setAttribute('onclick', 'updateStudent()');
        saveBtn.classList.add('btn-update');
        saveBtn.classList.remove('btn-save');
    }
    
    // Scroll to form
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

// Update student (UPDATE - Save changes)
function updateStudent() {
    const id = editId;
    const name = document.getElementById('studentName')?.value;
    const regNo = document.getElementById('studentRegNo')?.value;
    const email = document.getElementById('studentEmail')?.value;
    const course = document.getElementById('studentCourse')?.value;
    const phone = document.getElementById('studentPhone')?.value;
    
    if (!name || !regNo || !email || !course || !phone) {
        alert('❌ Please fill in all fields!');
        return;
    }
    
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = { id, name, regNo, email, course, phone };
        saveToLocalStorage();
        displayStudents();
        clearForm();
        alert(`✅ Student "${name}" updated successfully!`);
        
        // Reset button back to Save
        const updateBtn = document.querySelector('.btn-update');
        if (updateBtn) {
            updateBtn.innerHTML = '<i class="fas fa-save"></i> Save Student';
            updateBtn.setAttribute('onclick', 'addStudent()');
            updateBtn.classList.add('btn-save');
            updateBtn.classList.remove('btn-update');
        }
        editId = null;
    }
}

// Delete student (DELETE)
function deleteStudent(id) {
    const student = students.find(s => s.id === id);
    if (confirm(`⚠️ Are you sure you want to delete "${student?.name}"?`)) {
        students = students.filter(s => s.id !== id);
        saveToLocalStorage();
        displayStudents();
        alert(`✅ Student deleted successfully!`);
        
        // Clear form if editing deleted student
        if (editId === id) {
            clearForm();
        }
    }
}

// Clear form
function clearForm() {
    document.getElementById('studentId').value = '';
    document.getElementById('studentName').value = '';
    document.getElementById('studentRegNo').value = '';
    document.getElementById('studentEmail').value = '';
    document.getElementById('studentCourse').value = '';
    document.getElementById('studentPhone').value = '';
    editId = null;
    
    // Reset button to Save
    const updateBtn = document.querySelector('.btn-update');
    if (updateBtn) {
        updateBtn.innerHTML = '<i class="fas fa-save"></i> Save Student';
        updateBtn.setAttribute('onclick', 'addStudent()');
        updateBtn.classList.add('btn-save');
        updateBtn.classList.remove('btn-update');
    }
}

// Search students
function searchStudents() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    if (!searchTerm) {
        displayStudents();
        return;
    }
    
    const filtered = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) ||
        student.regNo.toLowerCase().includes(searchTerm) ||
        student.course.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm)
    );
    
    displayStudents(filtered);
}

// ==================== CONTACT FORM ====================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const messageEl = document.getElementById('formMessage');
        
        if (name && email && message) {
            messageEl.innerHTML = '✅ Thank you ' + name + '! Your message has been sent. We\'ll get back to you soon.';
            messageEl.style.color = '#28a745';
            form.reset();
            
            setTimeout(() => {
                messageEl.innerHTML = '';
            }, 5000);
        } else {
            messageEl.innerHTML = '❌ Please fill in all fields.';
            messageEl.style.color = '#dc3545';
            
            setTimeout(() => {
                messageEl.innerHTML = '';
            }, 3000);
        }
    });
}

// ==================== LOGIN FORM ====================
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const messageEl = document.getElementById('loginMessage');
        
        if (email && password) {
            messageEl.innerHTML = '✅ Login successful! Redirecting to dashboard...';
            messageEl.style.color = '#28a745';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            messageEl.innerHTML = '❌ Please enter email and password.';
            messageEl.style.color = '#dc3545';
            
            setTimeout(() => {
                messageEl.innerHTML = '';
            }, 3000);
        }
    });
}

// ==================== ENROLL COURSE ====================
function enrollCourse(courseName) {
    alert(`🎓 You have enrolled in ${courseName}! Check your email for details.`);
}

// ==================== SIGNUP ====================
function showSignup() {
    alert('📝 Sign up feature coming soon! Please check back later.');
}

// ==================== PAGE LOAD ====================
document.addEventListener('DOMContentLoaded', function() {
    createBubbles();
    setupContactForm();
    setupLoginForm();
    loadStudents();
    console.log('🚀 EduLearn Website with CRUD Loaded Successfully!');
});