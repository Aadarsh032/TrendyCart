const PORT = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
//For Authentication
const jwt = require('jsonwebtoken')
// To Upload Images through Admin Panel
const multer = require('multer');
// Path to backend Directory
const path = require('path');

const cors = require('cors');
const { type } = require('os');

const corsOptions = {
  origin: 'https://trendy-cart-admin.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};



// Whatever request we get will be parsed through Json format
app.use(express.json());
// To connect Frontend and backend using port no.
app.use(cors(corsOptions));


// Data Base Connection with Mongo DB

mongoose.connect('mongodb+srv://kumarn206:Fw05vulRIkfygRuK@cluster0.gataub6.mongodb.net/trendycart')

// Api Creation

app.get("/", (req, res) => {

    res.send("Express App is Running")
})


//Image Storage Engine

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'upload/images'),
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })


// Creating Upload Endpoint for images
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

  // Connection String

app.post("/upload",cors(corsOptions), upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `https://trendy-cart-backend.vercel.app:${PORT}/images/${req.file.filename}`
    })
})

// Schema for Creating Products

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    description_short: {
        type: String,
        required: true,
    },
    description_long: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    }
})

app.post('/addproduct', async (req, res) => {

    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        // This logic is to get the id which is one increment of previous documents id.
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1;
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        description_short: req.body.description_short,
        description_long: req.body.description_long,
    })

    console.log(product);
    await product.save();
    console.log("Product Details Saved")
    res.json({
        success: true,
        name: req.body.name,
    })


})


// Creating Api for Deleting the Products


app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log(`Product having id : ${req.body.id} has been successfully removed`);
    res.json({
        success: true,
        name: req.body.name,
    })
})


// Creating Api for Getting all Products

app.get("/allproducts", async (req, res) => {

    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})



//Schema for User model

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    cartData: {
        type: Object,
    }
})

// Creating Endpoint to Register the User


app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing User Found With same Email ID" })
    }
    let cart = {};
    for (let index = 0; index < 300; index++) {
        cart[index] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    await user.save();

    //JWT Authentication

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_trendycart');
    res.json({ success: true, token });
})


// Creating EndPoint for User login

app.post('/login', async (req, res) => {

    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_trendycart');
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    }
    else {
        res.json({ success: false, errors: "No Account Found with this Email-Id " });
    }
})


// Creating EndPoint for NewCollections

app.get('/newcollections', async (req,res)=>{
      let products = await Product.find({});
      let newcollection = products.slice(1).slice(-8);
      console.log('New Collections Fetched');
      res.send(newcollection);
})


// Creating EndPoint for Popular Section

app.get('/popularinwomen',async(req,res)=>{
     
    let products = await Product.find({});
    let  popularproducts = products.slice(3,7);
    res.send(popularproducts);
})
// Creating EndPoint for Related Product Section

app.get('/relatedproducts',async (req,res)=>{
     
    let products =  await Product.find({});
    let  relatedproducts = products.slice(10,14);
    res.send(relatedproducts);
})


// Creating Middleware to fetch User using auth-token

const fetchUser= async (req,res,next)=>{
      const token = req.header('auth-token');
      if(!token)
        {
            res.status(401).send({errors:"Please authenticate using Valid Token"})
        }
        else{
            try{
                 const data = jwt.verify(token,'secret_trendycart');
                 req.user = data.user;
                 next();
            }
            catch(error)
            {
                res.status(401).send({errors:"please authenticate using a valid token"})
            }
        }
}



//Creating Endpoint for adding products in cartdata

app.post('/addtocart',fetchUser, async (req,res)=>{
        console.log("Added",req.body.itemId);
        let userData =  await Users.findOne({_id: req.user.id});
        userData.cartData[req.body.itemId] = userData.cartData[req.body.itemId] + 1;
        await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
        res.send("Added");
})

// Creating Endpoint to remove product from cartdata

app.post('/removefromcart',fetchUser,async (req,res)=>{
        console.log("Removed",req.body.itemId);
     let userData = await Users.findOne({_id: req.user.id});
     if( userData.cartData[req.body.itemId]>0)
        {
            userData.cartData[req.body.itemId] = userData.cartData[req.body.itemId] - 1;
        }
     await  Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
     res.send("Item Removed");

})

// Creating end point to get CartData

app.post('/getcart',fetchUser,async (req,res)=>{
      console.log("Get Cart")
     let userData = await Users.findOne({_id:req.user.id});
     res.json(userData.cartData);
})


app.listen(PORT, (error) => {
    if (error) {
        console.log("Error : " + error)
    }
    else {
        console.log(`Server Running on : ${PORT}`)
    }
})
