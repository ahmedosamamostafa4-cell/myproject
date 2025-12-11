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

    currentSlide = (currentSlide + 1) % slides.length;
    
    // 1. Calculate the magnitude of the shift (e.g., 100, 200, 300)
    const magnitude = currentSlide * 100;
    
    // 2. Check the current document direction
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    let offset;

    if (isRTL) {
        // If Arabic (RTL), we need a POSITIVE offset to move the strip to the right.
        offset = magnitude;
    } else {
        // If English (LTR), we need a NEGATIVE offset to move the strip to the left.
        offset = magnitude * -1;
    }

    // Apply the direction-aware transformation
    sliderStrip.style.transform = `translateX(${offset}vw)`;
}

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
});

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