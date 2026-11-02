# BCA305P SE — Lab Sheet 5
## NoSQL Database Design: Riak KV (Q1–Q10) and Neo4j (Q11–Q15)

This single Markdown document combines the original Riak Python program, Neo4j Python program, Cypher reference queries, and Python dependencies from the supplied ZIP. The code is kept in separate labelled code blocks because Python and Cypher are different languages; they cannot be merged into one directly executable program.

---

## 1. Riak KV Python Code — `riak_lab.py` (Q1–Q10)

```python
"""
BCA305P Lab Sheet 5 — Riak KV practicals (Q1-Q10)
Requires a reachable Riak KV HTTP interface, usually http://localhost:8098.
Set RIAK_URL if your Riak server uses another address.
"""
import json
import os
import requests

RIAK_URL = os.getenv("RIAK_URL", "http://localhost:8098").rstrip("/")
TIMEOUT = 10
HEADERS = {"Content-Type": "application/json"}

def put(bucket, key, value, params=None):
    response = requests.put(
        f"{RIAK_URL}/buckets/{bucket}/keys/{key}",
        params=params or {}, headers=HEADERS,
        data=json.dumps(value), timeout=TIMEOUT
    )
    response.raise_for_status()
    print(f"PUT {bucket}/{key}: HTTP {response.status_code}")

def get(bucket, key, params=None):
    response = requests.get(
        f"{RIAK_URL}/buckets/{bucket}/keys/{key}",
        params=params or {}, timeout=TIMEOUT
    )
    if response.status_code == 404:
        print(f"Not found: {bucket}/{key}")
        return None
    response.raise_for_status()
    try:
        value = response.json()
    except ValueError:
        value = response.text
    print(f"GET {bucket}/{key}: {json.dumps(value, indent=2)}")
    return value

def delete(bucket, key, params=None):
    response = requests.delete(
        f"{RIAK_URL}/buckets/{bucket}/keys/{key}",
        params=params or {}, timeout=TIMEOUT
    )
    if response.status_code not in (200, 204, 404):
        response.raise_for_status()
    print(f"DELETE {bucket}/{key}: HTTP {response.status_code}")

def q1_students_crud():
    print("\nQ1: Student bucket — create, retrieve, update, delete")
    put("students", "S101", {"id": "S101", "name": "Aman", "course": "BCA"})
    get("students", "S101")
    put("students", "S101", {"id": "S101", "name": "Aman Kumar", "course": "BCA"})
    get("students", "S101")
    delete("students", "S101")

def q2_user_sessions():
    print("\nQ2: User sessions")
    session = {"session_id": "SES001", "user_id": "U101",
               "login_time": "2026-11-02 10:00:00", "status": "active"}
    put("user_sessions", "SES001", session)
    get("user_sessions", "SES001")

def q3_profiles():
    print("\nQ3: User profiles and preferences")
    profile = {"name": "Riya", "email": "riya@example.com", "city": "Khair",
               "language": "Hindi", "theme": "dark",
               "notifications": {"email": True, "sms": False}}
    put("user_profiles", "U102", profile)
    get("user_profiles", "U102")

def q4_shopping_cart():
    print("\nQ4: Shopping cart operations")
    cart = {"user_id": "U103", "items": [
        {"product_id": "P1", "quantity": 2, "price": 100},
        {"product_id": "P2", "quantity": 1, "price": 250}]}
    put("shopping_carts", "U103", cart)
    get("shopping_carts", "U103")
    cart["items"][0]["quantity"] = 3
    put("shopping_carts", "U103", cart)  # update quantity
    cart["items"] = [item for item in cart["items"] if item["product_id"] != "P2"]
    put("shopping_carts", "U103", cart)  # remove product
    get("shopping_carts", "U103")

def q5_value_types():
    print("\nQ5: Different value structures")
    put("value_demo", "string1", "Hello Riak")
    put("value_demo", "json1", {"name": "Neha", "age": 20})
    put("value_demo", "list1", ["DBMS", "Python", "NoSQL"])
    get("value_demo", "string1")
    get("value_demo", "json1")
    get("value_demo", "list1")
    print("Bucket = collection/namespace; key = unique record identifier; value = stored data.")

def q6_quorums():
    print("\nQ6: Read/write quorum demonstration")
    # R/W/DW are Riak quorum parameters. Exact valid values depend on bucket
    # properties and cluster size. 'quorum' is a common symbolic setting.
    put("students", "Q6-S1", {"name": "Karan"}, {"w": "quorum", "dw": "quorum"})
    get("students", "Q6-S1", {"r": "quorum"})
    print("Riak uses N/R/W quorum settings to balance consistency, availability and latency.")
    print("Use quorum values appropriate to the configured bucket and cluster; this is not a SQL transaction.")

def q7_scaling():
    print("\nQ7: Multiple buckets and bulk records")
    for bucket in ("scale_students", "scale_products", "scale_orders"):
        for number in range(1, 101):
            put(bucket, f"record-{number}",
                {"number": number, "bucket": bucket})
    print("Inserted 100 records into each of 3 buckets (300 total).")
    print("Riak distributes partitions/replicas across cluster nodes; add nodes for horizontal capacity.")

def q8_transaction_like():
    print("\nQ8: Transaction-like shopping workflow")
    cart = {"user_id": "U104", "items": [], "total": 0}
    cart["items"].append({"product_id": "P10", "quantity": 1, "price": 500})
    cart["total"] = sum(x["quantity"] * x["price"] for x in cart["items"])
    put("shopping_carts", "U104", cart)
    cart["items"][0]["quantity"] = 2
    cart["total"] = sum(x["quantity"] * x["price"] for x in cart["items"])
    put("shopping_carts", "U104", cart)
    get("shopping_carts", "U104")
    print("Limitation: separate Riak keys do not form one ACID multi-key transaction;")
    print("application logic, conflict handling and compensating actions may be needed.")

def q9_query_by_data():
    print("\nQ9: Query-by-data using application-side filtering")
    users = [
        {"id": "U201", "name": "Asha", "city": "Delhi", "age": 21, "preference": "music"},
        {"id": "U202", "name": "Dev", "city": "Agra", "age": 22, "preference": "sports"},
        {"id": "U203", "name": "Maya", "city": "Delhi", "age": 20, "preference": "sports"},
    ]
    for user in users:
        put("query_users", user["id"], user)
    # Application-level filtering: retrieve known keys and filter in Python.
    retrieved = [get("query_users", user["id"]) for user in users]
    matches = [u for u in retrieved if u and u.get("city") == "Delhi"]
    print("Users in Delhi:", json.dumps(matches, indent=2))
    print("For large datasets, use a suitable Riak indexing/search feature rather than scanning keys.")

def q10_sets_note():
    print("\nQ10: Set operations")
    print("Riak Data Types (CRDT sets) use the typed API, commonly:")
    print(f"  POST {RIAK_URL}/types/default/sets/interests/user-U1")
    print("The exact set endpoint and content-type depend on Riak version and bucket-type configuration.")
    print("This lab prints the operations to demonstrate; configure a Riak bucket type with datatype= set.")
    print("Operations: add interest, remove interest, fetch set, check membership, intersection.")
    print("For a simple portable fallback, store a JSON list and perform set operations in application code.")
    a, b = {"music", "cricket", "coding"}, {"coding", "travel"}
    print("A =", sorted(a), "B =", sorted(b))
    print("Add:", sorted(a | {"reading"}))
    print("Remove cricket:", sorted(a - {"cricket"}))
    print("Membership coding:", "coding" in a)
    print("Common:", sorted(a & b))

def main():
    print("BCA305P Riak KV Lab — Q1 to Q10")
    print("Riak URL:", RIAK_URL)
    print("Ensure Riak KV is running and its HTTP API is reachable.")
    for lab in (q1_students_crud, q2_user_sessions, q3_profiles, q4_shopping_cart,
                q5_value_types, q6_quorums, q7_scaling, q8_transaction_like,
                q9_query_by_data, q10_sets_note):
        try:
            lab()
        except requests.RequestException as error:
            print("Riak request failed:", error)
            print("Check RIAK_URL, server status, network and bucket/API configuration.")
            break

if __name__ == "__main__":
    main()
```

---

## 2. Neo4j Python Code — `neo4j_lab.py` (Q11–Q15)

```python
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
```

---

## 3. Neo4j Cypher Queries — `neo4j_queries.cypher` (Q11–Q14)

```cypher
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
```

---

## 4. Python Dependencies — `requirements.txt`

```text
requests>=2.31.0
neo4j>=5.20.0
```

---

## 5. Setup and Run Instructions

### Requirements
- Python 3.9+
- A running Riak KV server with its HTTP API reachable (default `http://localhost:8098`) for Q1–Q9.
- A running Neo4j server with Bolt enabled (default `bolt://localhost:7687`) for Q11–Q15.

**Important:** Riak KV and Neo4j are database servers; installing Python packages does not install or start those servers. Run them on a supported Linux machine, VM, cloud instance, or other compatible host, then set the connection variables below. Android/Termux can run the Python client when it can reach the server.

### Install Python dependencies

```bash
python -m pip install requests neo4j
```

### Run Riak KV practicals (Q1–Q10)

```bash
export RIAK_URL="http://YOUR_SERVER_IP:8098"
python riak_lab.py
```

### Run Neo4j practicals (Q11–Q15)

```bash
export NEO4J_URI="bolt://YOUR_SERVER_IP:7687"
export NEO4J_USER="neo4j"
export NEO4J_PASSWORD="YOUR_NEO4J_PASSWORD"
python neo4j_lab.py
```

You can also paste the Cypher statements from Section 3 into Neo4j Browser. The `BEGIN`/`COMMIT` example is intended for Neo4j Browser transaction commands; for Python, Q14 uses the driver's managed transaction API.

### Notes and limitations from the original project
- Q10 explains the Riak CRDT Set typed endpoint and demonstrates set operations in Python. Configure a Riak bucket type with `datatype=set` and adapt the typed API calls to your Riak version before claiming a server-side CRDT Set test.
- Q6 quorum names/values must be valid for the bucket properties and cluster size.
- Q7 inserts 300 records; run against a test cluster.
- Q9 uses application-level filtering over known keys, not a full-text index.
- Do not commit real passwords to GitHub. Use environment variables or a local `.env` file.
- Replace sample names/data with your own where required.
- Run each practical against your own database server and capture genuine output/screenshots. Do not claim that a practical ran successfully until it has been tested on a working database server.

---

## 6. Original Project README

# BCA305P — NoSQL Database Design Lab Sheet 5

Solutions and demonstration code for all 15 questions in the supplied lab sheet.

## Contents
- `riak_lab.py` — Riak KV exercises Q1–Q10.
- `neo4j_lab.py` — Neo4j Python exercises Q11–Q15.
- `neo4j_queries.cypher` — Cypher query reference for Q11–Q14.
- `requirements.txt` — Python dependencies.

## Requirements
- Python 3.9+
- A running Riak KV server with its HTTP API reachable (default `http://localhost:8098`) for Q1–Q9.
- A running Neo4j server with Bolt enabled (default `bolt://localhost:7687`) for Q11–Q15.

**Important:** Riak KV and Neo4j are database servers; installing Python packages in Termux does not install or start those servers. Run them on a supported Linux machine, VM, cloud instance, or other compatible host, then set the connection variables below. Android/Termux can run the Python client when it can reach the server.

## Install Python dependencies
```bash
python -m pip install -r requirements.txt
```

## Riak KV (Q1–Q10)
Set the server URL if it is not on the same device:
```bash
export RIAK_URL="http://YOUR_SERVER_IP:8098"
python riak_lab.py
```
The script demonstrates bucket/key/value operations, session records, profiles, cart updates, value types, quorum parameters, bulk records, application-level transaction-like logic, application-side filtering and set operations.

Notes:
- Q10 explains the Riak CRDT Set typed endpoint and demonstrates set operations in Python. Configure a Riak bucket type with `datatype=set` and adapt the typed API calls to your Riak version before claiming a server-side CRDT Set test.
- Q6 quorum names/values must be valid for the bucket properties and cluster size.
- Q7 inserts 300 records; run against a test cluster.
- Q9 uses application-level filtering over known keys, not a full-text index.

## Neo4j (Q11–Q15)
Set your Neo4j connection details:
```bash
export NEO4J_URI="bolt://YOUR_SERVER_IP:7687"
export NEO4J_USER="neo4j"
export NEO4J_PASSWORD="YOUR_NEO4J_PASSWORD"
python neo4j_lab.py
```
Do not commit real passwords to GitHub. Use environment variables or a local `.env` file that is excluded by `.gitignore`.

You can also paste statements from `neo4j_queries.cypher` into Neo4j Browser. The `BEGIN`/`COMMIT` example is intended for Neo4j Browser's transaction commands; for Python, Q14 uses the driver's managed transaction API.

## Termux: upload this project to GitHub
1. Install Termux from a trusted source and open it.
2. Update packages and install Git:
```bash
pkg update && pkg upgrade
pkg install git
```
3. Move the downloaded project ZIP into Termux storage (Android Downloads), then:
```bash
termux-setup-storage
cd ~/storage/downloads
unzip BCA305P_NoSQL_Lab5.zip
cd BCA305P_NoSQL_Lab5
```
If `unzip` is missing, run `pkg install unzip`.

4. Configure Git identity (use your own GitHub details):
```bash
git config --global user.name "YOUR_GITHUB_USERNAME"
git config --global user.email "YOUR_GITHUB_EMAIL"
```

5. Create an **empty repository** on GitHub (for example `BCA305P-NoSQL-Lab5`). Do not initialize it with a README or license if you plan to push this folder as-is.

6. Add and push:
```bash
git init
git add .
git commit -m "Add BCA305P NoSQL Lab Sheet 5 solutions"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/BCA305P-NoSQL-Lab5.git
git push -u origin main
```
GitHub may ask you to authenticate. Use a GitHub Personal Access Token when prompted for HTTPS password; never share the token with anyone or put it in this repository. You can also configure SSH authentication.

## Before submission
- Replace sample names/data with your own where required.
- Run each practical against your own database server and capture genuine output/screenshots.
- Review Q10 CRDT Set configuration and Q6 quorum settings for your Riak version.
- Do not claim that a practical ran successfully until you have tested it on a working database server.
