# BCA305P-AS02 — NoSQL Database Design, Lab Sheet 3

This solution pack contains MongoDB `mongosh` code for all 15 questions in the uploaded lab sheet.

## Files
- `BCA305P-AS02_Solutions.js` — sample data, MongoDB queries, updates, and aggregation examples for Q1–Q15.

## Requirements
- MongoDB server (local MongoDB or MongoDB Atlas)
- MongoDB Shell (`mongosh`)

## Run in Termux
1. Install/use a MongoDB server or Atlas connection and install `mongosh` if available for your environment.
2. Save the JS file in a folder.
3. Start `mongosh`, connect to your database, then run:
   ```javascript
   load("/full/path/to/BCA305P-AS02_Solutions.js")
   ```
   If connecting to Atlas, use your Atlas connection string to start `mongosh` first.

The script uses a dedicated database named `BCA305P_AS02_Lab3` and clears the named lab collections before inserting sample data, so it can be rerun for consistent examples. Do not use it against important data.

## Important
- Q11 (wallet transfer) demonstrates a transaction. Transactions require a replica set or MongoDB Atlas; a standalone MongoDB server does not support multi-document transactions.
- Results are printed by `printjson(...)` in the shell. Screenshots of the output can be captured for your lab submission.
- The lab sheet asks for database designs and queries, not a prescribed output format; sample data and outputs may differ if you modify the sample records.
remove original file pdf