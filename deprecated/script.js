let notices = JSON.parse(localStorage.getItem('notices')) || [];
let schedules = JSON.parse(localStorage.getItem('schedules')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let attendance = JSON.parse(localStorage.getItem('attendance')) || {};

function saveData() {
    localStorage.setItem('notices', JSON.stringify(notices));
    localStorage.setItem('schedules', JSON.stringify(schedules));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('attendance', JSON.stringify(attendance));
}

function addNotice() {
    const noticeInput = document.getElementById('new-notice');
    if (noticeInput.value !== '') {
        notices.push(noticeInput.value);
        noticeInput.value = '';
        renderNotices();
        saveData();
        showNotification('새 공지사항이 추가되었습니다.');
    }
}

function removeNotice(index) {
    notices.splice(index, 1);
    renderNotices();
    saveData();
    showNotification('공지사항이 삭제되었습니다.');
}

function addSchedule() {
    const scheduleInput = document.getElementById('new-schedule');
    const scheduleDate = document.getElementById('schedule-date');
    if (scheduleInput.value !== '' && scheduleDate.value !== '') {
        schedules.push({date: scheduleDate.value, text: scheduleInput.value});
        scheduleInput.value = '';
        scheduleDate.value = '';
        renderSchedules();
        saveData();
        showNotification('새 일정이 추가되었습니다.');
    }
}

function removeSchedule(index) {
    schedules.splice(index, 1);
    renderSchedules();
    saveData();
    showNotification('일정이 삭제되었습니다.');
}

function addStudent() {
    const studentInput = document.getElementById('new-student');
    if (studentInput.value !== '') {
        students.push(studentInput.value);
        studentInput.value = '';
        renderStudents();
        saveData();
        showNotification('새 학생이 추가되었습니다.');
    }
}

function removeStudent(student) {
    students = students.filter(s => s !== student);
    renderStudents();
    saveData();
    showNotification('학생이 삭제되었습니다.');
}

function takeAttendance() {
    const date = document.getElementById('attendance-date').value;
    if (date) {
        attendance[date] = {};
        renderAttendance(date);
        saveData();
    }
}

function markAttendance(student, date, status) {
    if (!attendance[date]) {
        attendance[date] = {};
    }
    attendance[date][student] = status;
    renderAttendance(date);
    saveData();
}

function renderNotices() {
    const noticeList = document.getElementById('notice-list');
    noticeList.innerHTML = notices.map((notice, index) => `<li>${notice} <button onclick="removeNotice(${index})">삭제</button></li>`).join('');
}

function renderSchedules() {
    const scheduleList = document.getElementById('schedule-list');
    scheduleList.innerHTML = schedules.map((schedule, index) => `<li>${schedule.date}: ${schedule.text} <button onclick="removeSchedule(${index})">삭제</button></li>`).join('');
}

function renderStudents() {
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = `
        <tr>
            <th>학생 이름</th>
            <th>작업</th>
        </tr>
        ${students.map(student => `
            <tr>
                <td>${student}</td>
                <td><button onclick="removeStudent('${student}')">삭제</button></td>
            </tr>
        `).join('')}
    `;
}

function renderAttendance(date) {
    const attendanceList = document.getElementById('attendance-list');
    attendanceList.innerHTML = `
        <h3>${date} 출석</h3>
        <table>
            <tr>
                <th>학생 이름</th>
                <th>출석 상태</th>
            </tr>
            ${students.map(student => `
                <tr>
                    <td>${student}</td>
                    <td>
                        <select onchange="markAttendance('${student}', '${date}', this.value)">
                            <option value="present" ${attendance[date] && attendance[date][student] === 'present' ? 'selected' : ''}>출석</option>
                            <option value="absent" ${attendance[date] && attendance[date][student] === 'absent' ? 'selected' : ''}>결석</option>
                            <option value="late" ${attendance[date] && attendance[date][student] === 'late' ? 'selected' : ''}>지각</option>
                        </select>
                    </td>
                </tr>
            `).join('')}
        </table>
    `;
}

function openTab(evt, tabName) {
    var i, content, tabs;
    content = document.getElementsByClassName("content");
    for (i = 0; i < content.length; i++) {
        content[i].style.display = "none";
    }
    tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 다크 모드 토글 기능 추가
const darkModeToggle = document.getElementById('dark-mode-toggle');
const rootElement = document.documentElement;

darkModeToggle.addEventListener('click', () => {
    if (rootElement.classList.contains('dark-mode')) {
        rootElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    } else {
        rootElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
});

// 페이지 로드 시 테마 설정
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    rootElement.classList.add('dark-mode');
} else {
    rootElement.classList.remove('dark-mode');
}

// 초기 렌더링
renderNotices();
renderSchedules();
renderStudents();
