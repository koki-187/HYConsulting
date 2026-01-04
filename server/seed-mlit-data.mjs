/**
 * Seed MLIT Sample Data
 * Loads sample transaction data from the provided SQLite database
 * into the MySQL database for testing
 */

import sqlite3 from "sqlite3";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SAMPLE_DB_PATH = join(__dirname, "../../../upload/HY_Appraisal_DB_sample.sqlite");

async function seedMLITData() {
  console.log("🌱 Starting MLIT data seeding...\n");

  // Read from SQLite
  const sqliteData = await readFromSQLite();
  console.log(`✓ Read ${sqliteData.datasets.length} datasets from SQLite`);
  console.log(`✓ Read ${sqliteData.regions.length} regions from SQLite`);
  console.log(`✓ Read ${sqliteData.transactions.length} transactions from SQLite`);

  // Connect to MySQL
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "hy_consulting",
  });

  try {
    // Insert datasets
    console.log("\n📊 Inserting dataset versions...");
    for (const dataset of sqliteData.datasets) {
      await connection.execute(
        `INSERT IGNORE INTO dataset_versions (id, source, description, publishedDate, ingestedAt, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          dataset.id,
          dataset.source,
          dataset.description,
          dataset.published_date,
          dataset.ingested_at,
          dataset.notes,
        ]
      );
    }
    console.log(`✓ Inserted ${sqliteData.datasets.length} dataset versions`);

    // Insert regions
    console.log("\n🗺️  Inserting regions...");
    for (const region of sqliteData.regions) {
      await connection.execute(
        `INSERT IGNORE INTO regions (prefecture, city, ward, district, geoCode, lat, lon)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          region.prefecture,
          region.city,
          region.ward,
          region.district,
          region.geo_code,
          region.lat,
          region.lon,
        ]
      );
    }
    console.log(`✓ Inserted ${sqliteData.regions.length} regions`);

    // Insert transactions
    console.log("\n💰 Inserting transactions...");
    for (const tx of sqliteData.transactions) {
      await connection.execute(
        `INSERT IGNORE INTO transactions (
          datasetVersionId, transactionYm, prefecture, city, ward, district,
          propertyType, landAreaM2, buildingAreaM2, buildingYear, structure,
          floorPlan, floor, nearestStation, stationDistanceMin, priceYen,
          unitPriceYenPerM2, lat, lon, remarks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tx.dataset_version_id,
          tx.transaction_ym,
          tx.prefecture,
          tx.city,
          tx.ward,
          tx.district,
          tx.property_type,
          tx.land_area_m2,
          tx.building_area_m2,
          tx.building_year,
          tx.structure,
          tx.floor_plan,
          tx.floor,
          tx.nearest_station,
          tx.station_distance_min,
          tx.price_yen,
          tx.unit_price_yen_per_m2,
          tx.lat,
          tx.lon,
          tx.remarks,
        ]
      );
    }
    console.log(`✓ Inserted ${sqliteData.transactions.length} transactions`);

    console.log("\n✅ MLIT data seeding completed successfully!\n");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

function readFromSQLite() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(SAMPLE_DB_PATH, (err) => {
      if (err) {
        reject(new Error(`Failed to open SQLite database: ${err.message}`));
        return;
      }

      const data = {
        datasets: [],
        regions: [],
        transactions: [],
      };

      // Read datasets
      db.all("SELECT * FROM dataset_versions", (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        data.datasets = rows || [];

        // Read regions
        db.all("SELECT * FROM regions", (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          data.regions = rows || [];

          // Read transactions
          db.all("SELECT * FROM transactions", (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
            data.transactions = rows || [];

            db.close();
            resolve(data);
          });
        });
      });
    });
  });
}

// Run seeding
seedMLITData().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
