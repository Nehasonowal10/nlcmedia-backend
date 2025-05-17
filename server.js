const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Try to load .env file, but don't fail if it doesn't exist
try {
    dotenv.config();
} catch (error) {
    console.log('No .env file found, using default configuration');
}

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use default MongoDB URI if not provided in .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nlc_media';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if cannot connect to database
});

//schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema);

app.post('/submit-form', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    try {
        const newMessage = new Contact({name, email, subject, message});
        await newMessage.save();
        res.status(200).json({message: 'Message submitted successfully'});
    } catch(error) {
        console.error('Error submitting form:', error);
        res.status(500).json({message: 'Something went wrong', error: error.message});
    }
});

//server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


    
