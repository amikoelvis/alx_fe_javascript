document.addEventListener("DOMContentLoaded", function () {
    // Selecting DOM elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    // Array to store quotes with their categories
    const quotes = [
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
            quoteDisplay.innerHTML = `"${quotes[randomIndex].text}" - ${quotes[randomIndex].category}`;
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
            event.preventDefault(); // Fix: Added missing parentheses
            addQuote(); // Fix: Call the addQuote function inside event listener
        });
    }

    // Event listener for the "Show New Quote" button
    newQuoteButton.addEventListener("click", showRandomQuote);

    // Initialize the quote generator by creating the form and showing a quote on page load
    createAddQuoteForm();
    showRandomQuote();
});
