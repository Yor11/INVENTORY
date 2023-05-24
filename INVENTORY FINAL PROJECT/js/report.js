let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add dateTime property to each transaction object
transactions.forEach((transaction) => {
  transaction.dateTime = new Date(transaction.date).toLocaleString('en-US', {timeZone: 'Asia/Manila'});
});

// Define the start and end dates
let startDate = new Date('2023-05-01');
let endDate = new Date('2023-05-14');

// Update the start and end dates when the form is submitted
$('#dateRangeForm').on('submit', function(e) {
  e.preventDefault();
  startDate = new Date($('#startDate').val());
  endDate = new Date($('#endDate').val());
  $('#startDateDisplay').text(startDate.toLocaleDateString());
  $('#endDateDisplay').text(endDate.toLocaleDateString());
  renderSalesReport();
});

// Render the sales report
function renderSalesReport() {
  // Filter the transactions array based on the date range
  let filteredTransactions = transactions.filter((transaction) => {
    let transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  // Calculate total sales and profit
  let totalSales = 0;
  let totalProfit = 0;
  filteredTransactions.forEach((transaction) => {
    totalSales += transaction.totalSrp;
    totalProfit += transaction.totalSrp - transaction.totalCost;
  });

  // Calculate average sales and profit per transaction
  let averageSales = $.map(filteredTransactions, (transaction) => transaction.totalSrp).reduce((a, b) => a + b, 0) / filteredTransactions.length || 0;
  let averageProfit = $.map(filteredTransactions, (transaction) => transaction.totalSrp - transaction.totalCost).reduce((a, b) => a + b, 0) / filteredTransactions.length || 0;

// Create the sales report HTML
let salesReportHtml = `
  <h2>SALES REPORT</h2>
  <p><strong>TOTAL SALES:</strong> ${totalSales.toFixed(2)}</p>
  <p><strong>TOTAL PROFIT:</strong> ${totalProfit.toFixed(2)}</p>
  <p><strong>AVERAGE SALES:</strong> ${averageSales.toFixed(2)}</p>
  <p><strong>AVERAGE PROFIT:</strong> ${averageProfit.toFixed(2)}</p>
`;

// Iterate through each transaction and add its details to the sales report HTML
filteredTransactions.forEach((transaction, index) => {
  salesReportHtml += `
    <h4>Transaction #${index + 1}</h4>
    <table class="transactionItems">
    <thead>
    <tr>
      <th>TRANSACTION DATE</th>
      <th>PRODUCT CATEGORY</th>
      <th>PRODUCT NAME</th>
      <th>UNIT</th>
      <th>QUANTITY</th>
      <th>EXPIRATION DATE</th>
      <th>PRICE</th>
    </tr>
  </thead>  
      <tbody>
  `;
  transaction.items.forEach((item) => { // Iterate over each item in the transaction
    salesReportHtml += ` 
      <tr>
        <td>${transaction.dateTime}</td> 
        <td>${item.category}</td> 
        <td>${item.productName}</td> 
        <td>${item.unit}</td> 
        <td>${item.quantity}</td> 
        <td>${item.expirationDate}</td> 
        <td>${item.srp}</td> 
      </tr>
    `;
  });
  salesReportHtml += ` 
    </tbody>
    <tfoot>
      <tr>
        <td colspan="6">Total SRP:</td> 
        <td>${transaction.totalSrp.toFixed(2)}</td> 
      </tr>
    </tfoot>
  </table>
  `;  
});
   // Append the sales report HTML to the new div element
   $('#salesReport').html(salesReportHtml);

}
  function displayInventoryReport() {
  // Retrieve stored products from local storage
  let storedProducts = JSON.parse(localStorage.getItem("products"));

  // Calculate the total number of products
  let totalNumberOfProducts = storedProducts.length;

  // Calculate inventory value by category
  let inventoryValueByCategory = {};
  storedProducts.forEach((product) => {
    if (inventoryValueByCategory[product._category]) {
      inventoryValueByCategory[product._category].value += product._quantity * product._srp;
      inventoryValueByCategory[product._category].quantity += parseInt(product._quantity);
    } else {
      inventoryValueByCategory[product._category] = { value: product._quantity * product._srp, quantity: parseInt(product._quantity) };
    }
  });

  // Get current date and time
  let now = new Date();
  let dateTimeString = now.toLocaleString();

  // Build the inventory report HTML
  let inventoryReport = '';
  inventoryReport += `<p><strong>DATE & TIME:</strong> ${dateTimeString}</p>`;
  inventoryReport += `<p><strong>TOTAL NUMBER OF PRODUCTS:</strong> ${totalNumberOfProducts}</p>`;
  inventoryReport += `<table>
                      <tr>
                        <th>CATEGORY</th>
                        <th>TOTAL VALUE</th>
                        <th>QUANTITY</th>
                      </tr>`;
  // Iterate over inventory value by category and add rows to the inventory report table
  for (let category in inventoryValueByCategory) {
    let categoryValue = inventoryValueByCategory[category].value.toFixed(2);
    let categoryQuantity = inventoryValueByCategory[category].quantity;
    inventoryReport += `<tr>
                          <td>${category}</td>
                          <td>${categoryValue}</td>
                          <td>${categoryQuantity}</td>
                        </tr>`;
  }
  inventoryReport += `</table><br><br><table>`;
  inventoryReport += `<tr>
                        <th>PRODUCT NAME</th>
                        <th>QUANTITY ON HAND</th>
                        <th>COST</th>
                        <th>TOTAL VALUE</th>
                        <th>PRODUCT STATUS</th>
                        <th>UNIT</th>
                      </tr>`;
  // Adding table headers for the inventory report
  storedProducts.forEach((product) => {
    let productTotalValue = (product._quantity * product._srp).toFixed(2);
    // Calculating the total value of the product by multiplying quantity and SRP 
    let productStatus = "";
    if (product._quantity == 0) {
      productStatus = "OUT OF STOCK";
    } else if (product._quantity < product._reorderLevel) {
      productStatus = "LOW STOCK";
    } else {
      productStatus = "IN STOCK";
    }
    // Determining the status of the product based on its quantity and reorder level
    let productRow = `
      <tr>
        <td>${product._name}</td>
        <td>${product._quantity}</td>
        <td>${product._srp}</td>
        <td>${productTotalValue}</td>
        <td>${productStatus}</td>
        <td>${product._unit}</td>
      </tr>
    `;
    // Creating a row in the inventory report table with product details
    inventoryReport += productRow;
  });
  // Set the HTML content of the element with the ID "inventory-report" to the generated inventory report
  $("#inventory-report").html(inventoryReport);
}
// Call function to display inventory report on page load
$(document).ready(displayInventoryReport);

  let storedProducts = JSON.parse(localStorage.getItem("products"));
  // This function generates a purchase report
  function generatePurchaseReport(products, allProducts = false) {
  let table = $('#purchaseReportTableBody');
  table.empty();
  let totalCost = 0;
  let productsToDisplay;
  
  if (allProducts) {
    // Display all stored products
    productsToDisplay = storedProducts;
  } else {
    // Display only the provided products
    productsToDisplay = products;
  };
  if (productsToDisplay.length === 0) {
    // Display a message if no products are found
    table.append('<tr><td colspan="5">No purchase found.</td></tr>');
  } else {
    // Iterate through each product and display its details in a table row
    productsToDisplay.forEach((product) => {
      let row = $('<tr>');
      row.html(`
        <td>${product._id}</td>
        <td>${product._name}</td>
        <td>${product._quantity}</td>
        <td>${product._cost}</td>
        <td>${(product._cost * product._quantity).toFixed(2)}</td>
      `);
      totalCost += product._cost * product._quantity;
      table.append(row);
    });
    // Display the total cost row
    let totalRow = $('<tr>');
    totalRow.html(`
      <td colspan="4"><strong>Total Cost:</strong></td>
      <td><strong>${totalCost.toFixed(2)}</strong></td>
    `);
    table.append(totalRow);
  }
}
  // Set the text of the button to "Filter"
  $('#generateButton').text('Filter');

  // Handle the form submission for date filtering
  $('#dateFilterForm').on('submit', function(event) {
   event.preventDefault();
   let startDate = $('#startDate').val();
   let endDate = $('#endDate').val();
  
   // Filter the stored products based on the selected date range
   let filteredProducts = storedProducts.filter(product => {
    return product._purchaseDate >= startDate && product._purchaseDate <= endDate;
   });
     // Generate the purchase report for the filtered products
    generatePurchaseReport(filteredProducts, false);
   });
   // Generate the purchase report for all stored products
   generatePurchaseReport(storedProducts, true);

  // This function filters products based on their expiration date
   function filterProductsByExpirationDate() {
  let currentDate = new Date();
  let filteredProducts = [];
  filteredProducts = storedProducts.filter((product) => {
    let expirationDate = new Date(product._expirationDate);
    // Include products that have already expired but have not been marked as "expired"
    if (expirationDate <= currentDate || product._status === "expired") {
      return true;
    }
    // Include products that expire within 5 days
    let daysToExpiration = Math.floor((expirationDate - currentDate) / (1000 * 60 * 60 * 24));
    if (daysToExpiration <= 5 && daysToExpiration >= 0) {
      return true;
    }
    // Include products that expire within 3 days
    if (daysToExpiration <= 3 && daysToExpiration > 0) {
      return true;
    }
    return false;
  });
  // Render the filtered products in a table
  let table = document.getElementById("expiredProductTableBody");
  table.innerHTML = "";
  filteredProducts.forEach((product) => {
    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${product._id}</td>
    <td>${product._category}</td>
    <td>${product._name}</td>
    <td>${product._unit}</td>
    <td>${product._srp}</td>
    <td>${product._cost}</td>
    <td>${product._quantity}</td>
    <td>${product._expirationDate}</td>
    `;
    table.appendChild(row);
  });
  // Display a message when there are no expired or near-to-expired products
  if (filteredProducts.length === 0) {
    let messageRow = document.createElement("tr");
    messageRow.innerHTML = "<td colspan='8'>No expired or near-to-expired products found.</td>";
    table.appendChild(messageRow);
  }
}
// Call the function to filter products by expiration date and render them in the table
filterProductsByExpirationDate();

