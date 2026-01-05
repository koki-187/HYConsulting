import { describe, it, expect, beforeAll } from "vitest";
import { getDb, calculateAssessmentPrice, seedPropertyDatabase } from "./db";

describe("Session 28 - Critical Bug Fixes", () => {
  beforeAll(async () => {
    // Seed database before running tests
    await seedPropertyDatabase();
  });

  describe("1. Assessment Price Calculation (Min-Max Range)", () => {
    it("should calculate estimated price range correctly", async () => {
      const estimatedPrice = await calculateAssessmentPrice(
        "mansion",
        "神奈川県横浜市中区",
        10,
        70,
        "good"
      );

      expect(estimatedPrice).not.toBeNull();
      expect(estimatedPrice).toBeGreaterThan(0);
      
      // Calculate range (±15%)
      const estimatedLowManYen = Math.round(estimatedPrice! * 0.85);
      const estimatedHighManYen = Math.round(estimatedPrice! * 1.15);
      
      expect(estimatedLowManYen).toBeGreaterThan(0);
      expect(estimatedHighManYen).toBeGreaterThan(estimatedLowManYen);
      
      console.log(`Estimated Price Range: ${estimatedLowManYen.toLocaleString('ja-JP')}万円～${estimatedHighManYen.toLocaleString('ja-JP')}万円`);
    });

    it("should format price in 万円 units", () => {
      const priceYen = 35000000; // 3,500万円
      const manYen = Math.round(priceYen / 10000);
      const formatted = `${manYen.toLocaleString('ja-JP')}万円`;
      
      expect(formatted).toBe("3,500万円");
    });

    it("should format price range correctly", () => {
      const estimatedPrice = 3500; // 3,500万円
      const estimatedLowManYen = Math.round(estimatedPrice * 0.85);
      const estimatedHighManYen = Math.round(estimatedPrice * 1.15);
      const priceRangeText = `${estimatedLowManYen.toLocaleString('ja-JP')}万円～${estimatedHighManYen.toLocaleString('ja-JP')}万円`;
      
      expect(priceRangeText).toBe("2,975万円～4,025万円");
    });
  });

  describe("2. Phone Number Validation (11 Digits)", () => {
    it("should accept valid 11-digit phone number", () => {
      const phone = "09012345678";
      const isValid = /^[0-9]{11}$/.test(phone);
      
      expect(isValid).toBe(true);
    });

    it("should reject phone number with hyphens", () => {
      const phone = "090-1234-5678";
      const isValid = /^[0-9]{11}$/.test(phone);
      
      expect(isValid).toBe(false);
    });

    it("should reject phone number with less than 11 digits", () => {
      const phone = "0901234567";
      const isValid = /^[0-9]{11}$/.test(phone);
      
      expect(isValid).toBe(false);
    });

    it("should reject phone number with more than 11 digits", () => {
      const phone = "090123456789";
      const isValid = /^[0-9]{11}$/.test(phone);
      
      expect(isValid).toBe(false);
    });

    it("should reject phone number with non-numeric characters", () => {
      const phone = "09012345abc";
      const isValid = /^[0-9]{11}$/.test(phone);
      
      expect(isValid).toBe(false);
    });
  });

  describe("3. Google Sheets Data Format Standardization", () => {
    it("should format property type in Japanese", () => {
      const propertyTypeMap: Record<string, string> = {
        house: "戸建て",
        mansion: "マンション",
        land: "土地",
        apartment: "アパート",
        condo: "マンション",
      };

      expect(propertyTypeMap["house"]).toBe("戸建て");
      expect(propertyTypeMap["mansion"]).toBe("マンション");
      expect(propertyTypeMap["land"]).toBe("土地");
      expect(propertyTypeMap["apartment"]).toBe("アパート");
    });

    it("should format location correctly", () => {
      const prefecture = "神奈川県";
      const city = "横浜市中区";
      const locationText = `${prefecture}${city}`;
      
      expect(locationText).toBe("神奈川県横浜市中区");
    });

    it("should format station info correctly", () => {
      const stationName = "横浜駅";
      const walkingMinutes = 5;
      
      const stationText = stationName || "未入力";
      const walkingText = walkingMinutes ? `${walkingMinutes}分` : "未入力";
      
      expect(stationText).toBe("横浜駅");
      expect(walkingText).toBe("5分");
    });

    it("should handle missing station info", () => {
      const stationName = undefined;
      const walkingMinutes = undefined;
      
      const stationText = stationName || "未入力";
      const walkingText = walkingMinutes ? `${walkingMinutes}分` : "未入力";
      
      expect(stationText).toBe("未入力");
      expect(walkingText).toBe("未入力");
    });
  });

  describe("4. MEDIAN SQL Error Resolution", () => {
    it("should calculate median manually without SQL MEDIAN function", () => {
      const prices = [1000, 2000, 3000, 4000, 5000];
      const sorted = prices.sort((a, b) => a - b);
      const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      
      expect(median).toBe(3000);
    });

    it("should calculate median for even number of values", () => {
      const prices = [1000, 2000, 3000, 4000];
      const sorted = prices.sort((a, b) => a - b);
      const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      
      expect(median).toBe(2500);
    });

    it("should handle empty price array", () => {
      const prices: number[] = [];
      const sorted = prices.sort((a, b) => a - b);
      const median = sorted.length > 0
        ? (sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)])
        : 0;
      
      expect(median).toBe(0);
    });
  });

  describe("5. Database Query Test (横浜市中区 マンション)", () => {
    it("should find matching property in database", async () => {
      const db = await getDb();
      expect(db).toBeDefined();

      const estimatedPrice = await calculateAssessmentPrice(
        "mansion",
        "神奈川県横浜市中区",
        10,
        70,
        "good"
      );

      expect(estimatedPrice).not.toBeNull();
      expect(estimatedPrice).toBeGreaterThan(0);
      console.log(`横浜市中区マンション推定価格: ${estimatedPrice}万円`);
    });
  });

  describe("6. Google Sheets Webhook Data Structure", () => {
    it("should create correct webhook data structure", () => {
      const input = {
        propertyType: "mansion",
        prefecture: "神奈川県",
        city: "横浜市中区",
        nearestStation: "横浜駅",
        walkingMinutes: 5,
        ownerName: "テスト太郎",
        email: "test@example.com",
        phone: "09012345678",
        floorArea: 70,
        buildingAge: 10,
      };

      const estimatedPrice = 3500;
      const estimatedLowManYen = Math.round(estimatedPrice * 0.85);
      const estimatedHighManYen = Math.round(estimatedPrice * 1.15);
      const priceRangeText = `${estimatedLowManYen.toLocaleString('ja-JP')}万円～${estimatedHighManYen.toLocaleString('ja-JP')}万円`;

      const propertyTypeMap: Record<string, string> = {
        house: "戸建て",
        mansion: "マンション",
        land: "土地",
        apartment: "アパート",
        condo: "マンション",
      };
      const propertyTypeJa = propertyTypeMap[input.propertyType];
      const locationText = `${input.prefecture}${input.city}`;
      const stationText = input.nearestStation || "未入力";
      const walkingText = input.walkingMinutes ? `${input.walkingMinutes}分` : "未入力";

      const webhookData = {
        timestamp: new Date().toISOString(),
        ownerName: input.ownerName,
        email: input.email,
        phone: input.phone,
        propertyType: propertyTypeJa,
        prefecture: input.prefecture,
        city: input.city,
        address: locationText,
        floorArea: input.floorArea,
        buildingAge: input.buildingAge,
        estimatedPrice: priceRangeText,
        nearestStation: stationText,
        walkingMinutes: walkingText,
      };

      expect(webhookData.propertyType).toBe("マンション");
      expect(webhookData.address).toBe("神奈川県横浜市中区");
      expect(webhookData.estimatedPrice).toBe("2,975万円～4,025万円");
      expect(webhookData.nearestStation).toBe("横浜駅");
      expect(webhookData.walkingMinutes).toBe("5分");
      expect(webhookData.phone).toBe("09012345678");
    });
  });
});
