import os
from neo4j import GraphDatabase

URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD")
if not PASSWORD:
    raise SystemExit("Set NEO4J_PASSWORD before running.")

class StudentApp:
    def __init__(self):
        self.driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD))
    def close(self):
        self.driver.close()
    @staticmethod
    def create(tx, sid, name, course):
        tx.run("MERGE (s:Student {student_id:$sid}) SET s.name=$name, s.course=$course",
               sid=sid, name=name, course=course).consume()
    @staticmethod
    def read(tx, sid):
        row = tx.run("MATCH (s:Student {student_id:$sid}) RETURN s.student_id AS id, s.name AS name, s.course AS course",
                     sid=sid).single()
        return dict(row) if row else None
    @staticmethod
    def update(tx, sid, name):
        tx.run("MATCH (s:Student {student_id:$sid}) SET s.name=$name", sid=sid, name=name).consume()
    @staticmethod
    def delete(tx, sid):
        tx.run("MATCH (s:Student {student_id:$sid}) DETACH DELETE s", sid=sid).consume()

def main():
    app = StudentApp()
    try:
        with app.driver.session() as session:
            session.execute_write(app.create, "PY101", "Aarav", "BCA")
            print("CREATE:", session.execute_read(app.read, "PY101"))
            session.execute_write(app.update, "PY101", "Aarav Yadav")
            print("UPDATE:", session.execute_read(app.read, "PY101"))
            session.execute_write(app.delete, "PY101")
            print("DELETE: student PY101 removed")
    finally:
        app.close()

if __name__ == "__main__":
    main()
