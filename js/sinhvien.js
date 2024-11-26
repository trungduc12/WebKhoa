function showContent(contentId) {
    // Lấy tất cả các phần tử trong sidebar
    const menuItems = document.querySelectorAll('.sidebar .menu li a');
    
    // Lặp qua tất cả các phần tử và xóa class 'active'
    menuItems.forEach(item => {
        item.classList.remove('active');
    });

    // Thêm class 'active' vào mục được chọn
    const selectedItem = document.querySelector(`.sidebar .menu li a[href='#${contentId}']`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }

    // Ẩn tất cả các content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Hiển thị content của phần tử được chọn
    const selectedSection = document.getElementById(contentId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
}

const scheduleData = {
    1: [
        ["101", "Lập trình nâng cao 10:00 - 12:00 (20/2/2025-26/05/2025)", "Triết\n 11:00 - 13:00 ", "12:00 - 14:00", "13:00 - 15:00", "14:00 - 16:00", "", ""],
        ["102", "08:00 - 10:00", "09:00 - 11:00", "10:00 - 12:00", "", "", "", ""],
        ["201", "", "10:00 - 12:00", "11:00 - 13:00", "12:00 - 14:00", "13:00 - 15:00", "", ""],
    ],
    2: [
        ["301", "", "08:00 - 10:00", "09:00 - 11:00", "", "10:00 - 12:00", "", ""],
        ["302", "10:00 - 12:00", "", "12:00 - 14:00", "", "", "13:00 - 15:00", ""],
    ],
    // Thêm dữ liệu cho các tháng khác
};

function updateSchedule() {
    const month = document.getElementById("month").value;
    const tbody = document.getElementById("schedule-body");
    tbody.innerHTML = ""; // Xóa nội dung cũ

    const rooms = scheduleData[month] || [];
    rooms.forEach(room => {
        const row = document.createElement("tr");
        room.forEach(cell => {
            const td = document.createElement("td");
            // Thay thế \n bằng <br> để hiển thị đúng trong HTML
            td.innerHTML = cell.replace(/\n/g, '<br>'); // Sử dụng innerHTML để chuyển đổi
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
}

// Khởi tạo lịch với tháng đầu tiên
updateSchedule();

// Tìm kiếm bài báo theo tên hoặc tác giả
document.querySelector('.article-form button').addEventListener('click', function () {
    const searchValue = document.querySelector('#search-article').value.toLowerCase();
    const rows = document.querySelectorAll('.article-table tbody tr');

    rows.forEach(row => {
        const title = row.children[0].textContent.toLowerCase();
        const author = row.children[1].textContent.toLowerCase();

        if (title.includes(searchValue) || author.includes(searchValue)) {
            row.style.display = ''; // Hiển thị dòng nếu khớp
        } else {
            row.style.display = 'none'; // Ẩn dòng nếu không khớp
        }
    });
});

// Phân trang (giả lập)
document.querySelectorAll('.page-btn').forEach(button => {
    button.addEventListener('click', function () {
        // Xóa trạng thái active cũ
        document.querySelector('.page-btn.active').classList.remove('active');

        // Thêm trạng thái active mới
        this.classList.add('active');

        // Xử lý hiển thị bài báo theo trang (tùy chỉnh nếu có dữ liệu thực tế)
        alert(`Bạn đã chuyển đến trang ${this.textContent}`);
    });
});
