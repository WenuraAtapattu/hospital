document.addEventListener('DOMContentLoaded', function () {
    const cartTableBody = document.querySelector("#cart-table tbody");
    const totalPriceElement = document.querySelector('.total-price');
    const payBtn = document.getElementById('pay');
    const customerNameInput = document.querySelector('#customerName');
    const addressInput = document.querySelector('#address');
    const contactInput = document.querySelector('#contact');
    const cardNumberInput = document.querySelector('#cardNumber');
    const cvvInput = document.querySelector('#cvv');

    loadCartItems();

    function updateTotalPrice() {
        const cartRows = cartTableBody.querySelectorAll('tr');
        let total = 0;
        cartRows.forEach(row => {
            const priceCell = row.querySelector('td:nth-child(4)');
            const price = parseFloat(priceCell.textContent);
            total += price;
        });
        totalPriceElement.textContent = `Total Price: ${total.toFixed(2)} LKR`;
    }

    function loadCartItems() {
        const cartItems = JSON.parse(localStorage.getItem("cartItems"));

        if (cartItems && cartItems.length > 0) {
            cartTableBody.innerHTML = ""; // Clear existing rows
            cartItems.forEach(item => {
                const cartRow = document.createElement('tr');

                const imageCell = document.createElement("td");
                const img = document.createElement("img");
                img.src = item.image;
                img.alt = item.name;
                img.style.width = "60px";
                imageCell.appendChild(img);
                cartRow.appendChild(imageCell);

                const nameCell = document.createElement("td");
                nameCell.textContent = item.name;
                cartRow.appendChild(nameCell);

                const quantityCell = document.createElement("td");
                quantityCell.textContent = item.quantity;
                cartRow.appendChild(quantityCell);

                const priceCell = document.createElement("td");
                priceCell.textContent = item.price;
                cartRow.appendChild(priceCell);

                const removeCell = document.createElement("td");
                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.className = "remove-button";
                removeButton.addEventListener("click", function () {
                    cartRow.remove();
                    updateTotalPrice();
                });
                removeCell.appendChild(removeButton);
                cartRow.appendChild(removeCell);

                cartTableBody.appendChild(cartRow);
            });

            updateTotalPrice();
        } else {
            alert("No items found in cart!");
        }
    }

    function validateForm() {
        if (
            customerNameInput.value.trim() === '' || 
            addressInput.value.trim() === '' || 
            contactInput.value.trim() === ''
        ) {
            alert('Please provide all personal details.');
            return false;
        }
        if (cardNumberInput.value.trim() === '' || cvvInput.value.trim() === '') {
            alert('Please provide all card details.');
            return false;
        }
        if (cartTableBody.querySelectorAll("tr").length === 0) {
            alert('Cart is empty. Add items to cart before paying.');
            return false;
        }
        return true;
    }

    function displaySuccessMessage() {
        let items = '';
        cartTableBody.querySelectorAll('tr').forEach(row => {
            const name = row.cells[1].innerText;
            const quantity = row.cells[2].innerText;
            const price = row.cells[3].innerText;
            items += `${name} - Quantity: ${quantity}, Total Price: ${price}\n`;
        });
        const today = new Date();
        const estimatedDeliveryDate = new Date(today);
        estimatedDeliveryDate.setDate(today.getDate() + 7);
        const formattedDeliveryDate = estimatedDeliveryDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const totalPrice = totalPriceElement.textContent;
        alert(`Thank you for your order!\n\nItems:\n${items}\n${totalPrice}\nEstimated Delivery Date: ${formattedDeliveryDate}`);
    }

    function clearCart() {
        // Clear cart table
        cartTableBody.innerHTML = '';
        // Clear total price
        totalPriceElement.textContent = 'Total Price: 0.00 LKR';
        // Remove items from localStorage
        localStorage.removeItem('cartItems');
    }

    payBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (validateForm()) {
            displaySuccessMessage();
            clearCart();
        }
    });
});
