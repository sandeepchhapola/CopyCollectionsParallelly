var async = require("async");
var mongoose = require('mongoose');

var urlstring1 = "mongodb://localhost/Source";
var urlstring2 = "mongodb://localhost/Destination";

var sourceConnection = mongoose.createConnection(urlstring1);
var DestinationConnection = mongoose.createConnection(urlstring2);

var userDatabaseSchema = {
    name: String,
    age: Number
};

var companyDatabaseSchema = {
    name: String,
    regNo: String
};

var userData = [
    {
        name: "sandeep kumar",
        age: 25
    },
    {
        name: "Rakesh kumar",
        age: 26
    },
    {
        name: "Mohit kumar",
        age: 28
    },
    {
        name: "Rubi",
        age: 26
    },
    {
        name: "Vinita sharma",
        age: 25
    },
    {
        name: "Kashish Gupta",
        age: 26
    },
    {
        name: "manoj kumar",
        age: 25
    },
    {
        name: "rohit kumar",
        age: 28
    },
    {
        name: "sandeep singh",
        age: 29
    },
    {
        name: "Rajesh kumar",
        age: 30
    }
];

var companyData = [
    {
        name: "asdas",
        regNo: 564654
    },
    {
        name: "ascacs",
        regNo: 789798
    },
    {
        name: "sacaca",
        regNo: 987879
    },
    {
        name: "sacasca",
        regNo: 789879
    },
    {
        name: "ascaca",
        regNo: 897999
    },
    {
        name: "ascasc",
        regNo: 231321
    },
    {
        name: "ZCZCZC",
        regNo: 231321
    },
    {
        name: "ZcASC",
        regNo: 465412
    },
    {
        name: "zxcasd",
        regNo: 654651
    },
    {
        name: "ZXadfC",
        regNo: 597853
    }
];


var sourceSchema1 = new mongoose.Schema(userDatabaseSchema);
var sourceModel1 = sourceConnection.model("Users", sourceSchema1);
var destinationModel1 = DestinationConnection.model("Person", sourceSchema1);

var sourceSchema2 = new mongoose.Schema(companyDatabaseSchema);
var sourceModel2 = sourceConnection.model("Companies", sourceSchema2);
var destinationModel2 = DestinationConnection.model("Organisation", sourceSchema2);

function cleanUserData(callback){
    sourceModel1.find({}).remove().exec(function (err, result) {
        console.log("Clean User Data: " + result);
        callback();
    });
}

function saveUserData(callback) {
    userData.forEach(function (data) {
        var task = [];
        task.push(function (callback) {
            new sourceModel1(data).save(function (err) {
                if (err) {
                    console.log(err);
                    callback(err);
                    return;
                }
                console.log(data);
                callback();
            })
        });
        async.series(task, function (err,result) {
            if (err)
                console.log("Error: " + err);
            else
            callback();
        });
    });
}

function showUserData(callback) {
    sourceModel1.find({}).exec(function (err, result) {
        console.log("User Data: " + result);
        callback();
    });
}

function cleanPersonData(callback){
    destinationModel1.find({}).remove().exec(function (err, result) {
        console.log("Clean Person Data: " + result);
        callback();
    });
}

function saveToPerson() {
    sourceModel1.find({}).exec(function (err, result, callback) {
        var task = [];
        result.forEach(function (data) {
            task.push(function (callback) {
                new destinationModel1(data).save(function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback();
                })
            });
        });
        async.series(task, function (err) {
            if (err)
                console.log("Error: " + err);
        });
    });
}

function showPersonData(callback) {
    destinationModel1.find({}).exec(function (err, result) {
      console.log("Person Data: " + result);
        callback();
    });
}

function cleanCompanyData(callback){
    sourceModel2.find({}).remove().exec(function (err, result) {
        console.log("Clean Company Data: " + result);
        callback();
    });
}

function saveCompanyData(callback) {
    companyData.forEach(function (data) {
        var task = [];
        task.push(function (callback) {
            new sourceModel2(data).save(function (err) {
                if (err) {
                    console.log(err);
                    callback(err);
                    return;
                }
                callback();
            })
        });
        async.series(task, function (err,result) {
            if (err)
                console.log("Error: " + err);
            else
            callback();
        });
    });
}

function showCompanyData(callback) {
    sourceModel2.find({}).exec(function (err, result) {
        console.log("Company Data: " + result);
        callback();
    });
}

function cleanOrganizationData(callback){
    destinationModel2.find({}).remove().exec(function (err, result) {
        console.log("Clean Organization Data: " + result);
        callback();
    });
}

function saveToOrganization() {
    sourceModel2.find({}).exec(function (err, result, callback) {
        var task = [];
        result.forEach(function (data) {
            task.push(function (callback) {
                new destinationModel2(data).save(function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback();
                })
            });
        });
        async.series(task, function (err) {
            if (err)
                console.log("Error: " + err);

        });
    });
}

function showOrganizationData(callback) {
    destinationModel2.find({}).exec(function (err, result) {
      console.log("Oraganization Data: " + result);
        callback();
    });
}


function copyUserData(callback){
    async.series([cleanUserData,saveUserData,showUserData,cleanPersonData,saveToPerson,showPersonData],function(err){
    });
}

function copyCompanyData(callback){
    async.series([cleanCompanyData,saveCompanyData,showCompanyData,cleanOrganizationData,saveToOrganization,showOrganizationData],function(err){
    });
}

async.parallel([copyUserData,copyCompanyData],function(err,result) {
    if(err)
        console.log('Some eror occured..' + err);
});


