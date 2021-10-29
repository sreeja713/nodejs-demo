const config =require('./dbconfig');
const sql = require('mysql');

const pool = sql.createPool(config);

function getCategoryData(categoryId,callback) {
    pool.query("SELECT *,count(*) as data_count FROM category where id=? ",[categoryId], (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        callback(data)
    })
}


function updateCategory(payload,id,callback){
   let fieldString = ""
   let fieldlist = []
   
    if(payload.name != undefined){
        if (fieldString != "") {
            fieldString = fieldString + ","
        }
        fieldString=fieldString+"name=?"
        fieldlist.push(payload.name)  
    }

    if(payload.url != undefined){
        if (fieldString != "") {
            fieldString = fieldString + ","
        }
        fieldString=fieldString+"url=?"
        fieldlist.push(payload.url)  
    }
    fieldlist.push(id)
    pool.query('update category set '+fieldString +'where id = ?',fieldlist,function(err,result){
        if(err) {
            console.error(err);
            callback(false);
        }
        callback(true)
        
    });

}













function getSubCategoryData(subCategoryId,callback) {
    pool.query("SELECT *,count(*) as data_count FROM sub_category where id=? ",[subCategoryId], (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        callback(data)
    })
}



function updateSubCategory(payload,id,callback){
   let fieldString = ""
   let fieldlist = []
   
    if(payload.name != undefined){
        if (fieldString != "") {
            fieldString = fieldString + ","
        }
        fieldString=fieldString+"name=?"
        fieldlist.push(payload.name)  
    }
    if(payload.url != undefined){
        if (fieldString != "") {
            fieldString = fieldString + ","
        }
        fieldString=fieldString+"url=?"
        fieldlist.push(payload.url)  
    }
    fieldlist.push(id)
    pool.query('update sub_category set '+fieldString +'where id = ?',fieldlist,function(err,result){
        if(err) {
            console.error(err);
            callback(false);
        }
        callback(true)
        
    });

}






function insertCategory(categoryName,generatedURL,callback) {
    pool.query('INSERT INTO category (name,url) VALUES (?,?)', [categoryName,generatedURL], function(err,result){
        if(err) {
            console.error(err);
            callback(false);
        }
        callback(true)
        
    })
}


function insertSubCategory(subCategoryName,categoryId,generatedURL,callback) {
    pool.query('INSERT INTO sub_category (name,category_id,url) VALUES (?,?,?)', [subCategoryName,categoryId,generatedURL ],function(err,result){
        if(err) {
            console.error(err);
            callback(false);
        }
        callback(true)
        
    })
}


function insertProduct(productName,categoryId,subCategoryId,price,quantity,generatedURL,callback) {
    pool.query('INSERT INTO products (name,price,quantity,category_id,subcategory_id,url) VALUES (?,?,?,?,?,?)', [productName,price,quantity,categoryId,subCategoryId,generatedURL ],function(err,result){
        if(err) {
            console.error(err);
            callback(false);
        }
        callback(true)
        
    })
}


function updateProduct(payload,id,callback){
   let fieldString = ""
   let fieldlist = []
   
    if(payload.name != undefined){
        if (fieldString != "") {
            fieldString = fieldString + ","
        }
        fieldString=fieldString+"name=?"
        fieldlist.push(payload.name)  
    }
    
    if(payload.price!=undefined){
        if (fieldString != "") {
            fieldString = fieldString + ","
        }
        fieldString=fieldString+"price=?"
        fieldlist.push(payload.price)
    }    
         
    if(payload.quantity!=undefined){
        if (fieldString != "") {
            fieldString = fieldString + ","
        }
        fieldString=fieldString+"quantity=?"
        fieldlist.push(payload.quantity)
    }

    if(payload.url!=undefined){
        if (fieldString != "") {
            fieldString = fieldString + ","
        }
        fieldString=fieldString+"url=?"
        fieldlist.push(payload.url)
    }

    fieldlist.push(id)
    pool.query('update products set '+fieldString +'where id = ?',fieldlist,function(err,result){
        if(err) {
            console.error(err);
            callback(false);
        }
        callback(true)
        
    });

}


function getproductdata(id,callback) {
    pool.query("SELECT *,count(*) as data_count FROM products where id=? ",[id], (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        callback(data)
    })
}
function updateProductUrl(url,id,callback) {
    pool.query("update products set url=concat('"+url+"',lower(name)) where subcategory_id = ?",[id], (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        callback(data)
    })
}

function updateSubcategoryUrl(url,id,callback) {
    pool.query("update sub_category set url=concat('"+url+"',lower(name)) where category_id = ?",[id], (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        callback(data)
    })
}

function updateProductUrlWithCategoryID(url,id,callback) {
    pool.query("update products set url=concat('"+url+"',lower(name)) where category_id = ?",[id], (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        callback(data)
    })
}


function getSubCategoryDataWithCategory(id,callback) {
    pool.query("SELECT * FROM sub_category where category_id=? ",[id], (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        callback(data)
    })
}

module.exports={insertCategory,insertSubCategory,insertProduct,getCategoryData, getSubCategoryData,updateProduct,getproductdata,updateSubCategory,updateProductUrl,updateCategory,updateProductUrlWithCategoryID,updateSubcategoryUrl,getSubCategoryDataWithCategory}

