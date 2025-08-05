document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Load cart items
    renderCartItems();
    updateCartCount();
});

function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.bag-items-list');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <img src="../images/icons/empty-bag.png" alt="Empty Bag">
                <h3>Your bag is empty</h3>
                <p>Looks like you haven't added anything to your bag yet</p>
                <a href="../index.html" class="btn-shop-now">SHOP NOW</a>
            </div>
        `;
        updatePriceDetails(0, 0);
        return;
    }
    
    cartContainer.innerHTML = '';
    
    let totalMRP = 0;
    let totalDiscount = 0;
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'bag-item-container';
        itemElement.innerHTML = `
            <div class="item-left-part">
                <img class="bag-item-img" src="../${item.image}" alt="${item.item_name}">
            </div>
            <div class="item-right-part">
                <div class="item-brand">${item.company}</div>
                <div class="item-info">${item.item_name}</div>
                <div class="item-size">Size: M</div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
                <div class="price-container">
                    <span class="current-price">Rs. ${item.current_price.toLocaleString()}</span>
                </div>
                <button class="remove-from-cart" onclick="removeFromCart(${item.id})">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
        cartContainer.appendChild(itemElement);
        
        totalMRP += item.current_price * item.quantity;
    });
    
    // Assuming a flat 20% discount for demo purposes
    totalDiscount = totalMRP * 0.2;
    updatePriceDetails(totalMRP, totalDiscount);
}

function updatePriceDetails(totalMRP, totalDiscount) {
    document.getElementById('total-mrp').textContent = `Rs. ${totalMRP.toLocaleString()}`;
    document.getElementById('total-discount').textContent = `- Rs. ${totalDiscount.toLocaleString()}`;
    document.getElementById('total-amount').textContent = `Rs. ${(totalMRP - totalDiscount).toLocaleString()}`;
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
    showNotification('Item removed from bag');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.bag-item-count').textContent = totalItems;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}