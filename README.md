# BlockHack Bootcamp API
Backend API for BlockHack Bootcamp application, which is a bootcamp finding website

Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own
Install Dependencies

npm install

Run App

# Run in dev mode
npm run dev

# Run in prod mode
npm start

# Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "data" folder, run

# Destroy all data
node seeder.js -delete

# Import all data
node seeder.js -import

Demo

The API is live at blockhack-bootcamp.tk

Extensive documentation with examples can be found at: https://documenter.getpostman.com/view/4519349/TVt2cizW


    Version: 1.0.0
    License: MIT
    Author: Ridoan Khan Anik
 
 
 
 
 

 <!-- To generate document with docgen just copy the exe and exported json in the same directory and the following command
 cmd /K "windows_amd64_2.exe" build -i BH.postman_collection.json -o index.html

 Firefox

 Type about:config in the Firefox address bar and find security.csp.enable and set it to false.
 Chrome

 You can install the extension called Disable Content-Security-Policy to disable CSP.
 
 
For Degital-ocean tutorial:
https://gist.github.com/bradtraversy/cd90d1ed3c462fe3bddd11bf8953a896 -->
>>>>>>> dev
