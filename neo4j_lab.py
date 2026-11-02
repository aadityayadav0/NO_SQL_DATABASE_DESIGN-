"""
BCA305P Lab Sheet 5 — Neo4j practicals (Q11-Q15)
Set NEO4J_URI, NEO4J_USER and NEO4J_PASSWORD before running.
"""
import os
from neo4j import GraphDatabase

URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
USER = os.getenv("NEO4J_USER", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

class Neo4jLab:
    def __init__(self):
        self.driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        self.driver.verify_connectivity()

    def run(self, query, **params):
        with self.driver.session() as session:
            result = session.run(query, **params)
            records = [record.data() for record in result]
            for record in records:
                print(record)
            return records

    def q11_student_course_department(self):
        print("\nQ11: Student, Course, Department graph")
        self.run("""
        MERGE (d:Department {name:'Computer Science'})
        MERGE (c:Course {code:'BCA305P', name:'NoSQL Database'})
        MERGE (s:Student {roll_no:'BCA001', name:'Aman'})
        MERGE (s)-[:ENROLLED_IN]->(c)
        MERGE (c)-[:OFFERED_BY]->(d)
        RETURN s,c,d
        """)

    def q12_social_network(self):
        print("\nQ12: Social network")
        self.run("""
        MERGE (a:Person {name:'Aman'})
        MERGE (b:Person {name:'Riya'})
        MERGE (c:Person {name:'Dev'})
        MERGE (a)-[:FRIENDS_WITH]->(b)
        MERGE (a)-[:FOLLOWS]->(c)
        MERGE (a)-[:WORKS_AT]->(:Company {name:'ABC Tech'})
        RETURN a,b,c
        """)
        self.run("""MATCH (p:Person {name:'Aman'})-[:FRIENDS_WITH]->(f)
                    RETURN f.name AS friend""")
        self.run("""MATCH (f:Person)-[:FOLLOWS]->(p:Person {name:'Dev'})
                    RETURN f.name AS follower""")

    def q13_ecommerce(self):
        print("\nQ13: E-commerce graph")
        self.run("""
        MERGE (customer:Customer {id:'C1', name:'Aman'})
        MERGE (product:Product {id:'P1', name:'Keyboard', price:1200})
        MERGE (category:Category {name:'Accessories'})
        MERGE (order:Order {id:'O1', date:'2026-11-02'})
        MERGE (customer)-[:PLACED]->(order)
        MERGE (order)-[:CONTAINS {quantity:1}]->(product)
        MERGE (product)-[:BELONGS_TO]->(category)
        RETURN customer,order,product,category
        """)
        self.run("""MATCH (:Customer {name:$name})-[:PLACED]->(:Order)-[:CONTAINS]->(p:Product)
                    RETURN DISTINCT p.name AS purchased_product""", name="Aman")

    def q14_transactions(self):
        print("\nQ14: Transaction / consistency / availability")
        with self.driver.session() as session:
            def work(tx):
                tx.run("MERGE (p:Product {id:'TX1'}) SET p.stock = 10")
                tx.run("MATCH (p:Product {id:'TX1'}) SET p.stock = p.stock - 1")
                tx.run("CREATE (l:LabLog {message:'Stock updated in transaction'})")
                return tx.run("MATCH (p:Product {id:'TX1'}) RETURN p.stock AS stock").single()["stock"]
            print("Committed transaction; stock =", session.execute_write(work))
        self.run("MATCH (l:LabLog {message:'Stock updated in transaction'}) DELETE l RETURN count(*) AS deleted")

    def q15_crud_and_relationship_queries(self):
        print("\nQ15: Small graph application CRUD and relationship query")
        self.run("""CREATE (p:Person {name:'Sample User', email:'sample@example.com'})
                    RETURN p""")
        self.run("""MATCH (p:Person {email:'sample@example.com'})
                    SET p.city='Agra' RETURN p""")
        self.run("""MATCH (p:Person {email:'sample@example.com'})
                    MERGE (r:Recommendation {name:'NoSQL Study'})
                    MERGE (p)-[:INTERESTED_IN]->(r)
                    RETURN p,r""")
        self.run("""MATCH (p:Person {email:'sample@example.com'})-[:INTERESTED_IN]->(r)
                    RETURN p.name AS user, r.name AS interest""")
        self.run("""MATCH (p:Person {email:'sample@example.com'}) DELETE p""")

    def close(self):
        self.driver.close()

def main():
    lab = None
    try:
        lab = Neo4jLab()
        lab.q11_student_course_department()
        lab.q12_social_network()
        lab.q13_ecommerce()
        lab.q14_transactions()
        lab.q15_crud_and_relationship_queries()
    except Exception as error:
        print("Neo4j error:", error)
        print("Check Neo4j is running, Bolt URI and credentials are correct.")
    finally:
        if lab:
            lab.close()

if __name__ == "__main__":
    main()
