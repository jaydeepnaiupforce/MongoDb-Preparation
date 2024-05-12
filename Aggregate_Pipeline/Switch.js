db.students.insertMany([
    {
        "productName": "Laptop",
        "category": "Electronics",
        "specs": {
            "processor": "Intel Core i7",
            "ram": "16GB",
            "display": "AMOLED",
            "storage": {
                "type": "SSD",
                "size": "512GB"
            }
        },
        "price": 2499.99,
        "ratings": [
            { "userId": "ObjectId('uniqueIdHere')", "score": 5, "reviewDate": "ISODate('2023-09-15')" },
            { "userId": "ObjectId('uniqueIdHere')", "score": 4, "reviewDate": "ISODate('2023-09-16')" }
        ],
        "available": true,
        "tags": ["laptop", "ultrabook", "high-performance"],
        "releaseDate": "ISODate('2023-01-01')"
    },
    {
        "productName": "Gaming PC",
        "category": "Electronics",
        "specs": {
            "processor": "AMD Ryzen 9",
            "ram": "32GB",
            "storage": {
                "type": "NVMe SSD",
                "size": "1TB"
            }
        },
        "price": 1899.99,
        "ratings": [
            { "userId": "ObjectId('uniqueIdHere')", "score": 5, "reviewDate": "ISODate('2023-09-10')" }
        ],
        "available": true,
        "tags": ["desktop", "gaming", "high-end"],
        "releaseDate": "ISODate('2023-02-15')"
    },
    {
        "productName": "Smartphone",
        "category": "Electronics",
        "specs": {
            "processor": "Snapdragon 888",
            "ram": "8GB",
            "storage": {
                "type": "UFS",
                "size": "256GB"
            }
        },
        "price": 699.99,
        "ratings": [
            { "userId": "ObjectId('uniqueIdHere')", "score": 4, "reviewDate": "ISODate('2023-08-25')" }
        ],
        "available": true,
        "tags": ["smartphone", "5G", "water-resistant"],
        "releaseDate": "ISODate('2023-03-10')"
    },
    {
        "productName": "4K Television",
        "category": "Electronics",
        "specs": {
            "screenSize": "55 inches",
            "features": {
                "type": "Smart TV",
                "resolution": "4K"
            }
        },
        "price": 1200.00,
        "ratings": [
            { "userId": "ObjectId('uniqueIdHere')", "score": 4, "reviewDate": "ISODate('2023-09-01')" },
            { "userId": "ObjectId('uniqueIdHere')", "score": 4, "reviewDate": "ISODate('2023-09-02')" }
        ],
        "available": true,
        "tags": ["home entertainment", "TV", "UHD"],
        "releaseDate": "ISODate('2023-04-20')"
    },
    {
        "productName": "Bluetooth Headphones",
        "category": "Accessories",
        "specs": {
            "type": "Over-Ear",
            "features": {
                "noiseCancellation": true,
                "batteryLife": "24 hours"
            }
        },
        "price": 199.99,
        "ratings": [
            { "userId": "ObjectId('uniqueIdHere')", "score": 4, "reviewDate": "ISODate('2023-09-01')" },
            { "userId": "ObjectId('uniqueIdHere')", "score": 5, "reviewDate": "ISODate('2023-09-02')" }
        ],
        "available": true,
        "tags": ["audio", "headphones", "bluetooth"],
        "releaseDate": "ISODate('2023-05-05')"
    },
    {
        "productName": "Electric Scooter",
        "category": "Transportation",
        "specs": {
            "maxSpeed": "25 mph",
            "range": "40 miles"
        },
        "price": 1550.00,
        "stock": 90,
        "ratings": [],
        "available": true,
        "tags": ["eco-friendly", "high-performance", "scooter"],
        "releaseDate": "ISODate('2023-06-01')"
    }]);


// Question: Project a new field priceCategory which categorizes the price as 'Low', 'Medium', or 'High'.
db.students.aggregate([
    {
        $project: {
            _id: 0,
            productName: 1,
            pricing: {
                $switch: {
                    branches: [
                        { case: { $and: [{ $gt: ["$price", 500] }, { $lt: ["$price", 1000] }] }, then: "medium" },
                        { case: { $and: [{ $gt: ["$price", 500] }, { $lt: ["$price", 1500] }] }, then: "exp" },
                    ],
                    default: "aws"
                }
            }
        }
    }
]);
// Question: Include product name and a new field inventoryStatus indicating if the stock level is 'Empty', 'Low', or 'Adequate'.
db.students.aggregate([
    {
        $project: {
            _id: 0,
            productName: 1,
            inventoryStatus: {
                $switch: {
                    branches: [
                        { case: { $and: [{ $gt: ["$stock", 0] }, { $gt: ["$stock", 10] }] }, then: "Low" },
                        { case: { $eq: ["$stock", 0] }, then: "Empty" }
                    ],
                    default: "Adequate"
                }
            }
        }
    }
]);
// Question: Display product name and a newRelease field which checks if the release date is within the last year.
db.students.aggregate([
    {
        $project: {
            _id: 0,
            productName: 1,
            fromLastYear: {
                $switch: {
                    branches: [
                        { case: { $gt: ["$releaseDate", ISODate('2023-01-01')] }, then: "yes" }
                    ],
                    default: "No"
                }
            }
        }
    }
]);
// Question: Project the name and a ratingLevel indicating if the average rating is 'Poor', 'Good', or 'Excellent'.
db.students.aggregate([
    {
        $project: {
            _id: 0,
            productName: 1,
            fromLastYear: {
                $switch: {
                    branches: [
                        { case: { $gt: [{ $avg: "$ratings.score" }, 4] }, then: "Fantastic" },
                        { case: { $lt: [{ $avg: "$ratings.score" }, 2] }, then: "Poor" },
                        { case: { $gt: [{ $avg: "$ratings.score" }, 2] }, then: "Medium" }
                    ],
                }
            }
        }
    }
]);
// Question: Calculate a profitability field based on the cost and price which indicates if the product is 'Profitable', 'Break-even', or 'Loss'.
db.students.aggregate([
    {
        $project: {
            _id: 0,
            productName: 1,
            fromLastYear: {
                $switch: {
                    branches: [
                        { case: { $gt: ["$price", "$cost"] }, then: "Pr" },
                    ],
                    default: "Non-pr"
                }
            }
        }
    }
]);
// Question: Display product name and a userRating field indicating if it's 'Unrated', 'Poor', 'Average', or 'Excellent'.

db.students.aggregate([
    {$project : {
        _id:0,
        productName:1,
        fromLastYear:{
            $switch : {
                branches : [
                    {case : { $eq : [{$size : "$ratings"},0]}, then : "no review"},
                    {case : { $and : [ 
                        {$gte : [{$avg:"$ratings.score"},2]},
                        {$lte : [{$avg:"$ratings.score"},3]},
                    ]},  then : "Average"},
                    {case : { $and :[
                        {$gte : [{$avg: "$ratings.score"},3]},   
                        {$lte : [{$avg: "$ratings.score"},4]},   
                    ]},then : "good"},
                    {case : { $and :[
                        {$gte : [{$avg: "$ratings.score"},4]},   
                        {$lte : [{$avg: "$ratings.score"},5]},   
                    ]},then : "Superb"},
                ],
                default : "Not got anything"
            }
        } 
    }}
]);
// Question: Calculate and display a shippingCost based on the weight of the product, classified into 'Low', 'Medium', 'High'.
db.products.aggregate([
    { $project: {
      productName: 1,
      shippingCost: {
        $switch: {
          branches: [
            { case: { $lt: ["$weight", 5] }, then: "Low" },
            { case: { $lt: ["$weight", 20] }, then: "Medium" }
          ],
          default: "High"
        }
      }
    }}
  ]);
//Question: Display the product name and maintenance based on the product type indicating if it's 'High', 'Medium', or 'Low'.
db.students.aggregate([
    {$project : {
        _id:0,
        productName:1,
        fromLastYear:{
            $switch : {
                branches : [
                    {case : { $in : ["$tags",["high-performance","headphones"]]}, then : "High"},
                ],
                default : "Not got anything"
            }
        } 
    }}
]);