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

function showAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
}




document.getElementById("addArticleBtn").addEventListener("click", function() {
    var title = document.getElementById("articleTitle").value;
    var content = document.getElementById("articleContent").value;

    // Kiểm tra xem các trường có trống không
    if (title.trim() === "" || content.trim() === "") {
        alert("Vui lòng nhập tiêu đề và nội dung bài báo.");
        return;
    }

    // Gửi yêu cầu AJAX để thêm bài viết
    fetch("/add_article", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tieu_de: title,
            noi_dung: content
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Thêm bài viết mới vào bảng
            var newRow = `<tr id="article-${data.article.id}">
                            <td>${data.article.tieu_de}</td>
                            <td>${data.article.noi_dung}</td>
                            <td>${data.article.ngay_dang}</td>
                            <td>${data.article.trang_thai}</td>
                            <td>
                                <button class="delete-btn" onclick="deleteArticle(${data.article.id})">🗑️</button>
                                <button class="edit-btn" onclick="editArticle(${data.article.id})">Sửa</button>
                            </td>
                          </tr>`;
            document.getElementById("articleTableBody").insertAdjacentHTML('beforeend', newRow);

            // Xóa giá trị input
            document.getElementById("articleTitle").value = "";
            document.getElementById("articleContent").value = "";
        } else {
            alert("Có lỗi xảy ra: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Có lỗi xảy ra khi gửi yêu cầu.");
    });
});


function showAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

// Đóng modal thêm người dùng
function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
}

// Thêm người dùng mới
function addUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    if (!username || !password || !email || !role) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    fetch('/add_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ten_dang_nhap: username,
            mat_khau: password,
            email: email,
            vai_tro: role
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadUsers(); // Cập nhật lại danh sách người dùng
            closeAddUserModal(); // Đóng modal
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('email').value = '';
            alert("Thêm người dùng thành công!");
        } else {
            alert(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    });
}

// Tải danh sách người dùng
function loadUsers() {
    fetch('/get_users')
    .then(response => response.json())
    .then(data => {
        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = '';
        data.forEach(user => {
            const newRow = `<tr>
                <td>${user.ma_nguoi_dung}</td>
                <td>${user.ten_dang_nhap}</td>
                <td>${user.email}</td>
                <td>${user.vai_tro}</td>
                <td>${user.ngay_tao}</td>
            </tr>`;
            userTableBody.insertAdjacentHTML('beforeend', newRow);
        });
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Có lỗi xảy ra khi tải danh sách người dùng.");
    });
}

// Tải danh sách người dùng ngay khi trang được tải
document.addEventListener('DOMContentLoaded', loadUsers);


// Hàm mở modal thêm khóa học
function showAddCourseModal() {
    document.getElementById('addCourseModal').style.display = 'block';
}

// Hàm đóng modal thêm khóa học
function closeAddCourseModal() {
    document.getElementById('addCourseModal').style.display = 'none';
}

// Hàm thêm khóa học mới (tạm thời chỉ hiển thị trên giao diện)
function addCourse() {
    const courseTitle = document.getElementById('courseTitle').value;
    const courseDescription = document.getElementById('courseDescription').value;

    if (!courseTitle || !courseDescription) {
        alert("Vui lòng nhập đầy đủ thông tin khóa học!");
        return;
    }

    // Gửi dữ liệu khóa học mới đến backend (tạm thời thêm vào giao diện)
    fetch('/add_course', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ten_khoa_hoc: courseTitle,
            mo_ta: courseDescription
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Thêm khóa học mới vào danh sách hiển thị
            const newCourse = `
                <div class="course-card">
                    <img src="static/img/thumbnail.png" alt="Course Thumbnail" class="course-thumbnail">
                    <p class="course-title">${data.ten_khoa_hoc}</p>
                </div>`;
            document.getElementById('courseList').insertAdjacentHTML('beforeend', newCourse);
            closeAddCourseModal();
            document.getElementById('courseTitle').value = '';
            document.getElementById('courseDescription').value = '';
        } else {
            alert("Không thể thêm khóa học. Vui lòng thử lại.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Có lỗi xảy ra.");
    });
}

// Hàm tải danh sách khóa học từ backend
function loadCourses() {
    fetch('/get_courses')
    .then(response => response.json())
    .then(data => {
        const courseList = document.getElementById('courseList');
        courseList.innerHTML = ''; // Xóa danh sách cũ trước khi thêm mới

        data.forEach(course => {
            const courseCard = `
                <div class="course-card">
                    <img src="static/img/thumbnail.png" alt="Course Thumbnail" class="course-thumbnail">
                    <p class="course-title">${course.ten_khoa_hoc}</p>
                </div>`;
            courseList.insertAdjacentHTML('beforeend', courseCard);
        });
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// Tải danh sách khóa học khi trang được tải
document.addEventListener('DOMContentLoaded', loadCourses);
