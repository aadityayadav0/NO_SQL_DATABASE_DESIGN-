# Expected Output Notes

These are typical response descriptions, not captured execution logs:
- `insertOne()` returns acknowledgement and an inserted ID.
- `insertMany()` returns acknowledgement and inserted IDs.
- `find()` prints matching documents; generated `_id` values differ.
- Update methods report matched/modified counts.
- Delete methods report deleted counts.
- `countDocuments({})` returns the number of matching documents.
- `drop()` returns true when a collection is dropped.
- `dropDatabase()` returns a result indicating the database was dropped.
Exact counts depend on starting data and which commands were run. Capture your own actual outputs for submission.
