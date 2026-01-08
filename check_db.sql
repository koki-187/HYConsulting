SELECT 
  prefecture,
  COUNT(*) as record_count,
  COUNT(DISTINCT city) as city_count,
  SUM(transactionCount) as total_transactions,
  COUNT(DISTINCT propertyType) as property_types
FROM aggregated_real_estate_data
GROUP BY prefecture
ORDER BY record_count DESC;
