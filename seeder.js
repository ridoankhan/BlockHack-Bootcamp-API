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

// Import data from bootcamp.json file to the bootcamp collection
const importData = async () => {
    try {
        const importResultForBootcamp = await Bootcamp.create(bootcamps);
        // const importResultForCourse = await Course.create(courses);

        if (importResultForBootcamp) { //importResultForBootcamp && importResultForCourse
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
        // const deleteResultForCourse = await Course.deleteMany()

        if (deleteResultForBootcamp) { // deleteResultForBootcamp && deleteResultForCourse
            console.log('Deleted Successfully'.green.bgRed)
            process.exit()
        }
    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] == '-import') {
    importData();
} else if (process.argv[2] == '-delete') {
    deleteData();
}