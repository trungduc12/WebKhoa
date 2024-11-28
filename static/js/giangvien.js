function showContent(contentId) {
    const menuItems = document.querySelectorAll('.sidebar .menu li a');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    const selectedItem = document.querySelector(`.sidebar .menu li a[onclick="showContent('${contentId}')"]`);
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

async function loadProfile() {
    try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Failed to fetch profile data');
        
        const data = await response.json();
        
        if (data.error) {
            console.error(data.error); // In ra lỗi nếu có
            return; // Nếu có lỗi, không làm gì thêm
        }

        // Cập nhật nội dung HTML
        document.getElementById('ma_giang_vien').innerText = data.ma_nguoi_dung || 'N/A';
        document.getElementById('phone').innerText = data.phone || 'N/A';
        document.getElementById('email').innerText = data.email || 'N/A';
        document.getElementById('ho_ten').innerText = data.ho_ten || 'N/A';
        document.getElementById('gioi_tinh').innerText = data.gioi_tinh || 'N/A';
        document.getElementById('mon_giang_day').innerText = data.mon_giang_day || 'N/A';
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProfile);

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

document.addEventListener("DOMContentLoaded", function() {
    // Mở Modal
    function openModal() {
        document.getElementById("add-course-modal").style.display = "flex";
    }
    // Đóng Modal
    function closeModal() {
        document.getElementById("add-course-modal").style.display = "none";
    }
    // Đóng modal khi click ra ngoài modal-content
    window.onclick = function(event) {
        var modal = document.getElementById("add-course-modal");
        if (event.target == modal) {
            closeModal();
        }
    }
    // Thêm sự kiện cho nút
    document.querySelector(".add-course-btn").addEventListener("click", openModal);
    document.querySelector(".close-btn").addEventListener("click", closeModal);
});

// Đợi DOM load hoàn tất
document.addEventListener("DOMContentLoaded", function() {
    // Lấy các phần tử modal và các nút
    var modal = document.getElementById("myCoursesModal");
    var btn = document.querySelector(".view-my-courses-btn");
    var closeBtn = document.querySelector(".close-btn");
    // Khi người dùng nhấn nút "Xem khóa học của tôi", mở modal
    btn.addEventListener("click", function() {
        modal.style.display = "block";
    });
    // Khi người dùng nhấn vào nút đóng (x), đóng modal
    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });
    // Khi người dùng nhấn ra ngoài modal, đóng modal
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});