const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({
    path: './config/config.env'
})

// Load bootcamp model
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')
const Review = require('./models/Review')

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})


// Load JSON file for bootcamp model
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/data/courses.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8'))

// Import data from bootcamp.json file to the bootcamp collection
const importData = async () => {
    try {
        const importResultForBootcamp = await Bootcamp.create(bootcamps);
        const importResultForCourse = await Course.create(courses);
        const importedResultForUser = await User.create(users);
        const importedResultForReview = await Review.create(reviews);

        if (importResultForBootcamp && importResultForCourse && importedResultForUser && importedResultForReview) {
            console.log('Successfully Data Imported'.green.inverse)
            process.exit()
        }
    } catch (err) {
        console.error(err)
    }
}

// Delete all data from bootcamp collection on db

const deleteData = async () => {
    try {
        const deleteResultForBootcamp = await Bootcamp.deleteMany()
        const deleteResultForCourse = await Course.deleteMany()
        const deleteResultForUser = await User.deleteMany()
        const deleteResultForReview = await Review.deleteMany()

        console.log('Deleted Successfully'.green.bgRed)
        process.exit()

    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] == '-import') {
    importData();
} else if (process.argv[2] == '-delete') {
    deleteData();
}