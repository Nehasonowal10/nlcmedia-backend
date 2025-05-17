const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
});

const Contact = mongoose.model('Contact', contactSchema);

app.post('/submit-form', async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const newMessage = new Contact({name, email, subject, message});
        await newMessage.save();
        res.status(200).json({message: 'Message submitted successfully'});
    } catch(error) {
        console.error(error);
        res.status(500).json({message: 'Something went wrong'});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



