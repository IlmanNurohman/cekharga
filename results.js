document.addEventListener("DOMContentLoaded", () => {
    const resultsContainer = document.getElementById("results");
    const noResultsMessage = document.getElementById("no-results");
    const totalClientPriceSumEl = document.getElementById("total-client-price-sum");
    const totalCostSumEl = document.getElementById("total-cost-sum");
    const totalProfitEstimationSumEl = document.getElementById("total-profit-estimation-sum");
    const gpmResultEl = document.getElementById("gpm-result");
    const companyNameEl = document.getElementById("company-name");
    const marketingNameEl = document.getElementById("marketing-name");
    const notesEl = document.getElementById("notes");
  
    // Retrieve data from localStorage
    let jobsheetData = JSON.parse(localStorage.getItem("jobsheetData")) || [];
  
    // Ensure jobsheetData is an array
    if (!Array.isArray(jobsheetData)) {
      jobsheetData = [];
    }
  
    // Variables to hold sums
    let totalClientPriceSum = 0;
    let totalCostSum = 0;
    let totalProfitEstimationSum = 0;
  
    if (jobsheetData.length === 0) {
      noResultsMessage.style.display = "block";
    } else {
      noResultsMessage.style.display = "none";
  
      // Assume that company name and marketing name are the same for all entries
      if (jobsheetData[0]) {
        companyNameEl.textContent = `Nama Perusahaan: ${jobsheetData[0].companyName}`;
        marketingNameEl.textContent = `Nama Marketing: ${jobsheetData[0].marketingName}`;
        notesEl.textContent = `Catatan: ${jobsheetData[0].notes}`;
      }
  
      jobsheetData[0]["wastes"].forEach((data, index) => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${data.wasteName}</td>
          <td>${data.unit}</td>
          <td>${data.quantity}</td>
          <td>${data.unitPrice}</td>
          <td>${data.totalClientPrice}</td>
          <td>${data.cost}</td>
          <td>${data.totalCost}</td>
          <td>${data.fleetProcessing}</td>
          <td>${data.profitEstimation}</td>
        `;
  
        resultsContainer.appendChild(row);
  
        // Update totals for calculated columns with error handling
        const totalClientPrice =
          parseFloat(
            (data.totalClientPrice || "")
              .replace(/[^0-9,-]+/g, "")
              .replace(",", ".")
          ) || 0;
        const totalCost =
          parseFloat(
            (data.totalCost || "").replace(/[^0-9,-]+/g, "").replace(",", ".")
          ) || 0;
        const profitEstimation =
          parseFloat(
            (data.profitEstimation || "")
              .replace(/[^0-9,-]+/g, "")
              .replace(",", ".")
          ) || 0;
  
        totalClientPriceSum += totalClientPrice;
        totalCostSum += totalCost;
        totalProfitEstimationSum += profitEstimation;
      });
  
      // Display sum totals with correct formatting
      totalClientPriceSumEl.textContent = `Rp ${totalClientPriceSum.toLocaleString(
        "id-ID",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )}`;
      totalCostSumEl.textContent = `Rp ${totalCostSum.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      totalProfitEstimationSumEl.textContent = `Rp ${totalProfitEstimationSum.toLocaleString(
        "id-ID",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )}`;
  
      // Calculate and display GPM
      const gpm = totalClientPriceSum
        ? ((totalProfitEstimationSum / totalClientPriceSum) * 100).toFixed(2)
        : 0;
      gpmResultEl.textContent = `GPM: ${gpm}%`;
    }
  
    // Function to generate PDF in landscape orientation
    document.getElementById("generate-pdf").addEventListener("click", () => {
      const element = document.getElementById("results-container");
  
      // Hide buttons before generating PDF
      const generatePdfButton = document.getElementById("generate-pdf");
      const backButton = document.querySelector(".back-button");
      generatePdfButton.style.display = "none";
      backButton.style.display = "none";
  
      // Create print date element but do not append it to DOM yet
      const currentDate = new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const printDateEl = document.createElement("p");
      printDateEl.textContent = `Tanggal Cetak: ${currentDate}`;
      printDateEl.className = "print-date";
  
      // Append the print date element only to the cloned version of the element
      const clonedElement = element.cloneNode(true);
      clonedElement.appendChild(printDateEl);
  
      // Generate PDF from the cloned element
      html2pdf()
        .from(clonedElement)
        .set({
          margin: 1,
          filename: "jobsheet_data.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 3 },
          jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        })
        .save()
        .then(() => {
          // Show buttons again after PDF is created
          generatePdfButton.style.display = "block";
          backButton.style.display = "block";
        });
    });
  
    // Clear the data in localStorage after displaying it
    localStorage.removeItem("jobsheetData");
  });
  