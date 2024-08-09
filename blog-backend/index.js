const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require("connect-flash");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

require('dotenv').config();

mongoose.connect("mongodb+srv://" + process.env.MYDBUSER + ":" + process.env.MYDBPASS + "@myatlasclusteredu.3ebfqvk.mongodb.net/blogsiteDB", { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: "keyboardcatmouse",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 2 * 60 * 60 * 1000
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    dob: Date,
    profilePicture: {
        data: Buffer,
        contentType: String
    },
    mobileNumber: String
});

userSchema.plugin(passportLocalMongoose);

const textSchema = {
    username: String,
    name: String,
    title: String,
    bcont: String,
    image: {
        data: Buffer,
        contentType: String
    }
};

const Text = mongoose.model("Text", textSchema);
const User = mongoose.model("User", userSchema);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const storage = multer.memoryStorage();

const uploadProfilePicture = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    }
}).single('profilePicture'); // Field name for profile pictures

const uploadBlogImage = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    }
}).single('image'); // Field name for blog images

app.get("/api/posts", (req, res) => {
    Text.find().then(posts => res.json(posts)).catch(err => res.status(500).json({ error: err.message }));
});

app.get("/api/posts/:id", (req, res) => {
    Text.findById(req.params.id).then(post => {
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    }).catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/posts/:id', uploadBlogImage, async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            bcont: req.body.bcont,
        };

        if (req.file) {
            updateData.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const post = await Text.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.json(post);
    } catch (error) {
        console.error('Error updating the post:', error);
        res.status(500).send('There was an error updating the post');
    }
});

app.post('/api/posts', uploadBlogImage, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded or incorrect file format" });
    }
    const newPost = new Text({
        username: req.body.username,
        name: req.body.name,
        title: req.body.title,
        bcont: req.body.bcont,
        image: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
    });
    newPost.save().then(() => res.json(newPost)).catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/current_user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ user: null });
    }
});

app.get("/api/users", (req, res) => {
    User.find().then(users => res.json(users)).catch(err => res.status(500).json({ error: err.message }));
});

app.get("/api/posts/author/:author", (req, res) => {
    Text.find({ username: req.params.author })
        .then(posts => res.json(posts))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        
        req.session.destroy((err) => {
            if (err) return next(err);

            res.clearCookie('connect.sid', { path: '/' });
            res.json({ message: "Logout successful" });
        });
    });
});


app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ user: req.user });
});

app.post('/register', uploadProfilePicture, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded or incorrect file format" });
    }
    const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        dob: req.body.dob,
        profilePicture: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        },
        mobileNumber: req.body.mobileNumber
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        passport.authenticate('local')(req, res, () => {
            res.json({ user });
        });
    });
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        const post = await Text.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting the post:', error);
        res.status(500).send('There was an error deleting the post');
    }
});

app.listen(8000, () => {
    console.log("Server is live on port 8000");
});
