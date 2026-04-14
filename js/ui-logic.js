// --- 1. MENU TOGGLE LOGIC ---
function toggleOffCanvasMenu() {
    document.body.classList.toggle('menu-active');
}

// --- 2. SLIDER LOGIC (FIXED FOR RTL) ---
const sliderStrip = document.getElementById('slider-strip');
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function moveSlider() {
    if (!sliderStrip || slides.length === 0) return;

    // The logic is perfect: loops 0 -> 1 -> 0
    currentSlide = (currentSlide + 1) % slides.length;
    
    // 1. Calculate the magnitude of the shift (e.g., 100, 200, 300)
    const magnitude = currentSlide * 100;
    
    // 2. Check the current document direction
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    let offset;

    if (isRTL) {
        // If Arabic (RTL), POSITIVE offset moves the strip to the right.
        offset = magnitude;
    } else {
        // If English (LTR), NEGATIVE offset moves the strip to the left.
        offset = magnitude * -1;
    }

    // Apply the transformation
    // If currentSlide is 0, offset is 0.
    // If currentSlide is 1, offset is -100 (LTR) or 100 (RTL).
    sliderStrip.style.transform = `translateX(${offset}vw)`; 
}

// This line ensures the slider starts moving automatically (assuming 3000ms interval)
// ENSURE THIS IS PRESENT AT THE END OF THE SLIDER SECTION IN ui-logic.js
setInterval(moveSlider, 3000);

// --- 3. FIXED HEADER SCROLL LOGIC ---
const floatingHeader = document.getElementById('floating-header');
const oilColorBar = document.getElementById('oil-color-bar');
const heroSection = document.getElementById('hero-section');

let scrollThreshold = 0;

window.addEventListener('load', () => {
     // Calculate the threshold (the height of the oil bar)
     const oilBarHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--oil-bar-height'));
     if (!isNaN(oilBarHeight)) {
         scrollThreshold = oilBarHeight;
     }
});

// --- FIX APPLIED HERE ---
window.addEventListener('scroll', () => {
    if (!floatingHeader || !oilColorBar || !heroSection) return; // Safety check

    if (window.scrollY > scrollThreshold) {
        // HIDE the oil bar
        oilColorBar.classList.add('hidden');
        // MOVE the main header to the top 
        floatingHeader.classList.add('lowered');
        // Adjust the margin top of the main content so there's no sudden jump
        heroSection.style.marginTop = `var(--main-header-height)`;

    } else {
        // SHOW the oil bar
        oilColorBar.classList.remove('hidden');
        // RESET the main header position
        floatingHeader.classList.remove('lowered');
        // Reset the margin top of the main content
        heroSection.style.marginTop = `var(--header-stack-height)`;
    }
}, { passive: true }); // <-- THIS IS THE CRITICAL ADDITION

/*-------------------------------------Sided Menu------------------------------------------*/
/*------------------------------NEW&FEATURED and SALES-------------------------------------*/

/**
 * Closes the menu, selects the 'New Arrivals' filter, and scrolls to the products.
 */
function handleNewFeaturedClick() {
    
    // 0. Unselect All Filter Options
    unselectAllFilters();
    
    // 1. Close the off-canvas menu
    toggleOffCanvasMenu(); 
    
    // 2. Select the 'New Arrivals' filter checkbox
    const newArrivalsCheckbox = document.getElementById('filter-new-arrivals');
    if (newArrivalsCheckbox) {
        newArrivalsCheckbox.checked = true;
        // The filterProducts() function is usually attached to the onchange/onclick 
        // event of the checkbox, but we call it explicitly here for certainty.
        if (typeof filterProducts === 'function') {
            filterProducts(); 
        }
    }
    
    // 3. Scroll down to the product display area
    scrollToProductArea();
}

/**
 * Closes the menu, selects the 'Offers' filter, and scrolls to the products.
 */
function handleSalesClick() {

    // 0. Unselect All Filter Options
    unselectAllFilters();

    // 1. Close the off-canvas menu
    toggleOffCanvasMenu(); 
    
    // 2. Select the 'Offers' filter checkbox
    const offersCheckbox = document.getElementById('filter-offers');
    if (offersCheckbox) {
        offersCheckbox.checked = true;
        if (typeof filterProducts === 'function') {
            filterProducts(); 
        }
    }

    // 3. Scroll down to the product display area
    scrollToProductArea();
}

/**
 * Utility function to scroll smoothly to the product area.
 * It ONLY scrolls if the user is near the top of the page.
 */
function scrollToProductArea() {
    const productArea = document.getElementById('product-display-area');
    
    // We assume the main content/header height is roughly 100 pixels.
    // If the user has scrolled past this threshold (window.scrollY > 100), 
    // it means they are already viewing the product area, so we stop scrolling.
    const scrollThreshold = 100; 

    if (productArea && window.scrollY < scrollThreshold) {
        // If the user is near the top, scroll them down to the product area.
        // Use 'start' to ensure the product list is at the top of the screen on the initial scroll.
        productArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } 
    // If window.scrollY is 100 or greater, the function does nothing.
}

/**
 * Utility function to unselect all product filter checkboxes.
 * It targets the shared class 'filter-checkbox' on all filter inputs.
 */
function unselectAllFilters() {
    // Select all elements with the class 'filter-checkbox'
    const allCheckboxes = document.querySelectorAll('.filter-checkbox');
    
    // Iterate over the list and uncheck each one
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}
/*---------------------------CONTACT ME---------------------------------*/
/**
 * Toggles the visibility of the contact modal.
 */
function toggleContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    if (modal.style.display === 'none') {
        // --- OPEN MODAL (Freeze Trigger) ---
        
        // 1. Close the off-canvas menu first
        if (document.body.classList.contains('menu-active')) {
            toggleOffCanvasMenu(); 
        }
        // 2. Show the modal
        modal.style.display = 'flex';
        // 3. Prevent background scrolling (Locks the screen)
        document.body.style.overflow = 'hidden'; // Ensure this line is exactly here
        
    } else {
        // --- CLOSE MODAL (Unfreeze Trigger) ---
        
        // 1. Hide the modal
        modal.style.display = 'none';
        // 2. Restore background scrolling (This UNLOCKS the screen)
        document.body.style.overflow = ''; // Ensure this line is exactly here
    }

}

/**
 * Opens the full-screen product detail view
 */
/**
 * Opens the full-screen product detail view
 */
function updateMainImage(src) {
    document.getElementById('detail-main-img').src = src;
    // Update active thumbnail styling
    document.querySelectorAll('.thumb').forEach(t => {
        t.classList.toggle('active', t.src === src);
    });
}

// This listens for the browser's Back and Forward buttons
window.addEventListener('popstate', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');

    if (productId) {
        renderProductPage(productId);
    } else {
        // If no product in URL, hide the product view and show the home page
        const detailView = document.getElementById('product-detail-view');
        if (detailView) detailView.classList.remove('active');
    }
});


/*------------------------------------------------------------------------------------------*/
// Update the "Add to Cart" Logic inside openProductDetail

function renderProductPage(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // 1. Tell the CSS to hide the home page
    document.body.classList.add('product-open');

    // 2. Show the product div
    const detailView = document.getElementById('product-detail-view');
    detailView.classList.add('active');
    
    // ... (Your existing code to fill in Name, Price, Image) ...
    
    window.scrollTo(0, 0);
}

function closeProductDetail() {
    // 1. Remove the product from the URL (updates history)
    window.history.pushState({}, '', window.location.pathname);

    // 2. Bring back the main site
    const hero = document.getElementById('hero-section');
    const shop = document.querySelector('.product-section');
    const footer = document.querySelector('footer');

    if(hero) hero.style.display = 'block';
    if(shop) shop.style.display = 'grid'; 
    if(footer) footer.style.display = 'block';

    // 3. Hide the detail view
    const detailView = document.getElementById('product-detail-view');
    if (detailView) {
        detailView.classList.remove('active');
    }

    // 4. Reset scroll and overflow
    document.body.style.overflow = '';
}

function openProductDetail(productId) {

    const overlay = document.querySelector('.product-detail-overlay');
    
    // This is the magic line that resets the scroll to the top
    overlay.scrollTop = 0; 
    
    overlay.classList.add('active');
    const product = products.find(p => p.id == productId);
    if (!product) return;

    // 1. Fill Text and Image Content
    document.getElementById('detail-main-img').src = product.img;
    document.getElementById('detail-name').innerText = product.name;
    document.getElementById('detail-brand').innerText = product.brand;
    document.getElementById('detail-price').innerText = product.price.toFixed(2);
    document.getElementById('detail-size-val').innerText = product.size;
    document.getElementById('detail-condition-val').innerText = product.condition || 'Original';


// 1. Update URL for Back Button support
    const newUrl = window.location.pathname + '?product=' + productId;
    window.history.pushState({ productId: productId }, '', newUrl);

    // 2. HIDE THE HOME PAGE SECTIONS
    // This removes the slider, the grid of other products, and the ticker
    const hero = document.getElementById('hero-section');
    const shop = document.querySelector('.product-section'); // The grid container
    const ticker = document.querySelector('.ticker-wrap');
    const footer = document.querySelector('footer');

    if(hero) hero.style.display = 'none';
    if(shop) shop.style.display = 'none';
    if(ticker) ticker.style.display = 'none';
    if(footer) footer.style.display = 'none';

    // 3. SHOW ONLY THE PRODUCT DETAIL
    const detailView = document.getElementById('product-detail-view');
    detailView.classList.add('active');

    // THIS PREVENTS THE DOUBLE SCROLL:
    document.body.style.overflow = 'hidden'; 
    
    // Ensure the product view starts at the top
    detailView.scrollTo(0, 0);

    
    // (Existing data population code stays here)
/*------------------------------------------------------------------------------------------*/


    const mainImg = document.getElementById('detail-main-img');
    if (mainImg) {
        mainImg.src = product.img;
    }
    // 2. Populate Thumbnails
    const thumbContainer = document.getElementById('detail-thumbnails');
    thumbContainer.innerHTML = ''; 

    const images = [product.img, product.img1, product.img2, product.img3];

    images.forEach((url, index) => {
        // DEBUG STEP 2: Check if URL is valid
        if (url && typeof url === 'string' && url.length > 5) {
            const thumb = document.createElement('img');
            thumb.src = url;
            thumb.className = 'pdp-thumb-icon';
            thumb.onclick = () => { mainImg.src = url; };
            thumbContainer.appendChild(thumb);
        } else {
            console.warn(`%c Creating thumb ${index}: Skipped (Value is: ${url})`, "color: orange");
        }
    });

    // 3. Inject Purchase Controls
    const purchaseContainer = document.getElementById('purchase-controls-container');
    if (purchaseContainer) {
        purchaseContainer.innerHTML = `
            <div class="purchase-box">
                <div class="qty-selector-pro">
                    <button type="button" id="pdp-minus">-</button>
                    <input type="number" id="qty-${product.id}" value="1" readonly>
                    <button type="button" id="pdp-plus">+</button>
                </div>
                <button id="detail-add-btn" class="pdp-add-to-cart" data-translate="pdp-add-to-bag">
                ${translations[currentLang]["pdp-add-to-bag"]}
                </button>
            </div>
             <div class="pdp-recommendations">
                <h3 class="recommendation-header" data-translate="recommended-title">
            ${translations[currentLang]["recommended-title"]}
        </h3>
                <div id="recommendation-grid" class="recommendation-grid">
            </div>
        `;
        // 4. Attach Unified Events
        document.getElementById('pdp-plus').onclick = () => changeQuantity(product.id, 1);
        document.getElementById('pdp-minus').onclick = () => changeQuantity(product.id, -1);
        
        // Calls your global cart-logic.js function
        document.getElementById('detail-add-btn').onclick = () => {handleAddToCart(product.id); closeProductDetail();}
    }

    // 5. Unified Cart Sync
    // This updates the badge in the PDP header using your global main menu logic
    if (typeof updateStagedCountDisplay === 'function') {
        updateStagedCountDisplay();
    }

    // 6. Show the view
    // --- NEW: Recommendation Logic ---
    renderRecommendations(productId);
    const detailOverlay = document.getElementById('product-detail-view');
    detailOverlay.scrollTop = 0; 
    detailOverlay.classList.add('active');
    
}

function renderRecommendations(currentProductId) {
    const grid = document.getElementById('recommendation-grid');
    if (!grid) return;

    // Filter to get 4 random items excluding the current one
    const otherProducts = products
        .filter(p => p.id != currentProductId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    grid.innerHTML = otherProducts.map(product => {
        const t = (key) => (translations[currentLang] && translations[currentLang][key]) || key;
        
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
                            <div class="original-price">${(product.price * 1.3).toFixed(2)}L.E</div>
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
}



/* The dynamic bar above */
function buildTicker(lang) {
        const track = document.getElementById('ticker-track');
        if (!track) return;
        const msgs = tickerMessages[lang] || tickerMessages['en'];
        // Build one set of items
        const itemsHTML = msgs.map(m => `<span class="ticker-item">${m}</span>${SEP}`).join('');
        // Duplicate 3× for seamless infinite scroll
        track.innerHTML = itemsHTML + itemsHTML + itemsHTML;

        // Direction: RTL scrolls right-to-left too, but CSS handles it
        if (lang === 'ar') {
            track.style.animationName = 'tickerScrollRTL';
        } else {
            track.style.animationName = 'tickerScroll';
        }
    }