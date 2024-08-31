document.addEventListener("DOMContentLoaded", () => {
    const wasteSearchInput = document.getElementById("waste-search");
    const suggestionsContainer = document.getElementById("suggestions");
    const selectedWastesContainer = document.getElementById("selected-wastes");
    const formContainer = document.getElementById("jobsheet-form");
    const accordionContainer = document.getElementById("accordion-container");
  
    let selectedWastes = [];
    let wasteData = [];
  
    // Ambil Data Limbah
    async function fetchWasteData() {
      try {
        const response = await fetch("https://wm-be.dev.pituku.id/waste", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer 123", // Ganti dengan token yang benar
          },
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        wasteData = data.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    // Tampilkan Suggestions
    function showSuggestions(suggestions) {
      suggestionsContainer.innerHTML = "";
  
      // Batasi jumlah suggestions yang ditampilkan maksimal 5
      const limitedSuggestions = suggestions.slice(0, 5);
  
      limitedSuggestions.forEach((suggestion) => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";
  
        const label = document.createElement("span");
        label.textContent = `${suggestion.waste_name} (${suggestion.waste_code})`;
        div.appendChild(label);
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
  
        // Disable checkbox if waste is already selected
        if (
          selectedWastes.some(
            (waste) => waste.waste_name === suggestion.waste_name
          )
        ) {
          checkbox.disabled = true;
          checkbox.checked = true; // Optional: you can keep it checked but disabled
        }
  
        checkbox.addEventListener("change", (event) => {
          if (event.target.checked) {
            selectedWastes.push(suggestion);
          } else {
            selectedWastes = selectedWastes.filter(
              (waste) => waste.waste_name !== suggestion.waste_name
            );
          }
          updateSelectedWastes();
        });
        div.appendChild(checkbox);
  
        suggestionsContainer.appendChild(div);
      });
  
      suggestionsContainer.style.display =
        limitedSuggestions.length > 0 ? "block" : "none";
    }
  
    function updateSelectedWastes() {
      renderWasteForms(); // Render formulir ketika limbah diperbarui
    }
  
    function renderWasteForms() {
      accordionContainer.innerHTML = ""; // Kosongkan wadah akordeon
      selectedWastes.forEach((waste, index) => {
        // Buat bagian akordeon baru untuk setiap limbah
        const accordionSection = document.createElement("div");
        accordionSection.className = "accordion-section";
  
        // Create the accordion header
        const accordionHeader = document.createElement("h3");
        accordionHeader.textContent = `${waste.waste_name} (${waste.waste_code})`;
        accordionHeader.className = "accordion-header";
        accordionSection.appendChild(accordionHeader);
  
        // Create the accordion panel
        const panel = document.createElement("div");
        panel.className = "panel";
        console.log(waste);
        // Add form fields to the panel
        const table = document.createElement("table_wate");
        table.innerHTML = `
                  <tr_acording>
                    <td>Nama Limbah</td>
                    <td><input type="text" name="wasteName-${index}" value="${
          waste.waste_name
        }" readonly required></td>
                  </tr>
                  <tr_acording>
                    <td>Unit</td>
                    <td>
                      <select name="unit-${index}" required>
                        <option value="kg" ${
                          waste.unit === "kg" ? "selected" : ""
                        }>kg</option>
                        <option value="liter" ${
                          waste.unit === "liter" ? "selected" : ""
                        }>liter</option>
                      </select>
                    </td>
                  </tr>
                  <tr_acording>
                    <td>Jumlah</td>
                    <td><input type="number" name="quantity-${index}" placeholder="Masukan Jumlah Limbah" required></td>
                  </tr>
                  <tr>
                    <td>Harga Satuan</td>
                    <td><input type="text" name="unitPrice-${index}" value="Rp ${
          waste.waste_price
        }" ></td>
                  </tr>
                  <tr_acording>
                    <td>Total Harga Client</td>
                    <td><input type="text" name="totalClientPrice-${index}" placeholder="Masukan Total Harga Client" readonly required></td>
                  </tr>
                  <tr>
                    <td>Biaya Produksi /Kg atau Liter</td>
                    <td><input type="number" name="cost-${index}" placeholder="Masukan Biaya" required></td>
                  </tr>
                  <tr_acording>
                    <td>Total Biaya</td>
                    <td><input type="text" name="totalCost-${index}" placeholder="Masukan Total Biaya" readonly required></td>
                  </tr>
                  <tr_acording>
                    <td>Pemrosesan Armada</td>
                    <td><input type="text" name="fleetProcessing-${index}" placeholder="Masukan Pemrosesan Armada" required></td>
                  </tr>
                  <tr_acording>
                    <td>Estimasi Keuntungan</td>
                    <td><input type="text" name="profitEstimation-${index}" placeholder="Masukan Estimasi Keuntungan" readonly required></td>
                  </tr>
                  <tr_acording style="display:none;">
                    <td>GPM</td>
                    <td><input type="text" name="gpm-${index}" placeholder="GPM" readonly required></td>
                  </tr>
              `;
  
        // Append table to panel
        panel.appendChild(table);
  
        // Append panel to accordion section
        accordionSection.appendChild(panel);
  
        // Append accordion section to accordion container
        accordionContainer.appendChild(accordionSection);
  
        // Add event listener to toggle accordion
        accordionHeader.addEventListener("click", () => {
          panel.classList.toggle("active");
          accordionHeader.classList.toggle("active");
        });
  
        // Add event listeners for automatic calculation
        const quantityInput = table.querySelector(`[name="quantity-${index}"]`);
        const unitPriceInput = table.querySelector(`[name="unitPrice-${index}"]`);
        const totalClientPriceInput = table.querySelector(
          `[name="totalClientPrice-${index}"]`
        );
        const costInput = table.querySelector(`[name="cost-${index}"]`);
        const totalCostInput = table.querySelector(`[name="totalCost-${index}"]`);
        const profitEstimationInput = table.querySelector(
          `[name="profitEstimation-${index}"]`
        );
        const gpmInput = table.querySelector(`[name="gpm-${index}"]`);
  
        function formatCurrency(value) {
          return `Rp ${value.toLocaleString("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }
  
        function calculateFields() {
          const quantity = parseFloat(quantityInput.value) || 0;
          const unitPrice =
            parseFloat(
              unitPriceInput.value.replace(/[^\d,-]/g, "").replace(",", ".")
            ) || 0;
          const cost =
            parseFloat(
              costInput.value.replace(/[^\d,-]/g, "").replace(",", ".")
            ) || 0;
  
          const totalClientPrice = quantity * unitPrice;
          const totalCost = quantity * cost;
          const profitEstimation = totalClientPrice - totalCost;
          const gpm = totalClientPrice
            ? (profitEstimation / totalClientPrice) * 100
            : 0;
  
          totalClientPriceInput.value = formatCurrency(totalClientPrice);
          totalCostInput.value = formatCurrency(totalCost);
          profitEstimationInput.value = formatCurrency(profitEstimation);
          gpmInput.value = `${gpm.toFixed(2)}%`;
        }
  
        // Update event listeners for the quantity and cost input fields
        quantityInput.addEventListener("input", calculateFields);
        unitPriceInput.addEventListener("input", calculateFields);
        costInput.addEventListener("input", calculateFields);
  
        // Trigger calculation once to ensure the fields are populated
        calculateFields();
      });
  
      formContainer.style.display = selectedWastes.length > 0 ? "block" : "none";
    }
  
    wasteSearchInput.addEventListener("input", () => {
      const inputValue = wasteSearchInput.value.toLowerCase();
      if (inputValue) {
        const filteredSuggestions = wasteData.filter((item) =>
          item.waste_name.toLowerCase().includes(inputValue)
        );
        showSuggestions(filteredSuggestions);
      } else {
        suggestionsContainer.style.display = "none";
      }
    });
  
    fetchWasteData();
  
    // Handling form submission and saving to localStorage
    const form = document.querySelector("form");
  
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent the default form submission
  
      let jobsheetData = JSON.parse(localStorage.getItem("jobsheetData")) || [];
  
      // Collecting form data
      const companyName = form.querySelector('input[name="companyName"]').value;
      const marketingName = form.querySelector(
        'input[name="marketingName"]'
      ).value;
      const notes = form.querySelector('textarea[name="notes"]').value;
  
      const wastes = selectedWastes.map((waste, index) => {
        return {
          wasteName: waste.waste_name,
          unit: form.querySelector(`[name="unit-${index}"]`).value,
          quantity: form.querySelector(`[name="quantity-${index}"]`).value,
          unitPrice: form.querySelector(`[name="unitPrice-${index}"]`).value,
          totalClientPrice: form.querySelector(
            `[name="totalClientPrice-${index}"]`
          ).value,
          cost: form.querySelector(`[name="cost-${index}"]`).value,
          totalCost: form.querySelector(`[name="totalCost-${index}"]`).value,
          fleetProcessing: form.querySelector(`[name="fleetProcessing-${index}"]`)
            .value,
          profitEstimation: form.querySelector(
            `[name="profitEstimation-${index}"]`
          ).value,
          gpm: form.querySelector(`[name="gpm-${index}"]`).value,
        };
      });
  
      // Storing the data
      jobsheetData.push({
        companyName,
        marketingName,
        notes,
        wastes,
      });
  
      localStorage.setItem("jobsheetData", JSON.stringify(jobsheetData));
  
      // Reset the form and the selections
      selectedWastes = [];
      suggestionsContainer.innerHTML = "";
      renderWasteForms();
      form.reset();
  
      // Hide the form briefly and then show it again for new input
      formContainer.style.display = "none";
      setTimeout(() => {
        formContainer.style.display = "block";
      }, 300); // Adjust the time as necessary
    });
  
    // Fetching jobsheet data from localStorage
    const storedJobsheetData =
      JSON.parse(localStorage.getItem("jobsheetData")) || [];
    if (storedJobsheetData.length > 0) {
      console.log(storedJobsheetData);
      // You can use storedJobsheetData to populate the UI or use it as needed
    }
  });
  