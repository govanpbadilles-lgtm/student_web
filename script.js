// ===== IMAGE PREVIEW =====
function previewProfile(event) {
    const file = event.target.files?.[0];
    const reader = new FileReader();
    const img = document.getElementById("previewImage");
    if (!img) return;
    if (file) {
        reader.onload = () => { img.src = reader.result; };
        reader.readAsDataURL(file);
    }
}

// ===== SEARCH =====
function performSearch() {
    const input = document.getElementById("studentSearch").value.trim().toLowerCase();
    const rows = document.querySelectorAll(".student-row");
    let foundAny = false;

    rows.forEach(row => {
        const idno = row.children[1]?.innerText.toLowerCase() || "";
        const lastname = row.children[2]?.innerText.toLowerCase() || "";
        const firstname = row.children[3]?.innerText.toLowerCase() || "";
        const course = row.children[4]?.innerText.toLowerCase() || "";
        const level = row.children[5]?.innerText.toLowerCase() || "";

        const nameMobile = row.children[6]?.innerText.toLowerCase() || "";
        const courseLevelMobile = row.children[7]?.innerText.toLowerCase() || "";

        if (
            idno.includes(input) ||
            lastname.includes(input) ||
            firstname.includes(input) ||
            course.includes(input) ||
            level.includes(input) ||
            nameMobile.includes(input) ||
            courseLevelMobile.includes(input)
        ) {
            row.style.display = "";
            foundAny = true;
        } else {
            row.style.display = "none";
        }
    });

    document.getElementById("noStudentMessage").style.display = (!foundAny && input !== "") ? "" : "none";
}

// ===== DELETE =====
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-icon")) {
        const row = e.target.closest("tr");
        const idno = (row?.children[1]?.textContent || "").trim();
        if (!idno) return alert("Cannot find student ID!");
        if (!confirm(`Delete student ${idno}?`)) return;

        fetch(`/delete/${encodeURIComponent(idno)}`, { method: "POST" })
            .then(res => res.json())
            .then(data => { alert(data.message || "Deleted"); location.reload(); })
            .catch(() => alert("Error deleting student."));
    }
});

// ===== EDIT =====
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-icon")) {
        const row = e.target.closest("tr");
        if (!row) return;

        const idno = row.children[1]?.textContent.trim() || "";
        const lastname = row.children[2]?.textContent.trim() || "";
        const firstname = row.children[3]?.textContent.trim() || "";
        const course = row.children[4]?.textContent.trim() || "";
        const level = row.children[5]?.textContent.trim() || "";
        const profileSrc = row.children[0].querySelector("img")?.src || "";

        const form = document.getElementById("studentForm");
        document.getElementById("idno").value = idno;
        document.getElementById("lastname").value = lastname;
        document.getElementById("firstname").value = firstname;
        document.getElementById("previewImage").src = profileSrc;
        document.getElementById("course").value = course;
        document.getElementById("level").value = level;
        document.getElementById("profile").value = "";
        form.action = `/update_student/${encodeURIComponent(idno)}`;
        form.querySelector(".w3-button-save").textContent = "UPDATE";
        form.scrollIntoView({ behavior: "smooth" });
    }
});

// ===== FORM VALIDATION (Add & Update) =====
document.getElementById("studentForm").addEventListener("submit", function(e) {
    const idno = document.getElementById("idno").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const firstname = document.getElementById("firstname").value.trim();
    const course = document.getElementById("course").value.trim();
    const level = document.getElementById("level").value.trim();
    const errorMsg = document.getElementById("errorMessage");

    if (!idno || !lastname || !firstname || !course || !level) {
        e.preventDefault(); // Stop form submission
        errorMsg.textContent = "All fields must be filled!";
        errorMsg.style.display = "block";
        return false;
    } else {
        errorMsg.style.display = "none";
    }
});

// ===== CANCEL =====
document.querySelector(".w3-button-cancel").addEventListener("click", function() {
    const form = document.getElementById("studentForm");
    form.reset();
    document.getElementById("previewImage").src = "/static/images/account.jpg";
    document.getElementById("errorMessage").style.display = "none";
    form.action = "/add_student"; // Must be absolute path in JS
    form.querySelector(".w3-button-save").textContent = "SAVE";
    performSearch();
});

// ===== LIVE SEARCH =====
document.getElementById("studentSearch").addEventListener("input", performSearch);
document.getElementById("studentSearchBtn").addEventListener("click", performSearch);
