document.addEventListener("DOMContentLoaded", function () {
    // Selecting required DOM elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");
    const syncStatus = document.getElementById("syncStatus"); // Notification area for sync status
    const serverSyncInterval = 30000; // Sync every 30 seconds
    const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock API endpoint

    // Load quotes from local storage or use default quotes
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "Believe in yourself.", category: "Motivation" },
        { text: "Knowledge is power.", category: "Wisdom" },
        { text: "Success is a journey, not a destination.", category: "Success" },
        { text: "Happiness depends upon ourselves.", category: "Happiness" }
    ];

    // Show sync status messages
    function showSyncStatus(message) {
        syncStatus.textContent = message;
        syncStatus.style.display = "block";
        setTimeout(() => { syncStatus.style.display = "none"; }, 5000); // Hide message after 5 seconds
    }

    /**
     * Populates the category dropdown dynamically
     */
    function populateCategories() {
        const uniqueCategories = [...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        uniqueCategories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Restore last selected category from local storage
        const lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";
        categoryFilter.value = lastSelectedCategory;
        filterQuotes();
    }

    /**
     * Displays a random quote based on the selected category
     */
    function showRandomQuote() {
        const selectedCategory = categoryFilter.value;
        const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
        
        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const selectedQuote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `"${selectedQuote.text}" - ${selectedQuote.category}`;
            sessionStorage.setItem("lastViewedQuote", JSON.stringify(selectedQuote));
        } else {
            quoteDisplay.innerHTML = "No quotes available for this category.";
        }
    }

    /**
     * Filters quotes by category and saves the selection in local storage
     */
    function filterQuotes() {
        localStorage.setItem("selectedCategory", categoryFilter.value);
        showRandomQuote();
    }

    /**
     * Syncs local quotes with the server, resolving conflicts
     */
    async function syncQuotes() {
        try {
            const response = await fetch(apiUrl); // Fetch data from the mock API
            const serverQuotes = await response.json(); // Parse the response JSON
            
            // Merge server quotes with local quotes, ensuring no duplicates
            let mergedQuotes = [...quotes];

            serverQuotes.forEach(serverQuote => {
                const existingIndex = quotes.findIndex(q => q.text === serverQuote.title);
                if (existingIndex === -1) {
                    // If the quote doesn't exist locally, add it
                    mergedQuotes.push({
                        text: serverQuote.title,
                        category: "Server"
                    });
                } else {
                    // If the quote exists, update it from the server
                    mergedQuotes[existingIndex] = {
                        text: serverQuote.title,
                        category: "Server"
                    };
                }
            });

            // Remove duplicates based on the text field
            quotes = [...new Set(mergedQuotes.map(q => JSON.stringify(q)))].map(q => JSON.parse(q));

            // Save the updated quotes back to localStorage
            localStorage.setItem("quotes", JSON.stringify(quotes));

            // Re-populate the categories dropdown
            populateCategories();

            // Show a notification about the successful sync
            showSyncStatus("Quotes synced with server successfully.");
        } catch (error) {
            // Handle any errors that occur during the fetch operation
            showSyncStatus("Error syncing with server. Please try again later.");
            console.error("Error syncing with server:", error);
        }
    }

    /**
     * Fetches quotes from the server and updates local quotes
     */
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch(apiUrl); // Fetch data from the mock API
            const serverQuotes = await response.json(); // Parse the response JSON
            
            // Merge server quotes with local quotes, ensuring no duplicates
            let mergedQuotes = [...quotes];

            serverQuotes.forEach(serverQuote => {
                const existingIndex = quotes.findIndex(q => q.text === serverQuote.title);
                if (existingIndex === -1) {
                    // If the quote doesn't exist locally, add it
                    mergedQuotes.push({
                        text: serverQuote.title,
                        category: "Server"
                    });
                } else {
                    // If the quote exists, update it from the server
                    mergedQuotes[existingIndex] = {
                        text: serverQuote.title,
                        category: "Server"
                    };
                }
            });

            // Remove duplicates based on the text field
            quotes = [...new Set(mergedQuotes.map(q => JSON.stringify(q)))].map(q => JSON.parse(q));

            // Save the updated quotes back to localStorage
            localStorage.setItem("quotes", JSON.stringify(quotes));

            // Re-populate the categories dropdown
            populateCategories();

            // Show a notification about the successful sync
            showSyncStatus("Quotes fetched from server and updated.");
        } catch (error) {
            // Handle any errors that occur during the fetch operation
            showSyncStatus("Error fetching quotes from server. Please try again later.");
            console.error("Error fetching quotes from server:", error);
        }
    }

    /**
     * Adds a new quote and updates storage and UI accordingly
     */
    function addQuote(text, category) {
        if (text && category) {
            quotes.push({ text, category });
            localStorage.setItem("quotes", JSON.stringify(quotes));
            alert("Quote added successfully!");
            populateCategories();
            showRandomQuote();
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    // Periodically sync with the server
    setInterval(syncQuotes, serverSyncInterval);

    // Event listeners for interactions
    newQuoteButton.addEventListener("click", showRandomQuote);
    categoryFilter.addEventListener("change", filterQuotes);

    // Initialize categories and start syncing
    populateCategories();
    syncQuotes(); // Initial sync on page load
});
