const products = [
    { id: 1, name: 'Rice', price: 50 },
    { id: 2, name: 'Wheat Flour', price: 40 },
    { id: 3, name: 'Sugar', price: 35 },
    { id: 4, name: 'Milk', price: 25 },
    { id: 5, name: 'Bread', price: 20 },
    { id: 6, name: 'Eggs', price: 10 },
    { id: 7, name: 'Butter', price: 45 },
    { id: 8, name: 'Cheese', price: 60 },
    { id: 9, name: 'Chicken', price: 150 },
    { id: 10, name: 'Fish', price: 200 },
    { id: 11, name: 'Apples', price: 120 },
    { id: 12, name: 'Bananas', price: 30 },
    { id: 13, name: 'Oranges', price: 80 },
    { id: 14, name: 'Tomatoes', price: 40 },
    { id: 15, name: 'Potatoes', price: 30 },
    { id: 16, name: 'Onions', price: 25 },
    { id: 17, name: 'Carrots', price: 50 },
    { id: 18, name: 'Broccoli', price: 60 },
    { id: 19, name: 'Spinach', price: 40 },
    { id: 20, name: 'Garlic', price: 120 },
    { id: 21, name: 'Ginger', price: 150 },
    { id: 22, name: 'Salt', price: 20 },
    { id: 23, name: 'Pepper', price: 80 },
    { id: 24, name: 'Coffee', price: 300 },
    { id: 25, name: 'Tea', price: 200 }
];

let cart = [];
let billNo = 1;

const productList = document.getElementById('productList');
const cartList = document.getElementById('cartList');
const totalPriceEl = document.getElementById('totalPrice');
const billNoEl = document.getElementById('billNo');

products.forEach(product => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `${product.name} - ₹${product.price}`;
    const button = document.createElement('button');
    button.className = 'btn btn-sm btn-primary';
    button.textContent = 'Add';
    button.addEventListener('click', () => addItem(product));
    li.appendChild(button);
    productList.appendChild(li);
});

function addItem(product) {
    const cartItem = cart.find(item => item.id === product.id);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, quantity) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = quantity;
        if (cartItem.quantity <= 0) {
            removeItem(productId);
        }
        updateCart();
    }
}

function updateCart() {
    cartList.innerHTML = '';
    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${item.name} - ₹${item.price} x 
            <input type="number" min="1" value="${item.quantity}" style="width: 60px;" class="quantity-input">
            <button class="btn btn-sm btn-danger">Remove</button>
        `;
        li.querySelector('.quantity-input').addEventListener('change', (e) => updateQuantity(item.id, parseInt(e.target.value)));
        li.querySelector('.btn-danger').addEventListener('click', () => removeItem(item.id));
        cartList.appendChild(li);
    });
    totalPriceEl.textContent = totalPrice;
}

document.getElementById('downloadInvoice').addEventListener('click', () => {
    const invoiceContent = `
        <h2>Invoice</h2>
        <p>Bill No: ${billNo}</p>
        <ul>
            ${cart.map(item => `<li>${item.name} - ₹${item.price} x ${item.quantity}</li>`).join('')}
        </ul>
        <p>Total: ₹${totalPriceEl.textContent}</p>
    `;

    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `invoice_${billNo}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    billNo++;
    billNoEl.textContent = billNo;
    cart = [];
    updateCart();
});
