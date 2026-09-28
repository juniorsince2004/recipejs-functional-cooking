const RecipeApp = (() => {

const recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        time: 25,
        difficulty: "easy",
        description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
        category: "pasta",
        // NEW: Add ingredients array
        ingredients: [
            "400g spaghetti",
            "200g pancetta or guanciale",
            "4 large eggs",
            "100g Pecorino Romano cheese",
            "Black pepper",
            "Salt"
        ],
        // NEW: Add steps array (can include nested steps)
        steps: [
            "Bring a large pot of salted water to boil",
            "Cook spaghetti according to package directions",
            {
                text: "Prepare the sauce",
                substeps: [
                    "Beat eggs in a bowl",
                    "Grate cheese and add to eggs",
                    "Add generous black pepper",
                    "Mix well"
                ]
            },
            "Cook pancetta in a large pan until crispy",
            "Drain pasta, reserve 1 cup pasta water",
            "Add hot pasta to pancetta pan (off heat)",
            "Quickly mix in egg mixture, adding pasta water to create creamy sauce",
            "Serve immediately with extra cheese"
        ]
    },
    {
        id: 2,
        title: "Chicken Tikka Masala",
        time: 45,
        difficulty: "medium",
        description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
        category: "curry",
        ingredients: ["Chicken", "Yogurt", "Tomato puree", "Cream", "Garlic", "Spices"],
        steps: [
            "Marinate chicken in yogurt and spices for at least 1 hour",
            "Grill or pan-fry chicken until cooked through",
            {
                text: "Make the sauce",
                substeps: [
                    "Heat oil in a large pan",
                    "Add garlic and sauté until fragrant",
                    "Add tomato puree and spices",
                    "Simmer for 10 minutes",
                    "Stir in cream and cook until thickened"
                ]
            },
            "Add cooked chicken to sauce and simmer for 5 minutes",
            "Serve with rice or naan bread"
        ]
    },
     {
        id: 3,
        title: "Homemade Croissants",
        time: 180,
        difficulty: "hard",
        description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
        category: "baking",
        ingredients: ["Flour", "Butter", "Yeast", "Milk", "Sugar"],
        steps: [
            "Mix flour, yeast, sugar, and salt in a bowl",
            "Gradually add milk and knead into a dough",
            "Let dough rise until doubled in size",
            {
                text: "Laminate the dough",
                substeps: [
                    "Roll out dough into a rectangle",
                    "Place cold butter in the center and fold dough over it",
                    "Roll out again and fold into thirds",
                    "Repeat rolling and folding process 3-4 times"
                ]
            },  
            "Cut dough into triangles and shape into croissants",
            "Let croissants rise until puffy",
            "Bake at 200°C (400°F) for 15-20 minutes until golden brown"
        ]
    },
    {
        id: 4,
        title: "Greek Salad",
        time: 15,
        difficulty: "easy",
        description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
        category: "salad",
        ingredients: ["Cucumber", "Tomato", "Feta", "Olives"],
        steps: [
            "Chop vegetables into bite-sized pieces",
            "Combine vegetables in a large bowl",
            "Add crumbled feta cheese and olives",
            "Toss with olive oil and herbs"
        ]
    },
    {
        id: 5,
        title: "Beef Wellington",
        time: 120,
        difficulty: "hard",
        description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
        category: "meat",
        ingredients: ["Beef", "Mushrooms", "Prosciutto", "Puff pastry"],
        steps: [
            "Sear beef fillet on all sides and let cool",
            "Make mushroom duxelles by finely chopping mushrooms and cooking until dry",
        ]
    },
    {
        id: 6,
        title: "Vegetable Stir-Fry",
        time: 30,
        difficulty: "easy",
        description: "A nutritious bowl filled with roasted vegetables, grains, and a tahini dressing.",
        category: "salad",
        ingredients: ["Broccoli", "Carrots", "Soy sauce", "Ginger"],
        steps: [
            "Chop vegetables into bite-sized pieces",
            "Heat oil in a wok or large pan",
            "Add vegetables and stir-fry until tender",
            "Add soy sauce and ginger, and cook for another minute"
        ]
    },
    {
        id: 7,
        title: "Pad Thai",
        time: 30,
        difficulty: "medium",
        description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
        category: "noodles",
        ingredients: ["Noodles", "Shrimp", "Peanuts", "Tamarind", "Egg"],
        steps: [
            "Cook rice noodles according to package instructions",
            "Heat oil in a wok or large pan",
            "Add shrimp and cook until pink",
            "Add vegetables and stir-fry until tender",
            "Add tamarind sauce and egg, and cook for another minute"
        ]
    },
    {
        id: 8,
        title: "Margherita Pizza",
        time: 60,
        difficulty: "medium",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
        category: "pizza",
        ingredients: ["Dough", "Tomatoes", "Mozzarella", "Basil"],
        steps: [
            "Prepare pizza dough and let it rise",
            "Roll out dough into a circle",
            "Spread tomato sauce evenly over the dough",
            "Add torn mozzarella pieces and fresh basil leaves",
            "Bake at 220°C (425°F) for 12-15 minutes until crust is golden"
        ]
    },
];
// STATE MANAGEMENT
// Track current filter and sort settings
let currentFilter = 'all';
let currentSort = 'none';

// NEW:part-4.
let searchQuery = '';
let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
let debounceTimer;

const recipeContainer = document.querySelector('#recipe-container');
console.log(recipeContainer);

// NEW: Select all filter and sort buttons
const filterButtons = document.querySelectorAll('.filter-btn');
const sortButtons = document.querySelectorAll('.sort-btn');

// NEW:part-4.
const searchInput = document.querySelector('#search-input');
const clearSearchBtn = document.querySelector('#clear-search');
const recipeCountDisplay = document.querySelector('#recipe-count');

// Recursive function to render steps (handles nesting)
const renderSteps = (steps, level = 0) => {
    const listClass = level === 0 ? 'steps-list' : 'substeps-list';
    let html = `<ol class="${listClass}">`;

    steps.forEach(step => {
        if (typeof step === 'string') {
            html += `<li>${step}</li>`;
        } else if (step && typeof step === 'object') {
            html += `<li>${step.text}`;

            if (step.substeps && step.substeps.length > 0) {
                html += renderSteps(step.substeps, level + 1);
            }

            html += `</li>`;
        }
    });

    html += `</ol>`;
    return html;
};

// Create complete steps HTML for a recipe
const createStepsHTML = (steps) => {
    if (!steps || steps.length === 0) {
        return '<p>No steps available</p>';
    }

    return renderSteps(steps);
};

// Function to create HTML for a single recipe card
const createRecipeCard = (recipe) => {
    const isFavorited = favorites.includes(recipe.id);
    const heartIcon = isFavorited ? '❤️' : '🤍';

    return `
        <div class="recipe-card" data-id="${recipe.id}">
    <!-- NEW:part-4. Favorite Button -->
            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-recipe-id="${recipe.id}">
                ${heartIcon}
            </button>

            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
            </div>
            <p>${recipe.description}</p>

            <div class="card-actions">
                <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="steps">
                    📋 Show Steps
                </button>
                <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="ingredients">
                    🥗 Show Ingredients
                </button>
            </div>

            <div class="ingredients-container" data-recipe-id="${recipe.id}">
                <h4>Ingredients:</h4>
                <ul>
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>

            <div class="steps-container" data-recipe-id="${recipe.id}">
                <h4>Cooking Steps:</h4>
                ${createStepsHTML(recipe.steps)}
            </div>
        </div>
    `;
};
console.log(createRecipeCard(recipes[0]));

// PURE FILTER FUNCTIONS
// These functions don't modify the original array
// They return a NEW filtered array

// Filter recipes by difficulty level
const filterByDifficulty = (recipes, difficulty) => {
    return recipes.filter(recipe => recipe.difficulty === difficulty);
};

// Filter recipes by maximum cooking time
const filterByTime = (recipes, maxTime) => {
    return recipes.filter(recipe => recipe.time <= maxTime);
};

// Apply the current filter
const applyFilter = (recipes, filterType) => {
    switch(filterType) {
        case 'easy':
            return filterByDifficulty(recipes, 'easy');
        case 'medium':
            return filterByDifficulty(recipes, 'medium');
        case 'hard':
            return filterByDifficulty(recipes, 'hard');
        case 'quick':
            return filterByTime(recipes, 30);
        // NEW:part-4. Add favorites case
        case 'favorites':
            return filterFavorites(recipes);
        case 'all':
        default:
            return recipes;
    }
};

// NEW:part-4. Search filter
const filterBySearch = (recipes, query) => {
    if (!query || query.trim() === '') {
        return recipes;
    }

    const lowerQuery = query.toLowerCase().trim();

    return recipes.filter(recipe => {
        const titleMatch = recipe.title.toLowerCase().includes(lowerQuery);
        const ingredientMatch = recipe.ingredients.some(ingredient =>
            ingredient.toLowerCase().includes(lowerQuery)
        );
        const descriptionMatch = recipe.description.toLowerCase().includes(lowerQuery);

        return titleMatch || ingredientMatch || descriptionMatch;
    });
};

// NEW:part-4. Favorites filter
const filterFavorites = (recipes) => {
    return recipes.filter(recipe => favorites.includes(recipe.id));
};  

console.log('Easy recipes:', filterByDifficulty(recipes, 'easy'));
console.log('Quick recipes:', filterByTime(recipes, 30));

// PURE SORT FUNCTIONS
// sort() mutates the original array, so we create a copy first

// Sort recipes by name (A-Z)
const sortByName = (recipes) => {
    return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
};

// Sort recipes by cooking time (fastest first)
const sortByTime = (recipes) => {
    return [...recipes].sort((a, b) => a.time - b.time);
};

// Apply the current sort
const applySort = (recipes, sortType) => {
    switch(sortType) {
        case 'name':
            return sortByName(recipes);
        case 'time':
            return sortByTime(recipes);
        case 'none':
        default:
            return recipes;
    }
};

const updateRecipeCount = (count) => {
    if (!recipeCountDisplay) {
        return;
    }

    recipeCountDisplay.textContent = `Showing ${count} of ${recipes.length} recipes`;
};

// MAIN UPDATE FUNCTION
// This function combines filter + sort + render
const updateDisplay = () => {
    let recipesToDisplay = [...recipes];

    // NEW:part-4: Apply search.
    recipesToDisplay = filterBySearch(recipesToDisplay, searchQuery);
    recipesToDisplay = applyFilter(recipesToDisplay, currentFilter);
    recipesToDisplay = applySort(recipesToDisplay, currentSort);

    // NEW:part-4, Update counter
    updateRecipeCounter(recipesToDisplay.length, recipes.length);
    
    renderRecipes(recipesToDisplay);
    updateRecipeCount(recipesToDisplay.length);

    // Render
    renderRecipes(recipesToDisplay);
    updateActiveButtons();
    console.log(`Displaying ${recipesToDisplay.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort}, Search: "${searchQuery}")`);
};

// UI HELPER FUNCTIONS
// Update which button looks "active"
const updateActiveButtons = () => {
    filterButtons.forEach(btn => {
        const filterType = btn.dataset.filter;
        if (filterType === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    sortButtons.forEach(btn => {
        const sortType = btn.dataset.sort;
        if (sortType === currentSort) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

// NEW:part-4. Update recipe counter
const updateRecipeCounter = (showing, total) => {
    if (recipeCountDisplay) {
        recipeCountDisplay.textContent = `Showing ${showing} of ${total} recipes`;
    }
};
// ============================================
// FAVORITES MANAGEMENT
// ============================================

// Save favorites to localStorage
const saveFavorites = () => {
    localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
};

const toggleFavorite = (recipeId) => {
    const id = Number(recipeId);

    if (favorites.includes(id)) {
        favorites = favorites.filter(favoriteId => favoriteId !== id);
    } else {
        favorites = [...favorites, id];
    }
    
    saveFavorites();
    updateDisplay();
};

// EVENT HANDLERS
// Handle toggle button clicks using event delegation
const handleCardClick = (event) => {
    const toggleButton = event.target.closest('.toggle-btn');
    if (!toggleButton) {
        return;
    }

    const recipeId = toggleButton.dataset.recipeId;
    const toggleType = toggleButton.dataset.toggle;
    const containerClass = toggleType === 'steps' ? 'steps-container' : 'ingredients-container';
    const container = document.querySelector(`.${containerClass}[data-recipe-id="${recipeId}"]`);

    if (container) {
        container.classList.toggle('visible');

        const isVisible = container.classList.contains('visible');
        if (toggleType === 'steps') {
            toggleButton.textContent = isVisible ? '📋 Hide Steps' : '📋 Show Steps';
        } else {
            toggleButton.textContent = isVisible ? '🥗 Hide Ingredients' : '🥗 Show Ingredients';
        }
    }
};
// Handle filter button clicks
const handleFilterClick = (event) => {
    const filterType = event.target.dataset.filter;
    currentFilter = filterType;
    updateActiveButtons();
    updateDisplay();
};

// Handle sort button clicks
const handleSortClick = (event) => {
    const sortType = event.target.dataset.sort;
    currentSort = sortType;
    updateActiveButtons();
    updateDisplay();
};

// NEW:part-4. Search input handler
const handleSearchInput = (event) => {
    const query = event.target.value;
    
    // Show/hide clear button
    if (clearSearchBtn) {
        clearSearchBtn.style.display = query.trim() ? 'block' : 'none';
    }
    
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchQuery = query;
        updateDisplay();
    }, 300);
};
// NEW:part-4. Clear search handler
const handleClearSearch = () => {
    clearTimeout(debounceTimer);
    searchQuery = '';
    if (searchInput) {
        searchInput.value = '';
    }
    if (clearSearchBtn) {
        clearSearchBtn.style.display = 'none';
    }
    updateDisplay();
};
// NEW:part-4. Favorite button handler (event delegation)
const handleFavoriteClick = (event) => {
    const favoriteButton = event.target.closest('.favorite-btn');
    if (!favoriteButton) {
        return;
    }

    toggleFavorite(favoriteButton.dataset.recipeId);
};
// EVENT LISTENER SETUP
const setupEventListeners = () => {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    sortButtons.forEach(btn => {
        btn.addEventListener('click', handleSortClick);
    });
    recipeContainer.addEventListener('click', handleCardClick);
  
    // NEW:part-4.
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', handleClearSearch);
    }
    
    recipeContainer.addEventListener('click', handleFavoriteClick);
    
    console.log('Event listeners attached!');
};

// Function to render recipes to the DOM
const renderRecipes = (recipesToRender) => {
    const recipeCardsHTML = recipesToRender.map(createRecipeCard);
    const allCardsHTML = recipeCardsHTML.join('');
    recipeContainer.innerHTML = allCardsHTML;
};
// INITIALIZATION
// Set up event listeners on page load
const init = () => {
    console.log('RecipeApp initializing...');
    setupEventListeners();
    if (clearSearchBtn) {
        clearSearchBtn.style.display = 'none';
    }
    updateDisplay();
    console.log('RecipeApp ready!');
    console.log(`📊 ${recipes.length} recipes loaded`);
    console.log(`❤️  ${favorites.length} favorites saved`);
};

// PUBLIC API - What's accessible from outside
return {
    init: init,
    updateDisplay: updateDisplay
};

})();

// START THE APP
RecipeApp.init();
