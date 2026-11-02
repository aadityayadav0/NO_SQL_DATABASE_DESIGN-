// BCA305P Lab Sheet 5 — Neo4j Cypher reference (Q11-Q14)

// Q11: Student, Course, Department
MERGE (d:Department {name: 'Computer Science'})
MERGE (c:Course {code: 'BCA305P', name: 'NoSQL Database'})
MERGE (s:Student {roll_no: 'BCA001', name: 'Aman'})
MERGE (s)-[:ENROLLED_IN]->(c)
MERGE (c)-[:OFFERED_BY]->(d);
MATCH (s:Student)-[r]->(n) RETURN s,r,n;

// Q12: Social network
MERGE (a:Person {name:'Aman'})
MERGE (b:Person {name:'Riya'})
MERGE (c:Person {name:'Dev'})
MERGE (a)-[:FRIENDS_WITH]->(b)
MERGE (a)-[:FOLLOWS]->(c)
MERGE (a)-[:WORKS_AT]->(:Company {name:'ABC Tech'});
MATCH (:Person {name:'Aman'})-[:FRIENDS_WITH]->(friend) RETURN friend;
MATCH (follower)-[:FOLLOWS]->(:Person {name:'Dev'}) RETURN follower;

// Q13: E-commerce
MERGE (c:Customer {id:'C1', name:'Aman'})
MERGE (p:Product {id:'P1', name:'Keyboard', price:1200})
MERGE (cat:Category {name:'Accessories'})
MERGE (o:Order {id:'O1'})
MERGE (c)-[:PLACED]->(o)
MERGE (o)-[:CONTAINS {quantity:1}]->(p)
MERGE (p)-[:BELONGS_TO]->(cat);
MATCH (:Customer {name:'Aman'})-[:PLACED]->(:Order)-[:CONTAINS]->(p:Product)
RETURN DISTINCT p;

// Q14: Transaction demonstration
// Run the following statements together in a Neo4j Browser transaction.
BEGIN
MERGE (p:Product {id:'TX1'}) SET p.stock = 10;
MATCH (p:Product {id:'TX1'}) SET p.stock = p.stock - 1;
CREATE (:LabLog {message:'Stock updated in transaction'});
COMMIT
MATCH (p:Product {id:'TX1'}) RETURN p.stock;
