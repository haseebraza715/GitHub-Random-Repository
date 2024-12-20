const languageUrl =
  "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json";
const apiBaseUrl = "https://api.github.com/search/repositories?q=language:";

// DOM elements
const languageSelect = document.getElementById("language-select");
const fetchButton = document.getElementById("fetch-repo");
const repoDetails = document.getElementById("repo-details");

async function loadLanguages() {
  try {
    const response = await fetch(languageUrl); 
    const languages = await response.json();

    
    languages.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.value; 
      option.textContent = language.title; 
      languageSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading languages:", error);
    alert("Failed to load programming languages. Please try again.");
  }
}

async function fetchRepository() {
  const selectedLanguage = languageSelect.value;

  if (!selectedLanguage) {
    alert("Please select a programming language!");
    return;
  }

  repoDetails.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `${apiBaseUrl}${selectedLanguage}&sort=stars&order=desc`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      displayRepositories(data.items); 
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

function displayRepositories(repositories) {
  repoDetails.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Top Repositories:";
  title.style.color = "#000000"; 
  title.style.marginBottom = "10px";
  title.style.fontWeight = "bold";
  repoDetails.appendChild(title);

  repositories.slice(0, 10).forEach((repo) => {
    const repoCard = document.createElement("div");
    repoCard.style.marginBottom = "15px";
    repoCard.style.padding = "15px"; 
    repoCard.style.background = "#FFFFFF"; 
    repoCard.style.border = "1px solid #000000"; 
    repoCard.style.borderRadius = "8px";
    repoCard.style.textAlign = "left"; 

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

document.addEventListener("DOMContentLoaded", loadLanguages); 
fetchButton.addEventListener("click", fetchRepository); 
