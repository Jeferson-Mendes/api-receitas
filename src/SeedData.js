const MongooseConnection = require('./database/index');
const fs = require('fs');
const RecipeCategory = require('./models/RecipeCategory');

// Connection to database
MongooseConnection.init();

const categories = JSON.parse(
    fs.readFileSync(`${__dirname}/config/recipeCategorySeedData.json`, 'utf-8'),
)

const seedData = async () => {
    try {
        await RecipeCategory.create(categories);
        console.log('Successfully seeding!');
        process.exit();
    } catch (error) {
        console.log(`Fail to seed data... ${error}`);
    }
}

seedData();