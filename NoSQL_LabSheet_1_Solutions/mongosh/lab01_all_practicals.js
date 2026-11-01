/*
NoSQL LabSheet 1 Q1-Q21 demonstration.
Run in mongosh: load("mongosh/lab01_all_practicals.js")
WARNING: Q19 drops Departments and Q20 drops StudentDB. Use disposable lab data only.
*/
db = db.getSiblingDB("StudentDB");
print("Q1: database " + db.getName());
if (!db.getCollectionNames().includes("Students")) db.createCollection("Students");
printjson(db.getCollectionNames());

print("Q2: create Faculty and Courses");
["Faculty","Courses"].forEach(n => { if (!db.getCollectionNames().includes(n)) db.createCollection(n); });
printjson(db.getCollectionNames());

print("Q3: insertOne");
db.Students.insertOne({RollNumber:101,Name:"Aarav Sharma",Department:"Computer Science",Semester:5,CGPA:8.4});
printjson(db.Students.findOne({RollNumber:101},{_id:0}));

print("Q4: insertMany");
db.Students.insertMany([
{RollNumber:102,Name:"Diya Verma",Department:"Information Technology",Semester:5,CGPA:8.1},
{RollNumber:103,Name:"Kabir Singh",Department:"Computer Science",Semester:3,CGPA:7.6},
{RollNumber:104,Name:"Meera Gupta",Department:"Electronics",Semester:5,CGPA:8.8},
{RollNumber:105,Name:"Ishaan Khan",Department:"Computer Science",Semester:3,CGPA:6.9}
]);
print("Q5: all students"); db.Students.find({}, {_id:0}).forEach(printjson);
print("Q6: by roll"); printjson(db.Students.findOne({RollNumber:103},{_id:0}));
print("Q7: by department"); db.Students.find({Department:"Computer Science"},{_id:0}).forEach(printjson);
print("Q8: projection"); db.Students.find({}, {_id:0,Name:1,Department:1}).forEach(printjson);

print("Q9: updateOne");
db.Students.updateOne({RollNumber:103},{$set:{Department:"Data Science"}});
print("Q10: updateMany");
db.Students.updateMany({Department:"Computer Science"},{$set:{Semester:6}});
print("Q11: replaceOne");
db.Students.replaceOne({RollNumber:104},{RollNumber:104,Name:"Meera Gupta",Department:"Electronics",Semester:6,CGPA:9.0});
print("Q12: add Email");
db.Students.updateMany({},{$set:{Email:"student@example.com"}});
print("Q13: unset CGPA");
db.Students.updateMany({},{$unset:{CGPA:""}});
print("Q14: deleteOne");
db.Students.deleteOne({RollNumber:105});
print("Q15: deleteMany");
db.Students.deleteMany({Department:"Computer Science",Semester:6});
print("Q16: count " + db.Students.countDocuments({}));

print("Q17: rename collection");
if (db.getCollectionNames().includes("Students")) db.Students.renameCollection("StudentDetails");
printjson(db.getCollectionNames());

print("Q18: Departments sample data");
db.createCollection("Departments");
db.Departments.insertMany([
{DepartmentId:"CSE",DepartmentName:"Computer Science",HOD:"Dr. Rao"},
{DepartmentId:"IT",DepartmentName:"Information Technology",HOD:"Dr. Mehta"},
{DepartmentId:"ECE",DepartmentName:"Electronics",HOD:"Dr. Das"}
]);
db.Departments.find({}, {_id:0}).forEach(printjson);

print("Q19: drop Departments");
print(db.Departments.drop());
print("Q20: DROP DATABASE — destructive");
printjson(db.dropDatabase());

print("Q21: recreate and insert");
db = db.getSiblingDB("StudentDB");
db.Students.insertMany([
{RollNumber:201,Name:"Ananya Joshi",Department:"Computer Science",Semester:5,CGPA:8.7},
{RollNumber:202,Name:"Rohan Patel",Department:"Information Technology",Semester:5,CGPA:8.2}
]);
printjson(db.Students.find({}, {_id:0}).toArray());
print("Q1-Q21 script complete.");
