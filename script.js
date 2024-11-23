// URLs for language list and GitHub API
const languageUrl =
  "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json";
const apiBaseUrl = "https://api.github.com/search/repositories?q=language:";

// DOM elements
const languageSelect = document.getElementById("language-select");
const fetchButton = document.getElementById("fetch-repo");
const repoDetails = document.getElementById("repo-details");

// Function to load programming languages into the dropdown
async function loadLanguages() {
  try {
    const response = await fetch(languageUrl); // Fetch the JSON file
    const languages = await response.json(); // Parse JSON response

    // Populate the dropdown with languages
    languages.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.value; // Use the "value" field for the option value
      option.textContent = language.title; // Use the "title" field for display
      languageSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading languages:", error);
    alert("Failed to load programming languages. Please try again.");
  }
}

// Function to fetch repositories for the selected language
async function fetchRepository() {
  const selectedLanguage = languageSelect.value;

  // Validate if a language is selected
  if (!selectedLanguage) {
    alert("Please select a programming language!");
    return;
  }

  // Show loading message while fetching data
  repoDetails.innerHTML = "<p>Loading...</p>";

  try {
    // Fetch repositories from the GitHub API
    const response = await fetch(
      `${apiBaseUrl}${selectedLanguage}&sort=stars&order=desc`
    );
    const data = await response.json();

    // Check if repositories exist for the selected language
    if (data.items && data.items.length > 0) {
      displayRepositories(data.items); // Pass the list of repositories to display
    } else {
      repoDetails.innerHTML =
        "<p>No repositories found for the selected language.</p>";
    }
  } catch (error) {
    console.error("Error fetching repository:", error);
    repoDetails.innerHTML =
      "<p>Failed to fetch repositories. Please try again later.</p>";
  }
}

// Function to display multiple repositories
function displayRepositories(repositories) {
  // Clear previous results
  repoDetails.innerHTML = "";

  // Create a title for the list
  const title = document.createElement("h2");
  title.textContent = "Top Repositories:";
  title.style.color = "#000000"; // Black text for title
  title.style.marginBottom = "10px";
  title.style.fontWeight = "bold";
  repoDetails.appendChild(title);

  // Iterate over the repositories and create cards for each
  repositories.slice(0, 10).forEach((repo) => {
    const repoCard = document.createElement("div");
    repoCard.style.marginBottom = "15px";
    repoCard.style.padding = "15px"; // Increased padding for better spacing
    repoCard.style.background = "#FFFFFF"; // White background
    repoCard.style.border = "1px solid #000000"; // Black border
    repoCard.style.borderRadius = "8px"; // Rounded corners
    repoCard.style.textAlign = "left"; // Align text to the left

    repoCard.innerHTML = `
      <h3 style="color: #000000; font-weight: bold; margin-bottom: 8px;">${
        repo.name
      }</h3>
      <p style="color: #000000; margin: 5px 0;">${
        repo.description || "No description available."
      }</p>
      <p style="color: #000000; margin: 5px 0;"><strong>⭐ Stars:</strong> ${
        repo.stargazers_count
      }</p>
      <p style="color: #000000; margin: 5px 0;"><strong>🍴 Forks:</strong> ${
        repo.forks_count
      }</p>
      <p style="color: #000000; margin: 5px 0;"><strong>🐞 Open Issues:</strong> ${
        repo.open_issues_count
      }</p>
      <a href="${repo.html_url}" target="_blank" 
         style="color: #FFFFFF; 
                background: #000000; 
                padding: 10px 15px; 
                border-radius: 5px; 
                text-decoration: none; 
                font-weight: bold; 
                display: inline-block;
                margin-top: 10px;">View Repository</a>
    `;
    repoDetails.appendChild(repoCard);
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", loadLanguages); // Load languages on page load
fetchButton.addEventListener("click", fetchRepository); // Fetch repository on button click
