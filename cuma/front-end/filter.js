document.addEventListener('DOMContentLoaded', function () {
  // Function to filter units by regex match on all terms
  function filterUnitsByRegex(regex, elementClassName) {
      const units = document.getElementsByClassName(elementClassName); // Get all units in the unit list

      for (const unit of units) {
          const unitInfo = `${unit.dataset.id} ${unit.dataset.name} ${unit.dataset.type} ${unit.dataset.credit} ${unit.dataset.level} ${unit.dataset.overview} ${unit.dataset.universityName}`.toLowerCase(); // Get unit information and convert to lowercase
          if (regex.test(unitInfo)) {
              unit.style.display = 'block'; // Show the unit if it matches the regex
          } else {
              unit.style.display = 'none'; // Hide the unit if it doesn't match
          }
      }
  }

  const searchInput = document.getElementById('unit-search'); // Get the search input element

  // Add event listener for input changes to perform filtering
  searchInput.addEventListener('input', function () {
      const searchValue = searchInput.value.trim(); // Get the input value and trim whitespace
      const regex = new RegExp(searchValue, 'i'); // Create case-insensitive regex pattern
      filterUnitsByRegex( regex, "unit"); // Filter units based on the regex
  });



    const searchUnitForConnection = document.getElementById('unit-search-bar-connection'); // Get the search input element
    // add event listener for search unit in unit connection
    searchUnitForConnection.addEventListener('input', function () {
        const searchValue = searchUnitForConnection.value.trim(); // Get the input value and trim whitespace
        const regex = new RegExp(searchValue, 'i'); // Create case-insensitive regex pattern
        filterUnitsByRegex(regex, "foreign-unit"); // Filter units based on the regex
    });
});


