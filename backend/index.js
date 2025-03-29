const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: "*", // Allow all origins OR use Netlify domain instead of "*"
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const PORT = 5000;

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const User = mongoose.model('user', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  con_password: {
    type: String
  }
})

const verifyToken = (req, res, next) => {
  const token = req.header('token');
  if (!token) {
    return res.status(401).send({
      errors: "Please authenticate using valid token"
    });
  }
  try {
    const data = jwt.verify(token, 'secret_ecom');
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({
      errors: "Please authenticate using valid token"
    });
  }
};

app.post('/signup', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      conpassword
    } = req.body;

    // Check if username exists
    let check = await User.findOne({
      email
    });
    if (check) {
      return res.status(400).json({
        success: false,
        error: "Username already exists!"
      });
    }

    // Check if passwords match
    if (password !== conpassword) {
      return res.status(400).json({
        success: false,
        error: "Passwords do not match!"
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      con_password: conpassword
    });
    await user.save();

    const token = jwt.sign({
      userId: user._id
    }, 'secret_ecom', {
      expiresIn: '1h'
    });

    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

app.post('/login', async (req, res) => {
  let user = await User.findOne({
    email: req.body.email
  });
  if (user) {
    const passcompare = req.body.password === user.password;
    if (passcompare) {
      const data = {
        user: {
          id: user.id
        }
      };

      const token = jwt.sign(data, 'secret_ecom');
      res.json({
        success: true,
        token
      });
    } else {
      res.json({
        success: false,
        errors: "Wrong password"
      });
    }
  } else {
    res.json({
      success: false,
      errors: "Wrong email id"
    });
  }
});

app.get("/peruser", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
});

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
    unique: false
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
      company: req.body.company,
      email: req.body.email,
      phone: req.body.phone,
      services: req.body.services,
      budget: req.body.budget,
      timeline: req.body.timeline,
      description: req.body.description,
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

app.post("/removequote", async (req, res) => {
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