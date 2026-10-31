# BCA305P-AS03 — NoSQL Database Design (Lab Sheet 5)

This package follows the supplied PDF: Q1–Q10 Riak KV; Q11–Q15 Neo4j.

- `solutions.md`: answers and commands for all 15 questions.
- `riak/scale_demo.py`: bulk records across multiple buckets.
- `riak/query_users.py`: store/retrieve/filter user records by city.
- `riak/set_demo.py`: add/remove/membership/intersection and save to Riak.
- `neo4j/*.cypher`: graph exercises for Q11–Q14.
- `app/neo4j_crud.py`: Python CRUD app for Q15.
- `requirements.txt`: Neo4j Python driver.

Examples assume Riak HTTP API at `http://127.0.0.1:8098` and Neo4j Bolt at `bolt://localhost:7687`. Install and start the relevant database before running. Sample outputs are expected/illustrative, not live execution logs.
