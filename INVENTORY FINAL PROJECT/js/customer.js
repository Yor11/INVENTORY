// Retrieve stored products from local storage
let storedProducts = JSON.parse(localStorage.getItem("products"));

// Takes in a quantity value and returns a color string
function getColorByQuantity(quantity) {
  if (quantity >= 10) {
    return 'green';
  } else {
    return 'red';
  }
}
 function filterProductsByCategory() {
  // Get the selected category value
  let category = $("#productCategory").val();

  // Filter the stored products based on the selected category
  let filteredProducts = storedProducts.filter((product) => product._category === category);

  // Get the table element to display the filtered products
  let table = $("#filteredProductTableBody");
  table.empty();

  // Check if there are any filtered products
  if (filteredProducts.length === 0) {
    // Display a message when no products are available
    let row = $("<tr></tr>");
    row.html(`<td colspan='9'>No product available</td>`);
    table.append(row);
  } else {
    // Iterate through the filtered products and display them in the table
    filteredProducts.forEach((product) => {
      let row = $("<tr></tr>");
      row.html(`
        <td>${product._id}</td>
        <td>${product._category}</td>
        <td>${product._name}</td>
        <td>${product._unit}</td>
        <td>${product._srp}</td>
        <td>${product._cost}</td>
        <td style="color: ${getColorByQuantity(product._quantity)}">${product._quantity}</td>
        <td>${product._expirationDate}</td>
        <td>
          <button class="add-product-btn" data-product-id="${product._id}">ADD TO CART</button>
        </td>
      `);
      table.append(row);
    });
  }
}
   function filterProductsBySearch() {
   // Getting the search query from the input field and converting it to lowercase
   let searchQuery = $("#productSearch").val().toLowerCase();
  
   // Filtering the stored products based on the search query
   let filteredProducts = storedProducts.filter((product) => {
   // Converting the product name to lowercase for case-insensitive search
    let productName = product._name.toLowerCase();
   // Checking if the product name includes the search query
    return productName.includes(searchQuery);
  });

  // Getting the table element to display the filtered products
  let table = $("#filteredProductTableBody");
  table.empty();

  // Checking if there are no filtered products
  if (filteredProducts.length === 0) {
    let row = $("<tr></tr>");
    row.html(`<td colspan='9'>No product available</td>`);
    table.append(row);
  } else {
    // Displaying each filtered product in a table row
    filteredProducts.forEach((product) => {
      let row = $("<tr></tr>");
      row.html(`
        <td>${product._id}</td>
        <td>${product._category}</td>
        <td>${product._name}</td>
        <td>${product._unit}</td>
        <td>${product._srp}</td>
        <td>${product._cost}</td>
        <td style="color: ${getColorByQuantity(product._quantity)}">${product._quantity}</td>
        <td>${product._expirationDate}</td>
        <td>
          <button class="add-product-btn" data-product-id="${product._id}">ADD TO CART</button>
        </td>
      `);
      table.append(row);
    });
  }
}
  // Displays all the products on the product table
  function viewAllProducts() {
    let table = $("#filteredProductTableBody");
    table.empty();
    storedProducts.forEach((product) => {
    let row = $("<tr></tr>");
    row.html(`
      <td>${product._id}</td>
      <td>${product._category}</td>
      <td>${product._name}</td>
      <td>${product._unit}</td>
      <td>${product._srp}</td>
      <td>${product._cost}</td>
      <td style="color: ${getColorByQuantity(product._quantity)}">${product._quantity}</td>
      <td>${product._expirationDate}</td>
      <td>
        <button class="add-product-btn" data-product-id="${product._id}">ADD TO CART</button>
      </td>
    `);
    // Append the row to the table
    table.append(row);
  });
}
  // Display all products initially
 viewAllProducts();
 // Add a selected product to the transfer table
  $(document).on('click', '.add-product-btn', function() {
  // Retrieves selected product from storedProducts
  let selectedProduct = storedProducts.find((p) => p._id === $(this).data('product-id'));
  // Check if the selected product is out of stock
  if(selectedProduct._quantity <= 0) {
  // Create a modal element
  let modal = $('<div>').addClass('modal');
  let modalContent = $('<div>').addClass('modal-content');
  let message = $('<p>').html('<i class="uil uil-exclamation-circle"></i> PRODUCT IS OUT OF STOCKS');
  modalContent.append(message);
  modal.append(modalContent);
  $('body').append(modal);
  modal.addClass('out-of-stock-modal');
  modal.on('click', function() {
  modal.remove();
});
  return;
}
  // Find an existing row in the transfer table with the same product ID
  let transferTableBody = $('#transferTableBody');
  let existingRow = transferTableBody.find(`[data-product-id="${selectedProduct._id}"]`);
  // If an existing row is found, update the quantity input
  if (existingRow.length) {
    let maxQuantity = parseInt(selectedProduct._quantity, 10);
    let quantityInput = existingRow.find('.quantity-input');
    let newQuantity = parseInt(quantityInput.val(), 10);
    if (newQuantity > maxQuantity) {
      newQuantity = maxQuantity;
    }
    quantityInput.val(newQuantity);
  }
  // If an existing row is not found, add a new row to the transfer table
  else {
    let transferTableRow = $('<tr>').attr('data-product-id', selectedProduct._id);
    transferTableRow.html(`
      <td><input type="checkbox" name="selectedProducts" value="${selectedProduct._id}" checked></td>
      <td>${selectedProduct._id}</td>
      <td>${selectedProduct._category}</td>
      <td>${selectedProduct._name}</td>
      <td>${selectedProduct._unit}</td>
      <td>${selectedProduct._srp}</td>
      <td><input type="number" class="quantity-input" value="1" min="1" max="${selectedProduct._quantity}"></td>
    `);
    transferTableBody.append(transferTableRow);
  }
  // Add event listener for quantity input change to update the total SRP
  transferTableBody.find('.quantity-input').on('input', function() {
    updateTotalSrp();
  });
// Function to calculate and display the total SRP
function updateTotalSrp() {
  let totalSrp = 0;
  $('#transferTableBody tr').each(function() {
    let checkbox = $(this).find('td:nth-child(1) input');
    if (checkbox.prop('checked')) {
      let srp = parseFloat($(this).find('td:nth-child(6)').text());
      let quantity = parseInt($(this).find('.quantity-input').val(), 10);
      totalSrp += srp * quantity;
    }
  });
  $('#totalSrp').text(`Total SRP: PHP ${totalSrp.toFixed(2)}`);
}
  // Event listener for the "Select All" button
  $("#selectAllBtn").on("click", function() {
  let checkboxes = $("#transferTableBody input[type='checkbox']");
  checkboxes.prop('checked', true);
  updateTotalSrp();
});

  // Event listener for the "Unselect All" button
  $("#unselectAllBtn").on("click", function() {
  let checkboxes = $("#transferTableBody input[type='checkbox']");
  checkboxes.prop('checked', false);
  updateTotalSrp();
  });

  // Event listener for checkbox changes
  $(document).on('change', 'input[name="selectedProducts"]', function() {
  updateTotalSrp();
});

   // Call the updateTotalSrp() function on page load
   updateTotalSrp();
});
   // Function to handle checkbox changes
   $(document).on('change', 'input[name="selectedProducts"]', function() {
   let row = $(this).closest('tr');
   let srp = parseFloat(row.find('td:nth-child(6)').text());
   let quantity = parseInt(row.find('.quantity-input').val(), 10);
   let totalSrp = parseFloat($('#totalSrp').text().replace('Total SRP: PHP ',''));
    if (this.checked) {
    totalSrp += srp * quantity;
  } else {
    totalSrp -= srp * quantity;
  }
  if (isNaN(totalSrp)) { // Check if the result is NaN
    totalSrp = 0; // Set it to 0 if NaN
  }
  $('#totalSrp').text(`Total Srp: PHP ${totalSrp.toFixed(2)}`);
});
   // Generates a transaction receipt based on selected products and total SRP
 function generateTransactionReceipt(selectedProducts, totalSrp) {
  // Create a receipt to display transaction details
  let receiptContent = `
    <div class="receipt">
      <div class="header">
        <h2>PNC DANGAL GROCERY STORE</h2>
        <hr>
        <h3>******TRANSACTION RECEIPT******</h3>
        <hr>
      </div>
      <div class="body">
        <div class="product-list">
          <div class="row header">
          <div class="cell">Qty</div>
            <div class="cell">Unit</div>
            <div class="cell">Product Name</div>
            <div class="cell">Price</div>
          </div>
        `;
  // Add product details to receipt
  selectedProducts.forEach((selectedProduct) => {
    let product = storedProducts.find((p) => p._id === selectedProduct.id);
    receiptContent += `
      <div class="row">
        <div class="cell">${selectedProduct.quantity}</div>
        <div class="cell">${product._unit}</div>
        <div class="cell">${product._name}</div>
        <div class="cell">${product._srp}</div>
      </div>
    `;
});
// Add total SRP and transaction details to receipt
let date = new Date().toLocaleString();
let transactionNo = Math.floor(Math.random() * 1000000000);
receiptContent += `
        </div>
        <hr>
        <div class="total-srp">
        <p>Total Amount Paid: PHP ${totalSrp.toFixed(2)}</p>
      </div>      
        <hr>
        <div class="transaction-details">
          <p>Date: ${date}</p>
          <p>Transaction No.: ${transactionNo}</p>
        </div>
        <hr>
        <div class="footer">
          <p>For any questions or concerns, please contact our customer service team.</p>
        </div>
      </div>
    </div>
  `;
   // Display the receipt
  let receipt = document.createElement('div');
  receipt.classList.add('receipt-modal');
  receipt.innerHTML = receiptContent;
  document.body.appendChild(receipt);
   // Close the receipt when the user clicks outside of it
   window.onclick = function(event) {
    if (event.target == receipt) {
      receipt.remove();
    }
  };
}
  // Get the selected products on checkout
  $(document).on('click', '#checkoutBtn', function() {
  let selectedProducts = [];
  let transferTableBody = $('#transferTableBody');
  transferTableBody.find('tr').each(function() {
  let checkbox = $(this).find('td:nth-child(1) input');
  if (checkbox.prop('checked')) {
      let productId = $(this).data('product-id');
      let productQuantity = $(this).find('.quantity-input').val();
      selectedProducts.push({id: productId, quantity: productQuantity});
    }
  });
  // Validate selected products
  if (selectedProducts.length === 0) {
    alert('Please select at least one product to checkout.');
    return;
  }
  // Calculate total srp and cost
  let totalSrp = 0;
    let totalCost = 0;
  selectedProducts.forEach((selectedProduct) => {
  let product = storedProducts.find((p) => p._id === selectedProduct.id);
  totalSrp += product._srp * selectedProduct.quantity;
  totalCost += product._cost * selectedProduct.quantity;
  product._quantity -= selectedProduct.quantity; // Update quantity in the product table
});

  // Create a transaction 
  let transactionDetails = {
  items: selectedProducts.map((selectedProduct) => {
    let product = storedProducts.find((p) => p._id === selectedProduct.id);
    return {
      category: product._category,
      productName: product._name,
      unit: product._unit,
      quantity: selectedProduct.quantity,
      expirationDate: product._expirationDate,
      srp: product._srp
    };
  }),
   totalSrp: totalSrp,
   totalCost: totalCost,
   date: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
};
  // Store the transaction in the local storage
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions.push(transactionDetails);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  // Clear the transfer table and update the stored products in the local storage
  transferTableBody.empty();
  localStorage.setItem('products', JSON.stringify(storedProducts));

  // Display a modal message when transaction is successful
  let modal = $('<div>').addClass('modal');
  let modalContent = $('<div>').addClass('modal-content');
  let message = $('<p>').text('Transaction successful!').prepend('<i class="uil uil-check-circle"></i>');
  modalContent.append(message);
  modal.append(modalContent);
  $('body').append(modal);
  modal.addClass('success-modal');
  modal.on('click', function() {
  modal.remove();
});
 // Generates transaction receipt
  generateTransactionReceipt(selectedProducts, totalSrp);
  viewAllProducts();
  clearTransferTable();
});
  //Clear the transfer table
   function clearTransferTable() {
  $('#transferTableBody').empty();
  $('#totalSrp').text('Total SRP: PHP 0.00');
}
   // Call the filter function when the user selects a category
  $("#productCategory").on("change", filterProductsByCategory);

  // Call the filter function when the user types in the search box
  $("#productSearch").on("input", filterProductsBySearch);

