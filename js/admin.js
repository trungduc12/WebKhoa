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