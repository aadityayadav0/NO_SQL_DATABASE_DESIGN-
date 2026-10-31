# BCA305P-AS03 — Lab Sheet 5 Solutions

Answers follow the 15 questions in the supplied PDF. Change sample names, IDs, ports and credentials to match your lab setup.

## Riak KV — Q1 to Q10

### Q1. Install/configure Riak; CRUD in students
Install Riak KV using the instructions for your Linux distribution and start its service. Examples assume HTTP API port 8098.
```bash
curl -i http://127.0.0.1:8098/ping
curl -i -X PUT http://127.0.0.1:8098/riak/students/student-101 -H 'Content-Type: application/json' -d '{"id":"101","name":"Aarav","course":"BCA","year":2}'
curl -i http://127.0.0.1:8098/riak/students/student-101
curl -i -X PUT http://127.0.0.1:8098/riak/students/student-101 -H 'Content-Type: application/json' -d '{"id":"101","name":"Aarav Yadav","course":"BCA","year":3}'
curl -i -X DELETE http://127.0.0.1:8098/riak/students/student-101
```
`students` is the bucket, `student-101` the key, and the JSON object the value.

### Q2. user_sessions bucket
```bash
curl -i -X PUT http://127.0.0.1:8098/riak/user_sessions/session-abc-001 -H 'Content-Type: application/json' -d '{"session_id":"session-abc-001","user_id":"user-42","login_time":"2026-10-31T10:00:00+05:30","status":"active"}'
curl -i http://127.0.0.1:8098/riak/user_sessions/session-abc-001
```
The session key identifies the record; JSON stores session ID, user ID, login time and status.

### Q3. User profile and preferences
```bash
curl -i -X PUT http://127.0.0.1:8098/riak/user_profiles/user-42 -H 'Content-Type: application/json' -d '{"name":"Aarav","email":"aarav@example.com","city":"Meerut","language":"English","theme":"dark","notifications":{"email":true,"push":false}}'
curl -i http://127.0.0.1:8098/riak/user_profiles/user-42
```

### Q4. Shopping cart add/update/retrieve/remove
```bash
curl -i -X PUT http://127.0.0.1:8098/riak/shopping_carts/user-42 -H 'Content-Type: application/json' -d '{"user_id":"user-42","items":[{"product_id":"P100","quantity":2,"price":199},{"product_id":"P200","quantity":1,"price":499}]}'
curl -i -X PUT http://127.0.0.1:8098/riak/shopping_carts/user-42 -H 'Content-Type: application/json' -d '{"user_id":"user-42","items":[{"product_id":"P100","quantity":3,"price":199},{"product_id":"P200","quantity":1,"price":499}]}'
curl -i http://127.0.0.1:8098/riak/shopping_carts/user-42
curl -i -X PUT http://127.0.0.1:8098/riak/shopping_carts/user-42 -H 'Content-Type: application/json' -d '{"user_id":"user-42","items":[{"product_id":"P100","quantity":3,"price":199}]}'
```
The last PUT removes P200 by replacing the cart value. This is application-managed editing, not an atomic multi-key transaction; concurrent updates need conflict handling.

### Q5. String, JSON and list values
```bash
curl -i -X PUT http://127.0.0.1:8098/riak/demo/string-key -H 'Content-Type: text/plain' --data 'hello-riak'
curl -i http://127.0.0.1:8098/riak/demo/string-key
curl -i -X PUT http://127.0.0.1:8098/riak/demo/json-key -H 'Content-Type: application/json' -d '{"name":"Mira","active":true}'
curl -i http://127.0.0.1:8098/riak/demo/json-key
curl -i -X PUT http://127.0.0.1:8098/riak/demo/list-key -H 'Content-Type: application/json' -d '["databases","python","graphs"]'
curl -i http://127.0.0.1:8098/riak/demo/list-key
```
Bucket groups objects (`demo`); key identifies one object (`json-key`); value is its content (text or JSON).

### Q6. Read/write quorum
```bash
curl -i -X PUT 'http://127.0.0.1:8098/riak/students/student-102?w=2' -H 'Content-Type: application/json' -d '{"id":"102","name":"Sana","course":"BCA"}'
curl -i 'http://127.0.0.1:8098/riak/students/student-102?r=2'
```
Riak commonly uses `w` for write quorum and `r` for read quorum. Values must be compatible with bucket replication factor and cluster configuration. Larger quorum asks for more replica responses, which may reduce availability if nodes are down.

### Q7. Scaling
Run `python3 riak/scale_demo.py`. It inserts 100 records into each of three buckets. Riak distributes objects across partitions and replicas; adding nodes can increase capacity and redistribute partitions. A single-node test demonstrates bulk writes, not actual horizontal scaling.

### Q8. Transaction-like shopping workflow
Read cart → add item → update quantity → recalculate total → write cart. Q4 demonstrates the write steps. Riak KV does not provide a general ACID transaction across multiple keys. Concurrent writers require conflict handling/retries; this is transaction-like application logic, not a true multi-key transaction.

### Q9. Query-by-data
Run `python3 riak/query_users.py`. It stores users, retrieves them by known keys, and filters by city in Python. Classic key-value access does not automatically provide arbitrary SQL-like filtering over JSON attributes. For large datasets, configure a supported indexing/search feature or maintain a separate index.

### Q10. Set operations
Run `python3 riak/set_demo.py`. It demonstrates add, remove, membership and intersection with Python sets, then stores the result as a JSON list in Riak. This is an application-level set representation.

## Neo4j — Q11 to Q15

### Q11. Install Neo4j and create Student/Course/Department
Install Neo4j Desktop or Community Server, start a database, open Neo4j Browser and run `neo4j/01_student_course_department.cypher`. Its final MATCH query returns the graph for visualization.

### Q12. Social network
Run `neo4j/02_social_network.cypher`. It creates Person nodes and FRIENDS_WITH, FOLLOWS and WORKS_AT relationships, then queries friends and followers.

### Q13. E-commerce graph
Run `neo4j/03_ecommerce.cypher`. It creates Customer, Product, Category and Order nodes and finds products purchased by a customer through order relationships.

### Q14. Transactions, consistency and availability
Run `neo4j/04_transactions.cypher` statement by statement. Neo4j transactions commit changes atomically or roll them back on failure. The Python driver in Q15 demonstrates managed transactions. Availability depends on deployment and cluster topology; ACID support alone does not guarantee availability during every failure.

### Q15. Python CRUD application
```bash
python3 -m pip install -r requirements.txt
export NEO4J_URI='bolt://localhost:7687'
export NEO4J_USERNAME='neo4j'
export NEO4J_PASSWORD='your-password'
python3 app/neo4j_crud.py
```
The app creates, reads, updates and deletes a Student node. Q11–Q13 demonstrate relationship-based queries. Graph databases are useful for social networks, recommendations, fraud detection and knowledge graphs.

### Expected output
Successful Riak requests return HTTP success responses and GET returns stored values. Q9 should list the two sample Meerut users. Neo4j Browser displays the graph and returns matching friend/follower/product rows. The Python CRUD app prints the created record, updated record and deletion confirmation. These are expected results, not captured live execution logs.
