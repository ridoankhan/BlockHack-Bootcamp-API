const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter bootcamp name"],
        unique: true,
        trim: true,
        maxlength: [50, "bootcamp name can not be more than 50 words"],
    },

    slug: String,

    description: {
        type: String,
        required: [true, "Please enter bootcamp description"],
        maxlength: [500, "bootcamp description can not be more than 500 words"],
    },

    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please enter a valid url with HTTP or HTTPS",
        ],
    },

    phone: {
        type: String,
        maxlength: [20, "Phone number can not be more than 20 characters"],
    },

    email: {
        type: String,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
    },

    address: {
        type: String,
        required: [true, "Please enter an address"],
    },

    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },

    careers: {
        type: [String],
        required: true,
        enum: [
            "Web Development",
            "Mobile Development",
            "UI/UX",
            "Data Science",
            "Business",
            "Other",
        ],
    },

    averageRating: {
        type: Number,
        min: [1, "Rating can not be less than 1"],
        max: [10, "Rating can not be more than 10"],
    },

    averageCost: Number,

    photo: {
        type: String,
        default: "no-photo.jpg",
    },

    housing: {
        type: Boolean,
        default: false,
    },

    jobAssistance: {
        type: Boolean,
        default: false,
    },

    jobGuarantee: {
        type: Boolean,
        default: false,
    },

    acceptGi: {
        type: Boolean,
        default: false,
    },

    createdAt: {
        type: Date,
        deafult: Date.now,
    },
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);