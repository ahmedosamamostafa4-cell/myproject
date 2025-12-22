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
            size: doc.size,
            stock: doc.stock || 0, // Ensure 'stock' exists and defaults to 0
            img1: doc.img1,
            img2: doc.img2,
            img3: doc.img3,
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

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.img || 'path/to/placeholder.jpg'}">
                </div>
                <div class="product-details">
                    <div class="gender"><h3 class="product-name">${product.gender}</h3></div>
                    <div class="size-and-name">
                        <h3 class="product-name">${product.size}" ${productName}</h3>
                    </div>
                    <p class="product-brand">${product.brand}</p>
                    <p class="product-spec">
                        <span class="product-price">L.E ${(product.price || 0).toFixed(2)}</span>
                    </p>

                    <div class="price-and-actions">
                        <button 
                            class="view-product-btn" 
                            data-product-id="${product.id}" 
                            onclick="openProductDetail('${product.id}')"
                            ${buttonDisabled}
                        >
                            ${buttonText} 
                        </button>
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



async function filterProducts() {
    // 1. Hole alle Checkboxen
    const checkboxes = document.querySelectorAll('.filter-checkbox:checked');
    
    // 2. Wenn keine Filter aktiv sind, zeige alle Produkte (nach dem Mischen)
    if (checkboxes.length === 0) {
        // Randomly shuffle products for a "New/Random Products" feel
        const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
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

