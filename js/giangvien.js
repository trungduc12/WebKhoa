function showContent(section) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => {
        section.classList.remove('active');
    });

    // Show the selected section
    const selectedSection = document.getElementById(section);
    selectedSection.classList.add('active');
}