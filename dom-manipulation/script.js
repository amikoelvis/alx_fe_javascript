document.addEventListener("DOMContentLoaded", function () {
    // Selecting required DOM elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");
    const serverSyncInterval = 30000; // Sync every 30 seconds
    const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock API endpoint

    // Load quotes from local storage or use default quotes
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "Believe in yourself.", category: "Motivation" },
        { text: "Knowledge is power.", category: "Wisdom" },
        { text: "Success is a journey, not a destination.", category: "Success" },
        { text: "Happiness depends upon ourselves.", category: "Happiness" }
    ];

    /**
     * Populates the category dropdown dynamically
     * Ensures unique categories and remembers the last selected category
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
     * Stores the last viewed quote in session storage
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
     * Creates a form for adding new quotes dynamically
     */
    function createAddQuoteForm() {
        const form = document.createElement("form");
        form.id = "addQuoteForm";
        
        // Input field for the quote text
        const quoteInput = document.createElement("input");
        quoteInput.type = "text";
        quoteInput.placeholder = "Enter new quote";
        quoteInput.id = "newQuoteText";
        
        // Input field for the category
        const categoryInput = document.createElement("input");
        categoryInput.type = "text";
        categoryInput.placeholder = "Enter category";
        categoryInput.id = "newQuoteCategory";
        
        // Submit button
        const addButton = document.createElement("button");
        addButton.textContent = "Add Quote";
        addButton.type = "submit";
        
        form.appendChild(quoteInput);
        form.appendChild(categoryInput);
        form.appendChild(addButton);
        document.body.appendChild(form);
        
        // Event listener to handle form submission
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            addQuote(quoteInput.value.trim(), categoryInput.value.trim());
        });
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

            // Clear input fields
            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    /**
     * Sync local quotes with the server
     * Fetches new quotes periodically and updates local storage
     */
    async function syncWithServer() {
        try {
            const response = await fetch(apiUrl);
            const serverQuotes = await response.json();
            
            // Simulating merging server data by taking unique entries
            const mergedQuotes = [...quotes, ...serverQuotes.map(q => ({ text: q.title, category: "Server" }))];
            quotes = [...new Set(mergedQuotes.map(q => JSON.stringify(q)))].map(q => JSON.parse(q));
            
            localStorage.setItem("quotes", JSON.stringify(quotes));
            populateCategories();
            console.log("Quotes synced with server");
        } catch (error) {
            console.error("Error syncing with server:", error);
        }
    }

    // Event listeners for interactions
    newQuoteButton.addEventListener("click", showRandomQuote);
    categoryFilter.addEventListener("change", filterQuotes);
    
    // Initialize form, categories, and start server sync
    createAddQuoteForm();
    populateCategories();
    syncWithServer();
    setInterval(syncWithServer, serverSyncInterval); // Periodic sync
});
