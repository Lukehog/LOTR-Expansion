document.addEventListener("DOMContentLoaded", function() {
    const cardGrid = document.getElementById('cardGrid');
    const nonSupplyCardGrid = document.getElementById('nonSupplyCardGrid');
    const overlay = document.getElementById('overlay');
    const enlargedCard = document.getElementById('enlargedCard');
    const removeButton = document.querySelector('.removeCard');
    let currentCard; // Variable to store the current card element

    // Function to load cards from a given JSON file and populate the grid
    function loadCards(jsonFile, gridElement) {
        fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                // Sort the cards after fetching the data
                data.cards.sort((a, b) => {
                    if (a.cost !== b.cost) {
                        return a.cost - b.cost; // Sort by cost
                    }
                    return a.ref.localeCompare(b.ref); // Sort by ref
                });

                // Create image elements for each card
                data.cards.forEach(card => {
                    const imgElement = document.createElement('img');
                    imgElement.src = `cards/${card.ref}`; // The path is already set to the 'cards' folder
                    imgElement.alt = 'Card';
                    imgElement.addEventListener('click', () => {
                        enlargedCard.src = `cards/${card.ref}`; // Set the source of the enlarged image
                        overlay.style.display = 'flex'; // Show the overlay
                        currentCard = imgElement; // Store the current card element
                    });

                    gridElement.appendChild(imgElement);
                });
            })
            .catch(error => console.error('Error loading the JSON file:', error));
    }

    // Load original cards
    loadCards('cards.json', cardGrid);

    // Load non-supply cards
    loadCards('non_supply_cards.json', nonSupplyCardGrid);

    // Close the overlay when clicking outside the enlarged image
    enlargedCard.addEventListener('click', () => {
        overlay.style.display = 'none'; // Hide the overlay
    });

    // Add event listener for the remove button
    removeButton.addEventListener('click', () => {
        if (currentCard) {
            currentCard.remove(); // Remove the current card from the grid
            overlay.style.display = 'none'; // Hide the overlay
            currentCard = null; // Reset the current card
        }
    });
});
