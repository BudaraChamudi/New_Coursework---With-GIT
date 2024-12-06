new Vue({
  el: '#app',

  data: {
    sitename: "After School Club",
    showProduct: true, // Controls whether to show the product page or the checkout page
    order: {
      firstName: '',
      lastName: '',
      phone: '',
      address: ''
    },
    errors: {
      firstName: '',
      lastName: '',
      phone: ''
    },
    lessons: [],
    cart: [],
    searchQuery: '',
    sortAttribute: '',
    sortOrder: 'asc'
  },
  created: function () { // Automatically runs when creating the Vue instance
    fetch("http://localhost:3000/collection/Products")
      .then(response => response.json())
      .then(data => {
        this.lessons = data;
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        alert("Failed to load products.");
      });
  },
  methods: {
    getLessonImage(lessonId) {
      const lesson = this.lessons.find(lesson => lesson.id === lessonId);
      return lesson ? lesson.image : '';
    },

    addToCart(lesson) {
      if (lesson.availableInventory > 0) {
        this.cart.push({ id: lesson.id, subject: lesson.subject, price: lesson.price });
        lesson.availableInventory--;
    
        // Perform a PUT request to update inventory in the database
        fetch(`http://localhost:3000/collection/Products/${lesson._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ availableInventory: lesson.availableInventory - 1}),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to update inventory");
          }
          return response.json();
        })
        .then(data => {
          console.log("Inventory updated successfully:", data);
        })
        .catch(error => {
          console.error("Error updating inventory:", error);
        });
      } else {
        console.error("No inventory available for this lesson.");
      }
    },
    
    

    removeFromCart(item) {
      const itemIndex = this.cart.findIndex(cartItem => cartItem.id === item.id);
      if (itemIndex !== -1) {
        this.cart.splice(itemIndex, 1);
        const lesson = this.lessons.find(lesson => lesson.id === item.id);
        if (lesson) lesson.availableInventory++;
      }
    },

    showCheckout() {
      this.showProduct = !this.showProduct; // Toggle between product and checkout sections
    },
    validateFirstName() {
      const regex = /^[A-Za-z]+$/;
      this.errors.firstName = regex.test(this.order.firstName) ? '' : 'First name must only contain letters.';
    },
    validateLastName() {
      const regex = /^[A-Za-z]+$/;
      this.errors.lastName = regex.test(this.order.lastName) ? '' : 'Last name must only contain letters.';
    },
    validatePhone() {
      const regex = /^\d{10}$/;
      this.errors.phone = regex.test(this.order.phone) ? '' : 'Phone number must be exactly 10 digits and contain only numbers.';
    },
  placeOrder() {
    // Validate inputs
    this.validateFirstName();
    this.validateLastName();
    this.validatePhone();
  
    // Check if there are any validation errors
    if (this.errors.firstName || this.errors.lastName || this.errors.phone) {
      alert("Please fix the errors in the form before placing the order.");
      return;
    }
  
    // Proceed if the form is valid and canPlaceOrder is true
    if (this.canPlaceOrder) {
      const newOrder = {
        firstName: this.order.firstName,
        lastName: this.order.lastName,
        phone: this.order.phone,
        address: this.order.address,
        cart: this.cart // Include the items in the cart in the order
      };
  
      fetch("http://localhost:3000/collection/Orders", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to submit order.');
          }
          return response.json();
        })
        .then(data => {
          alert('Order submitted successfully!');
  
          // Update product availability
          
          // Wait for all updates to complete
          return Promise.all(updatePromises);
        })
        .then(() => {
          console.log('All product availability updated successfully.');
          this.resetOrder(); // Reset the order and cart after processing
        })
        .catch(error => {
          console.error('Error occurred:', error);
        });
    } else {
      alert("Please complete all required fields and ensure the cart is not empty before placing the order.");
    }
  },
  

    resetOrder() {
      this.order = { firstName: '', lastName: '', phone: '', address: '' };
      this.cart = [];
      this.showProduct = true;
    }
  },

  computed: {
    cartTotal() {
      return this.cart.reduce((total, item) => total + item.price, 0);
    },
    cartItemCount() {
      return this.cart.length;
    },
    canPlaceOrder() {
      // Check if all fields are filled
      const isFirstNameFilled = this.order.firstName.trim() !== '';
    const isLastNameFilled = this.order.lastName.trim() !== '';
    const isPhoneFilled = this.order.phone.trim() !== '';
    const isAddressFilled = this.order.address.trim() !== '';
    const isCartNotEmpty = this.cart.length > 0;

    // Ensure no validation errors exist
    const noErrors = !this.errors.firstName && !this.errors.lastName && !this.errors.phone;

      // The button is enabled when all fields are filled, no errors exist, and the cart is not empty
    return isFirstNameFilled && isLastNameFilled && isPhoneFilled && isAddressFilled && isCartNotEmpty && noErrors;
    },

    filteredLessons() {
      let lessons = this.lessons.filter(lesson => {
        return (
          lesson.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          lesson.location.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          lesson.price.toString().includes(this.searchQuery) ||
          lesson.availableInventory.toString().includes(this.searchQuery)
        );
      });

      if (this.sortAttribute) {
        lessons.sort((a, b) => {
          let modifier = this.sortOrder === 'asc' ? 1 : -1;
          if (a[this.sortAttribute] < b[this.sortAttribute]) return -1 * modifier;
          if (a[this.sortAttribute] > b[this.sortAttribute]) return 1 * modifier;
          return 0;
        });
      }
      return lessons;
    }
  }
});
