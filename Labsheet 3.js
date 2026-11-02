/*
BCA305P-AS02 — NoSQL Database Design, Lab Sheet 3
MongoDB solutions for all 15 questions.

Run:
  mongosh
  load("/path/to/BCA305P-AS02_Solutions.js")

This script uses a dedicated database named BCA305P_AS02_Lab3.
For repeatable sample output, it clears only the collections used by this lab
before inserting sample records. Do not point this script at a database that
contains your real data.

Note:
- Use mongosh (MongoDB Shell).
- Question 11 uses transactions and requires a replica set or MongoDB Atlas.
*/

const lab = db.getSiblingDB("BCA305P_AS02_Lab3");
print("\n=== BCA305P-AS02: MongoDB Lab Sheet 3 ===");
print("Database: " + lab.getName());

function resetCollection(name) {
  lab.getCollection(name).deleteMany({});
}

// -----------------------------------------------------------------------------
// Q1. Student Activity Tracking System
// -----------------------------------------------------------------------------
print("\nQ1. Student Activity Tracking System");
resetCollection("student_activity");
lab.student_activity.insertMany([
  {
    studentId: "ST101", name: "Aman", age: 20,
    courses: ["MongoDB", "Java"], attendance: 92,
    skills: ["JavaScript", "MongoDB"],
    recentActivities: [
      { type: "login", date: ISODate("2026-09-01T09:00:00Z") },
      { type: "assignment_submit", date: ISODate("2026-09-02T10:00:00Z") }
    ]
  },
  {
    studentId: "ST102", name: "Neha", age: 21,
    courses: ["Python", "MongoDB"], attendance: 68,
    skills: ["Python", "Data Analysis"],
    recentActivities: [
      { type: "login", date: ISODate("2026-09-03T09:00:00Z") }
    ]
  },
  {
    studentId: "ST103", name: "Ravi", age: 19,
    courses: ["Flutter", "Java"], attendance: 85,
    skills: ["Dart", "Flutter"],
    recentActivities: [
      { type: "quiz_attempt", date: ISODate("2026-09-04T11:00:00Z") },
      { type: "assignment_submit", date: ISODate("2026-09-05T12:00:00Z") }
    ]
  }
]);
print("Students with attendance >= 80:");
printjson(lab.student_activity.find({ attendance: { $gte: 80 } }, { _id: 0, name: 1, attendance: 1 }).toArray());
print("Students enrolled in MongoDB:");
printjson(lab.student_activity.find({ courses: "MongoDB" }, { _id: 0, name: 1, courses: 1 }).toArray());
print("Students who submitted an assignment:");
printjson(lab.student_activity.find({ "recentActivities.type": "assignment_submit" }, { _id: 0, name: 1 }).toArray());
print("Students with the JavaScript skill:");
printjson(lab.student_activity.find({ skills: "JavaScript" }, { _id: 0, name: 1, skills: 1 }).toArray());

// -----------------------------------------------------------------------------
// Q2. Event Logging System
// -----------------------------------------------------------------------------
print("\nQ2. Event Logging System");
resetCollection("event_logs");
lab.event_logs.insertMany([
  { user: "aman", event: "login", time: ISODate("2026-09-10T09:00:00Z"), ip: "10.0.0.1" },
  { user: "aman", event: "failed-login", time: ISODate("2026-09-10T09:02:00Z"), ip: "10.0.0.1" },
  { user: "aman", event: "failed-login", time: ISODate("2026-09-10T09:03:00Z"), ip: "10.0.0.1" },
  { user: "aman", event: "failed-login", time: ISODate("2026-09-10T09:04:00Z"), ip: "10.0.0.1" },
  { user: "neha", event: "file-upload", time: ISODate("2026-09-10T10:00:00Z"), file: "report.pdf" },
  { user: "neha", event: "password-change", time: ISODate("2026-09-10T10:05:00Z") },
  { user: "ravi", event: "logout", time: ISODate("2026-09-10T11:00:00Z") },
  { user: "neha", event: "file-upload", time: ISODate("2026-09-10T11:05:00Z"), file: "notes.pdf" }
]);
print("Users with at least 3 failed-login events:");
printjson(lab.event_logs.aggregate([
  { $match: { event: "failed-login" } },
  { $group: { _id: "$user", failedAttempts: { $sum: 1 } } },
  { $match: { failedAttempts: { $gte: 3 } } }
]).toArray());
print("Event frequency:");
printjson(lab.event_logs.aggregate([
  { $group: { _id: "$event", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]).toArray());

// -----------------------------------------------------------------------------
// Q3. Mini Blogging Platform
// -----------------------------------------------------------------------------
print("\nQ3. Mini Blogging Platform");
resetCollection("blogs");
lab.blogs.insertMany([
  {
    title: "Getting Started with MongoDB", author: "Aman",
    category: "Technology", tags: ["MongoDB", "Database"],
    comments: [{ user: "Neha", text: "Helpful article" }],
    published: true, publishedAt: ISODate("2026-08-01T10:00:00Z")
  },
  {
    title: "JavaScript Arrays", author: "Neha",
    category: "Programming", tags: ["JavaScript", "Programming"],
    comments: [], published: true, publishedAt: ISODate("2026-08-03T10:00:00Z")
  },
  {
    title: "Database Design Tips", author: "Ravi",
    category: "Technology", tags: ["Database", "Design"],
    comments: [{ user: "Aman", text: "Great tips" }],
    published: false, publishedAt: null
  }
]);
print("Technology category:");
printjson(lab.blogs.find({ category: "Technology" }, { _id: 0, title: 1, tags: 1 }).toArray());
print("Blogs tagged MongoDB:");
printjson(lab.blogs.find({ tags: "MongoDB" }, { _id: 0, title: 1 }).toArray());
print("Technology blogs tagged Database:");
printjson(lab.blogs.find({ category: "Technology", tags: "Database" }, { _id: 0, title: 1 }).toArray());
print("Blogs containing both Database and Design tags:");
printjson(lab.blogs.find({ tags: { $all: ["Database", "Design"] } }, { _id: 0, title: 1 }).toArray());

// -----------------------------------------------------------------------------
// Q4. Flexible Product Catalog
// -----------------------------------------------------------------------------
print("\nQ4. Flexible Product Catalog");
resetCollection("catalog_products");
lab.catalog_products.insertMany([
  { name: "Laptop Pro", category: "laptop", brand: "Aster", price: 72000, ramGB: 16, storageGB: 512, processor: "i7" },
  { name: "Phone X", category: "mobile", brand: "Nova", price: 28000, ramGB: 8, storageGB: 256, batteryMah: 5000, cameraMP: 50 },
  { name: "Cam Z", category: "camera", brand: "Optix", price: 56000, sensor: "APS-C", megapixels: 24, lensMount: "X" }
]);
print("Laptops with at least 16 GB RAM:");
printjson(lab.catalog_products.find({ category: "laptop", ramGB: { $gte: 16 } }, { _id: 0 }).toArray());
print("Mobiles with battery >= 4500 mAh:");
printjson(lab.catalog_products.find({ category: "mobile", batteryMah: { $gte: 4500 } }, { _id: 0 }).toArray());
print("Cameras with at least 20 megapixels:");
printjson(lab.catalog_products.find({ category: "camera", megapixels: { $gte: 20 } }, { _id: 0 }).toArray());
print("All products under Rs. 60000:");
printjson(lab.catalog_products.find({ price: { $lt: 60000 } }, { _id: 0, name: 1, price: 1, category: 1 }).toArray());

// -----------------------------------------------------------------------------
// Q5. E-Commerce Order Management
// -----------------------------------------------------------------------------
print("\nQ5. E-Commerce Order Management");
resetCollection("customers");
resetCollection("store_products");
resetCollection("orders");
lab.customers.insertMany([
  { customerId: "C1", name: "Aman", email: "aman@example.com" },
  { customerId: "C2", name: "Neha", email: "neha@example.com" }
]);
lab.store_products.insertMany([
  { productId: "P1", name: "Keyboard", price: 900 },
  { productId: "P2", name: "Mouse", price: 500 },
  { productId: "P3", name: "Monitor", price: 8500 }
]);
lab.orders.insertMany([
  { orderId: "O100", customerId: "C1", date: ISODate("2026-09-01T00:00:00Z"), items: [{ productId: "P1", name: "Keyboard", qty: 1, price: 900 }, { productId: "P2", name: "Mouse", qty: 2, price: 500 }] },
  { orderId: "O101", customerId: "C1", date: ISODate("2026-09-05T00:00:00Z"), items: [{ productId: "P3", name: "Monitor", qty: 1, price: 8500 }] },
  { orderId: "O102", customerId: "C2", date: ISODate("2026-09-06T00:00:00Z"), items: [{ productId: "P2", name: "Mouse", qty: 1, price: 500 }] }
]);
print("Customer C1 purchase history with order totals:");
printjson(lab.orders.aggregate([
  { $match: { customerId: "C1" } },
  { $unwind: "$items" },
  { $group: { _id: { orderId: "$orderId", date: "$date" }, total: { $sum: { $multiply: ["$items.qty", "$items.price"] } }, items: { $push: "$items" } } },
  { $sort: { "_id.date": 1 } }
]).toArray());
print("Total value of every order:");
printjson(lab.orders.aggregate([
  { $project: { _id: 0, orderId: 1, customerId: 1, total: { $sum: { $map: { input: "$items", as: "item", in: { $multiply: ["$$item.qty", "$$item.price"] } } } } } }
]).toArray());

// -----------------------------------------------------------------------------
// Q6. Website Analytics
// -----------------------------------------------------------------------------
print("\nQ6. Website Analytics");
resetCollection("page_visits");
lab.page_visits.insertMany([
  { page: "/home", userId: "U1", device: "mobile", browser: "Chrome", location: "Delhi", timestamp: ISODate("2026-09-01T09:00:00Z") },
  { page: "/home", userId: "U2", device: "desktop", browser: "Firefox", location: "Agra", timestamp: ISODate("2026-09-01T09:10:00Z") },
  { page: "/products", userId: "U1", device: "mobile", browser: "Chrome", location: "Delhi", timestamp: ISODate("2026-09-01T09:15:00Z") },
  { page: "/home", userId: "U3", device: "tablet", browser: "Safari", location: "Meerut", timestamp: ISODate("2026-09-01T09:20:00Z") },
  { page: "/products", userId: "U4", device: "mobile", browser: "Chrome", location: "Noida", timestamp: ISODate("2026-09-01T09:25:00Z") }
]);
print("Most visited pages:");
printjson(lab.page_visits.aggregate([
  { $group: { _id: "$page", visits: { $sum: 1 } } },
  { $sort: { visits: -1 } }
]).toArray());
print("Device usage:");
printjson(lab.page_visits.aggregate([
  { $group: { _id: "$device", visits: { $sum: 1 } } },
  { $sort: { visits: -1 } }
]).toArray());

// -----------------------------------------------------------------------------
// Q7. Content Management System
// -----------------------------------------------------------------------------
print("\nQ7. Content Management System");
resetCollection("cms_content");
lab.cms_content.insertMany([
  { title: "MongoDB Basics", author: "Aman", category: "Tutorial", tags: ["MongoDB"], status: "published", publishedAt: ISODate("2026-08-01T00:00:00Z") },
  { title: "Draft: Indexing", author: "Neha", category: "Tutorial", tags: ["Index"], status: "draft", publishedAt: null },
  { title: "Campus News", author: "Ravi", category: "News", tags: ["Campus"], status: "published", publishedAt: ISODate("2026-08-04T00:00:00Z") }
]);
print("Published content:");
printjson(lab.cms_content.find({ status: "published" }, { _id: 0, title: 1, author: 1 }).toArray());
print("Unpublished/draft content:");
printjson(lab.cms_content.find({ status: { $ne: "published" } }, { _id: 0, title: 1, status: 1 }).toArray());
print("Published tutorials:");
printjson(lab.cms_content.find({ status: "published", category: "Tutorial" }, { _id: 0, title: 1 }).toArray());

// -----------------------------------------------------------------------------
// Q8. Shopping Cart with embedded documents
// -----------------------------------------------------------------------------
print("\nQ8. Shopping Cart System");
resetCollection("shopping_carts");
lab.shopping_carts.insertOne({
  cartId: "CART1", userId: "U1",
  items: [
    { productId: "P1", name: "Keyboard", price: 900, quantity: 1 },
    { productId: "P2", name: "Mouse", price: 500, quantity: 2 }
  ]
});
print("Initial cart:");
printjson(lab.shopping_carts.findOne({ cartId: "CART1" }));
// Add a product (or increase quantity if already present).
lab.shopping_carts.updateOne(
  { cartId: "CART1", "items.productId": "P3" },
  { $inc: { "items.$.quantity": 1 } }
);
if (lab.shopping_carts.countDocuments({ cartId: "CART1", "items.productId": "P3" }) === 0) {
  lab.shopping_carts.updateOne({ cartId: "CART1" }, { $push: { items: { productId: "P3", name: "USB Cable", price: 250, quantity: 1 } } });
}
// Change quantity of mouse.
lab.shopping_carts.updateOne({ cartId: "CART1", "items.productId": "P2" }, { $set: { "items.$.quantity": 3 } });
// Remove keyboard.
lab.shopping_carts.updateOne({ cartId: "CART1" }, { $pull: { items: { productId: "P1" } } });
print("Updated cart and calculated value:");
printjson(lab.shopping_carts.aggregate([
  { $match: { cartId: "CART1" } },
  { $project: { _id: 0, cartId: 1, items: 1, cartTotal: { $sum: { $map: { input: "$items", as: "item", in: { $multiply: ["$$item.price", "$$item.quantity"] } } } } } }
]).toArray());

// -----------------------------------------------------------------------------
// Q9. Product Review and Rating System
// -----------------------------------------------------------------------------
print("\nQ9. Product Review and Rating System");
resetCollection("product_reviews");
lab.product_reviews.insertMany([
  { productId: "P1", customer: "Aman", rating: 5, review: "Excellent" },
  { productId: "P1", customer: "Neha", rating: 4, review: "Good quality" },
  { productId: "P1", customer: "Ravi", rating: 5, review: "Worth buying" },
  { productId: "P2", customer: "Aman", rating: 3, review: "Average" }
]);
print("Average rating and number of reviews per product:");
printjson(lab.product_reviews.aggregate([
  { $group: { _id: "$productId", averageRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]).toArray());

// -----------------------------------------------------------------------------
// Q10. Inventory Monitoring System
// -----------------------------------------------------------------------------
print("\nQ10. Inventory Monitoring System");
resetCollection("inventory");
lab.inventory.insertMany([
  { productId: "P1", name: "Keyboard", stock: 4, minStock: 10, supplier: "Tech Supply", restockDate: ISODate("2026-09-15T00:00:00Z") },
  { productId: "P2", name: "Monitor", stock: 20, minStock: 5, supplier: "Screen House", restockDate: ISODate("2026-10-01T00:00:00Z") },
  { productId: "P3", name: "Mouse", stock: 2, minStock: 8, supplier: "Tech Supply", restockDate: ISODate("2026-09-16T00:00:00Z") }
]);
print("Products requiring immediate restocking:");
printjson(lab.inventory.find({ $expr: { $lte: ["$stock", "$minStock"] } }, { _id: 0 }).toArray());

// -----------------------------------------------------------------------------
// Q11. Bank Wallet Transfer using transactions
// Requires a replica set or MongoDB Atlas.
// -----------------------------------------------------------------------------
print("\nQ11. Bank Wallet Transfer (transaction example)");
resetCollection("wallets");
lab.wallets.insertMany([
  { userId: "U1", name: "Aman", balance: 5000 },
  { userId: "U2", name: "Neha", balance: 2000 }
]);
print("Balances before transfer:");
printjson(lab.wallets.find({}, { _id: 0 }).toArray());
print("Transaction code (run in replica set / Atlas):");
print("const session = db.getMongo().startSession();");
print("const txdb = session.getDatabase('BCA305P_AS02_Lab3');");
print("session.startTransaction();");
print("try {");
print("  const debit = txdb.wallets.updateOne({ userId: 'U1', balance: { $gte: 1000 } }, { $inc: { balance: -1000 } });");
print("  if (debit.modifiedCount !== 1) throw new Error('Insufficient balance or sender not found');");
print("  const credit = txdb.wallets.updateOne({ userId: 'U2' }, { $inc: { balance: 1000 } });");
print("  if (credit.modifiedCount !== 1) throw new Error('Receiver not found');");
print("  session.commitTransaction();");
print("} catch (e) { session.abortTransaction(); throw e; } finally { session.endSession(); }");
print("After running the transaction separately, query: db.wallets.find({}, { _id: 0 })");

// -----------------------------------------------------------------------------
// Q12. User Notification System
// -----------------------------------------------------------------------------
print("\nQ12. User Notification System");
resetCollection("notifications");
lab.notifications.insertMany([
  { notificationId: "N1", userId: "U1", type: "message", text: "New message", read: false, createdAt: ISODate("2026-09-01T08:00:00Z") },
  { notificationId: "N2", userId: "U1", type: "order-update", text: "Order shipped", read: false, createdAt: ISODate("2026-09-01T09:00:00Z") },
  { notificationId: "N3", userId: "U1", type: "system-alert", text: "Profile updated", read: true, createdAt: ISODate("2026-09-01T10:00:00Z") },
  { notificationId: "N4", userId: "U2", type: "message", text: "Welcome", read: false, createdAt: ISODate("2026-09-01T11:00:00Z") }
]);
print("Unread notifications for U1:");
printjson(lab.notifications.find({ userId: "U1", read: false }, { _id: 0 }).toArray());
lab.notifications.updateMany({ userId: "U1", read: false }, { $set: { read: true, readAt: new Date() } });
print("U1 notifications after marking as read:");
printjson(lab.notifications.find({ userId: "U1" }, { _id: 0 }).toArray());

// -----------------------------------------------------------------------------
// Q13. Course Learning Platform
// -----------------------------------------------------------------------------
print("\nQ13. Course Learning Platform");
resetCollection("course_progress");
lab.course_progress.insertMany([
  { courseId: "DB101", course: "MongoDB Basics", instructor: "Mr. Sharma", studentId: "ST101", student: "Aman", modules: [{ name: "Intro", completed: true }, { name: "CRUD", completed: true }, { name: "Aggregation", completed: false }], progress: 67, completed: false },
  { courseId: "DB101", course: "MongoDB Basics", instructor: "Mr. Sharma", studentId: "ST102", student: "Neha", modules: [{ name: "Intro", completed: true }, { name: "CRUD", completed: true }, { name: "Aggregation", completed: true }], progress: 100, completed: true },
  { courseId: "PY101", course: "Python", instructor: "Ms. Verma", studentId: "ST103", student: "Ravi", modules: [{ name: "Intro", completed: true }, { name: "Loops", completed: false }], progress: 50, completed: false }
]);
print("Students with progress >= 60%:");
printjson(lab.course_progress.find({ progress: { $gte: 60 } }, { _id: 0, student: 1, course: 1, progress: 1 }).toArray());
print("Students who completed the course:");
printjson(lab.course_progress.find({ completed: true }, { _id: 0, student: 1, course: 1, progress: 1 }).toArray());
print("Progress by course:");
printjson(lab.course_progress.aggregate([
  { $group: { _id: "$course", averageProgress: { $avg: "$progress" }, students: { $sum: 1 } } }
]).toArray());

// -----------------------------------------------------------------------------
// Q14. Real-Time Order Tracking
// -----------------------------------------------------------------------------
print("\nQ14. Real-Time Order Tracking");
resetCollection("order_tracking");
lab.order_tracking.insertOne({
  orderId: "ORD5001", customerId: "C1",
  currentStatus: "Shipped",
  statusHistory: [
    { status: "Placed", time: ISODate("2026-09-01T08:00:00Z") },
    { status: "Confirmed", time: ISODate("2026-09-01T08:30:00Z") },
    { status: "Shipped", time: ISODate("2026-09-02T10:00:00Z") }
  ]
});
print("Current order status:");
printjson(lab.order_tracking.find({ orderId: "ORD5001" }, { _id: 0, orderId: 1, currentStatus: 1 }).toArray());
// Add the next stage and update currentStatus.
lab.order_tracking.updateOne(
  { orderId: "ORD5001" },
  { $set: { currentStatus: "Delivered" }, $push: { statusHistory: { status: "Delivered", time: new Date() } } }
);
print("Complete order status history:");
printjson(lab.order_tracking.find({ orderId: "ORD5001" }, { _id: 0 }).toArray());

// -----------------------------------------------------------------------------
// Q15. Flexible News Database
// -----------------------------------------------------------------------------
print("\nQ15. Flexible News Database");
resetCollection("news_articles");
lab.news_articles.insertMany([
  { title: "City Opens New Library", author: "Aman", location: "Agra", category: "Local", tags: ["education", "city"], images: ["library.jpg"], sources: ["City News"], publishedAt: ISODate("2026-09-01T07:00:00Z") },
  { title: "New Tech Policy Announced", category: "Technology", tags: ["policy", "technology"], sources: ["Tech Daily"] },
  { title: "Heavy Rain Alert", author: "Neha", location: "Saharanpur", category: "Weather", tags: ["rain", "alert"], publishedAt: ISODate("2026-09-02T07:00:00Z") }
]);
print("Search by category:");
printjson(lab.news_articles.find({ category: "Technology" }, { _id: 0, title: 1, category: 1 }).toArray());
print("Search by tag, even when optional fields differ:");
printjson(lab.news_articles.find({ tags: "alert" }, { _id: 0, title: 1, tags: 1 }).toArray());
print("Articles that mention Agra:");
printjson(lab.news_articles.find({ location: "Agra" }, { _id: 0, title: 1, location: 1 }).toArray());
print("Articles with a publishedAt field:");
printjson(lab.news_articles.find({ publishedAt: { $exists: true } }, { _id: 0, title: 1, publishedAt: 1 }).toArray());

print("\n=== Lab script completed. Review the printed query results above. ===");
