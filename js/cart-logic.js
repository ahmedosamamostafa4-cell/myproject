// --- CART STATE ---
// Assuming 'products' array is loaded from inventory.js
// Assuming 'alertMessage' is defined in ui-logic.js or main.js for showing notifications.

// cart: The final confirmed order list (Make sure to initialize this or use a global var from another file)
let cart = []; 
// stagedCart: The temporary list of items waiting for confirmation via the header icon click
let stagedCart = []; 


/**
 * Calculates the total number of items (quantities combined) in the STAGED cart
 * and updates the header badge.
 */
function updateStagedCountDisplay() {
    const totalCount = stagedCart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update the main menu badge (if it exists)
    const mainBadge = document.getElementById('cart-count');
    if (mainBadge) mainBadge.textContent = totalCount;

    // Update the PDP badge (the one inside the detail view)
    const pdpBadge = document.getElementById('detail-cart-count');
    if (pdpBadge) {
        pdpBadge.textContent = totalCount;
        
        // Add a little animation so the user sees it updated
        pdpBadge.style.transform = 'scale(1.3)';
        setTimeout(() => pdpBadge.style.transform = 'scale(1.0)', 200);
    }
}

/**
 * Handles adding a product to the STAGED cart with the selected quantity.
 * This is triggered by the product card button.
 * NOTE: Ensure 'products' and 'alertMessage' are globally accessible.
 * @param {number} productId - The ID of the product.
 */
function handleAddToCart(productId) {
    const quantityInput = document.getElementById(`qty-${productId}`);
    
    // Fallback if quantity input doesn't exist, assume quantity is 1
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
    
    // Check for global 'products' variable (defined in inventory.js)
    if (typeof products === 'undefined') {
        console.error("Products array is not defined. Ensure inventory.js is loaded correctly.");
        return;
    }

    const product = products.find(p => p.id === productId);

    if (quantity < 1) {
        // Assume alertMessage is defined globally
        if (typeof alertMessage !== 'undefined') alertMessage("Please select a quantity of at least 1.", 'error');
        return;
    }

    if (product) {
        // Find if the item already exists in the STAGED cart
        const existingItem = stagedCart.find(item => item.id === productId);
        
        // --- NEW STOCK LIMIT LOGIC ---
        // 1. Calculate current total quantity in cart for this product
        const currentCartQty = existingItem ? existingItem.quantity : 0;
        // 2. Calculate what the total will be AFTER this addition
        const totalNewQty = currentCartQty + quantity;
        
        // 3. Check if the final total exceeds the defined stock limit
        if (totalNewQty > product.stock) {
            const stockLimitMessage = isArabic() 
                ? `الحد الأقصى للطلب من منتج ${product.name} هو ${product.stock} فقط. لديك حالياً ${currentCartQty} في السلة.`
                : `You can only order a maximum of ${product.stock} for ${product.name}. You currently have ${currentCartQty} in the cart.`;
                
            if (typeof alertMessage !== 'undefined') alertMessage(stockLimitMessage, 'error');
            return; // Stop adding the item if stock is exceeded
        }
        // --- END OF NEW STOCK LIMIT LOGIC ---
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Add the product details along with the selected quantity
            stagedCart.push({ 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                quantity: quantity,
                img: product.img 
            });
        }
        
        updateStagedCountDisplay();
        renderTotal(); // 🔥 ADD THIS
        // Reset quantity to 1 after adding, if the input exists
        if (quantityInput) quantityInput.value = 1;
        if(isArabic())
        {
          if (typeof alertMessage !== 'undefined') {
            alertMessage(`تم اضافه عدد ${quantity} من منتج ${product.name}. اضغط هنا للشراء!`, 'success');
        } else {
            console.log(`تم اضافه عدد ${quantity} من منتج ${product.name} الى السله. اضغط للتاكيد.`);
        }
        }
        else
        {
        if (typeof alertMessage !== 'undefined') {
            alertMessage(`Added ${quantity} x ${product.name}. Click the cart icon to confirm!`, 'success');
        } else {
            console.log(`Added ${quantity} x ${product.name} to staged cart. Needs confirmation.`);
        }
        }   
    }
}


function handlePDPAddToCart(productId) {
    // 1. Get PDP-specific quantity input
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

    if (typeof products === 'undefined') return;
    const product = products.find(p => p.id === productId);

    if (!product) return;

    // 2. Stock & Quantity Validation
    if (quantity < 1) {
        pdpAlert(isArabic() ? "برجاء اختيار كمية صحيحة" : "Please select a valid quantity", true);
        return;
    }

    const existingItem = stagedCart.find(item => item.id === productId);
    const currentCartQty = existingItem ? existingItem.quantity : 0;
    const totalNewQty = currentCartQty + quantity;

    if (totalNewQty > product.stock) {
        const stockMsg = isArabic() 
            ? `الحد الأقصى هو ${product.stock}. لديك بالفعل ${currentCartQty} في السلة.`
            : `Max stock is ${product.stock}. You have ${currentCartQty} in cart.`;
        pdpAlert(stockMsg, true); // Show error banner in PDP
        return;
    }

    // 3. Update the Staged Cart Array
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        stagedCart.push({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            quantity: quantity,
            img: product.img 
        });
    }

    // 4. Update UI
    updateStagedCountDisplay(); // Syncs the badges (both main and PDP)
    
    if (quantityInput) quantityInput.value = 1; // Reset PDP input

    // 5. Trigger the PDP-ONLY Banner Notification
    const successMsg = isArabic()
        ? `تم إضافة ${quantity} من ${product.name} للحقيبة`
        : `Added ${quantity} x ${product.name} to bag!`;
    
    pdpAlert(successMsg); 
}

/**
 * Renders the items in the stagedCart array into the checkout modal list.
 * It also recalculates and updates the total cost and button state.
 */
function renderStagedCartItems() {
    const listElement = document.getElementById('cart-items-list');
    const totalSpan = document.getElementById('modal-total-cost');
    const placeOrderButton = document.querySelector('#order-form button[type="submit"]');

    if (!listElement || !totalSpan || !placeOrderButton) {
        console.error("Missing modal elements (list, total, or button).");
        return;
    }

    // Clear existing content
    listElement.innerHTML = '';
    
    const total = getStagedCartTotal();

    if (stagedCart.length === 0) {
        // Handle empty cart state
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'text-center text-gray-500 italic p-4';
        emptyMessage.textContent = isArabic() ? 'لا توجد منتجات في العربة.' : 'No items in cart.';
        listElement.appendChild(emptyMessage);
        
        // Disable the Place Order button
        placeOrderButton.disabled = true;
        placeOrderButton.classList.add('opacity-50', 'cursor-not-allowed');
        
    // Locate the stagedCart.forEach loop in js/cart-logic.js and replace the itemHtml content

// ... (inside renderStagedCartItems function) ...

    } else {
        stagedCart.forEach(item => {
            const itemHtml = `
                <div class="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0">
                    
                    <div class="flex items-center space-x-3">
                        <img src="${item.img}" alt="${item.name}" class="h-12 w-12 object-cover rounded-md border border-gray-100">
                        
                        <div class="flex flex-col">
                            <span class="font-semibold text-gray-800">${item.name}</span>
                            <span class="text-sm text-gray-500">${item.quantity}x<br><br></span>
                        </div>
                    </div>
                    
                        <div class="flex flex-col items-start">
                            <span class="text-lg font-bold text-indigo-700">
                                ${(item.price * item.quantity).toFixed(2)} L.E
                            </span>
                        </div>
                        <button type="button" 
                                onclick="removeFromStagedCart(${item.id})" 
                                class="text-red-500 hover:text-red-700 transition" 
                                title="${isArabic() ? 'إزالة' : 'Remove'}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            listElement.insertAdjacentHTML('beforeend', itemHtml);
        });
        
        // Enable the Place Order button
        placeOrderButton.disabled = false;
        placeOrderButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }

}


// --- DOMContentLoaded UPDATE ---
// You MUST also add the call to updateStagedCountDisplay() inside your
// main DOMContentLoaded listener (likely in js/main.js) to initialize the badge to 0.

function changeQuantity(productId, delta) {
    const input = document.getElementById(`qty-${productId}`);
    // --- NEW: Find the product and its stock ---
    // Assuming 'products' is globally accessible from inventory.js
    if (typeof products === 'undefined') {
        console.error("Products array is not defined for stock check.");
        return;
    }
    const product = products.find(p => p.id === productId);
    const stockLimit = product ? product.stock : 99; // Use stock, fallback to 99 if not found
    
    // --- END NEW BLOCK ---

    if (input) {
        let currentQty = parseInt(input.value, 10);
        let newQty = currentQty + delta;
        
        // Enforce limits
        if (newQty < 1) {
            newQty = 0;
        } 
        // --- NEW: Limit by the stock property ---
        else if (newQty > stockLimit) { 
            newQty = stockLimit; 
            // Optional: Alert the user they hit the stock limit
            if (delta > 0 && typeof alertMessage !== 'undefined') {
                 const message = isArabic() ? `الحد الأقصى للمتوفر هو ${stockLimit} فقط.` : `Stock limit reached (${stockLimit}).`;
                 alertMessage(message, 'info');
            }
        }
        // --- END NEW BLOCK ---
        
        input.value = newQty;
    }
}



/* Here we have everything that is regarding the amount of the cart */
function getStagedCartTotal() {
    const customerDistrict = document.getElementById('checkout-district').value;
    console.log(customerDistrict);
    const subtotal = stagedCart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    const shippingFees = [
        0, // no city
        65, // Cairo / Giza
        70, // Alex
        85, // Gharbeya
        85, // Sharqia
        85, // Dakahlya
        100, // Others

    ];

    const shippingFee = subtotal > 3000 ? 0 : (shippingFees[customerDistrict] ?? 0);

    document.getElementById('deliveryFeeText').textContent =
        `Delivery Service: ${shippingFee} L.E`;
    
    console.log(customerDistrict);

    return subtotal + shippingFee;
}

/* That is rendering the amount of the cart in run time to detect any changes */
function renderTotal() {
    console.trace("renderTotal called");
    
    document.getElementById('totalAmount').textContent =
        "\u00A0" + getStagedCartTotal().toFixed(2) + " L.E";
}

// --- 2. ALERT MESSAGE SYSTEM (Placeholder) ---
/**
 * Shows a non-blocking alert message.
 * @param {string} message - The message to display.
 * @param {('success'|'error'|'info')} type - The type of alert.
 */
function alertMessage(message, type = 'info') {
    const alertBox = document.getElementById('alert-message-box');
    if (!alertBox) return;

    alertBox.textContent = message;
    
    // Reset classes and apply type
    alertBox.className = ''; 
    alertBox.classList.add('active');
    
    // Optional: change color based on type
    if (type === 'error') alertBox.style.backgroundColor = '#e74c3c';
    else alertBox.style.backgroundColor = '#2ecc71'; // Success Green

    // Clear after 3 seconds
    setTimeout(() => {
        alertBox.classList.remove('active');
    }, 3000);
}

// --- 3. MODAL CONTROL LOGIC ---

/**
 * Opens the checkout modal and populates it with the current cart total.
 * @param {number} total - The calculated total cost.
 */
function openOrderModal() {
    const modal = document.getElementById('order-modal-overlay');
    const totalSpan = document.getElementById('modal-total-cost');

    if (modal && totalSpan) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

/**
 * Closes the checkout modal.
 */
function closeOrderModal() {
    const modal = document.getElementById('order-modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

/**
 * Function called when the cart icon is clicked.
 */
function openCheckoutModalIfCartIsReady() {

    if (stagedCart.length === 0) {
        if(isArabic())
        {
            alertMessage('العربه لا يوجد بها شئ. اضف بعض المنتجات!');
        }
        else
        {
            alertMessage("Your cart is empty. Please add items to checkout.", 'info');
        }
        return;
    }

    // Render the items list before showing the modal
    renderStagedCartItems(); 

    openOrderModal();
}

/* --- ---------------------- 4. ORDER FORM SUBMISSION --------------------------------------------------*/

async function placeOrder(e) {
    e.preventDefault();

    // 1️⃣ Initial Checks (Synchronous)
    if (stagedCart.length === 0) {
        alertMessage("Cannot place an empty order.", 'error');
        return;
    }
    if (typeof supabaseClient === 'undefined') {
        alertMessage("Database connection error. Supabase client not initialized.", 'error');
        return;
    }

    const total = getStagedCartTotal();
    const actions = []; // Array to hold necessary DB action promises and local state refs
    const currentStagedCart = [...stagedCart]; // Create a copy of the cart for logging

    // 2️⃣ Validation, Preparation, and Conditional Action Setup (Synchronous)
    for (const orderedItem of currentStagedCart) {
        const productInInventory = products.find(p => p.id === orderedItem.id);

        // Check if product exists and if stock is sufficient
        if (!productInInventory || productInInventory.stock < orderedItem.quantity) {
            alertMessage(`Order failed: "${orderedItem.name}" is out of stock or insufficient.`, 'error');
            return; // Stop execution immediately upon first validation failure
        }
        
        const newStock = productInInventory.stock - orderedItem.quantity;
        let dbPromise;

        // **CRITICAL LOGIC: Conditional UPDATE or DELETE**
        if (newStock >= 0) {
            // Stock remains, perform an UPDATE
            dbPromise = supabaseClient
                .from('products')
                .update({ stock: newStock })
                .eq('id', productInInventory.id);
        } else {
            // Stock is 0 or less, perform a DELETE
            /*dbPromise = supabaseClient
                .from('products')
                .delete()
                .eq('id', productInInventory.id);*/
        }
        
        actions.push({
            newStock: newStock,
            productRef: productInInventory, // Reference to the local object for UI update
            promise: dbPromise // The specific UPDATE or DELETE promise
        });
    }

    // 3️⃣ Data Preparation for Logging (Synchronous)
    const customerName = document.getElementById('checkout-name').value;
    const customerPhone1 = document.getElementById('checkout-phone1').value;
    const customerPhone2 = document.getElementById('checkout-phone2').value;
    const customerAddress = document.getElementById('checkout-address').value;


    // Generate a unique ID (NOTE: Using .toISOString() for better database compatibility if using 'text')
    // Keep your original usage (new Date(Date.now())) but remember it must match the DB column type (text/varchar is safer).
    const uniqueOrderId = new Date(Date.now());
    
    // Prepare an array of rows to insert (one row per item)
    const orderLogItems = currentStagedCart.map(item => ({
        Order_ID: uniqueOrderId, 
        Name: customerName,
        Phone_No_1 : customerPhone1,
        Phone_No_2 : customerPhone2,
        Address: customerAddress,
        Item: item.name,
        Quantity: item.quantity,
        Cost: item.quantity * item.price // Cost is total cost of this line item
    }));
    
    // ----------------------------------------------------------------------
    // ⚡️ OPTIMIZATION APPLIED HERE: Move UI cleanup before 'try' block
    // ----------------------------------------------------------------------

    // 4️⃣ IMMEDIATE UI FEEDBACK & LOCAL CLEANUP
    // These actions run instantly, giving the user the feeling of speed.
    closeOrderModal();
    alertMessage(`Order for ${total.toFixed(2)} L.E placed successfully!`, 'success');

    // Clear local state immediately
    stagedCart = []; // The global stagedCart variable is cleared here
    e.target.reset();
    updateStagedCountDisplay();
    renderStagedCartItems();

    console.log("--- ORDER SUBMITTED (Awaiting database confirmation) ---");

    // ----------------------------------------------------------------------
    // ⬇️ Database Operations (The slower section that we 'await')
    // ----------------------------------------------------------------------
    try {
        // 5a. Perform Concurrent DB Actions (Stock Update/Delete)
        const dbPromises = actions.map(item => item.promise);

        // Wait for all updates/deletes to complete
        const results = await Promise.all(dbPromises);

        // Check for any database errors after all actions have run
        for (const result of results) {
            if (result.error) {
                console.error("Supabase stock adjustment failed:", result.error);
                // Note: The success message has already been shown. Now we show an internal error.
                alertMessage("Warning: Stock adjustment error occurred. Check console.", 'error');
                // We do NOT return, we proceed to attempt the order log.
            }
        }
        
        // 5b. BATCH INSERT ORDER ITEMS INTO THE DATABASE
        const { error: insertError } = await supabaseClient
            .from('orders') // <-- ASSUMED TABLE NAME
            .insert(orderLogItems); 

        if (insertError) {
            console.error("Order logging failed:", insertError);
            alertMessage("Warning: Order log failed. Please contact support.", 'error');
        }
        
        // 6️⃣ Update Local State (Final Local Stock Update)
        actions.forEach(item => {
            item.productRef.stock = item.newStock;
        });

        console.log("--- ORDER PLACED (All database operations completed) ---");
        console.log("Total: L.E", total.toFixed(2));

    } catch (error) {
        // Catches network errors or other critical failures during the database calls
        console.error("Order placement failed during DB calls:", error);
        alertMessage("Critical error: Database connection failed. Please check your network.", 'error');
    }
}



function isArabic() {
    return typeof currentLang !== 'undefined' && currentLang === 'ar';
}   

function removeFromStagedCart(productId) {
    const removedItem = stagedCart.find(item => item.id === productId);
    stagedCart = stagedCart.filter(item => item.id !== productId);
    
    updateStagedCountDisplay();
    // Re-render the cart list and update the total/button state
    renderStagedCartItems(); 
    
    renderTotal();
    // Use a generic message or find the name before filtering
    if (removedItem) {
        const message = isArabic() ? `تمت إزالة ${removedItem.name}` : `Removed ${removedItem.name}`;
        alertMessage(message, 'info');
    }
}

function handleAddToCartFromDetail(productId, quantity) {
    // We manually set the value so your existing handleAddToCart can read it,
    // or we can slightly modify handleAddToCart to accept a qty directly.
    
    // Simplest way: Call handleAddToCart and then close the view
    handleAddToCart(productId); 
    // Note: handleAddToCart usually looks for an ID 'qty-ID'. 
    // You might need to update handleAddToCart to accept (productId, manualQty)
}
