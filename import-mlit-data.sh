#!/bin/bash
# Import MLIT Production Data to MySQL Database
# This script imports 100,000 transaction records efficiently

set -e

echo "========================================"
echo "MLIT Data Import Script"
echo "========================================"
echo ""

# Extract database credentials from DATABASE_URL
DB_URL="${DATABASE_URL}"

# Parse DATABASE_URL (format: mysql://user:password@host:port/database)
DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo ""

SQL_FILE="server/mlit-production-data.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Error: SQL file not found: $SQL_FILE"
    exit 1
fi

FILE_SIZE=$(du -h "$SQL_FILE" | cut -f1)
echo "SQL File: $SQL_FILE ($FILE_SIZE)"
echo ""

echo "Starting import..."
echo "This may take several minutes for 100,000 records..."
echo ""

# Import using mysql command with progress indicator
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Import completed successfully!"
    echo ""
    
    # Query record count
    echo "Verifying data..."
    RECORD_COUNT=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -N -e "SELECT COUNT(*) FROM transactions;")
    echo "Total records in database: $RECORD_COUNT"
    
    # Query prefecture distribution
    echo ""
    echo "Prefecture distribution:"
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT prefecture, COUNT(*) as count FROM transactions GROUP BY prefecture ORDER BY count DESC LIMIT 10;"
else
    echo ""
    echo "❌ Import failed!"
    exit 1
fi

echo ""
echo "========================================"
echo "Import Complete"
echo "========================================"
