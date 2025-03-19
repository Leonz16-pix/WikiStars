document.addEventListener("DOMContentLoaded", function () {
    showMainPage();
});

function registerUser() {
    let name = document.getElementById("username").value.trim();
    
    if (name !== "") {
        localStorage.setItem("user", name);
        showMainPage(); 
    } else {
        alert("Por favor, ingresa un nombre.");
    }
}

function showMainPage() {
    let user = localStorage.getItem("user");

    if (user) {
        document.getElementById("register").style.display = "none";
        document.getElementById("main").style.display = "block";
        document.getElementById("userDisplay").textContent = "Hola, " + user;
    } else {
        document.getElementById("register").style.display = "block";
        document.getElementById("main").style.display = "none";
    }
}

function createPost() {
    let content = document.getElementById("postContent").value.trim();
    let user = localStorage.getItem("user"); 
    let imageInput = document.getElementById("imageInput");
    let imageFile = imageInput.files[0]; 

    if (!user) {
        alert("Debes iniciar sesión antes de publicar.");
        return;
    }

    if (content !== "" || imageFile) {
        let posts = JSON.parse(localStorage.getItem("posts")) || []; 

        let newPost = {
            user: user,
            content: content,
            timestamp: new Date().toLocaleString(), 
            likes: 0, 
            image: null 
        };
        if (imageFile) {
            let reader = new FileReader();
            reader.onload = function(e) {
                newPost.image = e.target.result;
                posts.unshift(newPost); 
                localStorage.setItem("posts", JSON.stringify(posts)); 
                displayPosts(); 
            };
            reader.readAsDataURL(imageFile); 
        } else {
            posts.unshift(newPost); 
            localStorage.setItem("posts", JSON.stringify(posts)); 
            displayPosts();
        }
        document.getElementById("postContent").value = "";
        imageInput.value = "";
    } else {
        alert("No puedes publicar algo vacío.");
    }
}
function previewImage() {
    const file = document.getElementById("imageInput").files[0];
    const previewContainer = document.querySelector(".preview-container");
    const previewImage = document.querySelector(".preview-container img");

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = "block"; 
        };
        reader.readAsDataURL(file);
    }
}
function displayPosts() {
    let postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = ""; 

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts.forEach(post => {
        let postDiv = document.createElement("div");
        postDiv.classList.add("post");
        let imageHtml = "";
        if (post.image) {
            imageHtml = `<img src="${post.image}" alt="Imagen" class="post-image">`; 
        }

        postDiv.innerHTML = `
            <h4>${post.user} <span class="timestamp">(${post.timestamp})</span></h4>
            <p>${post.content}</p>
            ${imageHtml} <!-- Mostrar la imagen -->
            <button class="likeBtn" onclick="likePost(this)">Like</button>
            <span class="likesCount">${post.likes} Likes</span> <!-- Mostrar el contador de likes -->
        `;
        
        postsContainer.appendChild(postDiv);
    });
}
function likePost(button) {
    let postDiv = button.parentElement; 
    let likesCount = postDiv.querySelector(".likesCount");
    if (!likesCount) {
        likesCount = document.createElement("span");
        likesCount.classList.add("likesCount");
        likesCount.textContent = "0 Likes"; 
        postDiv.appendChild(likesCount);
    }
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let index = Array.from(postDiv.parentElement.children).indexOf(postDiv);
    let currentLikes = parseInt(likesCount.textContent.split(" ")[0]);
    likesCount.textContent = `${currentLikes + 1} Likes`;
    posts[index].likes = currentLikes + 1; 
    localStorage.setItem("posts", JSON.stringify(posts)); 
}
document.addEventListener("DOMContentLoaded", function () {
    showMainPage();
    displayPosts();
});
function showMainPage() {
    let user = localStorage.getItem("user");

    if (user) {
        document.getElementById("register").style.display = "none";
        document.getElementById("main").style.display = "block";
        document.querySelector(".dropbtn").textContent = `Hola, ${user}`;
    } else {
        document.getElementById("register").style.display = "block";
        document.getElementById("main").style.display = "none";
    }
}
function logout() {
    localStorage.removeItem("user"); 
    alert("Sesión cerrada"); 
    window.location.href = "INDEX.html"; 
}