document.addEventListener("DOMContentLoaded", function () {
    // Selecting DOM elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    // Load quotes from localStorage or use a default set
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "Believe in yourself.", category: "Motivation" },
        { text: "Knowledge is power.", category: "Wisdom" },
        { text: "Success is a journey, not a destination.", category: "Success" },
        { text: "Happiness depends upon ourselves.", category: "Happiness" }
    ];

    /**
     * Function to display a random quote
     * Selects a random quote from the array and updates the display
     */
    function showRandomQuote() {
        if (quotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const selectedQuote = quotes[randomIndex];
            quoteDisplay.innerHTML = `"${selectedQuote.text}" - ${selectedQuote.category}`;

            // Save the last viewed quote index in sessionStorage (optional)
            sessionStorage.setItem('lastViewedQuote', JSON.stringify(selectedQuote));
        } else {
            quoteDisplay.innerHTML = "No quotes available.";
        }
    }

    /**
     * Function to create and append a form dynamically for adding new quotes
     */
    function createAddQuoteForm() {
        const form = document.createElement("form");
        form.id = "addQuoteForm";

        // Input field for the quote text
        const quoteInput = document.createElement("input");
        quoteInput.type = "text";
        quoteInput.placeholder = "Enter new quote";
        quoteInput.id = "newQuoteText";

        // Input field for the quote category
        const categoryInput = document.createElement("input");
        categoryInput.type = "text";
        categoryInput.placeholder = "Enter category";
        categoryInput.id = "newQuoteCategory";

        // Button to submit the form
        const addButton = document.createElement("button");
        addButton.textContent = "Add Quote";
        addButton.type = "submit";

        // Append elements to the form
        form.appendChild(quoteInput);
        form.appendChild(categoryInput);
        form.appendChild(addButton);

        // Append the form to the body
        document.body.appendChild(form);

        /**
         * Function to add a new quote dynamically
         */
        function addQuote() {
            const newQuoteText = quoteInput.value.trim();
            const newQuoteCategory = categoryInput.value.trim();

            // Validate input to ensure both fields are filled
            if (newQuoteText && newQuoteCategory) {
                // Add the new quote to the array
                quotes.push({ text: newQuoteText, category: newQuoteCategory });

                // Save updated quotes to localStorage
                localStorage.setItem("quotes", JSON.stringify(quotes));

                // Notify the user
                alert("Quote added successfully!");

                // Clear input fields
                quoteInput.value = "";
                categoryInput.value = "";

                // Show the newly added quote
                showRandomQuote();
            } else {
                alert("Please enter both a quote and a category.");
            }
        }

        // Event listener for form submission
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission
            addQuote(); // Add the quote to the array
        });
    }

    // Event listener for the "Show New Quote" button
    newQuoteButton.addEventListener("click", showRandomQuote);

    // Export quotes to a JSON file
    window.exportToJsonFile = function () {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "quotes.json";
        link.click();
    };

    // Import quotes from a JSON file
    window.importFromJsonFile = function (event) {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes = importedQuotes;
                    // Save imported quotes to localStorage
                    localStorage.setItem("quotes", JSON.stringify(quotes));
                    showRandomQuote();
                    alert("Quotes imported successfully!");
                } else {
                    alert("Invalid JSON format.");
                }
            } catch (error) {
                alert("Failed to parse JSON file.");
            }
        };
        fileReader.readAsText(event.target.files[0]);
    };

    // Create the form to add a quote
    createAddQuoteForm();

    // Initialize by showing a random quote
    showRandomQuote();
});
