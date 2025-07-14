// Global variables to store wardrobe data
let wardrobe = {
  dresses: [],
  tops: [],
  bottoms: [],
  shoes: [],
  bags: [],
  accessories: [],
};

let currentMood = "";
let currentFilter = "all";

// Navigation functions
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");
  });
  event.target.classList.add("active");

  if (pageId === "wardrobe") {
    displayWardrobe();
  }
}

// File upload handling
document.addEventListener("DOMContentLoaded", function () {
  const categories = [
    "dresses",
    "tops",
    "bottoms",
    "shoes",
    "bags",
    "accessories",
  ];

  categories.forEach((category) => {
    const input = document.getElementById(category);
    input.addEventListener("change", function (e) {
      handleFileUpload(e, category);
    });
  });
  const demoItems = {
    dresses: [
      {
        id: 1,
        name: "Floral Maxi Dress",
        image:
          "https://i.pinimg.com/736x/6b/1d/f1/6b1df193263a03d1a1671b268739d289.jpg",
        category: "dresses",
      },
      {
        id: 2,
        name: "Elegant Evening Gown",
        image:
          "https://i.pinimg.com/736x/0a/1f/41/0a1f41b7f4015ef8e9b44d768b5cfd99.jpg",
        category: "dresses",
      },
    ],
    tops: [
      {
        id: 3,
        name: "White Linen Shirt",
        image:
          "https://i.pinimg.com/736x/b0/4f/44/b04f44947e24ea88bdc82d2b4f61a065.jpg",
        category: "tops",
      },
    ],
    bottoms: [
      {
        id: 4,
        name: "High Waist Blue Jeans",
        image:
          "https://i.pinimg.com/736x/8d/2c/b0/8d2cb041dc8f468ab0b81181d83c0070.jpg",
        category: "bottoms",
      },
    ],
    shoes: [
      {
        id: 5,
        name: "Black Heels",
        image:
          "https://i.pinimg.com/736x/77/2e/f7/772ef754d2ffe0ddd7b4128e53831574.jpg",
        category: "shoes",
      },
    ],
    bags: [
      {
        id: 6,
        name: "Brown Leather Handbag",
        image:
          "https://i.pinimg.com/736x/40/ed/a2/40eda2616f4d279a5d91c4ea21716f55.jpg",
        category: "bags",
      },
    ],
    accessories: [
      {
        id: 7,
        name: "Gold Hoop Earrings",
        image:
          "https://i.pinimg.com/736x/08/0a/da/080ada7914b921cc3e3feda486652606.jpg",
        category: "accessories",
      },
    ],
  };

  Object.keys(sampleItems).forEach((category) => {
    sampleItems[category].forEach((item) => {
      wardrobe[category].push({
        ...item,
        id: Date.now() + Math.random(),
      });
    });
  });

  displayWardrobe();
});

function handleFileUpload(event, category) {
  const files = Array.from(event.target.files);
  const previewContainer = document.getElementById(category + "-preview");

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      wardrobe[category].push({
        id: Date.now() + Math.random(),
        image: imageData,
        name: file.name,
        category: category,
      });

      const img = document.createElement("img");
      img.src = imageData;
      img.alt = file.name;
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

// Mood selection
function selectMood(mood) {
  currentMood = mood;
  document.querySelectorAll(".mood-card").forEach((card) => {
    card.classList.remove("selected");
  });
  event.target.classList.add("selected");

  setTimeout(() => {
    generateOutfitSuggestion(mood);
  }, 500);
}

function generateOutfitSuggestion(mood) {
  const outfitResult = document.getElementById("outfit-result");
  const suggestedOutfit = document.getElementById("suggested-outfit");

  suggestedOutfit.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Curating your perfect outfit...</p>
      </div>
    `;
  outfitResult.style.display = "block";

  setTimeout(() => {
    const outfit = createOutfitForMood(mood);
    displayOutfit(outfit);
  }, 2000);
}

function createOutfitForMood(mood) {
  const outfit = [];
  const moodPreferences = {
    professional: ["dresses", "tops", "bottoms", "shoes", "bags"],
    casual: ["tops", "bottoms", "shoes", "bags"],
    romantic: ["dresses", "shoes", "accessories"],
    party: ["dresses", "tops", "bottoms", "shoes", "bags", "accessories"],
    sporty: ["tops", "bottoms", "shoes"],
    chic: ["dresses", "tops", "bottoms", "shoes", "bags", "accessories"],
  };

  const categories = moodPreferences[mood] || Object.keys(wardrobe);

  categories.forEach((category) => {
    if (wardrobe[category].length > 0) {
      const randomItem =
        wardrobe[category][
          Math.floor(Math.random() * wardrobe[category].length)
        ];
      outfit.push(randomItem);
    }
  });

  return outfit;
}

function displayOutfit(outfit) {
  const suggestedOutfit = document.getElementById("suggested-outfit");

  if (outfit.length === 0) {
    suggestedOutfit.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
          <h3>No items found for this mood</h3>
          <p>Upload some clothes to get outfit suggestions!</p>
          <button class="cta-button" onclick="showPage('upload')">Upload Now</button>
        </div>
      `;
    return;
  }

  suggestedOutfit.innerHTML = outfit
    .map(
      (item) => `
      <div class="outfit-item">
        <img src="${item.image}" alt="${item.name}">
        <h4>${
          item.category.charAt(0).toUpperCase() + item.category.slice(1)
        }</h4>
        <p>${item.name}</p>
      </div>
    `
    )
    .join("");
}

function generateNewOutfit() {
  if (currentMood) {
    generateOutfitSuggestion(currentMood);
  }
}

function displayWardrobe() {
  const wardrobeItems = document.getElementById("wardrobe-items");
  let allItems = [];

  Object.keys(wardrobe).forEach((category) => {
    allItems = allItems.concat(wardrobe[category]);
  });

  if (currentFilter !== "all") {
    allItems = allItems.filter((item) => item.category === currentFilter);
  }

  if (allItems.length === 0) {
    wardrobeItems.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
          <h3>No items found</h3>
          <p>Upload some clothes to see them here!</p>
          <button class="cta-button" onclick="showPage('upload')">Upload Now</button>
        </div>
      `;
    return;
  }

  wardrobeItems.innerHTML = allItems
    .map(
      (item) => `
      <div class="wardrobe-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <h4>${
            item.category.charAt(0).toUpperCase() + item.category.slice(1)
          }</h4>
          <p>${item.name}</p>
        </div>
      </div>
    `
    )
    .join("");
}

function filterWardrobe(category) {
  currentFilter = category;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");
  displayWardrobe();
}
