document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results");

  // Retrieve data from localStorage
  const jobsheetData = JSON.parse(localStorage.getItem("jobsheetData")) || [];

  // Display the data
  jobsheetData.forEach((data, index) => {
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("result-item");
    resultDiv.innerHTML = `
          <h3>Entry ${index + 1}</h3>
          <p>Nama Limbah: ${data.wasteName}</p>
          <p>Satuan: ${data.unit}</p>
          <p>Jumlah: ${data.quantity}</p>
          <p>Harga Satuan: ${data.unitPrice}</p>
          <p>Total Harga Klien: ${data.totalClientPrice}</p>
          <p>Biaya: ${data.cost}</p>
          <p>Total Biaya: ${data.totalCost}</p>
          <p>Pengolahan & Armada: ${data.Armada}</p>
          <p>Estimasi Profit: ${data.profitEstimation}</p>
          <p>GPM (Gross Profit Margin): ${data.gpm}</p>
        `;
    resultsContainer.appendChild(resultDiv);
  });

  // Generate PDF functionality
  document.getElementById("generate-pdf").addEventListener("click", () => {
    const pdfContent = document.querySelector(".results-container").innerHTML;

    // You can use a library like jsPDF to generate the PDF
    const doc = new jsPDF();
    doc.fromHTML(pdfContent, 15, 15, { width: 170 });
    doc.save("jobsheet-results.pdf");
  });
});
