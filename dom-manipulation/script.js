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
     * Post a new quote to the server and update local data accordingly
     */
    async function postQuoteToServer(text, category) {
        const newQuote = { title: text, body: category, userId: 1 }; // Structure for JSONPlaceholder

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newQuote) // Send data as JSON
            });

            if (response.ok) {
                const postedQuote = await response.json();
                console.log("Posted Quote:", postedQuote);

                // Update local data with the newly posted quote
                quotes.push({
                    text: postedQuote.title,
                    category: postedQuote.body
                });

                localStorage.setItem("quotes", JSON.stringify(quotes)); // Save updated quotes to localStorage
                populateCategories(); // Re-populate the categories dropdown
                showSyncStatus("New quote posted successfully!");
            } else {
                throw new Error("Failed to post quote.");
            }
        } catch (error) {
            showSyncStatus("Error posting new quote. Please try again.");
            console.error("Error posting quote:", error);
        }
    }

    /**
     * Fetch quotes from the server and update local storage
     */
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch(apiUrl); // Fetch data from the mock API
            const serverQuotes = await response.json(); // Parse the response JSON
            
            // Merge server quotes with local quotes, ensuring no duplicates
            let mergedQuotes = [...quotes];
            let conflictsResolved = false;

            serverQuotes.forEach(serverQuote => {
                const existingIndex = quotes.findIndex(q => q.text === serverQuote.title);
                if (existingIndex === -1) {
                    // If the quote doesn't exist locally, add it
                    mergedQuotes.push({
                        text: serverQuote.title,
                        category: "Server"
                    });
                } else {
                    // If the quote exists, update it from the server (Conflict Resolution)
                    mergedQuotes[existingIndex] = {
                        text: serverQuote.title,
                        category: "Server"
                    };
                    conflictsResolved = true;
                }
            });

            // Remove duplicates based on the text field
            quotes = [...new Set(mergedQuotes.map(q => JSON.stringify(q)))].map(q => JSON.parse(q));

            // Save the updated quotes back to localStorage
            localStorage.setItem("quotes", JSON.stringify(quotes));

            // Re-populate the categories dropdown
            populateCategories();

            // Show a notification about the successful sync
            if (conflictsResolved) {
                showSyncStatus("Conflicts resolved and quotes synced with server.");
            } else {
                showSyncStatus("Quotes synced with server successfully.");
            }
        } catch (error) {
            // Handle any errors that occur during the fetch operation
            showSyncStatus("Error syncing with server. Please try again later.");
            console.error("Error syncing with server:", error);
        }
    }

    // Event listeners for interactions
    newQuoteButton.addEventListener("click", showRandomQuote);
    categoryFilter.addEventListener("change", filterQuotes);

    // Initialize categories and start syncing
    populateCategories();
    // Initial sync on page load (optional if you want to sync every time)
    fetchQuotesFromServer(); // Fetch quotes on page load

    // Periodically sync with the server
    setInterval(fetchQuotesFromServer, serverSyncInterval); // Periodic sync
});
