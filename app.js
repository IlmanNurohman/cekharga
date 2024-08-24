document.addEventListener("DOMContentLoaded", () => {
  const landingPage = document.getElementById("landing-page");
  const mainContent = document.getElementById("main-content");
  const createJobsheetButton = document.getElementById(
    "create-jobsheet-button"
  );

  setTimeout(() => {
    landingPage.style.display = "none";
    mainContent.style.display = "block";
  }, 2000);

  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  if (searchInput) {
    searchInput.addEventListener("input", search);
  }

  if (searchButton) {
    searchButton.addEventListener("click", displaySelectedResults);
  }

  if (createJobsheetButton) {
    createJobsheetButton.addEventListener("click", () => {
      window.location.href = "jobsheet.html";
    });
  }
});

let wasteData = [];
let selectedWastes = [];

async function search() {
  const input = document.getElementById("search-input").value;
  const resultsContainer = document.querySelector(".results-container");
  const results = document.getElementById("results");
  const createJobsheetButton = document.getElementById(
    "create-jobsheet-button"
  );

  if (input.trim() === "") {
    results.innerHTML = "";
    resultsContainer.style.display = "none";
    createJobsheetButton.style.display = "block";
    return;
  }

  createJobsheetButton.style.display = "none";

  try {
    const response = await fetch(
      `https://wm-be.dev.pituku.id/waste?search=${encodeURIComponent(input)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer 123",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    wasteData = data.data;
    displayResults(wasteData);
    resultsContainer.style.display = "block";

    if (wasteData.length === 0) {
      createJobsheetButton.style.display = "block";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    results.innerHTML =
      "<h3>Daftar Limbah</h3><p>Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.</p>";
    resultsContainer.style.display = "block";
    createJobsheetButton.style.display = "block";
  }
}

function displayResults(data) {
  const results = document.getElementById("results");
  results.innerHTML = "<h3></h3>";

  if (!data || data.length === 0) {
    results.innerHTML += "<p>Tidak ada data ditemukan.</p>";
    return;
  }

  data.forEach((item) => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.marginBottom = "10px";
    div.style.justifyContent = "space-between";

    const textContainer = document.createElement("div");
    textContainer.style.flex = "1";

    const nameDiv = document.createElement("div");
    nameDiv.textContent = item.waste_name;

    const categoryDiv = document.createElement("div");
    categoryDiv.style.color = "#777";
    categoryDiv.textContent = `${item.waste_code} - ${item.waste_category}`;

    textContainer.appendChild(nameDiv);
    textContainer.appendChild(categoryDiv);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "selectedWaste";
    checkbox.value = item.waste_name;
    checkbox.style.marginLeft = "10px";

    checkbox.addEventListener("change", function () {
      if (this.checked) {
        selectedWastes.push(item);
      } else {
        selectedWastes = selectedWastes.filter(
          (waste) => waste.waste_name !== item.waste_name
        );
      }
      updateSelectedWasteContainer();
    });

    div.appendChild(textContainer);
    div.appendChild(checkbox);
    results.appendChild(div);
  });
}

function updateSelectedWasteContainer() {
  const selectedWasteContainer = document.getElementById("selected-waste");
  selectedWasteContainer.innerHTML = ""; // Bersihkan kontainer terlebih dahulu

  if (selectedWastes.length === 0) {
    selectedWasteContainer.style.display = "none";
    return;
  }

  selectedWasteContainer.style.display = "block";

  // Buat satu div untuk menampung semua limbah yang dipilih
  const wasteListDiv = document.createElement("div");
  wasteListDiv.style.padding = "10px";
  wasteListDiv.style.backgroundColor = "#f0f0f0";
  wasteListDiv.style.borderRadius = "10px";

  selectedWastes.forEach((item) => {
    const wasteSpan = document.createElement("span");
    wasteSpan.textContent = item.waste_name;
    wasteSpan.style.display = "inline-block";
    wasteSpan.style.margin = "5px";
    wasteSpan.style.padding = "5px 10px";
    wasteSpan.style.backgroundColor = "#d1d1d1";
    wasteSpan.style.borderRadius = "15px";

    // Tombol untuk menghapus limbah dari daftar yang dipilih
    const removeButton = document.createElement("button");
    removeButton.textContent = "x";
    removeButton.style.marginLeft = "10px";
    removeButton.style.background = "none";
    removeButton.style.border = "none";
    removeButton.style.cursor = "pointer";

    removeButton.addEventListener("click", () => {
      selectedWastes = selectedWastes.filter(
        (waste) => waste.waste_name !== item.waste_name
      );
      updateSelectedWasteContainer();
    });

    wasteSpan.appendChild(removeButton);
    wasteListDiv.appendChild(wasteSpan);
  });

  selectedWasteContainer.appendChild(wasteListDiv);
}

function displaySelectedResults() {
  const results = document.getElementById("results");
  results.innerHTML = "<h3>Hasil Limbah yang Dipilih</h3>";

  if (selectedWastes.length === 0) {
    results.innerHTML += "<p>Tidak ada limbah yang dipilih.</p>";
    return;
  }

  let tableHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ccc;">Nama Limbah</th>
                    <th style="text-align: right; padding: 10px; border-bottom: 1px solid #ccc;">Harga</th>
                </tr>
            </thead>
            <tbody>
    `;

  selectedWastes.forEach((wasteItem) => {
    tableHTML += `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ccc;">${
                  wasteItem.waste_name
                }</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ccc;">Rp${wasteItem.waste_price.toLocaleString()}</td>
            </tr>
        `;
  });

  tableHTML += `
            </tbody>
        </table>
    `;

  results.innerHTML = tableHTML;
}
