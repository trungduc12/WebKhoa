function showContent(contentId) {
    const menuItems = document.querySelectorAll('.sidebar .menu li a');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    const selectedItem = document.querySelector(`.sidebar .menu li a[href='#${contentId}']`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    const selectedSection = document.getElementById(contentId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
}

function thucHienChucNang() {
    alert("Chức năng thêm người dùng mới được thực hiện!");
}

function generateCalendar(month, year) {
    const calendarTable = document.getElementById('calendarTable').querySelector('tbody');
    calendarTable.innerHTML = '';
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                cell.innerText = '';
            } else if (date > daysInMonth) {
                cell.innerText = '';
            } else {
                cell.innerText = date;
                if ([5, 12, 19, 25].includes(date)) {
                    cell.style.backgroundColor = '#ffedcc';
                    cell.style.fontWeight = 'bold';
                }
                date++;
            }
            row.appendChild(cell);
        }
        calendarTable.appendChild(row);
        if (date > daysInMonth) {
            break;
        }
    }
}

generateCalendar(10, 2024);

document.querySelector('.add-article-btn').addEventListener('click', function () {
    const title = document.querySelector('.article-form input[placeholder="Tên bài báo"]').value;
    const author = document.querySelector('.article-form input[placeholder="Tên tác giả"]').value;
    const year = document.querySelector('.article-form input[placeholder="Năm sáng tác"]').value;
    if (title && author && year) {
        const table = document.querySelector('.article-table tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${title}</td>
            <td>${author}</td>
            <td><a href="#">Link PDF</a></td>
            <td>
                <button class="delete-btn">🗑️</button>
                <button class="edit-btn">Sửa</button>
            </td>
        `;
        table.appendChild(row);
    } else {
        alert('Vui lòng điền đầy đủ thông tin!');
    }
});

document.querySelector('.article-table').addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn')) {
        event.target.closest('tr').remove();
    }
});

document.querySelector('.add-course-btn').addEventListener('click', function () {
    const courseList = document.querySelector('.course-list');
    const newCourse = document.createElement('div');
    newCourse.className = 'course-card';
    newCourse.innerHTML = `
        <img src="/img/course_thumbnail.png" alt="Course Thumbnail" class="course-thumbnail">
        <p class="course-title">New Course - Placeholder</p>
    `;
    courseList.appendChild(newCourse);
});

document.querySelector('.delete-course-btn').addEventListener('click', function () {
    const courseList = document.querySelector('.course-list');
    if (courseList.lastElementChild) {
        courseList.removeChild(courseList.lastElementChild);
    } else {
        alert('Không có bài giảng nào để xóa!');
    }
});