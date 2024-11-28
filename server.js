const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/afterSchoolClub', { useNewUrlParser: true, useUnifiedTopology: true });

const lessonSchema = new mongoose.Schema({
  subject: String,
  location: String,
  price: Number,
  image: String,
  availableInventory: Number,
});
const Lesson = mongoose.model('Lesson', lessonSchema);

const orderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  cart: Array,
  total: Number,
});
const Order = mongoose.model('Order', orderSchema);

app.get('/lessons', async (req, res) => {
  const lessons = await Lesson.find();
  res.json(lessons);
});

app.post('/orders', async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.json({ message: 'Order placed successfully!' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
