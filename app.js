new Vue({
  el: '#app',
  data: {
    sitename: "After School Club",
    showProduct: true,
    order: {
      firstName: '',
      lastName: '',
      phone: '',
      firstNameError: false,
      lastNameError: false,
      phoneError: false,
    },
    lessons: [
      { id: 1, subject: "Maths", location: "London", price: 320, image: "assets/maths.jpg", availableInventory: 17 },
      { id: 2, subject: "Biology", location: "New York", price: 125, image: "assets/bio.jpg", availableInventory: 22 },
      { id: 3, subject: "History", location: "Paris", price: 65, image: "assets/history.jpg", availableInventory: 10 },
      { id: 4, subject: "Music", location: "Columbia", price: 29, image: "assets/music.jpg", availableInventory: 20 },
      { id: 5, subject: "Art & Craft", location: "Sydney", price: 99, image: "assets/art.jpg", availableInventory: 10 },
      { id: 6, subject: "IT", location: "San Francisco", price: 220, image: "assets/it.jpg", availableInventory: 12 },
      { id: 7, subject: "English", location: "Chicago", price: 35, image: "assets/english.jpg", availableInventory: 17 },
      { id: 8, subject: "Physics", location: "Berlin", price: 150, image: "assets/physics.jpg", availableInventory: 23 },
      { id: 9, subject: "Chemistry", location: "Tokyo", price: 299, image: "assets/chemistry.jpg", availableInventory: 30 },
      { id: 10, subject: "Accounts", location: "Los Angeles", price: 175, image: "assets/accounts.jpg", availableInventory: 15 }
    ],
    cart: [],
    searchQuery: '',
    sortAttribute: '',
    sortOrder: 'asc'
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
      this.showProduct = !this.showProduct;
    },
    validateFirstName() {
    // Only letters allowed
    const regex = /^[a-zA-Z]+$/;
    this.firstNameError = !regex.test(this.firstName);
  },
  validateLastName() {
    // Only letters allowed
    const regex = /^[a-zA-Z]+$/;
    this.lastNameError = !regex.test(this.lastName);
  },
  validatePhone() {
    // Only numbers allowed
    const regex = /^[0-9]+$/;
    this.phoneError = !regex.test(this.phone);
  },
  placeOrder() {
// Ensure all fields are validated before placing the order
this.validateFirstName();
this.validateLastName();
this.validatePhone();

if (!this.firstNameError && !this.lastNameError && !this.phoneError) {
  alert('Order placed successfully!');
  this.showProduct = true; // Navigate back to products
} else {
  alert('Please correct the errors in the form.');
}
},
    resetOrder() {
      this.order = { firstName: '', lastName: '', phone: '' };
      this.cart = [];
      this.showProduct = true;
    },
  },
  computed: {
    isOrderDisabled() {
    // The button is disabled if there's any error in the fields
    return this.firstNameError || this.lastNameError || this.phoneError;
  },
    cartTotal() {
return this.cart.reduce((total, item) => total + item.price, 0);
},
    cartItemCount() {
      return this.cart.length;
    },
    canPlaceOrder() {
// Only enable the "Place Order" button when all validations pass
return (
  !this.firstNameError &&
  !this.lastNameError &&
  !this.phoneError &&
  this.order.firstName &&
  this.order.lastName &&
  this.order.phone
);
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