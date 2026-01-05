import { describe, it, expect } from "vitest";
import { calculateAssessment } from "./assessment";

describe("Assessment 10-Pattern Optimization Tests", () => {
  // Pattern 1: Small apartment - Yokohama Nishi-ku, 40sqm, built 2020
  it("Pattern 1: Small apartment - Compact urban property", async () => {
    const result = await calculateAssessment({
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "マンション",
      area: 40,
      buildingYear: 2020,
      stationDistance: 5,
    });
    
    expect(result).toBeDefined();
    expect(result.estimatedPrice).toBeGreaterThan(0);
    console.log("✓ Pattern 1 - Small apartment:", result.estimatedPrice);
  });

  // Pattern 2: Mid-range house - Yokohama Nishi-ku, 100sqm, built 2005
  it("Pattern 2: Mid-range house - Average suburban property", async () => {
    const result = await calculateAssessment({
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "一戸建て",
      area: 100,
      buildingYear: 2005,
      stationDistance: 12,
    });
    
    expect(result).toBeDefined();
    expect(result.estimatedPrice).toBeGreaterThan(0);
    console.log("✓ Pattern 2 - Mid-range house:", result.estimatedPrice);
  });

  // Pattern 3: Larger house - Yokohama Nishi-ku, 150sqm, built 2000
  it("Pattern 3: Larger house - Spacious property", async () => {
    const result = await calculateAssessment({
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "一戸建て",
      area: 150,
      buildingYear: 2000,
      stationDistance: 15,
    });
    
    expect(result).toBeDefined();
    expect(result.estimatedPrice).toBeGreaterThan(0);
    console.log("✓ Pattern 3 - Larger house:", result.estimatedPrice);
  });

  // Pattern 4: Old building - Yokohama Nishi-ku, 80sqm, built 1985
  it("Pattern 4: Old building - Depreciation test", async () => {
    const result = await calculateAssessment({
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "マンション",
      area: 80,
      buildingYear: 1985,
      stationDistance: 8,
    });
    
    expect(result).toBeDefined();
    expect(result.ageAdjustment).toBeLessThan(50);
    console.log("✓ Pattern 4 - Old building:", result.estimatedPrice, "Age adjustment:", result.ageAdjustment);
  });

  // Pattern 5: Very old property - Yokohama Nishi-ku, 120sqm, built 1975
  it("Pattern 5: Very old property - Significant depreciation", async () => {
    const result = await calculateAssessment({
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "一戸建て",
      area: 120,
      buildingYear: 1975,
      stationDistance: 18,
    });
    
    expect(result).toBeDefined();
    expect(result.ageAdjustment).toBeLessThan(30);
    console.log("✓ Pattern 5 - Very old property:", result.estimatedPrice, "Age adjustment:", result.ageAdjustment);
  });

  // Pattern 6: New apartment - Yokohama Nishi-ku, 60sqm, built 2022
  it("Pattern 6: New apartment - Recent construction", async () => {
    const result = await calculateAssessment({
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "マンション",
      area: 60,
      buildingYear: 2022,
      stationDistance: 3,
    });
    
    expect(result).toBeDefined();
    expect(result.estimatedPrice).toBeGreaterThan(0);
    console.log("✓ Pattern 6 - New apartment:", result.estimatedPrice);
  });

  // Pattern 7: Close to station - Yokohama Nishi-ku, 70sqm, built 2015
  it("Pattern 7: Close to station - Premium location", async () => {
    const result = await calculateAssessment({
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "マンション",
      area: 70,
      buildingYear: 2015,
      stationDistance: 2,
    });
    
    expect(result).toBeDefined();
    expect(result.stationDistanceAdjustment).toBeGreaterThan(100);
    console.log("✓ Pattern 7 - Close to station:", result.estimatedPrice, "Station adjustment:", result.stationDistanceAdjustment);
  });

  // Pattern 8: Far from station - Yokohama Nishi-ku, 200sqm, built 2010
  it("Pattern 8: Far from station - Distance penalty", async () => {
    const result = await calculateAssessment({
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "一戸建て",
      area: 200,
      buildingYear: 2010,
      stationDistance: 30,
    });
    
    expect(result).toBeDefined();
    expect(result.stationDistanceAdjustment).toBeLessThan(100);
    console.log("✓ Pattern 8 - Far from station:", result.estimatedPrice, "Station adjustment:", result.stationDistanceAdjustment);
  });

  // Pattern 9: Large land - Yokohama Nishi-ku, 250sqm, built 2008
  it("Pattern 9: Large land - Area premium", async () => {
    const result = await calculateAssessment({
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "一戸建て",
      area: 250,
      buildingYear: 2008,
      stationDistance: 20,
    });
    
    expect(result).toBeDefined();
    expect(result.areaAdjustment).toBeGreaterThan(100);
    console.log("✓ Pattern 9 - Large land:", result.estimatedPrice, "Area adjustment:", result.areaAdjustment);
  });

  // Pattern 10: Inheritance property - Yokohama Nishi-ku, 180sqm, built 1990
  it("Pattern 10: Inheritance property - Mixed factors", async () => {
    const result = await calculateAssessment({
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "一戸建て",
      area: 180,
      buildingYear: 1990,
      stationDistance: 25,
    });
    
    expect(result).toBeDefined();
    expect(result.ageAdjustment).toBeLessThan(50);
    console.log("✓ Pattern 10 - Inheritance property:", result.estimatedPrice, "Age adjustment:", result.ageAdjustment);
  });
}, { timeout: 30000 });
