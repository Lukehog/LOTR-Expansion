document.addEventListener("DOMContentLoaded", function () {
    const cardGrid = document.getElementById('cardGrid');
    const nonSupplyCardGrid = document.getElementById('nonSupplyCardGrid');
    //const artifactsCardGrid = document.getElementById('artifactsCardGrid');
    const landmarksCardGrid = document.getElementById('landmarksCardGrid');
    const propheciesCardGrid = document.getElementById('propheciesCardGrid');
    const ringsCardGrid = document.getElementById('ringsCardGrid');
    const overlay = document.getElementById('overlay');
    const enlargedCard = document.getElementById('enlargedCard');
    const removeButton = document.querySelector('.removeCard');
    const searchBar = document.getElementById('searchBar');
    let currentCard;
    let allCards = [];

    // Load cards from a given JSON file and populate the grid
    function loadCards(jsonFile) {
        fetch(jsonFile)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                // Sort cards
                data.cards.sort((a, b) => {
                    const costA = a.cost || 0; // Default to 0 if cost is undefined
                    const costB = b.cost || 0; 
                    if (costA !== costB) return costA - costB; 
                    return a.ref.localeCompare(b.ref);
                });

                allCards = data.cards; // Store all cards

                // Populate grids with cards
                allCards.forEach(card => createCardElement(card));
            })
            .catch(error => console.error('Error loading the JSON file:', error));
    }

    // Create a card element and append it to the appropriate grid
    function createCardElement(card) {
        const imgElement = document.createElement('img');
        imgElement.src = `../cards/${card.ref}`; 
        imgElement.alt = card.name; 
        imgElement.addEventListener('click', () => {
            enlargedCard.src = `../cards/${card.ref}`; 
            overlay.style.display = 'flex'; 
            currentCard = imgElement; 
        });

        // Append to the appropriate grid based on the source
        switch (card.source) {
            case 'supply':
                cardGrid.appendChild(imgElement);
                break;
            case 'non_supply':
                nonSupplyCardGrid.appendChild(imgElement);
                break;
            case 'misc':
                miscCardGrid.appendChild(imgElement);
                break;
            case 'mats':
                matsGrid.appendChild(imgElement);
                break;
            case 'prophecies':
                propheciesCardGrid.appendChild(imgElement);
                break;
            case 'rings':
                ringsCardGrid.appendChild(imgElement);
                break;
        }
    }

    // Filter cards based on the search query
    function filterCards(query) {
        // Clear all grids
        cardGrid.innerHTML = '';
        nonSupplyCardGrid.innerHTML = '';
        artifactsCardGrid.innerHTML = '';
        matsGrid.innerHTML = '';
        propheciesCardGrid.innerHTML = '';
        ringsCardGrid.innerHTML = '';

        // Filter matching cards
        const filteredCards = allCards.filter(card => 
            card.name.toLowerCase().includes(query.toLowerCase())
        );

// Sort filtered cards
filteredCards.sort((a, b) => {
    const costA = a.cost || 0; // Default to 0 if cost is undefined
    const costB = b.cost || 0; 
    if (costA !== costB) return costA - costB; // First sort by cost
    return a.name.localeCompare(b.name); // Then sort by ref (name)
});

        // Display sorted cards
        filteredCards.forEach(card => createCardElement(card));
    }

    // Load cards from a JSON file
    loadCards('../cards.json');

    // Toggle grid visibility on header click
    document.querySelectorAll('.grid-header').forEach(header => {
        header.addEventListener('click', () => {
            const grid = header.nextElementSibling;
            grid.style.display = (grid.style.display === 'none' || grid.style.display === '') ? 'grid' : 'none';
        });
    });

    // Close the overlay when clicking the enlarged image
    enlargedCard.addEventListener('click', () => {
        overlay.style.display = 'none'; 
    });

    // Remove card from the grid
    removeButton.addEventListener('click', () => {
        if (currentCard) {
            currentCard.remove(); 
            overlay.style.display = 'none'; 
            currentCard = null; 
        }
    });

    // Filter cards using the search bar
    searchBar.addEventListener('input', (event) => {
        const query = event.target.value; 
        filterCards(query); 
    });
});

