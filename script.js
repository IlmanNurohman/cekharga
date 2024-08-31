// Assuming you have a form submission process like this
document
.getElementById("submit-form")
.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get the new jobsheet data from the form
  const newJobsheetData = {
    companyName: document.getElementById("company-name-input").value,
    marketingName: document.getElementById("marketing-name-input").value,
    notes: document.getElementById("notes").value,
    wastes: getWastesFromForm(), // Assume this function collects all waste data from the form
  };

  // Get the existing jobsheet data from localStorage
  let jobsheetData =
    JSON.parse(localStorage.getItem("jobsheetData")) || [];

  // Append the new data
  jobsheetData.push(newJobsheetData);

  // Save back to localStorage
  localStorage.setItem("jobsheetData", JSON.stringify(jobsheetData));

  // Redirect to results page
  window.location.href = "results.html";
});