const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


const Touch = mongoose.model('Touch', {
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
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
  }
});

app.post('/addtouch', async (req, res) => {
  try {

    let mytouch = await Touch.find({});
    let id;
    if (mytouch.length > 0) {
      let last_product = mytouch[mytouch.length - 1];
      id = last_product.id + 1;
    } else {
      id = 1;
    }

    const touch = new Touch({
      id: id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message
    });

    await touch.save();

    res.json({
      success: true,
      name: req.body.name
    })

    console.log("Message send successfully by ", req.body.name)

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
app.get('/gettouch', async (req, res) => {
  let touch = await Touch.find({});
  console.log("All Get in Touch fetched ");
  res.send(touch);
})

app.post('/removetouch', async (req, res) => {
  try {
    await Touch.findOneAndDelete({
      id: req.body.id
    });
    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
})

const Quote = mongoose.model('quote', {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique:false
  },
  phone: {
    type: String,
    required: true
  },
  services: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    required: true
  },
  timeline: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

app.post('/addquote', async (req, res) => {
  try {

    let mytouch = await Quote.find({});
    let id;
    if (mytouch.length > 0) {
      let last_product = mytouch[mytouch.length - 1];
      id = last_product.id + 1;
    } else {
      id = 1;
    }

    const quote = new Quote({
      id: id,
      name: req.body.name,
      company:req.body.company,
      email: req.body.email,
      phone: req.body.phone,
      services:req.body.services,
      budget:req.body.budget,
      timeline:req.body.timeline,
      description:req.body.description,
    });

    await quote.save();

    res.json({
      success: true,
      name: req.body.name
    })

    console.log("Message send successfully by ", req.body.name)

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

app.get('/allquote', async (req, res) => {
  let quote = await Quote.find({});
  console.log("All Get in Touch fetched ");
  res.send(quote);
})

app.post("/removequote",async(req,res)=>{
  try {
    await Quote.findOneAndDelete({
      id: req.body.id
    });
    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
})

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));