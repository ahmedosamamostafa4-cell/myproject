// --- INVENTORY & FILTERING LOGIC ---
let products = [];

async function fetchProductsFromSupabase() {
    // This checks if 'supabase' object is initialized from index.html
    if (typeof supabaseClient === 'undefined') {
        console.error("Supabase client not initialized. Check index.html configuration.");
        renderProducts([]); 
        return;
    }
    
    try {
        // Use the Supabase client to select all data from the 'products' table
        const { data, error } = await supabaseClient
            .from('products')
            .select('*'); // Select all columns

        if (error) {
            throw error;
        }

        // Map data: Supabase 'id' is mapped to both 'supabaseId' and local 'id'
        products = data.map(doc => ({
            id: doc.id,         
            name: doc.name, 
            price: doc.price,
            brand: doc.brand,
            gender: doc.gender,
            condition: doc.condition,
            category: doc.category,
            img: doc.img,
            stock: doc.stock || 0 // Ensure 'stock' exists and defaults to 0
        }));

        // After successfully fetching, call the function to display products
        filterProducts(); 

    } catch (error) {
        console.error("Error fetching documents from Supabase: ", error);
        if (typeof alertMessage !== 'undefined') {
            alertMessage("Error loading inventory. Check your Supabase configuration and table.", 'error');
        }
        renderProducts([]); 
    }
}
// NOTE: The rest of the functions in this file (changeQuantity, renderProducts, filterProducts) 
// should remain the same.

function renderProducts(productsToDisplay) {
    const resultsContainer = document.getElementById('product-results');
    const stockMessage = document.getElementById('stock-message');
    // currentLang and translations are assumed to be defined/loaded from translations.js
    const t = translations[currentLang]; 

    resultsContainer.innerHTML = ''; 

    if (productsToDisplay.length === 0) {
        stockMessage.textContent = t["no-stock"]; 
        stockMessage.style.display = 'block';
        return;
    }

    stockMessage.style.display = 'none';

    productsToDisplay.forEach(products => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Translate product meta-data (requires currentLang and translations from translations.js)
        const conditionText = t[products.condition.toLowerCase() + "-shoes"] || products.condition;
        const genderText = t[products.gender.toLowerCase() + "-filter"] || products.gender;

        // Use the Product Card HTML structure here (ProductCard.html content conceptually)
        card.innerHTML = `
            <img src="${products.img}" alt="${products.name}" onerror="this.onerror=null;this.src='https://placehold.co/400x300/ccc/333?text=Shoe+Image';">
            <div class="product-details">
                <h4>${products.name}</h4>
                <p class="meta-data">${products.brand} | ${conditionText} (${genderText})</p>
                <p class="price">${products.price.toFixed(2)} L.E</p>
            </div>
            <!-- Quantity Selector and Add to Cart Button INSERTED HERE -->
            <div class="flex items-center justify-between mt-3 gap-2">
                <!-- Quantity Selector -->
                <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onclick="changeQuantity(${products.id}, -1)" class="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition-colors" type="button" aria-label="Decrease quantity">-</button>
                    <!-- Input field styling ensures it looks clean within the buttons -->
                    <input type="number" 
                           id="qty-${products.id}" 
                           value="0" 
                           min="1" 
                           max="${products.stock}"
                           class="w-12 h-8 text-center border-none focus:ring-0 p-0 text-sm text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                    <button onclick="changeQuantity(${products.id}, 1)" class="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition-colors" type="button" aria-label="Increase quantity">+</button>
                </div>

                <!-- Add to Cart Button (stages the order) -->
                <button onclick="handleAddToCart(${products.id})" class="flex-1 py-2 bg-[--primary-color] text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition duration-150 transform hover:scale-[1.02] flex items-center justify-center gap-2">
                    <i class="fas fa-cart-plus"></i>
                    <span data-translate="add-to-cart">Add to Cart</span>
                </button>
            </div>
            
        `;
        resultsContainer.appendChild(card);
    });
}


function filterProducts() {
    const checkboxes = Array.from(document.querySelectorAll('.filter-checkbox:checked'));
    
    if (checkboxes.length === 0) {
        // Shuffle and render all products if no filters are active
        const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
        renderProducts(shuffledProducts);
        return;
    }

    const activeFilters = { brand: [], gender: [], condition: [], category: [] }; 
    checkboxes.forEach(checkbox => activeFilters[checkbox.name].push(checkbox.value));

    const filteredProducts = products.filter(product => {
        const brandMatch = activeFilters.brand.length === 0 || activeFilters.brand.includes(products.brand);
        const genderMatch = activeFilters.gender.length === 0 || activeFilters.gender.includes(products.gender);
        const conditionMatch = activeFilters.condition.length === 0 || activeFilters.condition.includes(products.condition);
        const categoryMatch = activeFilters.category.length === 0 || activeFilters.category.includes(products.category); 

        return brandMatch && genderMatch && conditionMatch && categoryMatch;
    });
    
    renderProducts(filteredProducts);

        const countHeader = document.getElementById('products-count-header');
    if (countHeader) {
        const translationKey = activeFilters.brand.length > 0 || activeFilters.gender.length > 0 || activeFilters.condition.length > 0 || activeFilters.category.length > 0 
            ? 'products-count-header-filtered' : 'products-count-header';
        
        // Update translation text
        const t = translations[currentLang];
        const baseText = t[translationKey] || "Showing Products";
        countHeader.textContent = `${baseText} (${filteredProducts.length})`;
            }
}
