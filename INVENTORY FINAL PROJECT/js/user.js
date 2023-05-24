// Define User class with constructor method
class User {
  constructor(username, email, password, role) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    
  }
}
// Define AccountManager class with constructor and methods
class AccountManager {
  constructor() {
      // Load users and current user from local storage, or set empty values if none found
    this.users = JSON.parse(localStorage.getItem('users')) || [];
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;
  }
  register(username, email, password, role) {
    // Check if any input fields are empty
    if (!username || !email || !password || !role) {
      alert('Please fill in all fields.');
      return null;
    }
    // Check if user with given email already exists
    let existingUser = this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      alert('An account with this email already exists. Please try again with a different email.');
      return null;
    }
    // Create and add new user to users list in local storage
    let user = new User(username, email, password, role);
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
    this.loggedInUser = user;
    return user;
  }
  
  login(username, password) {
    // Check if any input fields are empty
    if (!username || !password) {
      alert('Please enter your email and password.');
      return false;
    }
    let user = this.users.find(user => user.email.toLowerCase() === username.toLowerCase());
    if (user && user.password === password) {
      this.loggedInUser = user;
      localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser));
      if (user.role === 'cashier') {
        window.location.href = '/html/customer.html'; // redirect to cashier page
      } else if (user.role === 'admin') {
        $(this).trigger('reset'); // clear input fields
        window.location.href = '/html/home.html'; // redirect to admin page
      }
      alert('Login successful!');      
      // Update the display of the current user in local storage
      let currentUser = AccountManager.getCurrentUser();
      console.log('Current user:', currentUser);   
      return true;
    }
    return false;
  }
   // Logout function
logout() {
    // Create a modal element
  let modal = $('<div>').addClass('modal').attr('id', 'logout-modal');
  let modalContent = $('<div>').addClass('modal-content');
  let message = $('<p>').text('Are you sure you want to log out?');
  let cancelButton = $('<button>').text('CANCEL');
  cancelButton.on('click', function() {
    modal.remove();
  });
  let logoutButton = $('<button>').text('LOG OUT');
  logoutButton.on('click', () => {
    this.loggedInUser = null;
    localStorage.removeItem('loggedInUser');
    $('#current-user').text(''); // clear the display of the current user
    window.location.href = '/html/index.html'; // redirect to login page
  });
  modalContent.append(message, cancelButton, logoutButton);
  modal.append(modalContent);
  $('body').append(modal);

  // Add class to body to blur the background
  $('body').addClass('modal-open');

 // Remove modal and body blur when clicking anywhere outside the modal
modal.on('click', function(event) {
  if (event.currentTarget === this) {
    modal.remove();
    $('body').removeClass('modal-open');
  }
});
return false;
}
  // Return current user from local storage
  getCurrentUser() {
    return this.loggedInUser;
  } 
  getUsers() {
    return this.users;
  }

    // Create a new cashier account by calling register method with 'cashier' role
    createCashierAccount(username, email, password) {
      let user = this.register(username, email, password, 'cashier');
    return user;
  }
    // Create a new admin account by calling register method with 'admin' role
  createAdminAccount(username, email, password) {
    let user = this.register(username, email, password, 'admin');
    return user;
  }

  // Return list of all cashier accounts from users list
    getCashierAccounts() {
    return this.users.filter(user => user.role === 'cashier');
   }
}
     
// Wait for document to be ready
$(document).ready(function() {
  let accountManager = new AccountManager();

  let users = accountManager.getUsers();
  let userListElement = $('#user-list');
  userListElement.empty();
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    let userRowElement = $('<tr>').addClass('user');
    userRowElement.append($('<td>').addClass('username').text(user.username));
    userRowElement.append($('<td>').addClass('email').text(user.email));
    userRowElement.append($('<td>').addClass('role').text(user.role));
    userListElement.append(userRowElement);
  }
  $('#user-modal-link').on('click', function(e) {
    e.preventDefault();
    $('#user-modal').show();
    $('.modal-overlay').show(); //show the overlay
  });
  
  $('.close').click(function() {
    $('#user-modal').hide();
    $('.modal-overlay').hide(); // Hide the overlay 
  });
  $('#register-btn').click(function(e) {
    e.preventDefault();
    let username = $('#register-form input[name="username"]').val();
    let email = $('#register-form input[name="email"]').val();
    let password = $('#register-form input[name="pswd"]').val();
    let role = $('#register-form select[name="role"]').val();
    let user = accountManager.register(username, email, password, role);
    if (user) { // check if the returned user object is not null
      // Register new user and show alert message
      alert('Successfully registered');
      // Reset registration form and show login form
      $('#register-form').trigger('reset');
      $('#login-form').show(); // show the login form
      $('#register-form').hide(); // hide the registration form
      
    }  
});
 // Login button clicked
   $('#login-btn').click(function(e) {
  e.preventDefault();
  let username = $('#login-form input[name="email"]').val(); // assuming email is used as the username
  let password = $('#login-form input[name="pswd"]').val();
  let isLoggedIn = accountManager.login(username, password);
  if (isLoggedIn) {
    $(this).trigger('reset'); // clear input fields
    window.location.href = '/html/home.html';
    // Display current user in local storage
    let currentUser = accountManager.getCurrentUser();
    $('#current-user').text(currentUser.username);
  } else {
    alert('Invalid username or password!');
   }
});
// Handle Logout click event
$('#logout').click(function(e) {
  e.preventDefault();
  accountManager.logout();
});
  $('#create-account-link').click(function(e) {
    e.preventDefault();
    $('#login-form').hide();
    $('#register-form').show();
  });
  // Display current user in local storage
  let currentUser = accountManager.getCurrentUser();
  $('#current-user').text(currentUser.username);
});

