# NoSQL Database Design — Lab Sheet 1 Solutions

**Objective:** Practise MongoDB database/collection management, CRUD operations, Compass, Shell, and SQL comparison. Commands are for `mongosh`; sample data is illustrative.

## Q1. Create StudentDB and verify
```javascript
use("StudentDB")
db.createCollection("Students")
db.getName()
show dbs
```
A database is persisted after a collection or data is created; `use()` alone only selects it.

## Q2. Create Students, Faculty, Courses
```javascript
db.createCollection("Students")
db.createCollection("Faculty")
db.createCollection("Courses")
show collections
```

## Q3. Insert one student
```javascript
db.Students.insertOne({RollNumber:101,Name:"Aarav Sharma",Department:"Computer Science",Semester:5,CGPA:8.4})
```

## Q4. Insert multiple students
```javascript
db.Students.insertMany([
{RollNumber:102,Name:"Diya Verma",Department:"Information Technology",Semester:5,CGPA:8.1},
{RollNumber:103,Name:"Kabir Singh",Department:"Computer Science",Semester:3,CGPA:7.6},
{RollNumber:104,Name:"Meera Gupta",Department:"Electronics",Semester:5,CGPA:8.8},
{RollNumber:105,Name:"Ishaan Khan",Department:"Computer Science",Semester:3,CGPA:6.9}
])
```

## Q5. Retrieve all
```javascript
db.Students.find()
```

## Q6. Retrieve by Roll Number
```javascript
db.Students.find({RollNumber:103})
```

## Q7. Filter by Department
```javascript
db.Students.find({Department:"Computer Science"})
```

## Q8. Projection: Name and Department
```javascript
db.Students.find({}, {_id:0,Name:1,Department:1})
```
`1` includes a field; `_id` is excluded explicitly because it is included by default.

## Q9. Update one student's department
```javascript
db.Students.updateOne({RollNumber:103},{$set:{Department:"Data Science"}})
```

## Q10. Update semester for a department
```javascript
db.Students.updateMany({Department:"Computer Science"},{$set:{Semester:6}})
```

## Q11. Replace a document
```javascript
db.Students.replaceOne(
 {RollNumber:104},
 {RollNumber:104,Name:"Meera Gupta",Department:"Electronics",Semester:6,CGPA:9.0}
)
```
Fields omitted from the replacement are removed.

## Q12. Add Email to all documents
```javascript
db.Students.updateMany({},{$set:{Email:"student@example.com"}})
```
This is a common sample value; use unique emails in a real dataset.

## Q13. Remove an existing field
```javascript
db.Students.updateMany({},{$unset:{CGPA:""}})
```

## Q14. Delete one student by Roll Number
```javascript
db.Students.deleteOne({RollNumber:105})
```

## Q15. Delete multiple matching records
```javascript
db.Students.deleteMany({Department:"Computer Science",Semester:6})
```
Use a condition matching your sample records; avoid an empty filter unless deleting all records is intended.

## Q16. Count documents
```javascript
db.Students.countDocuments({})
```

## Q17. Rename Students to StudentDetails
```javascript
db.Students.renameCollection("StudentDetails")
show collections
```
After renaming, use `db.StudentDetails`.

## Q18. Create Departments and insert sample information
```javascript
db.createCollection("Departments")
db.Departments.insertMany([
{DepartmentId:"CSE",DepartmentName:"Computer Science",HOD:"Dr. Rao"},
{DepartmentId:"IT",DepartmentName:"Information Technology",HOD:"Dr. Mehta"},
{DepartmentId:"ECE",DepartmentName:"Electronics",HOD:"Dr. Das"}
])
db.Departments.find()
```

## Q19. Drop Departments
```javascript
db.Departments.drop()
show collections
```

## Q20. Drop StudentDB
```javascript
db.getName() // Confirm StudentDB first.
db.dropDatabase()
show dbs
```
**Destructive:** removes the selected database and all collections. Run only on disposable lab data.

## Q21. Recreate StudentDB and insert sample data
```javascript
use("StudentDB")
db.Students.insertMany([
{RollNumber:201,Name:"Ananya Joshi",Department:"Computer Science",Semester:5,CGPA:8.7},
{RollNumber:202,Name:"Rohan Patel",Department:"Information Technology",Semester:5,CGPA:8.2}
])
db.Students.find()
```

## Q22. CRUD using MongoDB Compass and compare with Shell
1. Open Compass and connect to `mongodb://localhost:27017`.
2. Select `StudentDB`; if absent choose **Create Database**, enter `StudentDB` and `Students`.
3. In `Students`, choose **Add Data → Insert Document** and insert:
   ```json
   {"RollNumber":301,"Name":"Nisha","Department":"Computer Science","Semester":5,"CGPA":8.6}
   ```
4. Read with filter `{ "Department": "Computer Science" }`.
5. Edit the test document and change `Semester` to `6`; save.
6. Delete only this test document and confirm.
7. Compare with Shell:
   ```javascript
   db.Students.insertOne({RollNumber:301,Name:"Nisha",Department:"Computer Science",Semester:5,CGPA:8.6})
   db.Students.find({Department:"Computer Science"})
   db.Students.updateOne({RollNumber:301},{$set:{Semester:6}})
   db.Students.deleteOne({RollNumber:301})
   ```
8. Refresh Compass and compare. Capture your own screenshots.

## Q23. Demonstrate Shell and Compass management
- Shell: `show dbs`, `use("StudentDB")`, `show collections`, `db.createCollection("Faculty")`, `db.Faculty.drop()`.
- Compass: use the sidebar to view databases/collections; use **Create Database** and **Create Collection**; use collection menus for supported rename/drop actions.
- Connect both tools to the same MongoDB server; refresh Compass after Shell changes.

## Q24. Compare MongoDB CRUD with SQL
| Operation | MongoDB | SQL equivalent |
|---|---|---|
| Insert | `db.Students.insertOne({...})` | `INSERT INTO Students (...) VALUES (...);` |
| Read | `db.Students.find({Department:"CSE"})` | `SELECT * FROM Students WHERE Department='CSE';` |
| Update | `db.Students.updateOne({RollNumber:101},{$set:{Semester:6}})` | `UPDATE Students SET Semester=6 WHERE RollNumber=101;` |
| Delete | `db.Students.deleteOne({RollNumber:101})` | `DELETE FROM Students WHERE RollNumber=101;` |

MongoDB stores BSON documents in collections with flexible structures. Relational SQL databases store rows in tables with defined schemas and commonly use joins and foreign keys. MongoDB uses document filters/update operators; SQL uses statements such as SELECT, UPDATE, DELETE. Both support CRUD, indexes, and transaction capabilities, with database-specific differences.

## Q25. Comprehensive laboratory report
Complete `report/Lab_Record_Template.md` with objective, requirements, commands actually executed, actual outputs, screenshots, observations, and conclusion. Do not present illustrative output notes as actual execution logs.

## Run Q1–Q21 script
Start MongoDB, open `mongosh` in this folder, then:
```javascript
load("mongosh/lab01_all_practicals.js")
```
Read the destructive warning at the top of the script before running.
