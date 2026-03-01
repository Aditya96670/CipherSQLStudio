export const validateQuery = (query) => {
  if (!query || typeof query !== "string") {
    return { valid: false, message: "Invalid query format" };
  }

  const trimmedQuery = query.trim();

  
  if (trimmedQuery.split(";").length > 2) {
    return { valid: false, message: "Multiple statements are not allowed" };
  }

  const upperQuery = trimmedQuery.toUpperCase();

 
  const allowedStart = ["SELECT", "WITH", "SHOW"];

  const startsCorrectly = allowedStart.some(keyword =>
    upperQuery.startsWith(keyword)
  );

  if (!startsCorrectly) {
    return { valid: false, message: "Only read-only queries are allowed" };
  }

  
  const forbiddenKeywords = [
    "DROP",
    "DELETE",
    "TRUNCATE",
    "ALTER",
    "GRANT",
    "REVOKE",
    "CREATE DATABASE"
  ];

  const hasForbidden = forbiddenKeywords.some(keyword =>
    upperQuery.includes(keyword)
  );

  if (hasForbidden) {
    return { valid: false, message: "Dangerous operations are not allowed" };
  }

  return { valid: true };
};