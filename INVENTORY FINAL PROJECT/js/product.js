 // A class representing a product with its properties and methods
class Product {
  // A static property to track the last assigned id
  static lastId = 0;
  // Constructor to initialize the properties of a product
  constructor(category, name, unit, srp, cost, quantity, expirationDate, createdAt = null) {
  // Increment and assign a unique id to the product
  this._id = ++Product.lastId;
  this._category = category;
  this._name = name;
  this._unit = unit;
  this._srp = srp;
  this._cost = cost;
  this._quantity = quantity;
  this._expirationDate = expirationDate;
  // Assign the creation date and time of the product
  this._createdAt = createdAt === null ? new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }) : createdAt;
  }
  // Getters and setters for the properties of the product
  get id() {
    return this._id;
  }
  get category() {
    return this._category;
  }
  set category(category) {
    this._category = category;
  }
  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
  }
  get unit() {
    return this._unit;
  }
  set unit(unit) {
    this._unit = unit;
  }
  get srp() {
    return this._srp;
  }
  set srp(srp) {
    this._srp = srp;
  }
  get cost() {
    return this._cost;
  }
  set cost(cost) {
    this._cost = cost;
  }
  get quantity() {
    return this._quantity;
  }
  set quantity(quantity) {
    this._quantity = quantity;
  }
  get expirationDate() {
    return this._expirationDate;
  }
  set expirationDate(expirationDate) {
    this._expirationDate = expirationDate;
  }
  get createdAt() {
    return this._createdAt;
  }
}
  // Class representing a ProductHelper with methods to manage products
  class ProductHelper {
    constructor() {
  // Retrieve stored products or create empty array
  this.products = this._getStoredProducts();
  // Get the table body element to display products
  this.productTableBody = $("#productTableBody");
  // Get the button element to add a new product
  this.addProductBtn = $("#addProductBtn");
  // Add click event listener to the add product button
  this.addProductBtn.on("click", (event) => this.addProductHandler(event));
  this.renderProducts();
}
_getStoredProducts() {
  // Get products from local storage or return empty array
  let products = JSON.parse(localStorage.getItem("products")) || [];
  // Create new Product objects for each stored product and return as an array
  return products.map(p => new Product(p._category, p._name, p._unit, p._srp, p._cost, p._quantity,
                         p._expirationDate, p._createdAt, p.id));
  }
  _storeProducts() {
    // Update the ID values of the products based on their index
    this.products.forEach((product, index) => {
      product._id = index + 1;
    });
    // Store the updated products array in local storage
    localStorage.setItem("products", JSON.stringify(this.products));
  }
  
  // Render all products in the table
  renderProducts() {
  // clear the table body first
  this.productTableBody.empty();
  // loop through each product and create a table row for each
  this.products.forEach(product => {
  // fill in the table cells with the product properties
  let row = $("<tr>").html(`
        <td>${product.id}</td>
        <td>${product.category}</td>
        <td>${product.name}</td>
        <td>${product.unit}</td>
        <td>${product.srp}</td>
        <td>${product.cost}</td>
        <td>${product.quantity}</td>
        <td>${product.expirationDate}</td>
        <td>
          <button data-id="${product.id}" class="deleteBtn">
            <i class="uil uil-trash-alt"></i>
          </button>
          <button data-id="${product.id}" class="editBtn">
            <i class="uil uil-edit"></i>
          </button>
        </td>
      `);
  // append the row to the table body
  this.productTableBody.append(row);
  });
  // add click listeners to the delete and edit buttons
  this.addDeleteListeners();
  this.addEditListeners();
  }
// Add click listeners to all delete buttons
  addDeleteListeners() {
    let deleteBtns = $(".deleteBtn");
    deleteBtns.on("click", (event) => {
      // handle delete button click event
      this.deleteProductHandler(event);
    });
  }
  deleteProductHandler(event) {
    // Get the product ID from the clicked delete button
    let id = parseInt($(event.target).closest(".deleteBtn").data("id"));
    // Find the product with the ID in the products array
    let productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      // Remove the product from the products array
      this.products.splice(productIndex, 1);
      // Update the IDs of the remaining products
      this._storeProducts();
      // Render all products in the table again
      this.renderProducts();
    }
  }
  addEditListeners() {
  // Attach a click event listener to all elements with the "editBtn" class
  $(document).on('click', '.editBtn', (event) => {
  // Call the editProductHandler function and pass the event object as an argument
    this.editProductHandler(event);
    });
  }
   editProductHandler(event) {
  let id = parseInt($(event.target).data("id"));
  let index = this.products.findIndex(product => product.id === id);
  let product = this.products[index];
    // Set the editingProductId property to the id of the product being edited
  this.editingProductId = id;
    // Fill in the add product form with the product details
  fillProductForm(product);
    // Change the form submit button text to "Update"
  $("#addProductBtn").text("UPDATE");
    // Update the product object with new values on form submission
    $("#productForm").on("submit", (event) => {
  });
}
  addProductHandler(event) {
  event.preventDefault();
  // Check if the form is in edit mode or add mode
  let isEditMode = !!this.editingProductId;
  let product;
  
  if (isEditMode) {
  // Editing an existing product
    let index = this.products.findIndex(
        (product) => product.id === this.editingProductId
      );
    product = this.products[index];
    // Update the product object with the new values
    product.category = $("#productCategory").val();
    product.name = $("#productName").val();
    product.unit = $("#unitCategory").val();
    product.srp = $("#srp").val();
    product.cost = $("#cost").val();
    product.quantity = $("#quantity").val();
    product.expirationDate = $("#expirationDate").val();
    // Reset the editing product id to null
    this.editingProductId = null;
    } else {
    // Adding a new product
      let category = $("#productCategory").val();
      let name = $("#productName").val();
      let unit = $("#unitCategory").val();
      let srp = $("#srp").val();
      let cost = $("#cost").val();
      let quantity = $("#quantity").val();
      let expirationDate = $("#expirationDate").val();
    product = new Product(
        category,
        name,
        unit,
        srp,
        cost,
        quantity,
        expirationDate
    );
      this.products.push(product);
  }
    // Store the updated products array in local storage
    this._storeProducts();
    // Reset the input fields
    $("#productCategory").val("");
    $("#productName").val("");
    $("#unitCategory").val("");
    $("#srp").val("");
    $("#cost").val("");
    $("#quantity").val("");
    $("#expirationDate").val("");
    // Change the form submit button text to "Add Product"
    $("#addProductBtn").text("ADD PRODUCT");
    // Render the products list
    this.renderProducts();
  }
}
  function fillProductForm(product) {
  $("#productCategory").val(product.category);
  $("#productName").val(product.name);
  $("#unitCategory").val(product.unit);
  $("#srp").val(product.srp);
  $("#cost").val(product.cost);
  $("#quantity").val(product.quantity);
  $("#expirationDate").val(product.expirationDate);
 }
  // Creating an instance of the ProductHelper class
  let productHelper = new ProductHelper();
  