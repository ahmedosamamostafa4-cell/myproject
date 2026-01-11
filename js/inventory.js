// --- INVENTORY & FILTERING LOGIC ---
let products = [];


// Add this to inventory.js
// Inside your main init function or at the bottom of fetchProductsFromSupabase
async function initApp() {
    await fetchProductsFromSupabase(); // Load initial data
    setupRealtimeSubscription();       // Start listening for live changes
}

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
            console.error("Error fetching products:", error);
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
            size: doc.size,
            stock: doc.stock || 0, // Ensure 'stock' exists and defaults to 0
            img1: doc.img1,
            img2: doc.img2,
            img3: doc.img3,
        }));
        generateDynamicFilters();
        generateBrandFilters();
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


function generateDynamicFilters() {
    const sizeContainer = document.getElementById('dynamic-size-filters');
    if (sizeContainer && sizeContainer.children.length > 0) {
        return; 
    }
    // Safety check: If the element is missing, log a warning and stop
    if (!sizeContainer) {
        console.warn("Could not find 'dynamic-size-filters' element in HTML.");
        return; 
    }

    // Extract unique sizes from the products array
    const uniqueSizes = [...new Set(products.map(p => p.size))]
        .filter(size => size != null && size !== "")
        .sort((a, b) => a - b);

    sizeContainer.innerHTML = ''; // Clear old content

    uniqueSizes.forEach(size => {
        const div = document.createElement('div');
        div.className = 'filter-option';
        div.innerHTML = `
            <input type="checkbox" class="filter-checkbox" id="filter-size-${size}" 
                   name="size" value="${size}" onchange="filterProducts()">
            <label for="filter-size-${size}">${size}</label>
        `;
        sizeContainer.appendChild(div);
    });
}


function generateBrandFilters() {
    
    const brandContainer = document.getElementById('dynamic-brand-filters');
    if (brandContainer && brandContainer.children.length > 0) {
        return; 
    }
    // Safety check to prevent "innerHTML of null" errors
    if (!brandContainer) return; 

    // 1. Get unique brands from the products array
    const uniqueBrands = [...new Set(products.map(p => p.brand))]
        .filter(brand => brand != null && brand !== "")
        .sort(); // Sorts them A-Z

    // 2. Clear the container
    brandContainer.innerHTML = '';

    // 3. Create a checkbox for each unique brand found
    uniqueBrands.forEach(brand => {
        const div = document.createElement('div');
        div.className = 'filter-option';
        div.innerHTML = `
            <input type="checkbox" 
                   class="filter-checkbox" 
                   id="filter-brand-${brand}" 
                   name="brand" 
                   value="${brand}" 
                   onchange="filterProducts()">
            <label for="filter-brand-${brand}">${brand}</label>
        `;
        brandContainer.appendChild(div);
    });
}
/**
 * Renders the products onto the main display area (#product-results).
 * (Updated to organize info and use a 'View Product' button)
 * @param {Array<Object>} productsToDisplay - The array of product objects to render.
 */
function renderProducts(productsToDisplay) {
    const resultsContainer = document.getElementById('product-results');
    if (!resultsContainer) {
        console.error("Product results container (#product-results) not found. Check your HTML.");
        return;
    }

    resultsContainer.innerHTML = '';

    if (productsToDisplay.length === 0) {
        const noResultsMessage = `<p class="no-results-message">${(translations[currentLang] && translations[currentLang]['no-products-found']) || 'No products found matching your criteria.'}</p>`;
        resultsContainer.innerHTML = noResultsMessage;
        return;
    }

    // ... (rest of the file remains the same)

    const productsHtml = productsToDisplay.map(product => {
        const stockCount = product.stock || 0; 
        const outOfStock = stockCount <= 0;
        const t = (key) => (translations[currentLang] && translations[currentLang][key]) || key;
        const buttonText = outOfStock ? t('no-stock') : t('VIEW >'); 
        const buttonDisabled = outOfStock ? 'disabled' : '';
        const productName = product.name || 'Untitled Product';

        const hasDiscount = product.category === 'Offers'; // Logic for identifying offers
        const originalPrice = product.original_price || (product.price * 1.2).toFixed(2); // Example fallback
        const isOffer = product.category === 'Offers';
        // Reusing the EXACT classes from your inventory.js
// Inside renderProducts function in ui-logic.js
return `
            <div class="product-card" ${product.stock <= 0 ? 'sold-out-card' : ''}" data-product-id="${product.id}">
                <div class="product-image-container">
                    ${isOffer ? `<span class="discount-badge">OFFER</span>` : ''}
                    ${product.stock <= 0 ? `<div class="sold-out-stamp">Sold Out</div>` : ''}
                    <img src="${product.img || 'path/to/placeholder.jpg'}">
                </div>
                <div class="product-details">
                    <div class="gender"><h3 class="product-name">${product.gender}</h3></div>
                    <div class="size-and-name">
                        <h3 class="product-name">${product.size}" ${product.name}</h3>
                    </div>
                    <p class="product-brand">${product.brand}</p>
                    
                    <div class="price-box">
                        ${isOffer ? `
                            <div class="original-price">${(product.price * 1.15).toFixed(2)}L.E</div>
                            <div class="discounted-price">${(product.price || 0).toFixed(2)}L.E</div>
                        ` : `
                            <div class="product-price">${(product.price || 0).toFixed(2)}L.E</div>
                        `}
                    </div>

                    <div class="price-and-actions">
                    ${product.stock <= 0 ? 
                    `<button class="disabled-btn" disabled>
                    ${t('OUT OF STOCK')}
                    </button>` : 
                    `<button class="view-product-btn" onclick="openProductDetail('${product.id}')">
                            ${t('VIEW >')} 
                        </button>`
                    }
                    </div>
                </div>
            </div>
        `;
    }).join('');

    resultsContainer.innerHTML = productsHtml;
    
    // Re-attach listeners (assuming this function is in main.js)
    if (typeof attachProductListeners === 'function') {
        attachProductListeners();
    }
}

function setupRealtimeSubscription() {
    supabaseClient
        .channel('schema-db-changes')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE', // Listen specifically for stock/price updates
                schema: 'public',
                table: 'products'
            },
(payload) => {
    // 1. SILENTLY update the local data array
    const index = products.findIndex(p => p.id === payload.new.id);
    if (index !== -1) {
        products[index] = { ...products[index], ...payload.new };
    }

    // 2. VISUALLY update only the specific card if it exists
    const card = document.querySelector(`.product-card[data-product-id="${payload.new.id}"]`);
    
    if (card) {
        // If stock is now 0, add the Sold Out effects
        if (payload.new.stock <= 0) {
            const imgContainer = card.querySelector('.product-image-container');
            
            // Only add if not already there to prevent duplicates
            if (imgContainer && !imgContainer.querySelector('.sold-out-stamp')) {
                imgContainer.insertAdjacentHTML('beforeend', '<div class="sold-out-stamp">SOLD OUT</div>');
                imgContainer.querySelector('img')?.classList.add('sold-out-img');
                
                const btn = card.querySelector('.view-product-btn');
                if (btn) {
                    btn.outerHTML = `<button class="disabled-btn" disabled>OUT OF STOCK</button>`;
                }
            }
        } else {
            // OPTIONAL: If stock was added back, remove sold-out effects
            card.querySelector('.sold-out-stamp')?.remove();
            card.querySelector('img')?.classList.remove('sold-out-img');
        }
    }
    
    // CRITICAL: Ensure you ARE NOT calling generateBrandFilters() 
    // or filterProducts() here. That is what resets your checkboxes.
}
        )
        .subscribe();
}


async function filterProducts() {
    // 1. Hole alle Checkboxen
    const checkboxes = document.querySelectorAll('.filter-checkbox:checked');
    
    // 2. Wenn keine Filter aktiv sind, zeige alle Produkte (nach dem Mischen)
    if (checkboxes.length === 0) {
        // Randomly shuffle products for a "New/Random Products" feel
        const shuffledProducts = [...products].sort((a, b) => a.id - b.id);
        renderProducts(shuffledProducts);
        // Stelle sicher, dass der Zähler aktualisiert wird
        const countHeader = document.getElementById('products-count-header');
        if (countHeader) {
            // Dies ist der Fall ohne Filter. Wir zeigen alle Produkte an.
            countHeader.textContent = `${translations[currentLang]['products-count-header'].replace('(0)', '')} (${products.length})`;
        }
        return;
    }

    // 3. Fülle das Objekt mit allen aktiven Filterwerten
    const activeFilters = { brand: [], gender: [], size: [], category: [] }; 
    checkboxes.forEach(checkbox => activeFilters[checkbox.name].push(checkbox.value));

    // 4. Filtere das Hauptprodukt-Array
    const filteredProducts = products.filter(product => {
        
        // KORREKTUR DER FILTER-LOGIK: Prüfe, ob die Eigenschaft des E-I-N-Z-E-L-N-E-N Produkts
        // in der Liste der ausgewählten Filter enthalten ist.
        
        // Brand Match: Prüft, ob product.brand in der Liste der aktiven Marken ist
        const brandMatch = activeFilters.brand.length === 0 || activeFilters.brand.includes(product.brand);
        
        // Gender Match: Prüft, ob product.gender in der Liste der aktiven Geschlechter ist
        const genderMatch = activeFilters.gender.length === 0 || activeFilters.gender.includes(product.gender);
        
        // size Match: Prüft, ob product.size in der Liste der aktiven Zustände ist
        const sizeMatch = activeFilters.size.length === 0 || activeFilters.size.includes(product.size);
        
        // Category Match: Prüft, ob product.category in der Liste der aktiven Kategorien ist
        const categoryMatch = activeFilters.category.length === 0 || activeFilters.category.includes(product.category); 

        // Das Produkt muss ALLE aktiven Filter erfüllen (AND-Logik)
        return brandMatch && genderMatch && sizeMatch && categoryMatch;
    });
    
    // 5. Zeige die gefilterten Produkte an
    renderProducts(filteredProducts);

    // 6. Aktualisiere den Zähler-Header
    const countHeader = document.getElementById('products-count-header');
    if (countHeader) {
        // Wir verwenden den gefilterten Header-Text, da Filter aktiv sind
        const translationKey = 'products-count-header-filtered'; 
        
        const t = translations[currentLang];
        const baseText = t[translationKey] || "Showing Filtered Products";
        countHeader.textContent = `${baseText} (${filteredProducts.length})`;
    }
}

