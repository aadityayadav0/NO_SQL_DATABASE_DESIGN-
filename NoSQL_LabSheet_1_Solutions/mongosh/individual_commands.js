// Selectively run these in mongosh. Do not execute destructive commands casually.
use("StudentDB");
// Q1-Q2
db.createCollection("Students");
db.createCollection("Faculty");
db.createCollection("Courses");
// Q3-Q4
db.Students.insertOne({RollNumber:101,Name:"Aarav Sharma",Department:"Computer Science",Semester:5,CGPA:8.4});
db.Students.insertMany([{RollNumber:102,Name:"Diya Verma",Department:"IT",Semester:5,CGPA:8.1},{RollNumber:103,Name:"Kabir Singh",Department:"Computer Science",Semester:3,CGPA:7.6}]);
// Q5-Q8
db.Students.find();
db.Students.find({RollNumber:101});
db.Students.find({Department:"Computer Science"});
db.Students.find({}, {_id:0,Name:1,Department:1});
// Q9-Q13
db.Students.updateOne({RollNumber:101},{$set:{Department:"Data Science"}});
db.Students.updateMany({Department:"Computer Science"},{$set:{Semester:6}});
db.Students.replaceOne({RollNumber:102},{RollNumber:102,Name:"Diya Verma",Department:"IT",Semester:5,CGPA:8.5});
db.Students.updateMany({},{$set:{Email:"student@example.com"}});
db.Students.updateMany({},{$unset:{TemporaryField:""}});
// Q14-Q16
db.Students.deleteOne({RollNumber:103});
db.Students.deleteMany({Department:"Old Department"});
db.Students.countDocuments({});
// Q17-Q21
db.Students.renameCollection("StudentDetails");
db.createCollection("Departments");
db.Departments.insertOne({DepartmentId:"CSE",DepartmentName:"Computer Science"});
db.Departments.drop();
// Before db.dropDatabase(), verify db.getName() and confirm disposable data only.
