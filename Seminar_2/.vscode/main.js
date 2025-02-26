document.addEventListener("DOMContentLoaded", function () {
    // Navigation Bar: Highlight Active Link
    const currentPage = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll("nav ul li a");

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // Contact Form Logic
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");
        const confirmCheckbox = document.getElementById("confirm");
        const sendButton = document.getElementById("send-button");
        const nameError = document.getElementById("name-error");
        const emailError = document.getElementById("email-error");
        const messageError = document.getElementById("message-error");
        const confirmError = document.getElementById("confirm-error");

        // Validate name (must not contain numbers)
        function validateName() {
            const nameValue = nameInput.value.trim();
            const hasNumbers = /\d/.test(nameValue);

            if (hasNumbers) {
                nameError.textContent = "Name must not contain numbers.";
                nameError.style.display = "block";
                return false;
            } else {
                nameError.style.display = "none";
                return true;
            }
        }

        // Validate email (must include "@" and ".")
        function validateEmail() {
            const emailValue = emailInput.value.trim();
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

            if (!isValidEmail) {
                emailError.textContent = "Please enter a valid email address.";
                emailError.style.display = "block";
                return false;
            } else {
                emailError.style.display = "none";
                return true;
            }
        }

        // Validate message (must not be empty)
        function validateMessage() {
            const messageValue = messageInput.value.trim();

            if (messageValue === "") {
                messageError.textContent = "Message cannot be empty.";
                messageError.style.display = "block";
                return false;
            } else {
                messageError.style.display = "none";
                return true;
            }
        }

        // Validate checkbox (must be checked)
        function validateCheckbox() {
            if (!confirmCheckbox.checked) {
                confirmError.textContent = "You must confirm to send.";
                confirmError.style.display = "block";
                return false;
            } else {
                confirmError.style.display = "none";
                return true;
            }
        }

        // Enable/disable the "Send" button based on checkbox state
        confirmCheckbox.addEventListener("change", function () {
            sendButton.disabled = !this.checked;
        });

        // Validate form on submission
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();
            const isCheckboxValid = validateCheckbox();

            if (isNameValid && isEmailValid && isMessageValid && isCheckboxValid) {
                alert("Form submitted successfully!");
                contactForm.reset();
                sendButton.disabled = true;
            }
        });

        // Validate inputs on the fly
        nameInput.addEventListener("input", validateName);
        emailInput.addEventListener("input", validateEmail);
        messageInput.addEventListener("input", validateMessage);
    }

    // Posts Logic
    // Posts Page: Variables
    let postPage = 1;
    const postsPerPage = 5;
    const postsContainer = document.getElementById("posts-container");
    const loadMoreTrigger = document.getElementById("load-more-trigger");

    // User Profile Modal: Variables
    const modal = document.getElementById("user-modal");
    const closeModal = document.querySelector(".close");
    const userDetails = document.getElementById("user-details");

    // Fetch posts from the API
    async function fetchPosts(page) {
        try {
            const response = await fetch(`https://dummyjson.com/posts?limit=${postsPerPage}&skip=${(page - 1) * postsPerPage}`);
            const data = await response.json();
            return data.posts;
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
        }
    }

    // Fetch user details for a post
    async function fetchUser(userId) {
        try {
            const response = await fetch(`https://dummyjson.com/users/${userId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    }

    // Fetch comments for a post
    async function fetchComments(postId) {
        try {
            const response = await fetch(`https://dummyjson.com/comments/post/${postId}`);
            const data = await response.json();
            return data.comments;
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    }

    // Display a single post
    async function displayPost(post) {
        const user = await fetchUser(post.userId);
        const comments = await fetchComments(post.id);

        const postElement = document.createElement("div");
        postElement.classList.add("post");

        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <p><strong>Posted by:</strong> <a href="#" class="user-link" data-user-id="${post.userId}">${user ? user.username : "Unknown User"}</a></p>
            <p class="tags"><strong>Tags:</strong> ${post.tags.join(", ")}</p>
            <p class="reactions"><strong>Reactions:</strong> Likes ${post.reactions.likes}</p>
            <p class="reactions"><strong>Reactions:</strong> Dislikes ${post.reactions.dislikes}</p>
            <div class="comments">
                <h3>Comments:</h3>
                ${comments.length > 0 ? comments.map(comment => `<p><strong>${comment.user.username}:</strong> ${comment.body}</p>`).join("") : "<p>No comments available.</p>"}
            </div>
        `;

        postsContainer.appendChild(postElement);
    }

    // Load posts for the current page
    async function loadPosts() {
        const posts = await fetchPosts(postPage);
        posts.forEach(post => displayPost(post));
    }

    // Setup infinite scroll
    function setupInfiniteScroll() {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                postPage++;
                loadPosts();
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        });

        observer.observe(loadMoreTrigger);
    }

    // Initial load of posts
    loadPosts();
    setupInfiniteScroll();

    // Function to open the modal and display user details
    async function openUserModal(userId) {
        const user = await fetchUser(userId);
        if (user) {
            userDetails.innerHTML = `
                <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Address:</strong> ${user.address.address}, ${user.address.city}, ${user.address.state}, ${user.address.postalCode}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Website:</strong> <a href="http://${user.domain}" target="_blank">${user.domain}</a></p>
            `;
            modal.style.display = "block";
        } else {
            userDetails.innerHTML = "<p>Failed to load user details.</p>";
            modal.style.display = "block";
        }
    }

    // Close the modal when the close button is clicked
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Add event listeners to username links in posts
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("user-link")) {
            event.preventDefault();
            const userId = event.target.getAttribute("data-user-id");
            openUserModal(userId);
        }
    });
});