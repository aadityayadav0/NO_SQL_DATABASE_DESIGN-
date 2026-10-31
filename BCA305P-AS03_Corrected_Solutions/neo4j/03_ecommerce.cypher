// Q13
MERGE (c:Customer {customer_id:'C101', name:'Aarav'})
MERGE (cat:Category {name:'Books'})
MERGE (p1:Product {product_id:'P101', name:'Database Basics', price:399})
MERGE (p2:Product {product_id:'P102', name:'Python Guide', price:499})
MERGE (p1)-[:IN_CATEGORY]->(cat)
MERGE (p2)-[:IN_CATEGORY]->(cat)
MERGE (o:Order {order_id:'O501', status:'PAID'})
MERGE (c)-[:PLACED]->(o)
MERGE (o)-[:CONTAINS {quantity:1}]->(p1)
MERGE (o)-[:CONTAINS {quantity:2}]->(p2)
MATCH (:Customer {name:'Aarav'})-[:PLACED]->(:Order)-[line:CONTAINS]->(p:Product)
RETURN p.name AS product, p.price AS unit_price, line.quantity AS quantity;
