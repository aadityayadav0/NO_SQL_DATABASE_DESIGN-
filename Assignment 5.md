# BCA305P – NoSQL Database
# Assignment 5: Unit 5

**Topics:** Riak Key-Value Database and Neo4j Graph Database

---

## Q1. Explain the architecture and working of Riak as a Key-Value NoSQL database. Discuss how Riak stores data using keys and values and explain the major characteristics that distinguish it from relational databases.

Riak is a distributed NoSQL database designed around the **key-value data model**. It stores each item as a value that is identified and retrieved by a unique key. Applications generally address an object by its bucket (a logical namespace) and key.

### Architecture and working

- **Distributed nodes:** A Riak cluster consists of multiple nodes that cooperate to store and serve data.
- **Buckets and keys:** A bucket groups related objects. Within a bucket, an application uses a key to identify an object.
- **Values:** The value can contain application data such as JSON, text, or binary content. Riak treats much of this content as an opaque value.
- **Partitioning:** The key space is divided into partitions, which are distributed among cluster nodes. This spreads storage and request load.
- **Replication:** Objects are stored on multiple nodes according to the cluster's replication configuration. Replicas improve availability and durability.
- **Request coordination:** A client request is routed to the relevant nodes. Riak coordinates reads and writes using configurable quorum-style parameters.

A conceptual object might be represented as:

```text
Bucket: customers
Key: customer-1042
Value:
{
  "name": "Asha",
  "city": "Agra",
  "membership": "gold"
}
```

The application retrieves the value by supplying the bucket and key. It does not normally need to know which physical node holds each replica.

### Characteristics compared with relational databases

1. **Key-based access:** Data is commonly retrieved using a known key rather than arbitrary joins.
2. **Flexible values:** Values can have application-defined structures without requiring a fixed table schema.
3. **Horizontal distribution:** Data and requests can be spread across multiple nodes.
4. **Replication and availability:** Copies on multiple nodes can help a service continue through node failures.
5. **Limited relational operations:** Riak does not provide the same general-purpose joins and relational constraints as an SQL database.
6. **Application-managed relationships:** The application often stores references or denormalized data when objects are related.

Riak is therefore useful for distributed workloads that need reliable key-based access, while a relational database is often preferable when complex joins, strict relational constraints, and multi-row transactions are central.

## Q2. Explain the Key-Value Data Model in detail. Discuss the structure of data, key-value store features, data access mechanism, and limitations of this model. Why is a Key-Value database suitable for applications requiring fast lookups?

A Key-Value database stores data as pairs:

```text
Key  ->  Value
```

The **key** uniquely identifies an item within its namespace, and the **value** contains the associated data.

### Structure and features

- **Unique identifier:** Each stored item has a key, such as `user:501` or `session:abc123`.
- **Flexible value:** A value may be text, JSON, an image, serialized data, or another supported binary format.
- **Simple interface:** Common operations include `PUT`/`SET`, `GET`, and `DELETE`.
- **Schema flexibility:** The store generally does not require every value to follow a relational table schema.
- **Distribution:** Many key-value systems partition keys and replicate values across nodes.
- **Low-latency access:** A direct lookup by key can avoid scanning a table or evaluating complex joins.

### Data access mechanism

1. The application creates or receives a key.
2. It sends a read, write, or delete request for that key.
3. The database locates the partition responsible for the key.
4. The responsible node or replica returns or updates the value.
5. The application interprets the returned value.

Example:

```text
Key: product: P100
Value: {"name":"Keyboard","price":899,"stock":40}
```

A lookup for `product:P100` returns the associated value.

### Limitations

- Searching by arbitrary value fields may be limited or require additional indexes.
- Joins between separate values are usually not built in.
- Applications may need to maintain relationships and consistency between multiple keys.
- A large value may need to be read and rewritten even when only one small part changes, depending on the database and API.
- The model is not ideal for every workload, especially complex analytical queries and highly interconnected data.

### Why it suits fast lookups

When an application already knows the key, the database can locate the corresponding item directly through its key-distribution mechanism. This is useful for sessions, caches, shopping carts, user preferences, and other workloads dominated by predictable key-based reads and writes.

## Q3. Analyze the consistency model of Riak. Explain how Riak handles consistency in a distributed environment and discuss the trade-off between consistency, availability, and partition tolerance with a suitable example.

Riak is designed for distributed operation and provides tunable consistency behavior. Data can have multiple replicas, and read/write requests can specify how many replicas must respond before an operation is considered successful.

### Replication and quorum parameters

A Riak bucket can be configured with an `N` value representing the number of replicas. Requests can use parameters such as:

- **`R`:** Number of replicas that must respond to a read.
- **`W`:** Number of replicas that must acknowledge a write.
- **`DW`:** Number of replicas that must confirm durable storage for a write.

For example, with `N = 3`, a write configured with `W = 2` requires acknowledgements from two replicas. A read configured with `R = 2` requests responses from two replicas. These settings affect latency, availability, and the chance of observing recent updates. They do not by themselves make every operation equivalent to a serializable relational transaction.

### Conflicts and concurrent updates

If two clients update replicas during a network interruption, their changes can diverge. Riak can preserve concurrent versions (siblings) rather than silently discarding one update. The application may resolve the conflict, or configured conflict-resolution behavior may be used. Correct handling depends on the data type and application requirements.

### CAP trade-off

The CAP theorem describes a trade-off during a network partition:

- **Consistency (C):** Every read sees a single, up-to-date value.
- **Availability (A):** Every request to a non-failing node receives a response.
- **Partition tolerance (P):** The system continues operating despite communication failures between parts of the cluster.

A distributed system cannot guarantee both perfect consistency and full availability during every partition. Riak is designed to favor availability and partition tolerance in many configurations, while allowing applications to tune read/write behavior and handle conflicts.

### Example

Suppose a shopping service has three replicas of a cart item. A network partition separates one replica from the other two. The reachable side may accept an update so the customer can continue shopping. When connectivity returns, the system may discover concurrent versions and need to reconcile them. A stricter quorum configuration can reduce the chance of stale reads, but may cause requests to fail or wait when too few replicas are reachable.

Thus, the correct configuration depends on whether the application values continued access, fresher reads, or stricter coordination more highly.

## Q4. Discuss transactions and multi-operation transactions in Riak. Why are traditional relational-style transactions difficult to implement in distributed Key-Value databases? Explain possible approaches for maintaining data correctness across multiple operations.

Traditional relational transactions commonly provide ACID guarantees across multiple rows and tables:

- **Atomicity:** All operations succeed or none do.
- **Consistency:** Constraints remain valid.
- **Isolation:** Concurrent transactions behave according to defined isolation rules.
- **Durability:** Committed changes survive failures.

A distributed key-value database such as Riak is optimized for distributed access to individual objects. Providing a single atomic transaction across many keys and nodes is difficult because the objects may be on different machines, messages can be delayed or lost, and nodes can fail while an operation is in progress. Coordinating every participant adds latency and can reduce availability during partitions.

### Approaches to correctness

1. **Single-object updates:** Keep data that must change atomically together in one object where practical.
2. **Application-level workflow:** Break a larger task into explicit steps and record its progress.
3. **Compensating actions (Saga-style design):** If a later step fails, run a compensating operation to undo or offset earlier completed steps.
4. **Idempotent operations:** Design a repeated request to have the same effect as performing it once, often using unique operation IDs.
5. **Version checks:** Use object versions or conditional updates where supported to detect concurrent modifications.
6. **Conflict resolution:** Define application rules for reconciling concurrent values.
7. **Reconciliation jobs:** Periodically detect and repair inconsistent related records.

### Example

When placing an order, an application may create an order record, reserve stock, and update a customer account. If these are separate key-value objects, they may not be covered by one global ACID transaction. The application can track an order state such as `PENDING`, reserve stock with an idempotent operation, and mark the order `CONFIRMED` only after required steps succeed. If stock reservation fails, it can cancel the pending order or execute a compensating action.

The application must explicitly design failure handling; it should not assume that multiple independent key updates form one relational transaction.

## Q5. Explain the query features of Riak. How does querying by data differ from querying by key? Discuss how Riak can support searching, secondary indexes, and data retrieval when application requirements become more complex.

A basic key-value lookup uses a known bucket and key. This is direct and efficient:

```text
GET bucket = "customers", key = "customer-1042"
```

The application already knows the identity of the object and asks for its value.

### Querying by data

A data-oriented query asks questions about fields inside values, such as “find all customers in Agra” or “find products with price below 1,000.” The database must inspect indexed fields or search structures to identify matching objects. This is different from a direct key lookup and can require extra indexing and storage.

### Riak query capabilities

Depending on the Riak edition, version, and configuration, query options can include:

- **Secondary indexes (2i):** Index selected fields and retrieve keys matching an indexed value or range. They are useful for straightforward equality or range lookups on indexed fields.
- **Search:** Search functionality can index document content and support text-oriented queries when the relevant search component is enabled and configured.
- **Key listing / bucket operations:** These can help enumerate keys in some deployments, but broad key listing is not a substitute for a carefully designed index and may be expensive at scale.
- **Application-side retrieval:** Retrieve objects by key and filter or combine them in application code when the data volume is manageable.

### Example

An application could store a customer under key `customer-1042` and index a `city` field. It can then use a secondary index to find keys for customers whose city is `Agra`, and fetch the corresponding values.

As requirements become more complex, applications should select indexes based on known query patterns, avoid relying on full scans for large datasets, and consider a search engine or a database with richer query capabilities if complex ad hoc queries and joins are essential. Feature availability and exact query syntax vary by Riak version and deployment.

## Q6. A web application needs to store millions of user sessions. Explain how Riak can store session information and discuss the advantages of a Key-Value database for this application.

Riak can store each session as one key-value object.

### Conceptual structure

```text
Bucket: user_sessions
Key: session:9f82a1
Value:
{
  "user_id": 501,
  "login_time": "2026-11-04T10:15:00Z",
  "device": {
    "type": "mobile",
    "browser": "Chrome"
  },
  "expires_at": "2026-11-04T18:15:00Z"
}
```

The application generates a unique session ID and uses it as the key. When a request arrives, it retrieves the session by that ID, checks the expiry time, and then authorizes or rejects the request. Expired sessions can be deleted or removed through an appropriate expiry/cleanup mechanism supported by the chosen deployment and application.

### Typical operations

- **Create:** Write the session value under a new session key.
- **Read:** Retrieve the value using the session ID.
- **Update:** Replace or update session details, such as last activity time.
- **Delete:** Remove the session on logout.
- **Expiry:** Enforce expiration in the application and use database lifecycle/cleanup facilities where configured.

### Advantages

1. **Fast direct lookup:** A session ID is a natural key.
2. **Horizontal scaling:** The key space can be distributed as session volume grows.
3. **Availability:** Replication can help keep sessions accessible when a node fails.
4. **Flexible values:** Device details and other session attributes can evolve.
5. **High write/read workload:** The model fits frequent session creation, retrieval, and deletion.

The application should protect session IDs, use secure transport, avoid storing unnecessary sensitive information, and define behavior for expired or conflicting session updates.

## Q7. An e-commerce application needs user profiles, preferences, and shopping cart data. Design a conceptual Key-Value data structure and explain efficient access and updates.

A key-value design can keep each major user resource under a predictable key.

### Example structure

```text
Bucket: user_profiles
Key: user:501
Value:
{
  "name": "Asha",
  "email": "asha@example.com",
  "address": "Agra"
}

Bucket: user_preferences
Key: preferences:501
Value:
{
  "language": "en",
  "currency": "INR",
  "notifications": true
}

Bucket: shopping_carts
Key: cart:501
Value:
{
  "items": [
    {"product_id": "P100", "quantity": 2, "unit_price": 899},
    {"product_id": "P205", "quantity": 1, "unit_price": 499}
  ],
  "updated_at": "2026-11-04T10:30:00Z"
}
```

### Access and update strategy

- After login, use `user:501` to retrieve the profile and `preferences:501` to retrieve preferences.
- Use `cart:501` to load the customer's cart.
- Update only the relevant object when a preference changes.
- For a cart change, read the cart, validate the requested change, and write the updated cart using suitable version/conflict controls supported by the database.
- Use predictable key formats and keep objects at a size that suits the application's access pattern.

### Design considerations

Keeping profile, preferences, and cart separate allows each to be read or updated independently. However, an operation spanning multiple keys is not automatically atomic. The application must handle partial failures, concurrent cart updates, duplicate requests, and consistency between product prices and cart snapshots. For a highly concurrent cart, use version checks, idempotency keys, and a clear conflict-resolution policy.

## Q8. Explain relationships among data in Key-Value databases. Why are relationships harder to represent than in relational or graph databases? Discuss suitable techniques.

A simple key-value store is centered on retrieving an object by key. It does not generally provide built-in foreign keys, joins, or graph traversal. As a result, relationships between objects are usually represented by the application.

### Why relationships are harder

- A value may contain another object's key, but the database may not automatically validate that the referenced object exists.
- Retrieving related objects can require multiple lookups.
- Updating several related values can require application-level coordination.
- Many-to-many relationships and multi-step traversals can become expensive.
- There is no general relational join engine or native graph traversal in a basic key-value model.

### Techniques

1. **Store references:** Save related keys inside an object, such as a customer record containing order IDs.
2. **Denormalize:** Copy frequently needed related information into a value to reduce extra lookups.
3. **Maintain reverse indexes:** Store a separate key that maps a related entity to the keys that refer to it.
4. **Aggregate related data:** Keep data that is commonly read together in one value, when object size and update patterns permit.
5. **Application-level joins:** Retrieve multiple values and combine them in application code.
6. **Consistency workflows:** Use idempotent updates, version checks, compensating actions, and reconciliation for changes across objects.

For deeply connected information with frequent multi-hop relationship queries, a graph database such as Neo4j is often a more natural choice.

## Q9. Explain scaling in Riak. Discuss partitioning, replication, and distributed nodes in scalability and fault tolerance.

Scaling means increasing the system's ability to store more data and serve more requests as workload grows.

### Main mechanisms

- **Distributed nodes:** A cluster uses several machines to share storage and request processing.
- **Partitioning:** The key space is divided into partitions. Different partitions are assigned across nodes, distributing data and work.
- **Replication:** Multiple copies of an object are stored on different nodes. This can improve availability and durability.
- **Request routing:** The cluster routes operations to the nodes responsible for the relevant partitions and replicas.
- **Adding capacity:** Additional nodes can provide more storage and processing capacity, with data ownership redistributed according to the cluster's placement and rebalancing mechanisms.

### Example

If a service grows from one million to ten million session records, a distributed cluster can spread the key space across more nodes. Replicas can allow reads or writes to continue when a node becomes unavailable, depending on the configured quorum and failure scenario.

### Considerations

Replication consumes extra storage and network bandwidth. Rebalancing can use resources while data placement changes. Performance also depends on network latency, object size, request distribution, hardware, and configuration. Scaling is not unlimited or automatic; the cluster must be monitored and correctly sized.

## Q10. Explain Operations by Sets in Key-Value databases and their usefulness for groups, tags, product categories, and social relationships.

A set is a collection of distinct elements. Set-based operations allow an application to add, remove, or compare members without treating the collection as an ordered list.

Common mathematical set operations include:

- **Union (`A ∪ B`):** All distinct elements that appear in either set.
- **Intersection (`A ∩ B`):** Elements present in both sets.
- **Difference (`A − B`):** Elements in A that are not in B.
- **Membership:** Check whether a particular element belongs to a set.

### Examples

**User groups**

```text
Key: group:photography
Value: {"user:12", "user:28", "user:41"}
```

**Product tags**

```text
Key: product:P100:tags
Value: {"electronics", "accessories", "sale"}
```

**Social relationships**

```text
Key: user:501:followers
Value: {"user:102", "user:205", "user:310"}
```

### Why useful

- Union can combine members of two groups.
- Intersection can find users who belong to two groups.
- Difference can find members in one group but not another.
- Set membership can prevent duplicate logical entries and support quick membership checks, depending on the implementation.

Not every basic key-value database provides native set data types or atomic set operations. If the chosen Riak version/deployment supports a suitable set data type, it can be used; otherwise the application must implement set updates carefully. Concurrent updates and large sets require attention to conflict behavior, data size, and update semantics.

## Q11. Explain Graph Databases and their data model. Discuss nodes, relationships/edges, properties, and labels. Why are graph databases such as Neo4j suitable for highly connected data?

A graph database stores information as entities and the connections between them. It is designed to represent and query relationships directly.

### Main elements

- **Nodes:** Represent entities such as people, products, places, or accounts.
- **Relationships (edges):** Connect nodes and have a direction and a type, such as `FRIENDS_WITH`, `PURCHASED`, or `FOLLOWS`.
- **Properties:** Key-value attributes stored on nodes or relationships, such as a person's name or a purchase date.
- **Labels:** Classify nodes, such as `:Person`, `:Product`, or `:Customer`.

### Example

```text
(:Person {name: "Asha"})
  -[:FRIENDS_WITH {since: 2022}]->
(:Person {name: "Ravi"})
```

A graph keeps the connection as a first-class part of the model. Neo4j uses a property graph model and the Cypher query language to create, match, and traverse connected patterns.

### Why suitable for highly connected data

- Relationships are stored explicitly rather than reconstructed from many join tables.
- Traversal can follow paths such as friend-of-a-friend or customer-bought-product.
- The model naturally represents networks, recommendations, fraud connections, routes, and dependency structures.
- Queries can express patterns involving multiple node and relationship types.

Graph databases are especially valuable when the relationships among records are as important as the records themselves.

## Q12. Explain the major features of Neo4j as a Graph NoSQL database. Discuss consistency, transactions, availability, query capabilities, and scaling. Compare it with a traditional relational database.

Neo4j is a graph database that stores nodes, relationships, labels, and properties. Its data model is designed for connected information.

### Major features

1. **Property graph model:** Nodes and relationships can both contain properties.
2. **Cypher:** A declarative query language for creating, matching, updating, and deleting graph patterns.
3. **ACID transactions:** Neo4j supports transactions for reliable groups of database operations. Exact behavior and limits depend on the edition and deployment.
4. **Consistency:** Transactional constraints and database rules help maintain valid data. The available consistency guarantees depend on the cluster architecture and configuration.
5. **Availability:** Neo4j clustering and replication options can improve availability. The specific capabilities depend on product edition, version, and topology.
6. **Scaling:** Neo4j supports scaling approaches such as vertical scaling and clustering for availability/read capacity; horizontal distribution of a single graph has edition- and architecture-specific constraints. It should not be assumed to scale exactly like a distributed key-value store.

### Example Cypher query

```cypher
CREATE (a:Person {name: 'Asha'})
CREATE (b:Person {name: 'Ravi'})
CREATE (a)-[:FRIENDS_WITH]->(b);

MATCH (p:Person)-[:FRIENDS_WITH]->(friend:Person)
WHERE p.name = 'Asha'
RETURN friend.name;
```

### Neo4j compared with relational databases

| Aspect | Neo4j | Relational database |
|---|---|---|
| Main structure | Nodes and relationships | Tables, rows, columns |
| Relationships | Explicit graph edges | Foreign keys and joins |
| Query language | Cypher | SQL |
| Best fit | Connected data and path queries | Structured records and relational queries |
| Transactions | ACID transactions supported | ACID transactions commonly supported |
| Schema | Labels, relationship types, properties, and optional constraints | Typically table schemas and constraints |

A relational database can represent graphs using tables and joins. Neo4j is often more expressive and convenient when queries repeatedly traverse many relationships.

## Q13. Explain graph database query processing using Neo4j. Discuss graph traversal and pattern-based queries. Why can graph querying be more effective than relational joins for highly connected datasets?

Neo4j queries are commonly written in Cypher. Cypher describes a pattern of nodes and relationships that the database should find or modify.

### Pattern matching

A simple pattern:

```cypher
MATCH (a:Person)-[:FRIENDS_WITH]->(b:Person)
WHERE a.name = 'Asha'
RETURN b.name;
```

This finds people connected from Asha by a `FRIENDS_WITH` relationship.

### Graph traversal

Traversal follows relationships from a starting node. For example, finding friends-of-friends:

```cypher
MATCH (a:Person {name: 'Asha'})-[:FRIENDS_WITH*2]->(possibleFriend:Person)
RETURN DISTINCT possibleFriend.name;
```

A variable-length relationship pattern such as `*2` expresses a path of two relationship hops. Real applications should set sensible path bounds to avoid exploring an unnecessarily large graph.

### Multi-pattern query

```cypher
MATCH (customer:Person)-[:PURCHASED]->(product:Product)
      <-[:PURCHASED]-(otherCustomer:Person)
WHERE customer.name = 'Asha'
RETURN DISTINCT otherCustomer.name, product.name;
```

This finds other customers who purchased products also purchased by Asha.

### Why graph queries can outperform joins for connected data

A relational approach may need to join several tables repeatedly to follow a multi-step relationship. A graph database stores relationships directly and can traverse them from a starting node. This can make the query more natural and efficient for highly connected data, although actual performance depends on indexes, graph shape, query design, data volume, and workload. Graph databases are not automatically faster for every query; simple tabular reporting may be better suited to SQL.

## Q14. Model a social networking application in Neo4j for users, friendships, followers, posts, likes, groups, and recommendations. Discuss advantages.

A social network contains many connected entities, so it can be represented naturally using Neo4j nodes and relationships.

### Suggested node labels

- `User`: `{userId, name, email}`
- `Post`: `{postId, text, createdAt}`
- `Group`: `{groupId, name}`
- `Topic`: `{topicId, name}`

### Suggested relationship types

- `(User)-[:FRIENDS_WITH]-(User)` for mutual friendship.
- `(User)-[:FOLLOWS]->(User)` for one-way following.
- `(User)-[:CREATED]->(Post)` for post ownership.
- `(User)-[:LIKED {createdAt}]->(Post)` for likes.
- `(User)-[:MEMBER_OF]->(Group)` for group membership.
- `(Post)-[:ABOUT]->(Topic)` for post topics.

### Example Cypher data creation

```cypher
CREATE
  (asha:User {userId: 1, name: 'Asha'}),
  (ravi:User {userId: 2, name: 'Ravi'}),
  (meera:User {userId: 3, name: 'Meera'}),
  (post:Post {postId: 101, text: 'Learning graph databases'}),
  (group:Group {groupId: 10, name: 'Database Learners'}),
  (topic:Topic {topicId: 20, name: 'NoSQL'});

CREATE
  (asha)-[:FRIENDS_WITH]-(ravi),
  (meera)-[:FOLLOWS]->(asha),
  (asha)-[:CREATED]->(post),
  (ravi)-[:LIKED {createdAt: date()}]->(post),
  (asha)-[:MEMBER_OF]->(group),
  (post)-[:ABOUT]->(topic);
```

### Example queries

**Find Asha's followers:**

```cypher
MATCH (follower:User)-[:FOLLOWS]->(u:User {name: 'Asha'})
RETURN follower.name;
```

**Find posts liked by Ravi:**

```cypher
MATCH (u:User {name: 'Ravi'})-[:LIKED]->(p:Post)
RETURN p.postId, p.text;
```

**Suggest friends-of-friends who are not already connected to Asha:**

```cypher
MATCH (asha:User {name: 'Asha'})-[:FRIENDS_WITH]-(friend:User)
      -[:FRIENDS_WITH]-(suggestion:User)
WHERE suggestion <> asha
  AND NOT (asha)-[:FRIENDS_WITH]-(suggestion)
RETURN DISTINCT suggestion.name;
```

This is a simple conceptual recommendation query; a production system would also consider privacy settings, blocks, relevance, ranking, and performance.

### Advantages

- Relationships such as follows, likes, and membership are represented directly.
- Multi-hop queries are expressive.
- Recommendations can be derived from shared friends, interests, groups, or liked content.
- The model can evolve by adding new node labels, relationship types, and properties.
- Queries can reveal communities and paths that are awkward to express with repeated relational joins.

## Q15. Compare Riak Key-Value and Neo4j Graph databases across the specified dimensions. Recommend a database for shopping carts, user profiles, and social-network recommendations.

### Comparison

| Dimension | Riak Key-Value | Neo4j Graph |
|---|---|---|
| Data structure | Bucket/key/value objects | Nodes, relationships, labels, properties |
| Consistency | Distributed, tunable read/write quorum behavior; conflicts may need resolution | ACID transactions; cluster guarantees depend on architecture and configuration |
| Transactions | Not designed for general relational-style multi-key ACID transactions | Supports ACID transactions for grouped operations |
| Availability | Distributed replication and tunable quorums can support availability | Clustering and replication options support availability; capabilities vary by edition and topology |
| Query features | Direct key lookup; secondary indexes/search features depend on version and configuration | Cypher pattern matching and graph traversal |
| Relationships | Usually represented by references or denormalized values in application data | Explicit typed relationships between nodes |
| Scalability | Designed for distributed key-value storage and horizontal scaling | Scales through suitable sizing and clustering; distributed graph scaling has architecture-specific constraints |
| Suitable workloads | Sessions, caches, key-based profile or object retrieval | Social networks, recommendations, fraud links, dependency and path analysis |

### Recommendations by application

**1. Shopping-cart system — Riak can be a suitable choice**

A cart can be stored under a key such as `cart:user-501`, with the cart contents as the value. A known user or session key gives direct access, and a distributed key-value store can handle many independent cart reads and writes. The application must still design safe concurrent updates, idempotency, and behavior when an order spans several records. Neo4j may be useful if the main requirement is exploring product relationships, but it is not usually necessary for basic cart storage.

**2. User-profile system — Riak can be a suitable choice for key-based profile retrieval**

A profile can be stored under `user:501`, with preferences and other attributes in the value or in separate related keys. This is convenient when the application usually fetches a profile by user ID. If the application needs extensive relationship queries between users, products, and organizations, Neo4j may complement or better suit that part of the workload.

**3. Social-network recommendation system — Neo4j is the stronger fit**

Users, friendships, follows, posts, likes, groups, and interests form a highly connected graph. Neo4j can traverse these relationships to find friends-of-friends, shared interests, and similar users. A simple key-value model would require the application to manage many references and combine results itself.

### Conclusion

Riak is a good fit for distributed workloads dominated by fast key-based access and flexible values. Neo4j is a good fit when relationships and multi-hop graph queries are central. The best choice should be made from the application's access patterns, consistency requirements, scale, and operational constraints; some systems may use more than one database for different workloads.

---

**Submission reminder:** Add your own name, roll number, class details, and any teacher-required cover page before submission. The assignment answers above are explanatory study material; verify terminology and product/version-specific features against the Riak and Neo4j versions used in your course.
