// State management
const state = {
  selectedCuisines: [],
  selectedTags: [],
  selectedSubpageTags: [],
};

const MAX_CUISINES = 3;
const MAX_TAGS = 6;
const MAX_SUBPAGE_TAGS = 2;

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  renderCuisines();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  document.getElementById("resetBtn").addEventListener("click", resetAll);
}

// Render cuisine buttons
function renderCuisines() {
  const grid = document.getElementById("cuisineGrid");
  grid.innerHTML = "";

  // Group cuisines by category
  const grouped = {};
  cuisineTagData.cuisines.forEach((cuisine) => {
    if (!grouped[cuisine.category]) {
      grouped[cuisine.category] = [];
    }
    grouped[cuisine.category].push(cuisine);
  });

  // Render grouped cuisines
  for (const [category, cuisines] of Object.entries(grouped)) {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category-group";

    const categoryTitle = document.createElement("h3");
    categoryTitle.className = "category-title";
    categoryTitle.textContent = category;
    categoryDiv.appendChild(categoryTitle);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-group";

    cuisines.forEach((cuisine) => {
      const btn = document.createElement("button");
      btn.className = "btn cuisine-btn";
      btn.textContent = cuisine.name;
      btn.dataset.id = cuisine.id;

      if (state.selectedCuisines.find((c) => c.id === cuisine.id)) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => selectCuisine(cuisine));
      buttonContainer.appendChild(btn);
    });

    categoryDiv.appendChild(buttonContainer);
    grid.appendChild(categoryDiv);
  }
}

// Select/deselect cuisine
function selectCuisine(cuisine) {
  const index = state.selectedCuisines.findIndex((c) => c.id === cuisine.id);

  if (index > -1) {
    // Deselect
    state.selectedCuisines.splice(index, 1);
  } else {
    // Select (if limit not reached)
    if (state.selectedCuisines.length < MAX_CUISINES) {
      state.selectedCuisines.push(cuisine);
    } else {
      alert(`Maximum ${MAX_CUISINES} cuisines can be selected`);
      return;
    }
  }

  // Clear selected tags and subpage tags when cuisine changes
  state.selectedTags = [];
  state.selectedSubpageTags = [];

  updateUI();
}

// Get related tags for selected cuisines
function getRelatedTags() {
  if (state.selectedCuisines.length === 0) {
    return [];
  }

  // Collect all food tags from selected cuisines
  const relatedTagNames = new Set();
  state.selectedCuisines.forEach((cuisine) => {
    cuisine.foodTags.forEach((tag) => relatedTagNames.add(tag));
  });

  // Match with available tags
  return cuisineTagData.allTags.filter((tag) => relatedTagNames.has(tag.name));
}

// Get related subpage tags for selected cuisines
function getRelatedSubpageTags() {
  if (state.selectedCuisines.length === 0) {
    return [];
  }

  // Collect all subpage tags from selected cuisines
  const relatedSubpageNames = new Set();
  state.selectedCuisines.forEach((cuisine) => {
    cuisine.subpageTags.forEach((tag) => relatedSubpageNames.add(tag));
  });

  // Match with available subpage tags
  return cuisineTagData.subpageTags.filter((tag) =>
    relatedSubpageNames.has(tag.name),
  );
}

// Render tags
function renderTags() {
  const grid = document.getElementById("tagGrid");
  const infoBox = document.getElementById("selectedCuisinesInfo");

  if (state.selectedCuisines.length === 0) {
    grid.innerHTML = "";
    infoBox.innerHTML =
      '<p class="warning">👉 Select cuisines above to see related tags</p>';
    document.getElementById("tagCount").textContent = "0";
    return;
  }

  const cuisineNames = state.selectedCuisines.map((c) => c.name).join(", ");
  infoBox.innerHTML = `<p class="success">✓ Selected: <strong>${cuisineNames}</strong></p>`;

  const relatedTags = getRelatedTags();
  grid.innerHTML = "";

  relatedTags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "btn tag-btn";
    btn.textContent = tag.name;
    btn.dataset.id = tag.id;

    if (state.selectedTags.find((t) => t.id === tag.id)) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => selectTag(tag));
    grid.appendChild(btn);
  });

  document.getElementById("tagCount").textContent = state.selectedTags.length;
}

// Select/deselect tag
function selectTag(tag) {
  const index = state.selectedTags.findIndex((t) => t.id === tag.id);

  if (index > -1) {
    // Deselect
    state.selectedTags.splice(index, 1);
  } else {
    // Select (if limit not reached)
    if (state.selectedTags.length < MAX_TAGS) {
      state.selectedTags.push(tag);
    } else {
      alert(`Maximum ${MAX_TAGS} tags can be selected`);
      return;
    }
  }

  updateUI();
}

// Render subpage tags
function renderSubpageTags() {
  const grid = document.getElementById("subpageTagGrid");

  if (state.selectedCuisines.length === 0) {
    grid.innerHTML = "";
    return;
  }

  const relatedSubpageTags = getRelatedSubpageTags();
  grid.innerHTML = "";

  relatedSubpageTags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "btn subpage-tag-btn";
    btn.textContent = tag.name;
    btn.dataset.id = tag.id;

    if (state.selectedSubpageTags.find((t) => t.id === tag.id)) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => selectSubpageTag(tag));
    grid.appendChild(btn);
  });

  document.getElementById("subpageCount").textContent =
    state.selectedSubpageTags.length;
}

// Select/deselect subpage tag
function selectSubpageTag(tag) {
  const index = state.selectedSubpageTags.findIndex((t) => t.id === tag.id);

  if (index > -1) {
    // Deselect
    state.selectedSubpageTags.splice(index, 1);
  } else {
    // Select (if limit not reached)
    if (state.selectedSubpageTags.length < MAX_SUBPAGE_TAGS) {
      state.selectedSubpageTags.push(tag);
    } else {
      alert(`Maximum ${MAX_SUBPAGE_TAGS} subpage tags can be selected`);
      return;
    }
  }

  updateUI();
}

// Update summary
function updateSummary() {
  // Cuisine summary
  const cuisineSummary = document.getElementById("cuisineSummary");
  cuisineSummary.innerHTML =
    state.selectedCuisines.length > 0
      ? state.selectedCuisines
          .map(
            (c) =>
              `<li>${c.name} <span class="badge">${c.category}</span></li>`,
          )
          .join("")
      : '<li class="empty">No cuisines selected</li>';

  // Tag summary
  const tagSummary = document.getElementById("tagSummary");
  tagSummary.innerHTML =
    state.selectedTags.length > 0
      ? state.selectedTags.map((t) => `<li>${t.name}</li>`).join("")
      : '<li class="empty">No tags selected</li>';

  // Subpage tag summary
  const subpageSummary = document.getElementById("subpageSummary");
  subpageSummary.innerHTML =
    state.selectedSubpageTags.length > 0
      ? state.selectedSubpageTags.map((t) => `<li>${t.name}</li>`).join("")
      : '<li class="empty">No subpage tags selected</li>';

  // Update counters
  document.getElementById("cuisineCount").textContent =
    state.selectedCuisines.length;
}

// Update all UI
function updateUI() {
  renderCuisines();
  renderTags();
  renderSubpageTags();
  updateSummary();
}

// Reset all selections
function resetAll() {
  state.selectedCuisines = [];
  state.selectedTags = [];
  state.selectedSubpageTags = [];
  updateUI();
}
