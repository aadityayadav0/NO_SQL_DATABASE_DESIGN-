# BCA305P SE — Lab Sheet 2
## NoSQL Database Design — Code Solutions (Q1–Q15)

This document contains code examples for the tasks listed in the supplied **BCA305P-AS01.pdf, Lab Sheet 2**. It is a single document containing different database languages and tools. The code blocks are intentionally kept separate because SQL, MongoDB shell, Redis CLI, Cassandra CQL, HBase shell, Cypher, and Python are different execution environments.

> Before running: install and start the relevant database service and its client. Replace sample credentials, hosts, and paths with your own environment. Distributed deployment tasks (sharding and replication) require multiple configured database instances; a local script alone cannot create a real multi-node cluster.

---

## Q1. Student data in MySQL and MongoDB; compare the models

### MySQL

```sql
CREATE DATABASE IF NOT EXISTS CollegeDB;
USE CollegeDB;

CREATE TABLE IF NOT EXISTS Student (
    Student_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Course VARCHAR(80),
    Semester INT,
    Marks DECIMAL(5,2)
);

INSERT INTO Student (Student_ID, Name, Course, Semester, Marks) VALUES
(1, 'Aarav', 'BCA', 1, 82.5),
(2, 'Diya', 'BCA', 2, 88.0),
(3, 'Kabir', 'BSc', 1, 76.5),
(4, 'Meera', 'BCom', 3, 91.0),
(5, 'Ishaan', 'BCA', 2, 79.0);

SELECT * FROM Student;
```

### MongoDB

```javascript
use CollegeDB

db.Students.insertMany([
  { Student_ID: 1, Name: "Aarav",  Course: "BCA",  Semester: 1, Marks: 82.5 },
  { Student_ID: 2, Name: "Diya",   Course: "BCA",  Semester: 2, Marks: 88.0 },
  { Student_ID: 3, Name: "Kabir",  Course: "BSc",  Semester: 1, Marks: 76.5 },
  { Student_ID: 4, Name: "Meera",  Course: "BCom", Semester: 3, Marks: 91.0 },
  { Student_ID: 5, Name: "Ishaan", Course: "BCA",  Semester: 2, Marks: 79.0 }
]);

db.Students.find().pretty();
```

---

## Q2. MongoDB CollegeDB and Students CRUD operations

```javascript
use CollegeDB

db.Students.insertMany([
  { Student_ID: 1, Name: "Aarav",  Course: "BCA",  Semester: 1, Marks: 82 },
  { Student_ID: 2, Name: "Diya",   Course: "BCA",  Semester: 2, Marks: 88 },
  { Student_ID: 3, Name: "Kabir",  Course: "BSc",  Semester: 1, Marks: 76 },
  { Student_ID: 4, Name: "Meera",  Course: "BCom", Semester: 3, Marks: 91 },
  { Student_ID: 5, Name: "Ishaan", Course: "BCA",  Semester: 2, Marks: 79 }
]);

// Display all documents
db.Students.find().pretty();

// Find students from a particular course
db.Students.find({ Course: "BCA" });

// Update marks of one student
db.Students.updateOne(
  { Student_ID: 2 },
  { $set: { Marks: 90 } }
);

// Delete one student
db.Students.deleteOne({ Student_ID: 5 });

// Count students
db.Students.countDocuments({});
```

---

## Q3. MongoDB Orders with embedded customer and products

```javascript
use CollegeDB

db.Orders.insertMany([
  {
    Order_ID: 101,
    Customer: { Customer_ID: 1, Name: "Aarav" },
    Products: [
      { Product_ID: "P1", Name: "Keyboard", Quantity: 1, Price: 700 },
      { Product_ID: "P2", Name: "Mouse", Quantity: 2, Price: 300 }
    ]
  },
  {
    Order_ID: 102,
    Customer: { Customer_ID: 2, Name: "Diya" },
    Products: [
      { Product_ID: "P3", Name: "Monitor", Quantity: 1, Price: 8500 }
    ]
  },
  {
    Order_ID: 103,
    Customer: { Customer_ID: 1, Name: "Aarav" },
    Products: [
      { Product_ID: "P4", Name: "USB Drive", Quantity: 3, Price: 450 }
    ]
  },
  {
    Order_ID: 104,
    Customer: { Customer_ID: 3, Name: "Kabir" },
    Products: [
      { Product_ID: "P5", Name: "Headphones", Quantity: 1, Price: 1200 }
    ]
  },
  {
    Order_ID: 105,
    Customer: { Customer_ID: 4, Name: "Meera" },
    Products: [
      { Product_ID: "P6", Name: "Webcam", Quantity: 1, Price: 2200 }
    ]
  }
]);

// Orders of a particular customer
db.Orders.find({ "Customer.Name": "Aarav" });

// Update quantity of a product in an order
db.Orders.updateOne(
  { Order_ID: 101, "Products.Product_ID": "P2" },
  { $set: { "Products.$.Quantity": 3 } }
);

// Calculate total amount and show it with each order
db.Orders.aggregate([
  {
    $project: {
      Order_ID: 1,
      Customer: 1,
      TotalAmount: {
        $sum: {
          $map: {
            input: "$Products",
            as: "p",
            in: { $multiply: ["$$p.Quantity", "$$p.Price"] }
          }
        }
      }
    }
  }
]);

// Orders above a specified amount (example: 1000)
db.Orders.aggregate([
  {
    $addFields: {
      TotalAmount: {
        $sum: {
          $map: {
            input: "$Products",
            as: "p",
            in: { $multiply: ["$$p.Quantity", "$$p.Price"] }
          }
        }
      }
    }
  },
  { $match: { TotalAmount: { $gt: 1000 } } }
]);
```

---

## Q4. Redis student information system

Run in `redis-cli`:

```redis
SET student:1 "Aarav"
SET student:2 "Diya"
SET student:3 "Kabir"
SET student:4 "Meera"
SET student:5 "Ishaan"

GET student:3

SET student:3 "Kabir Sharma"

DEL student:5

KEYS student:*
```

---

## Q5. Cassandra CollegeDB keyspace and Students table

Run in `cqlsh`:

```sql
CREATE KEYSPACE IF NOT EXISTS CollegeDB
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE CollegeDB;

CREATE TABLE IF NOT EXISTS Students (
    Student_ID int PRIMARY KEY,
    Name text,
    Course text,
    Semester int,
    Marks decimal
);

INSERT INTO Students (Student_ID, Name, Course, Semester, Marks)
VALUES (1, 'Aarav', 'BCA', 1, 82.5);

INSERT INTO Students (Student_ID, Name, Course, Semester, Marks)
VALUES (2, 'Diya', 'BCA', 2, 88.0);

INSERT INTO Students (Student_ID, Name, Course, Semester, Marks)
VALUES (3, 'Kabir', 'BSc', 1, 76.5);

INSERT INTO Students (Student_ID, Name, Course, Semester, Marks)
VALUES (4, 'Meera', 'BCom', 3, 91.0);

INSERT INTO Students (Student_ID, Name, Course, Semester, Marks)
VALUES (5, 'Ishaan', 'BCA', 2, 79.0);

// Display all records
SELECT * FROM Students;

// Course filtering requires an index or an appropriate query table in Cassandra.
// For this lab demonstration:
CREATE INDEX IF NOT EXISTS students_course_idx ON Students (Course);
SELECT * FROM Students WHERE Course = 'BCA';

// Update marks
UPDATE Students SET Marks = 90 WHERE Student_ID = 2;

// Delete a student
DELETE FROM Students WHERE Student_ID = 5;
```

---

## Q6. HBase Students table with personal and academic column families

Run in the HBase shell:

```ruby
create 'Students', 'personal', 'academic'

put 'Students', '1', 'personal:name', 'Aarav'
put 'Students', '1', 'personal:course', 'BCA'
put 'Students', '1', 'academic:semester', '1'
put 'Students', '1', 'academic:marks', '82'

put 'Students', '2', 'personal:name', 'Diya'
put 'Students', '2', 'personal:course', 'BCA'
put 'Students', '2', 'academic:semester', '2'
put 'Students', '2', 'academic:marks', '88'

put 'Students', '3', 'personal:name', 'Kabir'
put 'Students', '3', 'personal:course', 'BSc'
put 'Students', '3', 'academic:semester', '1'
put 'Students', '3', 'academic:marks', '76'

put 'Students', '4', 'personal:name', 'Meera'
put 'Students', '4', 'personal:course', 'BCom'
put 'Students', '4', 'academic:semester', '3'
put 'Students', '4', 'academic:marks', '91'

put 'Students', '5', 'personal:name', 'Ishaan'
put 'Students', '5', 'personal:course', 'BCA'
put 'Students', '5', 'academic:semester', '2'
put 'Students', '5', 'academic:marks', '79'

get 'Students', '2'
put 'Students', '2', 'academic:marks', '90'
scan 'Students'
deleteall 'Students', '5'
```

---

## Q7. Neo4j Student–Course graph

Run in Neo4j Browser:

```cypher
CREATE
  (s1:Student {student_id: 1, name: 'Aarav'}),
  (s2:Student {student_id: 2, name: 'Diya'}),
  (s3:Student {student_id: 3, name: 'Kabir'}),
  (s4:Student {student_id: 4, name: 'Meera'}),
  (s5:Student {student_id: 5, name: 'Ishaan'}),
  (c1:Course {name: 'BCA'}),
  (c2:Course {name: 'BSc'}),
  (c3:Course {name: 'BCom'}),
  (s1)-[:ENROLLED_IN]->(c1),
  (s2)-[:ENROLLED_IN]->(c1),
  (s3)-[:ENROLLED_IN]->(c2),
  (s4)-[:ENROLLED_IN]->(c3),
  (s5)-[:ENROLLED_IN]->(c1);

// Display all students
MATCH (s:Student) RETURN s;

// Find students in BCA
MATCH (s:Student)-[:ENROLLED_IN]->(c:Course {name: 'BCA'})
RETURN s.name;

// Courses taken by a particular student
MATCH (s:Student {name: 'Aarav'})-[:ENROLLED_IN]->(c:Course)
RETURN c.name;

// Add a relationship
MATCH (s:Student {name: 'Kabir'}), (c:Course {name: 'BCA'})
CREATE (s)-[:ENROLLED_IN]->(c);

// Remove a relationship
MATCH (:Student {name: 'Kabir'})-[r:ENROLLED_IN]->(:Course {name: 'BCA'})
DELETE r;
```

---

## Q8. Implement the same student dataset in MongoDB, Cassandra, and Neo4j

Use the student records from Q1.

### MongoDB document model

```javascript
use CollegeDB
db.Students.insertMany([
  { Student_ID: 1, Name: "Aarav", Course: "BCA", Semester: 1, Marks: 82 },
  { Student_ID: 2, Name: "Diya", Course: "BCA", Semester: 2, Marks: 88 },
  { Student_ID: 3, Name: "Kabir", Course: "BSc", Semester: 1, Marks: 76 },
  { Student_ID: 4, Name: "Meera", Course: "BCom", Semester: 3, Marks: 91 },
  { Student_ID: 5, Name: "Ishaan", Course: "BCA", Semester: 2, Marks: 79 }
]);
db.Students.find();
```

### Cassandra table model

```sql
USE CollegeDB;
SELECT * FROM Students;
```

### Neo4j graph model

```cypher
MATCH (s:Student)-[:ENROLLED_IN]->(c:Course)
RETURN s, c;
```

### Comparison points

- **Data model:** MongoDB stores documents; Cassandra stores partitioned rows; Neo4j stores nodes and relationships.
- **Storage structure:** MongoDB uses BSON documents; Cassandra uses tables/partitions; Neo4j uses a graph structure.
- **Query method:** MongoDB Query API; Cassandra CQL; Neo4j Cypher.
- **Scalability:** Each supports scaling with different architecture and trade-offs; actual capacity depends on deployment and workload.
- **Suitable applications:** MongoDB for flexible document data; Cassandra for distributed high-write workloads; Neo4j for highly connected data.

---

## Q9. Single-server/local MongoDB deployment and CRUD

Start MongoDB using the service manager or `mongod` for your operating system. Then run in `mongosh`:

```javascript
use SingleServerDB

db.createCollection("Students");

db.Students.insertMany([
  { Student_ID: 1, Name: "Aarav", Course: "BCA", Marks: 82 },
  { Student_ID: 2, Name: "Diya", Course: "BCA", Marks: 88 },
  { Student_ID: 3, Name: "Kabir", Course: "BSc", Marks: 76 }
]);

// Read
db.Students.find();

// Update
db.Students.updateOne(
  { Student_ID: 1 },
  { $set: { Marks: 85 } }
);

// Delete
db.Students.deleteOne({ Student_ID: 3 });

// Verify
db.Students.find();
db.Students.countDocuments({});
```

---

## Q10. MongoDB sharding demonstration

> Requires a sharded MongoDB deployment with config servers, shard servers, and `mongos`. The following commands are run in `mongosh` connected to `mongos`; they do not create the cluster processes themselves.

```javascript
sh.enableSharding("CollegeDB");

db = db.getSiblingDB("CollegeDB");

db.Students.insertMany(
  Array.from({ length: 20 }, (_, i) => ({
    Student_ID: i + 1,
    Name: "Student" + (i + 1),
    Course: ["BCA", "BSc", "BCom"][i % 3],
    Marks: 60 + (i % 40)
  }))
);

// Create an index for the chosen shard key
db.Students.createIndex({ Student_ID: "hashed" });

// Shard the collection using the hashed Student_ID key
sh.shardCollection("CollegeDB.Students", { Student_ID: "hashed" });

// Inspect sharding and chunk information
sh.status();
db.Students.getShardVersion();
```

A shard key determines how documents are distributed. Sharding can increase storage and throughput capacity by distributing data across shards; it also adds operational complexity.

---

## Q11. MongoDB Primary-Secondary replication (replica set)

> Requires at least two MongoDB instances configured with the same replica-set name and reachable hostnames/ports. Start the instances with `mongod --replSet rs0` and suitable separate data directories before running this in `mongosh`.

```javascript
// Run once on the first node
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" }
  ]
});

// Check replica-set state
rs.status();

// Insert on the primary
use CollegeDB
db.ReplicationDemo.insertOne({
  Student_ID: 1,
  Name: "Aarav",
  Course: "BCA"
});

// On a secondary connection, allow secondary reads and verify
rs.secondaryOk();
db.getSiblingDB("CollegeDB").ReplicationDemo.find();
```

If the primary becomes unavailable, an eligible secondary may be elected primary if the replica set has a voting majority. If no majority is available, writes may not be accepted until a primary can be elected.

---

## Q12. Cassandra peer-to-peer replication

> Requires a Cassandra cluster with multiple configured nodes. Run the CQL statements in `cqlsh` connected to the cluster.

```sql
CREATE KEYSPACE IF NOT EXISTS CollegeP2P
WITH replication = {
  'class': 'NetworkTopologyStrategy',
  'datacenter1': 3
};

USE CollegeP2P;

CREATE TABLE IF NOT EXISTS Students (
  Student_ID int PRIMARY KEY,
  Name text,
  Course text,
  Marks int
);

INSERT INTO Students (Student_ID, Name, Course, Marks)
VALUES (1, 'Aarav', 'BCA', 82);

INSERT INTO Students (Student_ID, Name, Course, Marks)
VALUES (2, 'Diya', 'BCA', 88);

SELECT * FROM Students;
```

Check node status using `nodetool status` on a Cassandra node. Cassandra uses a peer-to-peer architecture in which nodes have equal roles; master-slave systems instead distinguish a primary/master from secondary/slave nodes.

---

## Q13. Sharding + replication architecture demonstration

> This is a MongoDB sharded-cluster setup task. Configure the config-server replica set, shard replica sets, and `mongos` first. Then run the following commands through `mongos`.

```javascript
sh.enableSharding("CollegeDB");

db = db.getSiblingDB("CollegeDB");

db.Students.createIndex({ Student_ID: "hashed" });

sh.shardCollection("CollegeDB.Students", { Student_ID: "hashed" });

db.Students.insertMany(
  Array.from({ length: 30 }, (_, i) => ({
    Student_ID: i + 1,
    Name: "Student" + (i + 1),
    Course: ["BCA", "BSc", "BCom"][i % 3],
    Marks: 55 + (i % 45)
  }))
);

sh.status();
db.Students.find();
```

Each shard should be configured as a replica set for shard-level replication. Verify each replica set with `rs.status()` on its members and verify distribution with `sh.status()`.

---

## Q14. MapReduce on a student dataset

MongoDB MapReduce is deprecated in modern MongoDB releases and may be unavailable depending on server version. This example shows the MapReduce operation requested in the lab; for new applications, use aggregation pipelines.

```javascript
use CollegeDB

db.StudentMarks.insertMany([
  { Student_ID: 1, Name: "Aarav", Course: "BCA", Marks: 82 },
  { Student_ID: 2, Name: "Diya", Course: "BCA", Marks: 88 },
  { Student_ID: 3, Name: "Kabir", Course: "BSc", Marks: 76 },
  { Student_ID: 4, Name: "Meera", Course: "BCom", Marks: 91 },
  { Student_ID: 5, Name: "Ishaan", Course: "BCA", Marks: 79 }
]);

var mapFunction = function () {
  emit(this.Course, { count: 1, totalMarks: this.Marks });
};

var reduceFunction = function (course, values) {
  var result = { count: 0, totalMarks: 0 };
  values.forEach(function (value) {
    result.count += value.count;
    result.totalMarks += value.totalMarks;
  });
  return result;
};

db.StudentMarks.mapReduce(
  mapFunction,
  reduceFunction,
  { out: "CourseMapReduceResults" }
);

db.CourseMapReduceResults.find().forEach(function (doc) {
  print({
    Course: doc._id,
    StudentCount: doc.value.count,
    AverageMarks: doc.value.totalMarks / doc.value.count
  });
});
```

### Modern aggregation alternative

```javascript
db.StudentMarks.aggregate([
  {
    $group: {
      _id: "$Course",
      StudentCount: { $sum: 1 },
      AverageMarks: { $avg: "$Marks" }
    }
  },
  { $sort: { _id: 1 } }
]);
```

---

## Q15. Database distribution models — commands and architecture notes

### A. Single server

```javascript
use DistributionLab
db.Students.insertOne({ Student_ID: 1, Name: "Aarav", Course: "BCA" });
db.Students.find();
```

### B. Sharding (MongoDB, run through `mongos` in a configured sharded cluster)

```javascript
sh.enableSharding("DistributionLab");
db = db.getSiblingDB("DistributionLab");
db.Students.createIndex({ Student_ID: "hashed" });
sh.shardCollection("DistributionLab.Students", { Student_ID: "hashed" });
sh.status();
```

### C. Master-secondary replication (MongoDB replica set)

```javascript
// Run on the first configured replica-set node
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" }
  ]
});
rs.status();
```

### D. Peer-to-peer replication (Cassandra)

```sql
CREATE KEYSPACE IF NOT EXISTS DistributionLab
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 3
};
```

### E. Sharding + replication

Configure each MongoDB shard as a replica set, add the shard replica sets to the sharded cluster, enable sharding for the database, and shard the collection as shown in Q13.

### Architecture comparison

| Model | Data distribution | Failure handling | Advantage | Limitation | Example use |
|---|---|---|---|---|---|
| Single server | One server stores the data | Server failure can make data unavailable | Simple to set up | Limited scale and single point of failure | Small local application |
| Sharding | Data split across shards | Depends on shard availability and any configured replicas | Horizontal data/throughput scaling | More operational complexity | Large datasets |
| Master-secondary | Primary replicates to secondary nodes | Eligible secondary can be elected after primary failure | Read redundancy and failover | Writes normally go through primary | Applications needing primary-based writes |
| Peer-to-peer | Nodes share responsibility | Replicas and consistency settings help maintain availability | No single master role | Coordination and consistency need planning | Distributed workloads |
| Sharding + replication | Data split across replicated shards | Replica set can provide failover within each shard | Scaling plus redundancy | Highest deployment complexity | Large, highly available systems |

---

## Run and submission notes

- Use the correct shell for each block: `mysql`, `mongosh`, `redis-cli`, `cqlsh`, HBase shell, or Neo4j Browser.
- The Python/application and database-server setup depends on the operating system and installed database version.
- For MongoDB replica sets and sharding, Cassandra multi-node replication, and HBase, a real cluster or configured services are required. The configuration examples above are not proof that a cluster has been deployed.
- Use test data only. Do not upload database passwords, API keys, or private connection strings to a public repository.
- Run the commands in your own environment and capture your actual output for practical submission.
