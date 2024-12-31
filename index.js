const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const multer = require('multer');
const Course = require('./src/model/data');


const app = express()

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "src", "views"))


app.use(express.json())
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("about", {courses: courses});
  } catch (error) {
    
  }
});
app.get('/service', async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const updateData = {
      title,
      description,
      price: parseFloat(price)
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/contact', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete associated image if it exists
    if (course.imageUrl) {
      const imagePath = path.join(__dirname, course.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/data', (req, res) => {
  res.render('data');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.post('/api/courses', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const course = new Course({
      title,
      description,
      imageUrl,
      price: parseFloat(price)
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read - GET all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read - GET single course by ID
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update - PUT update course
app.put('/api/courses/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const updateData = {
      title,
      description,
      price: parseFloat(price)
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete - DELETE course
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete associated image if it exists
    if (course.imageUrl) {
      const imagePath = path.join(__dirname, course.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(8000, () => {
  console.log(`server stared on http://localhost:8000/`)
  mongoose.connect("mongodb://localhost:27017")
})