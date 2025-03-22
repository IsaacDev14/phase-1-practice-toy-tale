let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form"); // Fix: Selecting by class instead of id

  if (!toyForm) {
    console.error("🚨 Error: The form with class 'add-toy-form' was not found.");
    return;
  }

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Handle form submission
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = event.target.name.value;
    const imageInput = event.target.image.value;

    if (!nameInput || !imageInput) {
      alert("Please enter a toy name and image URL.");
      return;
    }

    const newToy = {
      name: nameInput,
      image: imageInput,
      likes: 0,
    };

    // Send POST request to server
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((toy) => {
        renderToy(toy);
        toyForm.reset();
      })
      .catch((error) => console.error("Error:", error));
  });

  // Fetch and display toys
  fetchToys();
});

// Function to fetch and render toys
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => renderToy(toy));
    })
    .catch((error) => console.error("Error fetching toys:", error));
}

// Function to display a toy
function renderToy(toy) {
  const toyCollection = document.querySelector("#toy-collection");

  const toyCard = document.createElement("div");
  toyCard.className = "card";
  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar"/>
    <p>${toy.likes} Likes</p>
    <button class="like-btn">Like ❤️</button>
  `;

  // Add event listener for like button
  const likeBtn = toyCard.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    toy.likes += 1;
    toyCard.querySelector("p").textContent = `${toy.likes} Likes`;

    // Update likes in the database
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: toy.likes }),
    }).catch((error) => console.error("Error updating likes:", error));
  });

  toyCollection.appendChild(toyCard);
}
