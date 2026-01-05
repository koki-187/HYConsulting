import { describe, it, expect } from "vitest";
import { calculateAssessmentPrice } from "./db";

describe("Price Calculation Debug - 354万円 Error", () => {
  it("should calculate correct price for 横浜市中区 mansion 70㎡ 10 years", async () => {
    const propertyType = "mansion";
    const location = "神奈川県横浜市中区 (横浜駅徒歩5分)";
    const buildingAge = 10;
    const floorArea = 70;
    const condition = "fair";

    const estimatedPrice = await calculateAssessmentPrice(
      propertyType,
      location,
      buildingAge,
      floorArea,
      condition
    );

    console.log("=== Price Calculation Debug ===");
    console.log(`Property Type: ${propertyType}`);
    console.log(`Location: ${location}`);
    console.log(`Building Age: ${buildingAge} years`);
    console.log(`Floor Area: ${floorArea} ㎡`);
    console.log(`Condition: ${condition}`);
    console.log(`Estimated Price: ${estimatedPrice}万円`);
    console.log("===============================");

    expect(estimatedPrice).toBeGreaterThan(2000); // Should be > 2000万円
    expect(estimatedPrice).toBeLessThan(5000); // Should be < 5000万円
  });

  it("should calculate correct price for house (戸建て)", async () => {
    const propertyType = "house";
    const location = "神奈川県横浜市中区";
    const buildingAge = 10;
    const floorArea = 70;
    const condition = "fair";

    const estimatedPrice = await calculateAssessmentPrice(
      propertyType,
      location,
      buildingAge,
      floorArea,
      condition
    );

    console.log("=== House Price Calculation ===");
    console.log(`Property Type: ${propertyType}`);
    console.log(`Estimated Price: ${estimatedPrice}万円`);
    console.log("===============================");

    expect(estimatedPrice).toBeDefined();
  });
});
