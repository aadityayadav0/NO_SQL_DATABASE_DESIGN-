# BCA305P – NoSQL Database Design
## Lab Sheet 1: MongoDB Practical Code

**Source note:** The supplied PDF heading reads “Problem Statement Lab Sheet-02”. The filename and heading here use “Lab Sheet 1” as requested. This file covers the 25 tasks in the PDF.

**Environment:** MongoDB Community Edition, `mongosh`, MongoDB Compass. Run commands in `mongosh` in order. Examples use sample data; replace it with your own values. Run destructive commands only in this practice database.

## Q1. Create StudentDB and verify

```javascript
use StudentDB
db
show dbs
```

MongoDB persists a database after data is stored in it. If it does not appear in `show dbs` yet, create a collection or insert a document.

## Q2. Create Students, Faculty, and Courses

```javascript
use StudentDB
db.createCollection("Students")
db.createCollection("Faculty")
db.createCollection("Courses")
show collections
```

## Q3. Insert one student

```javascript
db.Students.insertOne({
  RollNumber: 101,
  Name: "Aarav Sharma",
  Department: "Computer Science",
  Semester: 5,
  CGPA: 8.4
})
```

## Q4. Insert multiple students

```javascript
db.Students.insertMany([
  { RollNumber: 102, Name: "Diya Verma", Department: "Information Technology", Semester: 5, CGPA: 8.7 },
  { RollNumber: 103, Name: "Kabir Singh", Department: "Computer Science", Semester: 5, CGPA: 7.9 },
  { RollNumber: 104, Name: "Meera Gupta", Department: "Electronics", Semester: 3, CGPA: 8.1 },
  { RollNumber: 105, Name: "Ishaan Khan", Department: "Computer Science", Semester: 3, CGPA: 7.6 }
])
```

## Q5. Retrieve all students

```javascript
db.Students.find()
db.Students.find().pretty()
```

## Q6. Find a student by RollNumber

```javascript
db.Students.findOne({ RollNumber: 103 })
```

## Q7. Find students by Department

```javascript
db.Students.find({ Department: "Computer Science" })
```

## Q8. Show only Name and Department (projection)

```javascript
db.Students.find({}, { _id: 0, Name: 1, Department: 1 })
```

## Q9. Update one student's Department using updateOne()

```javascript
db.Students.updateOne(
  { RollNumber: 103 },
  { $set: { Department: "Information Technology" } }
)
db.Students.findOne({ RollNumber: 103 })
```

## Q10. Update Semester for a department using updateMany()

```javascript
db.Students.updateMany(
  { Department: "Computer Science" },
  { $set: { Semester: 6 } }
)
db.Students.find({ Department: "Computer Science" })
```

## Q11. Replace a student document using replaceOne()

```javascript
db.Students.replaceOne(
  { RollNumber: 104 },
  {
    RollNumber: 104,
    Name: "Meera Gupta",
    Department: "Mathematics",
    Semester: 4,
    CGPA: 8.3
  }
)
db.Students.findOne({ RollNumber: 104 })
```

## Q12. Add Email field to all student documents

This example generates placeholder addresses using each student's roll number.

```javascript
db.Students.updateMany(
  {},
  [
    {
      $set: {
        Email: {
          $concat: [
            "student",
            { $toString: "$RollNumber" },
            "@example.com"
          ]
        }
      }
    }
  ]
)
db.Students.find({}, { _id: 0, RollNumber: 1, Name: 1, Email: 1 })
```

## Q13. Remove a field from all documents

This removes the Email field added in Q12. Change the field name if your record uses another field.

```javascript
db.Students.updateMany({}, { $unset: { Email: "" } })
db.Students.find()
```

## Q14. Delete one student by RollNumber using deleteOne()

```javascript
db.Students.deleteOne({ RollNumber: 105 })
db.Students.find()
```

## Q15. Delete multiple matching students using deleteMany()

Example condition: CGPA below 8.0. Inspect matching records before deleting.

```javascript
db.Students.find({ CGPA: { $lt: 8.0 } })
db.Students.deleteMany({ CGPA: { $lt: 8.0 } })
db.Students.find()
```

## Q16. Count all documents in Students

```javascript
db.Students.countDocuments({})
```

## Q17. Rename Students to StudentDetails

```javascript
db.Students.renameCollection("StudentDetails")
show collections
db.StudentDetails.find()
```

## Q18. Create Departments and insert sample information

```javascript
db.createCollection("Departments")
db.Departments.insertMany([
  { DepartmentID: "D01", DepartmentName: "Computer Science", Head: "Dr. Sharma" },
  { DepartmentID: "D02", DepartmentName: "Information Technology", Head: "Dr. Verma" },
  { DepartmentID: "D03", DepartmentName: "Electronics", Head: "Dr. Mehta" }
])
db.Departments.find()
```

## Q19. Drop Departments and verify

```javascript
db.Departments.drop()
show collections
```

## Q20. Drop StudentDB and confirm removal

**Warning:** This permanently removes the practice database and its collections/documents.

```javascript
use StudentDB
db.dropDatabase()
show dbs
```

## Q21. Recreate StudentDB and insert sample data

```javascript
use StudentDB
db.Students.insertMany([
  { RollNumber: 201, Name: "Ananya Rao", Department: "Computer Science", Semester: 5, CGPA: 8.8 },
  { RollNumber: 202, Name: "Rohan Das", Department: "Information Technology", Semester: 5, CGPA: 8.2 },
  { RollNumber: 203, Name: "Sara Ali", Department: "Electronics", Semester: 3, CGPA: 9.0 }
])
db.Students.find()
show collections
show dbs
```

## Q22. Perform CRUD using MongoDB Compass

1. Open MongoDB Compass and connect to your MongoDB deployment. A local connection commonly uses `mongodb://localhost:27017`.
2. Create or select the `StudentDB` database.
3. Create a collection named `Students`.
4. Select `Students`, choose **ADD DATA → Insert Document**, and add one student document.
5. Add multiple documents using **Insert Document** or **Import File**.
6. Read records in the Documents tab. Example filter: `{ "Department": "Computer Science" }`.
7. Edit a document using its edit control and save.
8. Delete a document using its delete control.
9. Run the corresponding `mongosh` commands from Q3–Q16 and compare results with Compass.
10. Take screenshots of the database, collection, inserted documents, query results, update, and delete operations for your lab record.

## Q23. Demonstrate Shell and Compass database/collection management

**MongoDB Shell examples:**

```javascript
show dbs
use StudentDB
show collections
db.createCollection("Courses")
db.Courses.insertOne({ CourseID: "C01", CourseName: "NoSQL Database" })
db.Courses.find()
```

**MongoDB Compass:** Connect to the same deployment; view databases and collections in the left panel; create a database or collection using the graphical controls; insert, view, filter, edit, and delete documents in the Documents tab; then verify the same changes in `mongosh`.

## Q24. Compare MongoDB CRUD with equivalent SQL operations

| Operation | MongoDB (`mongosh`) | SQL equivalent |
|---|---|---|
| Create database | `use StudentDB` (persisted when data is created) | `CREATE DATABASE StudentDB;` |
| Create collection/table | `db.createCollection("Students")` | `CREATE TABLE Students (...);` |
| Insert | `db.Students.insertOne({RollNumber: 1, Name: "Asha"})` | `INSERT INTO Students (RollNumber, Name) VALUES (1, 'Asha');` |
| Read all | `db.Students.find()` | `SELECT * FROM Students;` |
| Read by condition | `db.Students.find({RollNumber: 1})` | `SELECT * FROM Students WHERE RollNumber = 1;` |
| Update | `db.Students.updateOne({RollNumber: 1}, {$set: {Name: "Asha Rao"}})` | `UPDATE Students SET Name = 'Asha Rao' WHERE RollNumber = 1;` |
| Delete | `db.Students.deleteOne({RollNumber: 1})` | `DELETE FROM Students WHERE RollNumber = 1;` |

**Differences:**
- MongoDB is document-oriented and stores BSON documents in collections.
- Relational SQL databases store data in tables with rows and columns.
- MongoDB documents can have flexible fields and structures; relational tables usually have a defined schema.
- MongoDB uses document filters and update operators; SQL uses statements such as `SELECT`, `UPDATE`, and `DELETE`.
- The appropriate database depends on data structure, relationships, consistency needs, and query patterns.

## Q25. Laboratory report structure

Use this outline in your lab record and enter the actual outputs from your own system:

1. **Objective:** Work with MongoDB databases and collections, perform CRUD operations, and compare MongoDB with SQL.
2. **Requirements:** MongoDB Community Edition, `mongosh`, MongoDB Compass, Ubuntu/Linux, internet connection, and basic database/command-line knowledge.
3. **Procedure:** Record the steps followed for each practical Q1–Q24.
4. **Commands executed:** Record the commands used for each question.
5. **Output:** Add the actual output returned by your MongoDB installation.
6. **Screenshots:** Attach screenshots of important Shell and Compass operations.
7. **Observations:** Note the results of create, read, update, delete, rename, count, and drop operations.
8. **Conclusion:** Summarize what you learned about MongoDB database/collection management, CRUD, Compass, Shell, and SQL comparison.

---

## Practical notes

- Run dependent questions in sequence. Q20 deliberately drops the practice database; Q21 recreates it.
- `example.com` email addresses are placeholders, not real student contact details.
- Check matching documents with `find()` before executing a delete.
- Output, generated `_id` values, and counts depend on the data and commands actually run. Record your own observed results; do not invent output.
- The PDF also asks for screenshots and a completed lab report. This file supplies commands and report guidance, not screenshots of executions on your device.
