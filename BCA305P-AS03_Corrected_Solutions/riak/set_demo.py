import json, urllib.request, urllib.error

items = {"music", "coding", "travel"}
items.add("databases")
print("After add:", sorted(items))
items.discard("travel")
print("After remove:", sorted(items))
print("Contains coding:", "coding" in items)
print("Common interests:", sorted(items.intersection({"coding","sports","music"})))
req = urllib.request.Request("http://127.0.0.1:8098/riak/user_interests/user-42",
    data=json.dumps(sorted(items)).encode(), headers={"Content-Type":"application/json"}, method="PUT")
try:
    with urllib.request.urlopen(req, timeout=10) as res:
        print("Saved to Riak; HTTP status:", res.status)
except (urllib.error.URLError, TimeoutError) as exc:
    raise SystemExit(f"Riak connection failed: {exc}")
