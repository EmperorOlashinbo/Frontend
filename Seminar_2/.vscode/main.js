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
    
        const titleElement = document.createElement("h2");
        titleElement.textContent = post.title;
    
        const bodyElement = document.createElement("p");
        bodyElement.textContent = post.body;
    
        const userElement = document.createElement("p");
        const userLabel = document.createElement("strong");
        userLabel.textContent = "Posted by: ";
        userElement.appendChild(userLabel);
        const userLink = document.createElement("a");
        userLink.href = "#";
        userLink.classList.add("user-link");
        userLink.dataset.userId = post.userId;
        userLink.textContent = user ? user.username : "Unknown User";
        userElement.appendChild(userLink);
    
        const userImage = document.createElement("img");
        userImage.src = user ? user.image : "default-user-image.png"; // Use a default image if user image is not available
        userImage.alt = user ? user.username : "Unknown User";
        userImage.classList.add("user-image");
        userElement.appendChild(userImage);
    
        const tagsElement = document.createElement("p");
        tagsElement.classList.add("tags");
        const tagsLabel = document.createElement("strong");
        tagsLabel.textContent = "Tags: ";
        tagsElement.appendChild(tagsLabel);
        tagsElement.appendChild(document.createTextNode(post.tags.join(", ")));
    
        const likesElement = document.createElement("p");
        likesElement.classList.add("reactions");
        const likesLabel = document.createElement("strong");
        likesLabel.textContent = "Reactions: 👍";
        likesElement.appendChild(likesLabel);
        likesElement.appendChild(document.createTextNode(post.reactions.likes));
    
        const dislikesElement = document.createElement("p");
        dislikesElement.classList.add("reactions");
        const dislikesLabel = document.createElement("strong");
        dislikesLabel.textContent = "Reactions: 👎";
        dislikesElement.appendChild(dislikesLabel);
        dislikesElement.appendChild(document.createTextNode(post.reactions.dislikes));
    
        const commentsElement = document.createElement("div");
        commentsElement.classList.add("comments");
        const commentsTitle = document.createElement("h3");
        commentsTitle.textContent = "💬Comments:";
        commentsElement.appendChild(commentsTitle);
    
        if (comments.length > 0) {
            comments.forEach(comment => {
                const commentElement = document.createElement("p");
                const commentUser = document.createElement("strong");
                commentUser.textContent = `${comment.user.username}: `;
                commentElement.appendChild(commentUser);
                commentElement.appendChild(document.createTextNode(comment.body));
                const commentLikes = document.createElement("strong");
                commentLikes.textContent = ` 👍${comment.likes}`;
                commentElement.appendChild(commentLikes);
                commentsElement.appendChild(commentElement);
            });
        } else {
            const noCommentsElement = document.createElement("p");
            noCommentsElement.textContent = "No comments available.";
            commentsElement.appendChild(noCommentsElement);
        }
    
        postElement.appendChild(titleElement);
        postElement.appendChild(bodyElement);
        postElement.appendChild(userElement);
        postElement.appendChild(tagsElement);
        postElement.appendChild(likesElement);
        postElement.appendChild(dislikesElement);
        postElement.appendChild(commentsElement);
    
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
        userDetails.textContent = ""; 
    
        if (user) {
            const userImage = document.createElement("img");
            userImage.src = user.image;
            userImage.alt = `${user.firstName} ${user.lastName}`;
            userImage.classList.add("user-image");
    
            const nameElement = document.createElement("p");
            const nameLabel = document.createElement("strong");
            nameLabel.textContent = "Name: ";
            nameElement.appendChild(nameLabel);
            nameElement.appendChild(document.createTextNode(`${user.firstName} ${user.lastName}`));
    
            const emailElement = document.createElement("p");
            const emailLabel = document.createElement("strong");
            emailLabel.textContent = "Email: ";
            emailElement.appendChild(emailLabel);
            emailElement.appendChild(document.createTextNode(user.email));
    
            const addressElement = document.createElement("p");
            const addressLabel = document.createElement("strong");
            addressLabel.textContent = "Address: ";
            addressElement.appendChild(addressLabel);
            addressElement.appendChild(document.createTextNode(`${user.address.address}, ${user.address.city}, ${user.address.state}, ${user.address.postalCode}`));
    
            const phoneElement = document.createElement("p");
            const phoneLabel = document.createElement("strong");
            phoneLabel.textContent = "Phone: ";
            phoneElement.appendChild(phoneLabel);
            phoneElement.appendChild(document.createTextNode(user.phone));
    
            const ageElement = document.createElement("p");
            const ageLabel = document.createElement("strong");
            ageLabel.textContent = "Age: ";
            ageElement.appendChild(ageLabel);
            ageElement.appendChild(document.createTextNode(user.age));
    
            const genderElement = document.createElement("p");
            const genderLabel = document.createElement("strong");
            genderLabel.textContent = "Gender: ";
            genderElement.appendChild(genderLabel);
            genderElement.appendChild(document.createTextNode(user.gender));
    
            userDetails.appendChild(userImage);
            userDetails.appendChild(nameElement);
            userDetails.appendChild(emailElement);
            userDetails.appendChild(addressElement);
            userDetails.appendChild(phoneElement);
            userDetails.appendChild(ageElement);
            userDetails.appendChild(genderElement);
    
            modal.style.display = "block";
        } else {
            const errorElement = document.createElement("p");
            errorElement.textContent = "Failed to load user details.";
            userDetails.appendChild(errorElement);
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