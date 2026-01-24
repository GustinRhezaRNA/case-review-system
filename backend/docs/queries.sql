-- Example 1: Get all cases with full user and status information
SELECT 
  c.id,
  c.title,
  c.description,
  creator.name AS created_by_name,
  creator_role.name AS creator_role,
  assignee.name AS assigned_to_name,
  assignee_role.name AS assignee_role,
  cs.name AS status,
  c.created_at,
  c.updated_at
FROM cases c
INNER JOIN users creator ON c.created_by = creator.id
INNER JOIN roles creator_role ON creator.role_id = creator_role.id
LEFT JOIN users assignee ON c.assigned_to = assignee.id
LEFT JOIN roles assignee_role ON assignee.role_id = assignee_role.id
INNER JOIN case_statuses cs ON c.status_id = cs.id
ORDER BY c.created_at DESC;

-- Example 2: Get case count by status for each user
SELECT 
  u.name AS user_name,
  r.name AS role,
  cs.name AS status,
  COUNT(c.id) AS case_count
FROM users u
INNER JOIN roles r ON u.role_id = r.id
LEFT JOIN cases c ON c.assigned_to = u.id
LEFT JOIN case_statuses cs ON c.status_id = cs.id
GROUP BY u.id, u.name, r.name, cs.name
ORDER BY u.name, cs.name;

-- Example 3: Get cases assigned by each admin/supervisor
SELECT 
  creator.name AS assigned_by,
  assignee.name AS assigned_to,
  COUNT(c.id) AS total_cases
FROM cases c
INNER JOIN users creator ON c.created_by = creator.id
LEFT JOIN users assignee ON c.assigned_to = assignee.id
GROUP BY creator.id, creator.name, assignee.id, assignee.name
ORDER BY creator.name, assignee.name;