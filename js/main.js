// --- APPLICATION INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // Note: applyTranslations and filterProducts must be defined 
    // in translations.js and inventory.js respectively and be globally accessible.
    
    // 1. Initialize language to 'en' (this also sets RTL/LTR and calls filterProducts)
    if (typeof applyTranslations === 'function') {
        applyTranslations('en');
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

