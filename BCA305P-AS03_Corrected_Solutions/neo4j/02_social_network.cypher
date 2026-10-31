// Q12
MERGE (a:Person {name:'Aarav'})
MERGE (s:Person {name:'Sana'})
MERGE (m:Person {name:'Mira'})
MERGE (co:Company {name:'TechWorks'})
MERGE (a)-[:FRIENDS_WITH]-(s)
MERGE (a)-[:FOLLOWS]->(m)
MERGE (s)-[:FOLLOWS]->(a)
MERGE (a)-[:WORKS_AT]->(co);

// Aarav's friends
MATCH (:Person {name:'Aarav'})-[:FRIENDS_WITH]-(f:Person) RETURN f.name AS friend;
// People who follow Aarav
MATCH (f:Person)-[:FOLLOWS]->(:Person {name:'Aarav'}) RETURN f.name AS follower;
