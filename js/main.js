// --- APPLICATION INITIALIZATION ---
/**
 * Attaches event listeners to all 'Add to Cart' buttons on the product cards.
 * This must be called every time products are rendered or filtered.
 */
function attachProductListeners() {
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    cartButtons.forEach(button => {
        // Prevent adding the listener multiple times
        if (button.dataset.listenerAdded) {
            return;
        }

        button.addEventListener('click', (e) => {
            // Get the product ID from the button's data attribute
            const productId = e.currentTarget.dataset.productId;
            
            // Check if the required function exists before calling it
            if (typeof addToStagedCart === 'function') {
                addToStagedCart(productId);
            } else {
                console.error('CRITICAL ERROR: addToStagedCart function is not defined.');
            }
        });
        
        // Mark the button so we don't attach the listener again
        button.dataset.listenerAdded = 'true';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Note: applyTranslations and filterProducts must be defined 
    // in translations.js and inventory.js respectively and be globally accessible.
    
    // 1. Initialize language to 'en' (this also sets RTL/LTR and calls filterProducts)
    if (typeof applyTranslations === 'function') {
        applyTranslations('ar');
    }
    
    // 2. Initial product display: 
    if (typeof fetchProductsFromSupabase === 'function') { // ✅ Correct function name
        fetchProductsFromSupabase();                        // ✅ Correct function name
    }

    // 3. Initialize Staged Cart Count
    // This function is defined in js/cart-logic.js and sets the header badge to '0'
    if (typeof updateStagedCountDisplay === 'function') {
        updateStagedCountDisplay();
    }    

    // 2. Attach the order submission logic to the form
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', placeOrder);
    }

});

document.addEventListener('DOMContentLoaded', () => {
        // Initial build — currentLang may already be set by translations.js
        setTimeout(() => buildTicker(typeof currentLang !== 'undefined' ? currentLang : 'ar'), 0);
    });

    // Monkey-patch applyTranslations to rebuild ticker on language switch
    // We do this after all scripts load
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const pId = params.get('product');

    if (pId) {
        // Wait for products to load from Supabase
        const interval = setInterval(() => {
            if (products && products.length > 0) {
                openProductDetail(pId);
                clearInterval(interval);
            }
        }, 100);
    }
});


