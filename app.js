const express = require('express')
const app = express()
var handler  = require('./handler');

app.use(express.json());

// create apis
app.post('/api/v1/category',handler.categoryCreation);
app.post('/api/v1/subcategory',handler.subCategoryCreation);
app.post('/api/v1/product',handler.productCreation);

// update apis
app.put('/api/v1/product/:id',handler.productUpdation);
app.put('/api/v1/subcategory/:id',handler.subCategoryUpdation);
app.put('/api/v1/category/:id',handler.categoryUpdation);


module.exports =app;
