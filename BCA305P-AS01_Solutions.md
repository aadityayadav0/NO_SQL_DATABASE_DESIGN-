# BCA305P-AS01 — Lab Sheet 4 Solutions

Actual sheet topics: Q1–Q10 Apache HBase; Q11–Q15 Apache Cassandra. Run HBase examples in HBase shell and CQL examples in cqlsh. Sample values can be changed for your practical.

## Q1. Student table (HBase)
```ruby
create 'Student', 'personal', 'academic'
put 'Student','S101','personal:name','Aarav'
put 'Student','S101','personal:city','Saharanpur'
put 'Student','S101','academic:course','BCA'
put 'Student','S101','academic:semester','5'
put 'Student','S102','personal:name','Priya'
put 'Student','S102','personal:city','Roorkee'
put 'Student','S102','academic:course','BCA'
put 'Student','S102','academic:semester','3'
put 'Student','S103','personal:name','Rahul'
put 'Student','S103','academic:course','BSc'
put 'Student','S104','personal:name','Neha'
put 'Student','S104','academic:course','BCA'
put 'Student','S105','personal:name','Vikas'
put 'Student','S105','academic:course','BCom'
scan 'Student'
get 'Student','S101'
```
Expected: five student row keys are listed; `get` displays S101 cells.

## Q2. Employee CRUD (HBase)
```ruby
create 'Employee','info','job'
put 'Employee','E101','info:name','Amit'
put 'Employee','E101','job:role','Developer'
put 'Employee','E101','job:salary','45000'
get 'Employee','E101'
scan 'Employee'
put 'Employee','E101','job:salary','50000'
get 'Employee','E101'
delete 'Employee','E101','info:name'
deleteall 'Employee','E101'
```
Expected: salary changes to 50000; delete removes a cell or whole row.

## Q3. Event Logging System (HBase)
```ruby
create 'EventLog','event','user','status'
put 'EventLog','EVT1001','event:timestamp','2026-10-20T10:00:00'
put 'EventLog','EVT1001','event:type','LOGIN'
put 'EventLog','EVT1001','user:user_id','U101'
put 'EventLog','EVT1001','status:result','SUCCESS'
put 'EventLog','EVT1002','event:type','FILE_UPLOAD'
put 'EventLog','EVT1002','user:user_id','U102'
put 'EventLog','EVT1002','status:result','SUCCESS'
get 'EventLog','EVT1001'
scan 'EventLog'
```
Expected: event data is retrieved by event row key. Keep each event's cells under the same row key.

## Q4. Content Management System (HBase)
```ruby
create 'CMS','content','author','metadata'
put 'CMS','C001','content:title','HBase Basics'
put 'CMS','C001','content:body','Introduction to HBase'
put 'CMS','C001','author:name','Aarav'
put 'CMS','C001','metadata:status','draft'
get 'CMS','C001'
put 'CMS','C001','metadata:status','published'
get 'CMS','C001'
delete 'CMS','C001','content:body'
get 'CMS','C001'
```
Expected: status updates and body cell is deleted.

## Q5. Blogging platform (HBase)
```ruby
create 'Blog','details','author','comments'
put 'Blog','B001','details:title','Learning NoSQL'
put 'Blog','B001','author:name','Aarav'
put 'Blog','B001','comments:c1','Very useful'
put 'Blog','B002','details:title','HBase Regions'
put 'Blog','B002','author:name','Priya'
put 'Blog','B003','details:title','Cassandra CQL'
put 'Blog','B003','author:name','Rahul'
scan 'Blog'
get 'Blog','B002'
```
Expected: three blog records; B002 is retrieved by row key.

## Q6. Column families and qualifiers (HBase)
```ruby
create 'Product','identity','specs','stock'
put 'Product','P01','identity:name','Laptop'
put 'Product','P01','identity:brand','ExampleBrand'
put 'Product','P01','specs:ram','16GB'
put 'Product','P01','specs:storage','512GB SSD'
put 'Product','P01','stock:warehouse1','25'
describe 'Product'
scan 'Product'
```
Expected: `identity`, `specs`, `stock` are column families; `name`, `ram`, `warehouse1` are qualifiers. Families are defined at table creation, while qualifiers can vary by row.

## Q7. Website page-view counter (HBase)
```ruby
create 'WebsiteCounter','views'
incr 'WebsiteCounter','home','views:count',1
incr 'WebsiteCounter','home','views:count',1
incr 'WebsiteCounter','products','views:count',1
get 'WebsiteCounter','home'
get 'WebsiteCounter','products'
```
Expected: home count 2, products count 1. `incr` is an atomic counter increment.

## Q8. Session TTL (HBase)
```ruby
create 'UserSession', {NAME => 'session', TTL => 86400}, {NAME => 'user'}
put 'UserSession','SID1001','session:user_id','U101'
put 'UserSession','SID1001','session:login_time','2026-10-20T09:00:00'
put 'UserSession','SID1001','session:status','active'
get 'UserSession','SID1001'
describe 'UserSession'
```
Expected: cells in `session` expire after 86400 seconds (one day). Physical removal may wait for compaction.

## Q9. Row-key design and scaling (HBase)
```ruby
create 'LargeApp','data'
put 'LargeApp','03#USER#10001','data:name','Riya'
put 'LargeApp','11#USER#10002','data:name','Kabir'
put 'LargeApp','07#USER#10003','data:name','Meera'
scan 'LargeApp'
get 'LargeApp','07#USER#10003'
```
Explanation: a deterministic hash/salt prefix spreads keys and writes across regions, avoiding hotspots from monotonically increasing keys. Application reads must calculate the same prefix. Pre-splitting can help.

## Q10. Regions and RegionServers (HBase)
```ruby
create 'RegionDemo','data', SPLITS => ['m','t']
put 'RegionDemo','a001','data:value','North'
put 'RegionDemo','n001','data:value','Middle'
put 'RegionDemo','z001','data:value','South'
scan 'RegionDemo'
```
Expected: row-key ranges are assigned to regions. Inspect region placement using HBase Web UI (often port 16010) or admin tools for your version. RegionServers serve reads/writes; region splitting and reassignment help scalability and availability.

## Q11. Cassandra CollegeDB and Students
```sql
CREATE KEYSPACE CollegeDB WITH replication = {'class':'SimpleStrategy','replication_factor':1};
USE CollegeDB;
CREATE TABLE Students (student_id int PRIMARY KEY, name text, city text, course text, semester int);
INSERT INTO Students (student_id,name,city,course,semester) VALUES (1,'Aarav','Saharanpur','BCA',5);
INSERT INTO Students (student_id,name,city,course,semester) VALUES (2,'Priya','Roorkee','BCA',3);
INSERT INTO Students (student_id,name,city,course,semester) VALUES (3,'Rahul','Dehradun','BSc',2);
INSERT INTO Students (student_id,name,city,course,semester) VALUES (4,'Neha','Haridwar','BCA',1);
INSERT INTO Students (student_id,name,city,course,semester) VALUES (5,'Vikas','Meerut','BCom',4);
SELECT * FROM Students;
```
Expected: five rows. RF=1 is for a single-node lab; use suitable replication for multi-node deployments.

## Q12. Employees CRUD (Cassandra)
```sql
USE CollegeDB;
CREATE TABLE Employees (employee_id int PRIMARY KEY, name text, department text, salary decimal);
INSERT INTO Employees (employee_id,name,department,salary) VALUES (101,'Amit','IT',45000);
SELECT * FROM Employees WHERE employee_id=101;
UPDATE Employees SET salary=50000 WHERE employee_id=101;
SELECT * FROM Employees WHERE employee_id=101;
DELETE FROM Employees WHERE employee_id=101;
SELECT * FROM Employees;
```
Expected: insert, select, update salary, then delete the row.

## Q13. Event logs by user and time range (Cassandra)
```sql
CREATE TABLE EventLogByUser (user_id text, event_time timestamp, event_id text, event_type text, status text, PRIMARY KEY ((user_id), event_time, event_id)) WITH CLUSTERING ORDER BY (event_time DESC);
INSERT INTO EventLogByUser (user_id,event_time,event_id,event_type,status) VALUES ('U101','2026-10-20 10:00:00','EV1','LOGIN','SUCCESS');
INSERT INTO EventLogByUser (user_id,event_time,event_id,event_type,status) VALUES ('U101','2026-10-20 10:30:00','EV2','FILE_UPLOAD','SUCCESS');
INSERT INTO EventLogByUser (user_id,event_time,event_id,event_type,status) VALUES ('U102','2026-10-20 11:00:00','EV3','LOGIN','FAILED');
SELECT * FROM EventLogByUser WHERE user_id='U101' AND event_time >= '2026-10-20 00:00:00' AND event_time < '2026-10-21 00:00:00';
```
Expected: U101 events in that time range. Cassandra tables are designed around query patterns and partition/clustering keys.

## Q14. Consistency and availability (Cassandra)
```sql
CREATE KEYSPACE ConsistencyDemo WITH replication = {'class':'SimpleStrategy','replication_factor':3};
USE ConsistencyDemo;
CREATE TABLE messages (message_id int PRIMARY KEY, message text);
CONSISTENCY ONE;
INSERT INTO messages (message_id,message) VALUES (1,'Hello');
SELECT * FROM messages WHERE message_id=1;
CONSISTENCY QUORUM;
INSERT INTO messages (message_id,message) VALUES (2,'Quorum write');
SELECT * FROM messages WHERE message_id=2;
CONSISTENCY ALL;
SELECT * FROM messages WHERE message_id=1;
```
Explanation: ONE needs one replica response, QUORUM a majority, ALL all replicas. Stronger levels can raise latency and fail if required replicas are unavailable. Observe behavior on a multi-node cluster; RF=3 on one node is not three independent replicas.

## Q15. Cassandra event logging application (CRUD + design)
```sql
CREATE KEYSPACE EventApp WITH replication = {'class':'SimpleStrategy','replication_factor':1};
USE EventApp;
CREATE TABLE events_by_user (user_id text, event_time timestamp, event_id text, event_type text, status text, PRIMARY KEY ((user_id), event_time, event_id)) WITH CLUSTERING ORDER BY (event_time DESC);
INSERT INTO events_by_user (user_id,event_time,event_id,event_type,status) VALUES ('U201','2026-10-20 09:15:00','E201','LOGIN','SUCCESS');
SELECT * FROM events_by_user WHERE user_id='U201';
UPDATE events_by_user SET status='REVIEWED' WHERE user_id='U201' AND event_time='2026-10-20 09:15:00' AND event_id='E201';
DELETE FROM events_by_user WHERE user_id='U201' AND event_time='2026-10-20 09:15:00' AND event_id='E201';
```
Discussion: Cassandra replicates data and offers tunable consistency. General multi-row ACID transactions are not its model; lightweight transactions support conditional updates at extra cost. CQL works best with primary-key-based queries. Partitioning distributes data across nodes; choose partition keys and partition sizes carefully. Replication factor and consistency level affect availability/consistency trade-offs.

## General practical notes
- Start the relevant HBase/Cassandra services before running commands.
- HBase syntax and admin tools can differ by release.
- `scan` / `SELECT` output should show the inserted rows and changed values described above.
