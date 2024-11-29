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

    if (isEditing) {
        // Show input fields for editing
        document.getElementById("tieuSuCell").querySelector("input").style.display = "block";
        document.getElementById("khoaCell").querySelector("input").style.display = "block";
        document.getElementById("namHocCell").querySelector("input").style.display = "block";
        document.getElementById("linhVucCell").querySelector("input").style.display = "block";

        // Hide the spans (labels)
        document.getElementById("tieuSuCell").querySelector("span").style.display = "none";
        document.getElementById("khoaCell").querySelector("span").style.display = "none";
        document.getElementById("namHocCell").querySelector("span").style.display = "none";
        document.getElementById("linhVucCell").querySelector("span").style.display = "none";

        this.innerText = "Lưu";  // Change button text to "Save"
    } else {
        // Save updated data
        var tieuSu = document.getElementById("tieuSuInput").value;
        var khoa = document.getElementById("khoaInput").value;
        var namHoc = document.getElementById("namHocInput").value;
        var linhVuc = document.getElementById("linhVucInput").value;

        // Send data to server via AJAX
        fetch("/update_profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tieu_su: tieuSu,
                khoa: khoa,
                nam_hoc: namHoc,
                linh_vuc_nghien_cuu: linhVuc
            })
        }).then(response => response.json())
          .then(data => {
            if (data.success) {
                // Update the profile display with the new values
                document.getElementById("tieuSuText").innerText = tieuSu;
                document.getElementById("khoaText").innerText = khoa;
                document.getElementById("namHocText").innerText = namHoc;
                document.getElementById("linhVucText").innerText = linhVuc;

                // Hide input fields and show text again
                document.getElementById("tieuSuCell").querySelector("input").style.display = "none";
                document.getElementById("khoaCell").querySelector("input").style.display = "none";
                document.getElementById("namHocCell").querySelector("input").style.display = "none";
                document.getElementById("linhVucCell").querySelector("input").style.display = "none";

                document.getElementById("tieuSuCell").querySelector("span").style.display = "block";
                document.getElementById("khoaCell").querySelector("span").style.display = "block";
                document.getElementById("namHocCell").querySelector("span").style.display = "block";
                document.getElementById("linhVucCell").querySelector("span").style.display = "block";

                this.innerText = "Cập nhật";  // Change button text back to "Update"
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        });
    }
});

