SELECT COUNT(*) as total_records FROM aggregated_real_estate_data;
SELECT prefecture, COUNT(*) as count FROM aggregated_real_estate_data GROUP BY prefecture ORDER BY prefecture LIMIT 10;
