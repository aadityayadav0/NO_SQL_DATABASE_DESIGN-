import json, urllib.request, urllib.error

BASE = "http://127.0.0.1:8098"
USERS = [
    {"id":"u1","name":"Aarav","city":"Meerut","age":20},
    {"id":"u2","name":"Sana","city":"Agra","age":22},
    {"id":"u3","name":"Mira","city":"Meerut","age":19},
]
def put(user):
    req = urllib.request.Request(f"{BASE}/riak/users/{user['id']}",
        data=json.dumps(user).encode(), headers={"Content-Type":"application/json"}, method="PUT")
    with urllib.request.urlopen(req, timeout=10): pass
def get(uid):
    with urllib.request.urlopen(f"{BASE}/riak/users/{uid}", timeout=10) as res:
        return json.loads(res.read().decode())
try:
    for user in USERS: put(user)
    records = [get(user["id"]) for user in USERS]
    print("Users in Meerut:")
    for user in records:
        if user["city"] == "Meerut":
            print(f"{user['id']}: {user['name']} (age {user['age']})")
except (urllib.error.URLError, TimeoutError) as exc:
    raise SystemExit(f"Riak connection failed: {exc}")
