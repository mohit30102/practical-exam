const Course = require('../model/data');

// Create a new course
createCourse = async (req, res) => {
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
};

// Get all courses
getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Course actions handling
// async function deleteCourse(id) {
//     try {
//       const response = await fetch(`/api/courses/${id}`, {
//         method: 'DELETE'
//       });
//       if (response.ok) {
//         document.getElementById(`course-${id}`).remove();
//       }
//     } catch (error) {
//       console.error('Error deleting course:', error);
//     }
//   }
  
//   async function updateCourse(id) {
//     window.location.href = `/courses/edit/${id}`;
//   }
  
//   // Event delegation for course actions
//   document.addEventListener('click', (e) => {
//     if (e.target.matches('.delete-btn')) {
//       if (confirm('Are you sure you want to delete this course?')) {
//         deleteCourse(e.target.dataset.id);
//       }
//     } else if (e.target.matches('.update-btn')) {
//       updateCourse(e.target.dataset.id);
//     }
//   });

export {createCourse,getAllCourses,getCourseById,updateCourse,deleteCourse}