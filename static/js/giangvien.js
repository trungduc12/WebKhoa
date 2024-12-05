// Function to show content based on contentId
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

// Load profile data from API
async function loadProfile() {
    try {
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            return; // Stop execution if there’s an error in the data
        }

        // Update HTML with profile data
        document.getElementById('ma_giang_vien').innerText = data.ma_nguoi_dung || 'N/A';
        document.getElementById('phone').innerText = data.phone || 'N/A';
        document.getElementById('email').innerText = data.email || 'N/A';
        document.getElementById('ho_ten').innerText = data.ho_ten || 'N/A';
        document.getElementById('gioi_tinh').innerText = data.gioi_tinh || 'N/A';
        document.getElementById('mon_giang_day').innerText = data.mon_giang_day || 'N/A';
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Error loading profile. Please try again later.');
    }
}

// Calendar update logic
const calendarHeader = document.querySelector(".calendar-header h3");
const prevMonthButton = document.querySelector(".prev-month");
const nextMonthButton = document.querySelector(".next-month");
let currentMonth = 10; // November (Note: months are 0-indexed)
let currentYear = 2024;

function updateCalendar(month, year) {
    calendarHeader.textContent = `Tháng ${month + 1}, ${year}`;
    // Add logic here to generate calendar dates if needed
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

// Modal open and close functionality
document.addEventListener('DOMContentLoaded', function() {
    // Modal functions for adding courses
    const addCourseButton = document.querySelector(".add-course-btn");
    const closeModalButton = document.querySelector(".close-btn");
    const addCourseModal = document.getElementById("add-course-modal");

    // Check if element exists before adding event listener
    if (addCourseButton) {
        addCourseButton.addEventListener("click", function() {
            addCourseModal.style.display = "flex";
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener("click", function() {
            addCourseModal.style.display = "none";
        });
    }

    window.onclick = function(event) {
        if (event.target === addCourseModal) {
            addCourseModal.style.display = "none";
        }
    };
});

// View my courses modal functionality
document.addEventListener("DOMContentLoaded", function() {
    const viewMyCoursesButton = document.querySelector(".view-my-courses-btn");
    const myCoursesModal = document.getElementById("myCoursesModal");
    const closeMyCoursesModalButton = document.querySelector(".close-btn");

    if (viewMyCoursesButton) {
        viewMyCoursesButton.addEventListener("click", function() {
            myCoursesModal.style.display = "block";
        });
    }

    if (closeMyCoursesModalButton) {
        closeMyCoursesModalButton.addEventListener("click", function() {
            myCoursesModal.style.display = "none";
        });
    }

    window.addEventListener("click", function(event) {
        if (event.target === myCoursesModal) {
            myCoursesModal.style.display = "none";
        }
    });
});

// Edit profile button functionality
document.getElementById("editButton").addEventListener("click", function() {
    var isEditing = this.innerText === "Cập nhật";

    // Chuyển đổi giữa chế độ xem và chỉnh sửa
    if (isEditing) {
        // Hiển thị các input
        document.querySelectorAll("input[type='text']").forEach(input => {
            input.style.display = "block";
        });
        document.querySelectorAll("span").forEach(span => {
            span.style.display = "none";
        });

        this.innerText = "Lưu";  // Đổi nút "Cập nhật" thành "Lưu"
    } else {
        // Lưu lại thông tin đã sửa
        var tieuSu = document.getElementById("tieuSuInput").value;
        var khoa = document.getElementById("khoaInput").value;
        var namHoc = document.getElementById("namHocInput").value;
        var linhVuc = document.getElementById("linhVucInput").value;
        var soDienThoai = document.getElementById("soDienThoaiInput").value;
        var gioiTinh = document.getElementById("gioiTinhInput").value;
        var diaChi = document.getElementById("diaChiInput").value;

        // Gửi dữ liệu đến server qua AJAX
        fetch("/update_profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tieu_su: tieuSu,
                khoa: khoa,
                nam_hoc: namHoc,
                linh_vuc_nghien_cuu: linhVuc,
                so_dien_thoai: soDienThoai,
                gioi_tinh: gioiTinh,
                dia_chi: diaChi
            })
        }).then(response => response.json())
          .then(data => {
            if (data.success) {
                // Cập nhật lại giao diện với dữ liệu mới
                document.getElementById("tieuSuText").innerText = tieuSu;
                document.getElementById("khoaText").innerText = khoa;
                document.getElementById("namHocText").innerText = namHoc;
                document.getElementById("linhVucText").innerText = linhVuc;
                document.getElementById("soDienThoaiText").innerText = soDienThoai;
                document.getElementById("gioiTinhText").innerText = gioiTinh;
                document.getElementById("diaChiText").innerText = diaChi;

                // Chuyển lại thành chế độ xem
                document.querySelectorAll("input[type='text']").forEach(input => {
                    input.style.display = "none";
                });
                document.querySelectorAll("span").forEach(span => {
                    span.style.display = "block";
                });

                document.getElementById("editButton").innerText = "Cập nhật";  // Đổi nút "Lưu" thành "Cập nhật"
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        });
    }
});


// Hàm bật chế độ sửa (edit) cho thông báo
// Hàm bật chế độ sửa (edit) cho thông báo
function enableEdit(id) {
    // Mở khóa các trường nhập tiêu đề và nội dung
    document.getElementById(`title_${id}`).disabled = false;
    document.getElementById(`content_${id}`).disabled = false;
    
    // Hiển thị nút Lưu và ẩn nút Sửa
    document.getElementById(`save_${id}`).style.display = 'inline-block';
    document.getElementById(`edit_${id}`).style.display = 'none';
}

// Hàm lưu thông tin chỉnh sửa của thông báo
function saveEdit(id) {
    // Lấy các giá trị đã sửa
    const newTitle = document.getElementById(`title_${id}`).value;
    const newContent = document.getElementById(`content_${id}`).value;

    // Gửi dữ liệu chỉnh sửa lên server để lưu vào cơ sở dữ liệu
    fetch(`/update_thong_bao/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tieu_de: newTitle,
            noi_dung: newContent,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Cập nhật giao diện sau khi lưu thành công
            document.getElementById(`title_${id}`).disabled = true;
            document.getElementById(`content_${id}`).disabled = true;
            document.getElementById(`save_${id}`).style.display = 'none';
            document.getElementById(`edit_${id}`).style.display = 'inline-block';
            alert('Thông báo đã được cập nhật thành công!');
        } else {
            alert('Có lỗi khi lưu thông báo!');
        }
    })
    .catch(error => alert('Lỗi kết nối: ' + error));
}

// Hàm xóa thông báo
function deleteNotification(id) {
    if (confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
        // Gửi yêu cầu xóa thông báo từ server
        fetch(`/delete_thong_bao/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Nếu xóa thành công, xóa phần tử thông báo khỏi giao diện
                document.getElementById(`notification_${id}`).remove();
                alert('Thông báo đã được xóa thành công!');
            } else {
                alert('Xóa thông báo thất bại!');
            }
        })
        .catch(error => alert('Lỗi khi xóa thông báo: ' + error));
    }
}



document.getElementById('searchInput').addEventListener('input', function () {
    var searchQuery = this.value.toLowerCase();  // Lấy giá trị người dùng nhập vào và chuyển thành chữ thường
    var rows = document.querySelectorAll('.document-row');  // Lấy tất cả các dòng trong bảng

    rows.forEach(function (row) {
        var tenMon = row.cells[1].textContent.toLowerCase();  // Lấy tên môn học từ cột thứ 2 (index 1)
        var maMon = row.cells[2].textContent.toLowerCase();  // Nếu bạn có mã môn học trong cột thứ 3, có thể thay đổi theo

        // Kiểm tra nếu tên môn học hoặc mã học phần khớp với từ khóa tìm kiếm
        if (tenMon.indexOf(searchQuery) > -1 || maMon.indexOf(searchQuery) > -1) {
            row.style.display = '';  // Hiển thị dòng nếu tìm thấy
        } else {
            row.style.display = 'none';  // Ẩn dòng nếu không khớp
        }
    });
});

document.getElementById('search-button').addEventListener('click', function() {
    var searchTitle = document.getElementById('search-title').value.toLowerCase();  // Lấy giá trị từ ô tìm kiếm tên bài báo
    var searchYear = document.getElementById('search-year').value;  // Lấy giá trị từ ô tìm kiếm năm sáng tác
    
    var rows = document.querySelectorAll('.article-row');  // Lấy tất cả các dòng bài báo
    
    rows.forEach(function(row) {
        var title = row.cells[0].textContent.toLowerCase();  // Lấy tên bài báo trong cột đầu tiên
        var content = row.cells[1].textContent.toLowerCase();  // Lấy nội dung bài báo trong cột thứ hai
        var date = row.cells[2].textContent;  // Lấy ngày đăng bài báo trong cột thứ ba
        
        // Kiểm tra nếu bất kỳ điều kiện nào trong hai ô tìm kiếm khớp với thông tin bài báo
        var matchTitle = searchTitle === '' || title.includes(searchTitle);  // Tìm kiếm tên bài báo
        var matchYear = searchYear === '' || date.includes(searchYear);  // Tìm kiếm năm sáng tác
        
        // Hiển thị hoặc ẩn bài báo tùy thuộc vào việc tìm kiếm có khớp không
        if (matchTitle && matchYear) {
            row.style.display = '';  // Hiển thị bài báo
        } else {
            row.style.display = 'none';  // Ẩn bài báo
        }
    });
});



document.getElementById("addArticleBtn").addEventListener("click", function() {
    const title = document.getElementById("articleTitle").value;
    const content = document.getElementById("articleContent").value;

    if (!title || !content) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    fetch('/add_article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tieu_de: title,
            noi_dung: content
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Append the new article to the table
            const newRow = `<tr id="article-${data.ma_bai_viet}">
                <td>${data.tieu_de}</td>
                <td>${data.noi_dung}</td>
                <td>
                    <button class="delete-btn" onclick="deleteArticle(${data.ma_bai_viet})">🗑️</button>
                    <button class="edit-btn" onclick="editArticle(${data.ma_bai_viet})">Sửa</button>
                </td>
            </tr>`;
            document.getElementById("articleTableBody").insertAdjacentHTML('beforeend', newRow);
            document.getElementById("articleTitle").value = '';
            document.getElementById("articleContent").value = '';
        } else {
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    });
});


function deleteArticle(maBaiViet) {
    if (confirm('Bạn có chắc chắn muốn xóa bài báo này?')) {
        fetch(`/delete_article/${maBaiViet}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById(`article-${maBaiViet}`).remove();
                alert('Xóa bài báo thành công!');
            } else {
                alert('Xóa bài báo thất bại!');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}


