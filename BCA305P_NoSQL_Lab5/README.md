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
