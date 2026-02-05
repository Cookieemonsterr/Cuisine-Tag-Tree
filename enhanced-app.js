// Enhanced state management with local storage
const appState = {
  selectedCuisines: [],
  selectedTags: [],
  notes: "",
  maxCuisines: 2,
  maxTags: 6,
  autoSave: true,
  showCategories: true,
  darkMode: false,
  currentFilter: "all",
  lockedCuisineCategory: null,
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  loadStateFromStorage();
  setupEventListeners();
  renderUI();
  updateAllCounters();
}

// Setup all event listeners
function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Cuisine filters
  document.querySelectorAll(".filter-chip").forEach((btn) => {
    btn.addEventListener("click", () => filterCuisines(btn.dataset.filter));
  });

  // Sidebar buttons
  document.getElementById("exportBtn").addEventListener("click", exportData);
  document
    .getElementById("importBtn")
    .addEventListener("click", () =>
      document.getElementById("fileInput").click(),
    );
  document
    .getElementById("clearBtn")
    .addEventListener("click", clearAllSelections);

  // Notes textarea
  const notesBox = document.getElementById("notesBox");
  if (notesBox) {
    notesBox.addEventListener("input", (e) => {
      appState.notes = e.target.value;
      saveState();
    });
  }

  // Data management
 // Data management (Settings removed -> guard against null)
const resetDataBtn = document.getElementById("resetDataBtn");
if (resetDataBtn) {
  resetDataBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all data?")) {
      clearAllSelections();
      showToast("All data has been reset", "success");
    }
  });
}

const exportDataBtn = document.getElementById("exportDataBtn");
if (exportDataBtn) {
  exportDataBtn.addEventListener("click", exportData);
}

  // File import
  document.getElementById("fileInput").addEventListener("change", importData);

  // Search
  document.getElementById("searchInput").addEventListener("input", (e) => {
    filterBySearch(e.target.value);
  });

  // Preview tab
  document
    .getElementById("copyJsonBtn")
    .addEventListener("click", copyJsonToClipboard);

  // Help modal
  document.getElementById("helpBtn").addEventListener("click", () => {
    document.getElementById("helpModal").style.display = "block";
  });
  document.querySelector(".modal-close").addEventListener("click", () => {
    document.getElementById("helpModal").style.display = "none";
  });
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("helpModal");
    if (e.target === modal) modal.style.display = "none";
  });

  // Sidebar toggle
  document.getElementById("sidebarToggle").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("collapsed");
  });
}

// Render all UI
function renderUI() {
  renderCuisines();
  renderTags();
  updateSummary();
}

// Render cuisines
function renderCuisines() {
  const grid = document.getElementById("cuisineGrid");
  grid.innerHTML = "";

const filtered = filterCuisinesBySearch().filter(c => !(c && c.id === 9999));

  if (appState.showCategories) {
    const grouped = {};
    filtered.forEach((cuisine) => {
      if (!grouped[cuisine.category]) grouped[cuisine.category] = [];
      grouped[cuisine.category].push(cuisine);
    });

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
        const btn = createCuisineButton(cuisine);
        buttonContainer.appendChild(btn);
      });

      categoryDiv.appendChild(buttonContainer);
      grid.appendChild(categoryDiv);
    }
  } else {
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    filtered.forEach((cuisine) => {
      const btn = createCuisineButton(cuisine);
      buttonGroup.appendChild(btn);
    });

    grid.appendChild(buttonGroup);
  }
}

function createCuisineButton(cuisine) {
  const btn = document.createElement("button");
  btn.className = "btn cuisine-btn";
  btn.textContent = `${cuisine.name} (${cuisine.id})`;
  btn.dataset.id = cuisine.id;

  const isSelected = appState.selectedCuisines.find((c) => c.id === cuisine.id);
  if (isSelected) btn.classList.add("active");

  // Lock to a single cuisine tree (category)
  const locked = appState.lockedCuisineCategory;
  const isLockedOut = locked && cuisine.category !== locked && !isSelected;

  if (isLockedOut) {
    btn.classList.add("disabled");
    btn.disabled = true;
    btn.title = `You already started with ${locked}. Clear your cuisines to switch.`;
  }

  btn.addEventListener("click", () => toggleCuisine(cuisine));
  return btn;
}

function toggleCuisine(cuisine) {
  const index = appState.selectedCuisines.findIndex((c) => c.id === cuisine.id);

  if (index > -1) {
    // Remove
    appState.selectedCuisines.splice(index, 1);
    showToast(`${cuisine.name} removed`, "info");

    // If nothing selected anymore, unlock the tree
    if (appState.selectedCuisines.length === 0) {
      appState.lockedCuisineCategory = null;
    }
  } else {
    // Add (but only within one tree/category)
    if (
      appState.lockedCuisineCategory &&
      cuisine.category !== appState.lockedCuisineCategory
    ) {
      showToast(
        `You can only pick cuisines from ONE tree. You started with ${appState.lockedCuisineCategory}.`,
        "warning",
      );
      return;
    }

    if (appState.selectedCuisines.length < appState.maxCuisines) {
      appState.selectedCuisines.push(cuisine);
      showToast(`${cuisine.name} added`, "success");

      // Lock on first add
      if (!appState.lockedCuisineCategory) {
        appState.lockedCuisineCategory = cuisine.category;
      }
    } else {
      showToast(
        `Maximum ${appState.maxCuisines} cuisines can be selected`,
        "warning",
      );
      return;
    }
  }

  // Reset tags whenever cuisines change
  appState.selectedTags = [];
  saveState();
  renderUI();
}

// Filter cuisines by search
function filterCuisinesBySearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  return cuisineTagData.cuisines.filter((cuisine) => {
    if (
      appState.currentFilter !== "all" &&
      cuisine.category.toLowerCase() !== appState.currentFilter
    ) {
      return false;
    }
    return cuisine.name.toLowerCase().includes(searchTerm);
  });
}

function filterCuisines(filter) {
  appState.currentFilter = filter;
  document.querySelectorAll(".filter-chip").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  renderCuisines();
}

function filterBySearch(searchTerm) {
  renderCuisines();
  renderTags();
}

// ✅ Allowed General Tag IDs (only the ones Lulu approved)
const ALLOWED_GENERAL_TAG_IDS = new Set([
  124, 211, 153, 204, 808, 600, 1899, 357, 324, 1074, 1073, 1154,
  114, 149, 150, 541, 1169, 1257, 202, 454, 203, 260, 906, 1563,
  917, 1173, 229, 1885, 1096, 1093, 1174, 452, 42, 538, 831, 259,
  840, 1091, 679, 224, 222, 659, 251, 392, 53
]);

// Get related tags
function getRelatedTags() {
  if (appState.selectedCuisines.length === 0) return [];

  // Build a fast lookup from the master tags list (name -> tag object)
  const byName = new Map();
  (cuisineTagData.allTags || []).forEach((t) => {
    if (t && t.name) byName.set(String(t.name).toLowerCase().trim(), t);
  });

  const tagMap = new Map();

  const hasNonGeoCuisine = appState.selectedCuisines.some(
    (c) => c && c.category === "Others" && c.__nonGeo === true
  );

  // ✅ Non-geo selected -> ONLY approved general tags
  if (hasNonGeoCuisine) {
    (cuisineTagData.allTags || []).forEach((t) => {
      if (!t || !t.name) return;
      if (!ALLOWED_GENERAL_TAG_IDS.has(Number(t.id))) return;

      const key = String(t.name).toLowerCase().trim();
      if (!tagMap.has(key)) {
        tagMap.set(key, { id: t.id, name: t.name, category: "General" });
      }
    });

    // 🛑 Stop here so nothing else adds tags
    return Array.from(tagMap.values());
  }

  // ✅ Normal cuisines -> derive tags from cuisine.foodTags using master IDs
  appState.selectedCuisines.forEach((cuisine) => {
    (cuisine.foodTags || []).forEach((rawName) => {
      const tagName = String(rawName).trim();
      const key = tagName.toLowerCase();

      if (tagMap.has(key)) return;

      const master =
        byName.get(key) ||
        (cuisineTagData.tagNameToId?.[key]
          ? { id: cuisineTagData.tagNameToId[key], name: tagName, category: "Food" }
          : null);

      if (!master) return; // ✅ don't create custom_* tags

      tagMap.set(key, {
        id: master.id,
        name: master.name,
        category: master.category || "Other",
      });
    });
  });

  // ✅ Final return (ONLY here)
  return Array.from(tagMap.values());
}

// Render tags
function renderTags() {
  const grid = document.getElementById("tagGrid");
  const infoBox = document.getElementById("tagInfo");

  if (appState.selectedCuisines.length === 0) {
    grid.innerHTML = "";
    infoBox.innerHTML =
      '<p class="warning">👉 Select cuisines above to see related tags</p>';
    document.getElementById("tagCount").textContent = "0";
    return;
  }

  const cuisineNames = appState.selectedCuisines.map((c) => c.name).join(", ");
  infoBox.innerHTML = `<p class="success">✓ Selected: <strong>${cuisineNames}</strong></p>`;

  const relatedTags = getRelatedTags();
  grid.innerHTML = "";

  relatedTags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "btn tag-btn";
    btn.textContent = `${tag.name} (${tag.id}) ${tag.category ? `[${tag.category}]` : ""}`;
    btn.dataset.id = tag.id;

    if (appState.selectedTags.find((t) => t.id === tag.id)) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => toggleTag(tag));
    grid.appendChild(btn);
  });

  updateAllCounters();
}

function toggleTag(tag) {
  const index = appState.selectedTags.findIndex((t) => t.id === tag.id);

  if (index > -1) {
    appState.selectedTags.splice(index, 1);
    showToast(`${tag.name} removed`, "info");
  } else {
    if (appState.selectedTags.length < appState.maxTags) {
      appState.selectedTags.push(tag);
      showToast(`${tag.name} added`, "success");
    } else {
      showToast(`Maximum ${appState.maxTags} tags can be selected`, "warning");
      return;
    }
  }

  saveState();
  renderTags();
  updateSummary();
}

// Update counters
function updateAllCounters() {
  document.getElementById("cuisineCount").textContent =
    appState.selectedCuisines.length;
  document.getElementById("tagCount").textContent =
    appState.selectedTags.length;
}

// Update summary
function updateSummary() {
  // Preview tab
  const previewCuisines = document.getElementById("previewCuisines");
  previewCuisines.innerHTML =
    appState.selectedCuisines.length > 0
      ? appState.selectedCuisines
          .map(
            (c) =>
              `<li><span class="badge">${c.category}</span> ${c.name} <span class="muted">${c.id}</span></li>`,
          )
          .join("")
      : '<li class="empty">No cuisines selected</li>';

  const previewTags = document.getElementById("previewTags");
  previewTags.innerHTML =
    appState.selectedTags.length > 0
      ? appState.selectedTags
          .map(
            (t) =>
              `<li><span class="badge">${t.category}</span> ${t.name} <span class="muted">${t.id}</span></li>`,
          )
          .join("")
      : '<li class="empty">No tags selected</li>';

  // JSON preview
  updateJsonPreview();

  // Analytics
  updateAnalytics();
}

function updateJsonPreview() {
  let csv = "CAREEM - CUISINE & TAG SELECTION\n";
  csv += `Export Date,${new Date().toLocaleString()}\n\n`;

  // Cuisines section
  csv += "SELECTED CUISINES\n";
  csv += "ID,Name,Category,Region\n";
  if (appState.selectedCuisines.length > 0) {
    appState.selectedCuisines.forEach((cuisine) => {
      csv += `"${cuisine.id}","${cuisine.name}","${cuisine.category}","${cuisine.region || ""}"\n`;
    });
  } else {
    csv += "No cuisines selected\n";
  }

  csv += "\n";

  // Tags section
  csv += "SELECTED TAGS\n";
  csv += "ID,Name,Category\n";
  if (appState.selectedTags.length > 0) {
    appState.selectedTags.forEach((tag) => {
      csv += `"${tag.id}","${tag.name}","${tag.category || ""}"\n`;
    });
  } else {
    csv += "No tags selected\n";
  }

  csv += "\n";

  // Summary
  csv += "SUMMARY\n";
  csv += `Total Cuisines Selected,${appState.selectedCuisines.length}\n`;
  csv += `Total Tags Selected,${appState.selectedTags.length}\n`;

  document.getElementById("jsonPreview").textContent = csv;
}

function updateAnalytics() {
  const total = appState.selectedCuisines.length + appState.selectedTags.length;
  const maxTotal = appState.maxCuisines + appState.maxTags;
  const completion = Math.round((total / maxTotal) * 100);

  document.getElementById("statCuisines").textContent =
    `${appState.selectedCuisines.length} / ${appState.maxCuisines}`;
  document.getElementById("statTags").textContent =
    `${appState.selectedTags.length} / ${appState.maxTags}`;
  document.getElementById("statCompletion").textContent = `${completion}%`;

  // Category breakdown
  const breakdown = {};
  appState.selectedCuisines.forEach((c) => {
    breakdown["Cuisines"] = (breakdown["Cuisines"] || 0) + 1;
  });
  appState.selectedTags.forEach((t) => {
    breakdown[t.category] = (breakdown[t.category] || 0) + 1;
  });

  const breakdownHtml = Object.entries(breakdown)
    .map(
      ([cat, count]) =>
        `<div class="breakdown-item"><span>${cat}</span><span class="count">${count}</span></div>`,
    )
    .join("");

  document.getElementById("categoryBreakdown").innerHTML =
    breakdownHtml || '<p class="empty">No selections yet</p>';
}

// Tab switching
function switchTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((btn) => btn.classList.remove("active"));

  const tabEl = document.getElementById(`${tabName}Tab`);
  if (tabEl) tabEl.classList.add("active");

  const navEl = document.querySelector(`[data-tab="${tabName}"]`);
  if (navEl) navEl.classList.add("active");

  const titles = {
    selector: {
      title: "Cuisine & Tag Selector",
      subtitle: "Select up to 2 cuisines to view related tags",
    },
    preview: {
      title: "Selection Preview",
      subtitle: "View your current selections and export data",
    },
    analytics: {
      title: "Analytics",
      subtitle: "Track your selection progress",
    },
  };

  if (titles[tabName]) {
    document.getElementById("pageTitle").textContent = titles[tabName].title;
    document.getElementById("pageSubtitle").textContent = titles[tabName].subtitle;
  }
}

// Export data as CSV
function exportData() {
  let csv = "CAREEM - CUISINE & TAG SELECTION\n";
  csv += `Export Date,${new Date().toLocaleString()}\n\n`;

  // Cuisines section
  csv += "SELECTED CUISINES\n";
  csv += "ID,Name,Category,Region\n";
  if (appState.selectedCuisines.length > 0) {
    appState.selectedCuisines.forEach((cuisine) => {
      csv += `"${cuisine.id}","${cuisine.name}","${cuisine.category}","${cuisine.region || ""}"\n`;
    });
  } else {
    csv += "No cuisines selected\n";
  }

  csv += "\n";

  // Tags section
  csv += "SELECTED TAGS\n";
  csv += "ID,Name,Category,Count\n";
  if (appState.selectedTags.length > 0) {
    appState.selectedTags.forEach((tag) => {
      csv += `"${tag.id}","${tag.name}","${tag.category || ""}",1\n`;
    });
  } else {
    csv += "No tags selected\n";
  }

  csv += "\n";

  // Summary
  csv += "SUMMARY\n";
  csv += `Total Cuisines Selected,${appState.selectedCuisines.length}\n`;
  csv += `Total Tags Selected,${appState.selectedTags.length}\n`;

  const dataBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `careem-selections-${new Date().getTime()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Data exported as CSV successfully", "success");
}

// Import data
function importData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      appState.selectedCuisines = data.cuisines || [];
      appState.selectedTags = data.tags || [];
      saveState();
      renderUI();
      showToast("Data imported successfully", "success");
    } catch (error) {
      showToast("Error importing data", "danger");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
}

// Copy CSV to clipboard
function copyJsonToClipboard() {
  const csv = document.getElementById("jsonPreview").textContent;
  navigator.clipboard.writeText(csv).then(() => {
    showToast("CSV copied to clipboard", "success");
  });
}

// Clear all selections
function clearAllSelections() {
  appState.selectedCuisines = [];
  appState.selectedTags = [];
  appState.lockedCuisineCategory = null;
  saveState();
  renderUI();
  showToast("All selections cleared", "info");
}

// Local storage management
function saveState() {
  if (appState.autoSave) {
    localStorage.setItem("cuisineTagState", JSON.stringify(appState));
  }
}

function loadStateFromStorage() {
  const saved = localStorage.getItem("cuisineTagState");
  if (saved) {
    const loaded = JSON.parse(saved);

    appState.maxCuisines = 2;
    appState.maxTags = 6;
    appState.autoSave = loaded.autoSave !== false;
    appState.showCategories = loaded.showCategories !== false;
    appState.darkMode = loaded.darkMode || false;
    appState.notes = loaded.notes || "";

    appState.selectedCuisines = (loaded.selectedCuisines || [])
      .map((c) => {
        const byId = cuisineTagData.cuisines.find((x) => x.id === c.id);
        if (byId) return byId;
        if (c.name) {
          const byName = cuisineTagData.cuisines.find(
            (x) =>
              String(x.name).toLowerCase() === String(c.name).toLowerCase(),
          );
          if (byName) return byName;
        }
        return null;
      })
      .filter(Boolean);

    appState.lockedCuisineCategory =
      appState.selectedCuisines.length > 0
        ? appState.selectedCuisines[0].category
        : null;

    appState.selectedTags = (loaded.selectedTags || []).filter((t) =>
      cuisineTagData.allTags.find((x) => x.id === t.id),
    );
  }
} 
// Toast notifications
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas fa-${
    type === "success"
      ? "check"
      : type === "danger"
        ? "times"
        : type === "warning"
          ? "exclamation"
          : "info"
  }-circle"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}









