SELECT prefecture, COUNT(*) as count
FROM transactions
GROUP BY prefecture
ORDER BY count DESC;
