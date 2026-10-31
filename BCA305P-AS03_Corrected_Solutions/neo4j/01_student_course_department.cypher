// Q11
MERGE (d:Department {name:'Computer Applications'})
MERGE (c:Course {code:'BCA', name:'Bachelor of Computer Applications'})
MERGE (c)-[:OFFERED_BY]->(d)
MERGE (s1:Student {student_id:'S101', name:'Aarav'})
MERGE (s2:Student {student_id:'S102', name:'Sana'})
MERGE (s1)-[:ENROLLED_IN]->(c)
MERGE (s2)-[:ENROLLED_IN]->(c)
MATCH (s:Student)-[r]->(n) RETURN s,r,n;
