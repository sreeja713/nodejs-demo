var db = require('./database')

function categoryCreation(req,res) {
   if (req.body.name == undefined) {
     return res.status(400).json({
         'message':'Ivalid Payload, need name field '
     })
   }

  let categoryName =req.body.name

   let formatedCategory=categoryName.toLowerCase()
   let generatedURL = "list/"+formatedCategory

   db.insertCategory(categoryName,generatedURL,function (insertionStatus) {
        if(insertionStatus){
        return res.status(201).json({
            'message':'sucessfully created category'
        });
        }
        else{
            return res.status(500).json({
            'message':'category creation failed'
        });
        }
   })
}


function subCategoryCreation(req,res){
    if (req.body.name == undefined || req.body.categoryId== undefined) {
     return res.status(400).json({
         'message':'Ivalid Payload, need name field and categoryid '
     })
   }
   let subCategoryName =req.body.name
   let categoryId = req.body.categoryId
   let formatedSubCategory=subCategoryName.toLowerCase()

    // getting category data of passed category id
   db.getCategoryData(categoryId,function (data) {
       // Validating category id valid or not
        if(data.length > 0 && data[0].data_count>0){
            // generating url, by converting the substring to lowercase and appending with category url
            let generatedURL = data[0].url+"/"+formatedSubCategory
            db.insertSubCategory(subCategoryName,categoryId,generatedURL,function (insertionStatus) {
                if(insertionStatus){
                    return res.status(201).json({
                    'message':'sucessfully created category'
                    });
                }else{
                    return res.status(500).json({
                        'message':'category creation failed'
                    });
                }
            })
            
        } else{
            return res.status(400).json({
                'message':'bad request'
            })
        }
    })
}


  
function productCreation(req,res) {
   if (req.body.name == undefined || req.body.categoryId == undefined || req.body.subCategoryId==undefined) {
     return res.status(400).json({
         'message':'Ivalid Payload, need name field and id  '
     })
   }

  let productName =req.body.name
  let categoryId = req.body.categoryId
  let subCategoryId = req.body.subCategoryId
  let price =req.body.price
  let quantity =req.body.quantity
  let formatedProduct =productName.toLowerCase()

    // getting category data of passed category Id 
   db.getCategoryData(categoryId,function (data) {
        // validating the passed category is valid or not
        if(data.length > 0 && data[0].data_count>0){

            // getting sub category data of passed sub category id
            db.getSubCategoryData(subCategoryId,function(data){
                // validating the passed sub category is valid or not
                if(data.length > 0 && data[0].data_count>0){
                    // generating url by converting product name to lower case and appending with subcategory url
                    let generatedURL = data[0].url+"/"+formatedProduct
                    db.insertProduct(productName, categoryId,subCategoryId,price,quantity,generatedURL,function (insertionStatus){
                        if(insertionStatus){
                            return res.status(201).json({
                                'message':'sucessfully created category'
                            });
                        }else{
                            return res.status(500).json({
                                'message':'category creation failed'
                            });
                        }

                    })

                }
            })
            
        }
   })
        
}

function productUpdation(req,res){
   
    let id = req.params.id
    // get Product data of passed produt ID
    db.getproductdata(id,function(data){
        // validating the Id is valid or not
        if(data.length > 0 && data[0].data_count>0){
            // if name is passed for update, then use passed name, else use the existing name for generating url
            let productName = data[0].name;
            if (req.body.name == undefined) {
                productName =  req.body.name
            }
            let formatedProduct=productName.toLowerCase() 
            
            // getting subcategory Data of the product
            db.getSubCategoryData(data[0].subcategory_id,function (data) {
                // create new url by converting the product name to lower case and append with subcategory url
                let generatedURL = data[0].url+"/"+formatedProduct
                let updateFields = req.body
                updateFields.url = generatedURL
                // updating produt
                db.updateProduct(updateFields,id,function (insertionStatus){
                    if(insertionStatus){
                        return res.status(201).json({
                            'message':'sucessfully updated  category'
                        });
                    }else{
                        return res.status(500).json({
                            'message':'category updation failed'
                        });
                    }

                })
            });
            

        }
        else{
            return res.status(400).json({
                'message':'invalid input'
            })
        }
    })
    

}


function subCategoryUpdation(req,res){
   
    let id = req.params.id
    // getting sub category of passed subcategory
    db.getSubCategoryData(id,function(data){
        // check the id is valid or not
        if(data.length > 0 && data[0].data_count>0){
            // if name is passed for update, then use passed name, else use the existing name for generating url
            let subCategoryName =req.body.name
            let formatedSubCategory=subCategoryName.toLowerCase()  
            
            // getting category details of subcategory for generating url
            db.getCategoryData(data[0].category_id,function (data) {
                if(data.length > 0 && data[0].data_count>0){

                    // generate url by appending the category url and lowercase of subcategory name
                    let generatedURL = data[0].url+"/"+formatedSubCategory

                    let updateFields = req.body 
                    updateFields.url = generatedURL
                    // update subcategory
                    db.updateSubCategory(updateFields,id,function (insertionStatus){
                        if(insertionStatus){
                            // generate url for updating product
                            generatedURL = generatedURL + "/"
                            // upate product url with new generated url
                            db.updateProductUrl(generatedURL,id,function (productupdationStatus){
                                if(productupdationStatus){
                                    return res.status(201).json({
                                        'message':'sucessfully updated  category'
                                    });
                                }else{
                                    return res.status(500).json({
                                        'message':'category updation failed'
                                    });
                                }
                            })
                            
                        }else{
                            return res.status(500).json({
                                'message':'category updation failed'
                            });
                        }
                    })
                 } else{
                    return res.status(400).json({
                        'message':'bad request'
                    })
                }    

            })

        }
        else{
            return res.status(400).json({
                'message':'invalid input'
            })
        }
    })
    

}


function categoryUpdation(req,res){
   
    let id = req.params.id
    // getting the category data of passed Id 
    db.getCategoryData(id,function(data){
        if(data.length > 0 && data[0].data_count>0){
            let categoryName =req.body.name
            // generate url for category
            let formatedCategory= "list/"+categoryName.toLowerCase()
            let updateFields = req.body
            updateFields.url = formatedCategory
            // upade category with url and passed name
            db.updateCategory(updateFields,id,function (insertionStatus){
                if(insertionStatus){
                    // generate url for updating subcategory
                    formatedCategory = formatedCategory+"/"
                    // updating subcategory url
                    db.updateSubcategoryUrl(formatedCategory,id,function (subCategoryStatus){
                        if(subCategoryStatus){
                            // getting subcategory data for generating url for product
                            db.getSubCategoryDataWithCategory(id,function(subCategoryData){

                                // generating url for product with subcategpry data
                                formatedCategory = subCategoryData[0].url+"/"
                                // updating product
                                db.updateProductUrlWithCategoryID(formatedCategory,id,function (productupdationStatus){
                                    if(productupdationStatus){
                                        return res.status(201).json({
                                            'message':'sucessfully updated  category'
                                        });
                                    }else{
                                        return res.status(500).json({
                                            'message':'category updation failed'
                                        });
                                    }
                                })
                            })
                            
                        }else{
                            return res.status(500).json({
                                'message':'category updation failed'
                            });
                        }
                    })

                }else{
                    return res.status(500).json({
                        'message':'category updation failed'
                    });
                }

            })

        }
        else{
            return res.status(400).json({
                'message':'invalid input'
            })
        }
    })
    

}


module.exports ={categoryCreation,subCategoryCreation,productCreation,productUpdation,subCategoryUpdation,categoryUpdation};