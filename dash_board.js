// =======================
// Data Initialization
// =======================
const predefinedEmployees = [
    {
        id: '1001',
        name: 'John Smith',
        department: 'IT',
        designation: 'Software Developer',
        dailyRate: 1500.00,
        bankAccount: '1234567890 (Bank of America)',
        taxInfo: 'TIN-123456789',
        sssDeduction: 100.00, // New fixed deduction
        pagibigDeduction: 50.00, // New fixed deduction
        philhealthDeduction: 75.00 // New fixed deduction
    },
    {
        id: '1002',
        name: 'Sarah Johnson',
        department: 'HR',
        designation: 'HR Manager',
        dailyRate: 1800.00,
        bankAccount: '2345678901 (Chase)',
        taxInfo: 'TIN-234567890',
        sssDeduction: 120.00,
        pagibigDeduction: 50.00,
        philhealthDeduction: 80.00
    },
    {
        id: '1003',
        name: 'Michael Chen',
        department: 'Finance',
        designation: 'Accountant',
        dailyRate: 1600.00,
        bankAccount: '3456789012 (Wells Fargo)',
        taxInfo: 'TIN-345678901',
        sssDeduction: 90.00,
        pagibigDeduction: 50.00,
        philhealthDeduction: 70.00
    },
    {
        id: '1004',
        name: 'Emily Davis',
        department: 'Marketing',
        designation: 'Marketing Specialist',
        dailyRate: 1400.00,
        bankAccount: '4567890123 (Citi)',
        taxInfo: 'TIN-456789012',
        sssDeduction: 80.00,
        pagibigDeduction: 50.00,
        philhealthDeduction: 65.00
    }
];

// Initialize localStorage data if not exists
function initializeData() {
    if (!localStorage.getItem('employees')) {
        localStorage.setItem('employees', JSON.stringify(predefinedEmployees));
    } else {
        const existingEmployees = JSON.parse(localStorage.getItem('employees'));
        const existingIds = existingEmployees.map(emp => emp.id);
        const missingEmployees = predefinedEmployees.filter(emp => !existingIds.includes(emp.id));
        if (missingEmployees.length > 0) {
            localStorage.setItem('employees', JSON.stringify([...existingEmployees, ...missingEmployees]));
        }
    }
    if (!localStorage.getItem('attendance')) localStorage.setItem('attendance', JSON.stringify([]));
    if (!localStorage.getItem('payslips')) localStorage.setItem('payslips', JSON.stringify([]));
}
initializeData();

// =======================
// Sidebar Navigation
// =======================
const sidebarLinks = document.querySelectorAll('.sidebar-menu li');
sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
        sidebarLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        showScreen(this.getAttribute('data-screen'));
    });
});

function showScreen(screenName) {
    document.querySelectorAll('.content-screen').forEach(screen => screen.classList.add('hidden'));
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        if (screenName === 'payslips') renderPayslipList();
        else if (screenName === 'employees') renderEmployeeList();
        else if (screenName === 'attendance') renderAttendanceList();
        else if (screenName === 'dashboard') updateDashboardStats();
    }
}

// =======================
// Dashboard Stats
// =======================
function updateDashboardStats() {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    const payslips = JSON.parse(localStorage.getItem('payslips')) || [];
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(record => record.date === today).length;
    document.getElementById('total-employees').textContent = employees.length;
    document.getElementById('today-attendance').textContent = todayAttendance;
    document.getElementById('total-payslips').textContent = payslips.length;
    const pendingPayroll = employees.length - payslips.length;
    document.getElementById('pending-payroll').textContent = pendingPayroll > 0 ? pendingPayroll : 0;
}

// =======================
// Employee Management
// =======================
const addEmployeeBtn = document.getElementById('add-employee-btn');
const employeeFormContainer = document.getElementById('employee-form-container');
const employeeForm = document.getElementById('employee-form');
const employeeList = document.getElementById('employee-list').querySelector('tbody');
const closeBtn = document.querySelector('.close-btn');

addEmployeeBtn.addEventListener('click', () => {
    document.getElementById('form-title').textContent = 'Add Employee';
    employeeForm.reset();
    document.getElementById('employee-id').value = '';
    employeeFormContainer.classList.remove('hidden');
});
closeBtn.addEventListener('click', () => employeeFormContainer.classList.add('hidden'));

employeeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const employeeId = document.getElementById('employee-id').value;
    const employees = JSON.parse(localStorage.getItem('employees'));
    const name = document.getElementById('emp-name').value;
    const department = document.getElementById('emp-dept').value;
    const designation = document.getElementById('emp-designation').value;
    const dailyRate = parseFloat(document.getElementById('emp-rate').value);
    const bankAccount = document.getElementById('emp-bank').value;
    const taxInfo = document.getElementById('emp-tax').value;
    const sssDeduction = parseFloat(document.getElementById('emp-sss')?.value) || 0;
    const pagibigDeduction = parseFloat(document.getElementById('emp-pagibig')?.value) || 0;
    const philhealthDeduction = parseFloat(document.getElementById('emp-philhealth')?.value) || 0;

    const employee = {
        id: employeeId || `EMP-${Date.now()}`,
        name, department, designation, dailyRate, bankAccount, taxInfo,
        sssDeduction, pagibigDeduction, philhealthDeduction
    };

    if (employeeId) {
        const index = employees.findIndex(emp => emp.id === employeeId);
        if (index !== -1) employees[index] = employee;
    } else {
        if (employees.some(emp => emp.id === employee.id)) {
            alert(`Employee with ID ${employee.id} already exists.`); return;
        }
        if (employees.some(emp => emp.name.toLowerCase() === employee.name.toLowerCase())) {
            alert(`Employee with the name "${employee.name}" already exists.`); return;
        }
        employees.push(employee);
    }
    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployeeList();
    employeeFormContainer.classList.add('hidden');
    updateDashboardStats();
});

function renderEmployeeList() {
    const employees = JSON.parse(localStorage.getItem('employees'));
    employeeList.innerHTML = '';
    if (employees.length === 0) {
        employeeList.innerHTML = `<tr><td colspan="6" class="no-employees">No employees found</td></tr>`;
        return;
    }
    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.department}</td>
            <td>${employee.designation}</td>
            <td>₱${employee.dailyRate.toFixed(2)}</td>
            <td>
                <button class="edit-btn" data-id="${employee.id}">Edit</button>
                <button class="delete-btn" data-id="${employee.id}">Delete</button>
                <button class="view-btn" data-id="${employee.id}">View</button>
            </td>
        `;
        employeeList.appendChild(row);
    });
    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => editEmployee(btn.dataset.id)));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => deleteEmployee(btn.dataset.id)));
    document.querySelectorAll('.view-btn').forEach(btn => btn.addEventListener('click', () => viewEmployee(btn.dataset.id)));
}

function editEmployee(id) {
    const employees = JSON.parse(localStorage.getItem('employees'));
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        document.getElementById('form-title').textContent = 'Edit Employee';
        document.getElementById('employee-id').value = employee.id;
        document.getElementById('emp-name').value = employee.name;
        document.getElementById('emp-dept').value = employee.department;
        document.getElementById('emp-designation').value = employee.designation;
        document.getElementById('emp-rate').value = employee.dailyRate;
        document.getElementById('emp-bank').value = employee.bankAccount;
        document.getElementById('emp-tax').value = employee.taxInfo;
        document.getElementById('emp-sss').value = employee.sssDeduction || 0;
        document.getElementById('emp-pagibig').value = employee.pagibigDeduction || 0;
        document.getElementById('emp-philhealth').value = employee.philhealthDeduction || 0;
        employeeFormContainer.classList.remove('hidden');
    }
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        let employees = JSON.parse(localStorage.getItem('employees'));
        employees = employees.filter(emp => emp.id !== id);
        localStorage.setItem('employees', JSON.stringify(employees));
        renderEmployeeList();
        updateDashboardStats();
    }
}

const employeeViewModal = document.getElementById('employee-view-modal');
const closeEmployeeBtn = document.querySelector('.close-btn-employee');
function viewEmployee(id) {
    const employees = JSON.parse(localStorage.getItem('employees'));
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        document.getElementById('employee-details').innerHTML = `
            <p><strong>Employee ID:</strong> ${employee.id}</p>
            <p><strong>Full Name:</strong> ${employee.name}</p>
            <p><strong>Department:</strong> ${employee.department}</p>
            <p><strong>Designation:</strong> ${employee.designation}</p>
            <p><strong>Daily Rate:</strong> ₱${employee.dailyRate.toFixed(2)}</p>
            <p><strong>Bank Account:</strong> ${employee.bankAccount}</p>
            <p><strong>Tax Information:</strong> ${employee.taxInfo}</p>
            <p><strong>SSS Deduction:</strong> ₱${employee.sssDeduction ? employee.sssDeduction.toFixed(2) : '0.00'}</p>
            <p><strong>Pag-IBIG Deduction:</strong> ₱${employee.pagibigDeduction ? employee.pagibigDeduction.toFixed(2) : '0.00'}</p>
            <p><strong>PhilHealth Deduction:</strong> ₱${employee.philhealthDeduction ? employee.philhealthDeduction.toFixed(2) : '0.00'}</p>
        `;
        employeeViewModal.classList.remove('hidden');
    }
}
closeEmployeeBtn.addEventListener('click', () => employeeViewModal.classList.add('hidden'));
window.addEventListener('click', event => {
    if (event.target === employeeViewModal) employeeViewModal.classList.add('hidden');
});

// =======================
// Attendance Management
// =======================
const attendanceList = document.getElementById('attendance-list').querySelector('tbody');
const saveAttendanceBtn = document.getElementById('save-attendance-btn');
const attendanceDateInput = document.getElementById('attendance-date');
attendanceDateInput.max = new Date().toISOString().split('T')[0];
attendanceDateInput.valueAsDate = new Date();

function renderAttendanceList() {
    const employees = JSON.parse(localStorage.getItem('employees'));
    const selectedDate = attendanceDateInput.value;
    const attendanceRecords = JSON.parse(localStorage.getItem('attendance'));
    attendanceList.innerHTML = '';
    if (employees.length === 0) {
        attendanceList.innerHTML = `<tr><td colspan="5" class="no-employees">No employees found</td></tr>`;
        return;
    }
    employees.forEach(employee => {
        const existingRecord = attendanceRecords.find(record =>
            record.employeeId === employee.id && record.date === selectedDate
        );
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td><input type="time" class="time-in" data-employee="${employee.id}" value="${existingRecord?.timeIn || ''}"></td>
            <td><input type="time" class="time-out" data-employee="${employee.id}" value="${existingRecord?.timeOut || ''}" readonly></td>
            <td>
                <select class="attendance-status" data-employee="${employee.id}">
                    <option value="">Select Status</option>
                    <option value="present" ${existingRecord?.status === 'present' ? 'selected' : ''}>Present</option>
                    <option value="late" ${existingRecord?.status === 'late' ? 'selected' : ''}>Late</option>
                    <option value="absent" ${existingRecord?.status === 'absent' ? 'selected' : ''}>Absent</option>
                    <option value="on leave" ${existingRecord?.status === 'on leave' ? 'selected' : ''}>On Leave</option>
                </select>
            </td>
        `;
        attendanceList.appendChild(row);
    });
    document.querySelectorAll('.time-in').forEach(timeInInput => {
        timeInInput.addEventListener('change', function() {
            const employeeId = this.getAttribute('data-employee');
            const timeInValue = this.value;
            const timeOutInput = document.querySelector(`.time-out[data-employee="${employeeId}"]`);
            if (timeInValue && timeOutInput) {
                const [hours, minutes] = timeInValue.split(':').map(Number);
                const timeInDate = new Date();
                timeInDate.setHours(hours, minutes, 0, 0);
                timeInDate.setTime(timeInDate.getTime() + (9 * 60 * 60 * 1000));
                const timeOutHours = String(timeInDate.getHours()).padStart(2, '0');
                const timeOutMinutes = String(timeInDate.getMinutes()).padStart(2, '0');
                timeOutInput.value = `${timeOutHours}:${timeOutMinutes}`;
            } else if (!timeInValue && timeOutInput) {
                timeOutInput.value = '';
            }
        });
    });
}

saveAttendanceBtn.addEventListener('click', function() {
    const selectedDate = new Date(attendanceDateInput.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate > currentDate) {
        alert("You cannot select a future date for attendance.");
        return;
    }
    const formattedDate = attendanceDateInput.value;
    const statusSelects = document.querySelectorAll('.attendance-status');
    let attendanceRecords = JSON.parse(localStorage.getItem('attendance'));
    attendanceRecords = attendanceRecords.filter(record => record.date !== formattedDate);
    statusSelects.forEach(select => {
        const employeeId = select.getAttribute('data-employee');
        const status = select.value;
        const timeInInput = document.querySelector(`.time-in[data-employee="${employeeId}"]`);
        const timeOutInput = document.querySelector(`.time-out[data-employee="${employeeId}"]`);
        if (status) {
            attendanceRecords.push({
                date: formattedDate,
                employeeId,
                status,
                timeIn: timeInInput?.value || '',
                timeOut: timeOutInput?.value || ''
            });
        }
    });
    localStorage.setItem('attendance', JSON.stringify(attendanceRecords));
    alert('Attendance saved successfully!');
    updateDashboardStats();
});

attendanceDateInput.addEventListener('change', renderAttendanceList);
attendanceDateInput.addEventListener('change', function() {
    const selectedDate = new Date(this.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < currentDate) {
        alert("You cannot select a past date for attendance.");
        this.valueAsDate = new Date();
    }
    renderAttendanceList();
});

// =======================
// Payroll Processing
// =======================
const calculatePayrollBtn = document.getElementById('calculate-payroll-btn');
const payrollResults = document.getElementById('payroll-results');
const payrollResultsBody = document.getElementById('payroll-results-body');
const generatePayslipsBtn = document.getElementById('generate-payslips-btn');
const cutoffSelect = document.getElementById('cutoff-select');
const payrollStartInput = document.getElementById('payroll-start');
const payrollEndInput = document.getElementById('payroll-end');

function setCutoffDates() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    let startDate, endDate;
    if (cutoffSelect.value === '1-15') {
        startDate = new Date(year, month, 1);
        endDate = new Date(year, month, 15);
    } else {
        startDate = new Date(year, month, 16);
        endDate = new Date(year, month + 1, 0);
    }
    payrollStartInput.value = startDate.toISOString().split('T')[0];
    payrollEndInput.value = endDate.toISOString().split('T')[0];
}
setCutoffDates();
cutoffSelect.addEventListener('change', setCutoffDates);

calculatePayrollBtn.addEventListener('click', function() {
    const startDate = payrollStartInput.value;
    const endDate = payrollEndInput.value;
    const fixedLateDeduction = 50;
    const taxRate = 0.1;
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }
    const employees = JSON.parse(localStorage.getItem('employees'));
    const attendanceRecords = JSON.parse(localStorage.getItem('attendance'));
    payrollResultsBody.innerHTML = '';
    if (employees.length === 0) {
        payrollResultsBody.innerHTML = `<tr><td colspan="8" class="no-employees">No employees found</td></tr>`;
        payrollResults.classList.remove('hidden');
        return;
    }
    employees.forEach(employee => {
        let daysWorkedForPay = 0;
        let grossPay = 0;
        const employeeRecords = attendanceRecords.filter(record =>
            record.employeeId === employee.id &&
            record.date >= startDate &&
            record.date <= endDate
        );
        const presentDays = employeeRecords.filter(record => record.status === 'present').length;
        const lateDaysByStatus = employeeRecords.filter(record => record.status === 'late').length;
        daysWorkedForPay = presentDays + lateDaysByStatus;
        grossPay = daysWorkedForPay * employee.dailyRate;
        const lateDeduction = lateDaysByStatus * fixedLateDeduction;
        const sssDeduction = employee.sssDeduction || 0;
        const pagibigDeduction = employee.pagibigDeduction || 0;
        const philhealthDeduction = employee.philhealthDeduction || 0;
        const grossAfterLate = Math.max(0, grossPay - lateDeduction);
        const tax = grossAfterLate * taxRate;
        const totalDeductions = lateDeduction + sssDeduction + pagibigDeduction + philhealthDeduction + tax;
        const netPay = grossAfterLate - tax - sssDeduction - pagibigDeduction - philhealthDeduction;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.designation || 'N/A'}</td>
            <td>${presentDays}</td>
            <td>${lateDaysByStatus}</td>
            <td>${daysWorkedForPay}</td>
            <td>₱${grossPay.toFixed(2)}</td>
            <td>₱${totalDeductions.toFixed(2)}</td>
            <td>₱${netPay.toFixed(2)}</td>
        `;
        payrollResultsBody.appendChild(row);
    });
    const payrollHeaderRow = payrollResults.querySelector('thead tr');
    payrollHeaderRow.innerHTML = `
        <th>Emp. ID</th>
        <th>Name</th>
        <th>Job Position</th>
        <th>Present</th>
        <th>Late</th>
        <th>Days Worked</th>
        <th>Gross Pay</th>
        <th>Total Deductions</th>
        <th>Net Pay</th>
    `;
    payrollResults.classList.remove('hidden');
});

generatePayslipsBtn.addEventListener('click', function() {
    const startDate = payrollStartInput.value;
    const endDate = payrollEndInput.value;
    const fixedLateDeduction = 50;
    const taxRate = 0.1;
    let payslips = JSON.parse(localStorage.getItem('payslips')) || [];
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const attendanceRecords = JSON.parse(localStorage.getItem('attendance')) || [];
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }
    payslips = payslips.filter(ps => ps.period !== `${startDate} to ${endDate}`);
    employees.forEach(employee => {
        let daysWorkedForPay = 0;
        let grossPay = 0;
        const employeeRecords = attendanceRecords.filter(record =>
            record.employeeId === employee.id &&
            record.date >= startDate &&
            record.date <= endDate
        );
        const presentDays = employeeRecords.filter(record => record.status === 'present').length;
        const lateDays = employeeRecords.filter(record => record.status === 'late').length;
        const absentDays = employeeRecords.filter(record => record.status === 'absent').length;
        const onLeaveDays = employeeRecords.filter(record => record.status === 'on leave').length;
        const totalWorkableDays = employeeRecords.length;
        daysWorkedForPay = presentDays + lateDays;
        grossPay = daysWorkedForPay * employee.dailyRate;
        const totalLateDeduction = lateDays * fixedLateDeduction;
        grossPay = Math.max(0, grossPay - totalLateDeduction);
        const taxDeduction = grossPay * taxRate;
        const sssDeduction = employee.sssDeduction || 0;
        const pagibigDeduction = employee.pagibigDeduction || 0;
        const philhealthDeduction = employee.philhealthDeduction || 0;
        const netPay = grossPay - taxDeduction - sssDeduction - pagibigDeduction - philhealthDeduction;
        if (totalWorkableDays > 0) {
            payslips.push({
                id: `PS-${Date.now()}-${employee.id}`,
                employeeId: employee.id,
                employeeName: employee.name,
                designation: employee.designation,
                period: `${startDate} to ${endDate}`,
                totalWorkableDays,
                presentDays,
                lateDays,
                absentDays,
                onLeaveDays,
                daysWorkedForPay,
                dailyRate: employee.dailyRate,
                grossPay,
                lateDeduction: totalLateDeduction,
                tax: taxDeduction,
                sssDeduction,
                pagibigDeduction,
                philhealthDeduction,
                netPay,
                generatedDate: new Date().toLocaleDateString()
            });
        }
    });
    localStorage.setItem('payslips', JSON.stringify(payslips));
    renderPayslipList();
    document.querySelectorAll('.sidebar-menu li').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.sidebar-menu li[data-screen="payslips"]').classList.add('active');
    showScreen('payslips');
    alert('Payslips generated successfully!');
    updateDashboardStats();
});

// =======================
// Payslip List & Modal
// =======================
function renderPayslipList() {
    const payslips = JSON.parse(localStorage.getItem('payslips')) || [];
    const payslipListBody = document.querySelector('#payslip-list tbody');
    payslipListBody.innerHTML = '';
    if (payslips.length === 0) {
        payslipListBody.innerHTML = `<tr><td colspan="5" class="no-payslips">No payslips generated yet</td></tr>`;
        return;
    }
    payslips.forEach(payslip => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payslip.id}</td>
            <td>${payslip.employeeName}</td>
            <td>${payslip.period}</td>
            <td>₱${payslip.netPay.toFixed(2)}</td>
            <td><button class="view-payslip-btn" data-id="${payslip.id}">View</button></td>
        `;
        payslipListBody.appendChild(row);
    });
    document.querySelectorAll('.view-payslip-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            viewPayslip(this.getAttribute('data-id'));
        });
    });
}

const payslipModal = document.getElementById('payslip-modal');
const closePayslipBtn = document.querySelector('.close-btn-payslip');
const payslipDetails = document.getElementById('payslip-details');

function viewPayslip(id) {
    const payslips = JSON.parse(localStorage.getItem('payslips'));
    const payslip = payslips.find(ps => ps.id === id);
    if (payslip) {
        payslipDetails.innerHTML = `
            <h2>Payslip: ${payslip.id}</h2>
            <p><strong>Employee:</strong> ${payslip.employeeName}</p>
            <p><strong>Employee ID:</strong> ${payslip.employeeId}</p>
            <p><strong>Job Position:</strong> ${payslip.designation}</p>
            <p><strong>Pay Period:</strong> ${payslip.period}</p>
            <hr>
            <p><strong>Total Workable Days:</strong> ${payslip.totalWorkableDays}</p>
            <p><strong>Present Days:</strong> ${payslip.presentDays}</p>
            <p><strong>Late Days:</strong> ${payslip.lateDays}</p>
            <p><strong>Absent Days:</strong> ${payslip.absentDays}</p>
            <p><strong>On Leave Days:</strong> ${payslip.onLeaveDays}</p>
            <hr>
            <p><strong>Days Worked for Pay:</strong> ${payslip.daysWorkedForPay}</p>
            <p><strong>Daily Rate:</strong> ₱${payslip.dailyRate.toFixed(2)}</p>
            <p><strong>Gross Pay:</strong> ₱${payslip.grossPay.toFixed(2)}</p>
            <p><strong>Late Deduction:</strong> ₱${payslip.lateDeduction ? payslip.lateDeduction.toFixed(2) : '0.00'}</p>
            <p><strong>Tax Deduction:</strong> ₱${payslip.tax.toFixed(2)}</p>
            <p><strong>SSS Deduction:</strong> ₱${payslip.sssDeduction ? payslip.sssDeduction.toFixed(2) : '0.00'}</p>
            <p><strong>Pag-IBIG Deduction:</strong> ₱${payslip.pagibigDeduction ? payslip.pagibigDeduction.toFixed(2) : '0.00'}</p>
            <p><strong>PhilHealth Deduction:</strong> ₱${payslip.philhealthDeduction ? payslip.philhealthDeduction.toFixed(2) : '0.00'}</p>
            <hr>
            <p><strong>Net Pay:</strong> ₱${payslip.netPay.toFixed(2)}</p>
            <p><strong>Generated Date:</strong> ${payslip.generatedDate}</p>
            <button id="print-payslip" class="print-btn">Print Payslip</button>
        `;
        payslipModal.classList.remove('hidden');
        document.getElementById('print-payslip')?.addEventListener('click', () => window.print());
    }
}
closePayslipBtn.addEventListener('click', () => payslipModal.classList.add('hidden'));
window.addEventListener('click', event => {
    if (event.target === payslipModal) payslipModal.classList.add('hidden');
});

// Clear payslips
document.getElementById('clear-payslips-btn')?.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete all payslips? This cannot be undone.')) {
        localStorage.setItem('payslips', JSON.stringify([]));
        renderPayslipList();
        alert('All payslips have been cleared!');
        updateDashboardStats();
    }
});

// =======================
// Authentication
// =======================
const logoutBtn = document.getElementById('logout-btn');
const loginForm = document.getElementById('login-form');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    });
}
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid username or password');
        }
    });
}

// =======================
// App Initialization
// =======================
function init() {
    if (localStorage.getItem('isLoggedIn')) {
        document.querySelector('.sidebar-menu li[data-screen="dashboard"]').classList.add('active');
        showScreen('dashboard');
    }
    renderEmployeeList();
    renderAttendanceList();
    renderPayslipList();
    updateDashboardStats();
}
init();