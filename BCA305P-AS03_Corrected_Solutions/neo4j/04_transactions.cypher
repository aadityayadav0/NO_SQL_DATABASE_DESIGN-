// Q14: Run each statement in Neo4j Browser.
CREATE (:TransactionDemo {id:'T1', status:'created', amount:100});
MATCH (t:TransactionDemo {id:'T1'}) SET t.status='updated', t.amount=125 RETURN t;
MATCH (t:TransactionDemo {id:'T1'}) SET t.status='checked' RETURN t;
MATCH (t:TransactionDemo {id:'T1'}) DELETE t;
