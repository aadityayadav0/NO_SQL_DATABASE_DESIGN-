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
