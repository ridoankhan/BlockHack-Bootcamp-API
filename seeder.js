const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: './config/config.env' })

// Load bootcamp model
const Bootcamp = require('./models/Bootcamp')

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})


// Load JSON file for bootcamp model

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamps.json`, 'utf-8'))

// Import data from bootcamp.json file to the bootcamp collection
const importData = async () => {
    try {
        const importResult = await Bootcamp.create(bootcamps)

        if (importResult) {
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
        const deleteResult = await Bootcamp.deleteMany()

        if (deleteResult) {
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