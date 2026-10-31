import json, urllib.request, urllib.error

BASE = "http://127.0.0.1:8098"
for bucket in ("scale_students", "scale_products", "scale_orders"):
    try:
        for i in range(100):
            data = json.dumps({"bucket": bucket, "record_number": i}).encode()
            req = urllib.request.Request(
                f"{BASE}/riak/{bucket}/record-{i:04d}", data=data,
                headers={"Content-Type": "application/json"}, method="PUT")
            with urllib.request.urlopen(req, timeout=10):
                pass
        print(f"Inserted 100 records into {bucket}")
    except (urllib.error.URLError, TimeoutError) as exc:
        raise SystemExit(f"Riak connection failed: {exc}")
print("Done. Use a multi-node cluster to demonstrate horizontal scaling.")
