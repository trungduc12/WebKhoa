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
        section.style.display = 'none';
    });
    // Hiển thị content của phần tử được chọn
    const selectedSection = document.getElementById(contentId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Ẩn form bài giảng nếu đang hiển thị
    const lectureForm = document.getElementById('lecture-form');
    if (lectureForm) {
        lectureForm.style.display = 'none';
    }
}

function showCourseDetails(courseId) {
    // Ẩn tất cả các form khác
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Hiển thị form bài giảng
    const lectureForm = document.getElementById('lecture-form');
    if (lectureForm) {
        lectureForm.style.display = 'block';
        const lectureList = document.getElementById('lecture-list');
        if (lectureList) {
            lectureList.innerHTML = ''; // Xóa các bài giảng trước đó

            // Dữ liệu bài giảng cho từng khóa học
            const lecturesData = {
                course1: [
                    { title: 'Bài giảng 1', link: 'lecture1.html' },
                    { title: 'Bài giảng 2', link: 'lecture2.html' },
                    { title: 'Bài giảng 3', link: 'lecture3.html' }
                ],
                course2: [
                    { title: 'Bài giảng A', link: 'lectureA.html' },
                    { title: 'Bài giảng B', link: 'lectureB.html' },
                    { title: 'Bài giảng C', link: 'lectureC.html' }
                ]
            };

            // Lấy danh sách bài giảng tương ứng
            const lectures = lecturesData[courseId] || [];

            // Thêm các bài giảng vào danh sách
            lectures.forEach(lecture => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${lecture.link}" target="_blank">${lecture.title}</a>`;
                lectureList.appendChild(li);
            });
        }
    }
}

function goBackToCourses() {
    // Ẩn form bài giảng
    const lectureForm = document.getElementById('lecture-form');
    if (lectureForm) {
        lectureForm.style.display = 'none';
    }

    // Hiển thị lại form khóa học
    const coursesForm = document.getElementById('courses');
    if (coursesForm) {
        coursesForm.style.display = 'block';
    }
}



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


document.getElementById("editButton").addEventListener("click", function() {
    var isEditing = this.innerText === "Cập nhật";

    // Chuyển đổi giữa chế độ xem và chỉnh sửa
    if (isEditing) {
        document.getElementById("tieuSuCell").querySelector("input").style.display = "block";
        document.getElementById("khoaCell").querySelector("input").style.display = "block";
        document.getElementById("namHocCell").querySelector("input").style.display = "block";
        document.getElementById("linhVucCell").querySelector("input").style.display = "block";  // Hiển thị input của Lĩnh vực nghiên cứu
        
        document.getElementById("tieuSuCell").querySelector("span").style.display = "none";
        document.getElementById("khoaCell").querySelector("span").style.display = "none";
        document.getElementById("namHocCell").querySelector("span").style.display = "none";
        document.getElementById("linhVucCell").querySelector("span").style.display = "none";  // Ẩn span của Lĩnh vực nghiên cứu

        this.innerText = "Lưu";  // Đổi nút "Cập nhật" thành "Lưu"
    } else {
        // Lưu lại thông tin đã sửa
        var tieuSu = document.getElementById("tieuSuInput").value;
        var khoa = document.getElementById("khoaInput").value;
        var namHoc = document.getElementById("namHocInput").value;
        var linhVuc = document.getElementById("linhVucInput").value;  // Lấy giá trị Lĩnh vực nghiên cứu

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
                linh_vuc_nghien_cuu: linhVuc  // Gửi thêm Lĩnh vực nghiên cứu
            })
        }).then(response => response.json())
          .then(data => {
            if (data.success) {
                // Cập nhật lại giao diện với dữ liệu mới
                document.getElementById("tieuSuText").innerText = tieuSu;
                document.getElementById("khoaText").innerText = khoa;
                document.getElementById("namHocText").innerText = namHoc;
                document.getElementById("linhVucText").innerText = linhVuc;  // Cập nhật Lĩnh vực nghiên cứu

                // Chuyển lại thành chế độ xem
                document.getElementById("tieuSuCell").querySelector("input").style.display = "none";
                document.getElementById("khoaCell").querySelector("input").style.display = "none";
                document.getElementById("namHocCell").querySelector("input").style.display = "none";
                document.getElementById("linhVucCell").querySelector("input").style.display = "none";  // Ẩn input Lĩnh vực nghiên cứu
                
                document.getElementById("tieuSuCell").querySelector("span").style.display = "block";
                document.getElementById("khoaCell").querySelector("span").style.display = "block";
                document.getElementById("namHocCell").querySelector("span").style.display = "block";
                document.getElementById("linhVucCell").querySelector("span").style.display = "block";  // Hiển thị lại span Lĩnh vực nghiên cứu

                document.getElementById("editButton").innerText = "Cập nhật";  // Đổi nút "Lưu" thành "Cập nhật"
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        });
    }
});

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
