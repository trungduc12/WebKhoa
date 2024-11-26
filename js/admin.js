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

function thucHienChucNang() {
    // Thực hiện hành động mong muốn, ví dụ mở một modal hoặc chuyển hướng
    alert("Chức năng thêm người dùng mới được thực hiện!");
    // Hoặc có thể chuyển hướng đến trang khác:
    // window.location.href = '/duong-dan-hanh-dong';
}

function generateCalendar(month, year) {
    const calendarTable = document.getElementById('calendarTable').querySelector('tbody');
    calendarTable.innerHTML = ''; // Xóa nội dung cũ

    const firstDay = new Date(year, month, 1).getDay(); // Ngày đầu tiên của tháng
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Tổng số ngày trong tháng

    let date = 1;
    for (let i = 0; i < 6; i++) { // Tối đa 6 hàng
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) { // 7 cột cho 7 ngày
            const cell = document.createElement('td');

            if (i === 0 && j < firstDay) {
                // Ô trống trước ngày đầu tiên
                cell.innerText = '';
            } else if (date > daysInMonth) {
                // Ô trống sau ngày cuối cùng
                cell.innerText = '';
            } else {
                cell.innerText = date;

                // Tô màu cho một số ngày cụ thể
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
            break; // Thoát nếu đã hết ngày trong tháng
        }
    }
}

// Gọi hàm tạo lịch cho tháng 11, 2024
generateCalendar(10, 2024);
