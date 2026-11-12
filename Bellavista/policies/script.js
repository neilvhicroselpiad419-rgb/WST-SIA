document.addEventListener("DOMContentLoaded", function() {
    const accordions = document.querySelectorAll(".accordion-header");

    accordions.forEach(acc => {
        acc.addEventListener("click", function() {
            // Toggle the active class for styling and icon change
            this.classList.toggle("active");

            // Select the associated content div
            const content = this.nextElementSibling;

            // Animate max-height for smooth opening/closing
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.borderBottom = "none";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.borderBottom = "1px solid #ddd";
            }
        });
    });
});