// --- LANGUAGE DATA ---
const translations = {
    en: {
        "page-title": "OriginalShoes - Home",
        "brand": "Original Kicks",
        "welcome": "Welcome!",
        "slogan-header": "Discover our world of original footwear",
        "menu-title": "Main Menu", 
        "slider-title": "Style and Comfort.",
        "slider-subtitle": "Find your perfect pair today.",
        "shop-now": "Shop Now",
        "account": "My Account", 
        "cart": "Shopping Cart", 
        "featured": "NEW & FEATURED",
        "sales": "SALES",
        "contact": "CONTACT US!",
        "language-nav": "Language (العربية)",
        "filter-shoes": "Filter Shoes",
        "browse-categories": "Categories",
        "new-arrivals-filter": "New Arrivals",
        "offers-filter": "Offers",
        "gender": "Gender",
        "condition": "Condition",
        "men-filter": "Men",
        "women-filter": "Women",
        "kids-filter": "Kids",
        "new-shoes": "New Shoes",
        "used-shoes": "Used Shoes",
        "all-products": "Random Products",
        "no-stock": "nothing on stock at the moment",
        "products-count-header": "Showing All Products (0)",
        "sort-by-label": "Sort By:",
        "sort-default": "Default",
        "sort-price-asc": "Price: Low to High",
        "sort-price-desc": "Price: High to Low",
        "add-to-cart": "Add to Cart",
        "checkout-title": "Complete Your Order",
        "personal-info": "Personal Information",
        "confirm-your-order": "Confirm Your Order",
        "full-name": "Full Name",
        "phone-number": "Phone Number",
        "another-phone-number": "Another Phone Number",
        "shipping-address": "Shipping Address",
        "total-due": "Total Due:",
        "cancel-button": "Cancel",
        "place-order-button": "Place Order",
        "cart-empty-error": "Your staged order is empty. Select products first.",
        "item-added-success": "Added to cart: ",
        "order-success": "Order placed successfully! Total: ",
        "item-removed": "Item removed from cart.",
        "name-label": "Full Name",
        "email-label": "Email Address",
        "address-label": "Shipping Address",
        "discard-item": "Remove Item",
        "cart-empty": "Your cart is empty.",
        "contact-title": "Contact Us",
        "contact-slogan": "We're always here to help you find your perfect pair.",
        "social-title": "Connect with us on Social Media",
        "browse-brands": "Brands",
        "pdp-add-to-bag": "ADD TO BAG",
        "pdp-quantity": "Quantity",
        "pdp-brand": "Brand",
        "pdp-price": "Price",
        "pdp-size": "Size:",
        "pdp-currency": "L.E",
        "pdp-condition": "Condition:",
        "size": "Size",
        "recommended-title": "You Might Also Like"
    },
    ar: {
        "page-title": "OriginalShoes - الصفحة الرئيسية",
        "brand": "Original Kicks",
        "welcome": "أهلاً وسهلاً!",
        "slogan-header": "الاصلى يبدا من هنا",
        "menu-title": "القائمة الرئيسية", 
        "slider-title": "أناقة وراحة.",
        "slider-subtitle": "اكتشف حذائك المثالي اليوم.",
        "shop-now": "تسوق الآن",
        "account": "حسابي", 
        "cart": "عربة التسوق", 
        "featured": "جديد ومميز",
        "sales": "تخفيضات",
        "contact": "تواصل معنا!",
        "language-nav": "English (اللغة)",
        "filter-shoes": "تصفية الأحذية",
        "browse-categories": "الفئات",
        "new-arrivals-filter": "وصل حديثاً",
        "offers-filter": "العروض",
        "gender": "النوع",
        "condition": "الحالة",
        "men-filter": "رجال",
        "women-filter": "نساء",
        "kids-filter": "أطفال",
        "new-shoes": "أحذية جديدة",
        "used-shoes": "أحذية مستعملة",
        "all-products": "بعض من المنتجات",
        "no-stock": "لا يوجد شيء في المخزون حاليًا",
        "condition-filter-header": "الحالة",
        "category-filter-header": "الفئة",
        "products-count-header": "عرض جميع المنتجات (0)",
        "sort-by-label": "الترتيب حسب:",
        "sort-default": "افتراضي",
        "sort-price-asc": "السعر: من الأدنى إلى الأعلى",
        "sort-price-desc": "السعر: من الأعلى إلى الأدنى",
        "footer-text": "© 2025 OriginalShoes. جميع الحقوق محفوظة.",
        "no-products-found": "لم يتم العثور على منتجات مطابقة لمعاييرك.",
        "add-to-cart": "أضف إلى السلة",
        "checkout-title": "أكمل طلبك",
        "confirm-your-order": "اكد طلبك",
        "full-name": "اكد طلبك",
        "phone-number": "رقمك الشخصى",
        "another-phone-number": "رقم بديل اخر",
        "shipping-address": "عنوان التوصيل",
        "personal-info": "المعلومات الشخصية",
        "total-due": "المبلغ الإجمالي:",
        "cancel-button": "إلغاء",
        "place-order-button": "تأكيد الطلب",
        "cart-empty-error": "سلة التسوق فارغة. الرجاء اختيار المنتجات أولاً.",
        "item-added-success": "تمت الإضافة للسلة: ",
        "order-success": "تم تأكيد طلبك بنجاح! الإجمالي: ",
        "item-removed": "تمت إزالة المنتج من السلة.",
        "name-label": "الاسم الكامل",
        "email-label": "البريد الإلكتروني",
        "address-label": "عنوان الشحن",
        "discard-item": "إزالة المنتج",
        "cart-empty": "سلة التسوق فارغة.",
        // --- NEW CONTACT MODAL TRANSLATIONS ---
        "contact-title": "تواصل معنا",
        "contact-slogan": "نحن هنا لمساعدتك دائمًا في العثور على حذائك المثالي.",
        "social-title": "تواصل معنا عبر وسائل التواصل",
        "VIEW >": "عرض المنتج",
        "OUT OF STOCK": "نفدت الكمية",
        "browse-brands": "الماركه",
        "size": "المقاس",
        "pdp-add-to-bag": "أضف إلى العربه",
        "pdp-quantity": "الكمية",
        "pdp-brand": "الماركة",
        "pdp-price": "السعر",
        "pdp-size": "المقاس:",
        "pdp-currency": "ج.م",
        "pdp-condition": "الحاله:",
        "pdp-state": "جديد",
        "footer-shipping-title": "شحن مجاني",
        "footer-shipping-desc": "على جميع الطلبات الأكثر من 3000 ج.م",
        "footer-return-title": "إرجاع مجاني",
        "footer-return-desc": "ضمان استرداد الأموال خلال 30 يومًا",
        "footer-support-title": "دعم 24/7",
        "footer-support-desc": "دعم فني مباشر على مدار اليوم",
        "footer-about": "نوفر أفضل أحذية السنيكرز الأصلية وعالية الجودة.",
        "footer-links-title": "روابط سريعة",
        "footer-social-title": "تابعنا على",
        "recommended-title": "منتجات قد تعجبك",
        
// ... other keys
    }
};

    // ===== ANNOUNCEMENT TICKER =====
    const tickerMessages = {
        en: [
            "THE ORIGINAL STARTS HERE",
            "WELCOME TO ORIGINAL KICKS",
            "WHERE ORIGINALS LIVE",
            "YOUR TRUSTWORTHY PLACE FOR ORIGINALS",
            "100% AUTHENTIC GUARANTEED",
            "FREE DELIVERY ON ORDERS ABOVE 3000 L.E",
        ],
        ar: [
            "الأصلي يبدأ من هنا",
            "أهلاً في أوريجينال كيكس",
            "حيث يعيش الأصلي",
            "مكانك الموثوق للأحذية الأصلية",
            "أصلية مضمونة ١٠٠٪",
            "توصيل مجاني فوق ٣٠٠٠ ج.م",
        ]
    };

let currentLang = 'en';

function applyTranslations(lang) {
            currentLang = lang;
            const t = translations[lang];

            // 1. Update document properties (Title, Lang attribute, Direction)
            document.getElementById('page-title').textContent = t["page-title"];
            document.documentElement.setAttribute('lang', lang);
            document.documentElement.setAttribute('dir', (lang === 'ar' ? 'rtl' : 'ltr'));

            // 2. Update all text content marked with data-translate
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                if (t[key]) {
                    element.textContent = t[key];
                }
            });

            // 3. Update the language toggle text for both desktop sidebar and off-canvas menu
            const langToggleNav = document.getElementById('lang-toggle-nav');
            if (langToggleNav) {
                langToggleNav.textContent = t["language-nav"];
            }
            const langToggleMenu = document.getElementById('lang-toggle-menu');
            if (langToggleMenu) {
                 langToggleMenu.textContent = t["language-nav"];
            }
            
            // --- FIX: Update the oil bar icon with simple text + flag emoji ---
            const langToggleBar = document.getElementById('lang-toggle-bar');
            if (langToggleBar) {
                let languageText, title;
                
                if (lang === 'en') {
                    // Next language is Arabic + Saudi Flag
                    languageText = '🌐 عربي'; 
                    title = 'Switch to Arabic'; 
                } else {
                    // Next language is English + UK Flag
                    languageText = 'English 🌐'; 
                    title = 'Switch to English'; 
                }

                // Use simple textContent/innerText instead of innerHTML to avoid inserting the <span> tag
                langToggleBar.textContent = languageText; 
                langToggleBar.title = title; 
            }
            
            filterProducts(); 
        }

function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    applyTranslations(newLang);
}
