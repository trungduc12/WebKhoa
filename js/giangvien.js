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

const calendarHeader = document.querySelector(".calendar-header h3");
const prevMonthButton = document.querySelector(".prev-month");
const nextMonthButton = document.querySelector(".next-month");

let currentMonth = 10; // Tháng 11 (lưu ý tháng trong JS bắt đầu từ 0)
let currentYear = 2024;

function updateCalendar(month, year) {
    calendarHeader.textContent = `Tháng ${month + 1}, ${year}`;
    // Viết thêm logic để tạo ngày tự động trong bảng (nếu cần)
}

prevMonthButton.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar(currentMonth, currentYear);
});

nextMonthButton.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar(currentMonth, currentYear);
});
