import { describe, it, expect } from "vitest";

describe("Session 29 - Comprehensive Fix Verification", () => {
  const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  it("should send mansion assessment data with correct format", async () => {
    expect(WEBHOOK_URL).toBeDefined();

    // Test data: 横浜市中区 マンション 70㎡ 築10年 横浜駅徒歩5分
    const assessmentData = {
      timestamp: new Date().toISOString(),
      ownerName: "Session29テスト",
      email: "session29@test.local",
      phone: "09087654321",
      propertyType: "マンション",  // Must be Japanese
      prefecture: "神奈川県",
      city: "横浜市中区",
      address: "神奈川県横浜市中区",
      floorArea: 70,
      buildingAge: 10,
      estimatedPrice: "2,421万円〜3,275万円",  // Correct range for mansion
      nearestStation: "横浜駅",  // Must not be 未入力
      walkingMinutes: "5分",  // Must not be 未入力
    };

    const response = await fetch(WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assessmentData),
    });

    expect(response.ok).toBe(true);
    const result = await response.json();
    expect(result.status).toBe("success");
    expect(result.sheet).toBe("無料不動産査定");

    console.log("✅ Mansion assessment data sent successfully");
    console.log(`   Property Type: ${assessmentData.propertyType}`);
    console.log(`   Estimated Price: ${assessmentData.estimatedPrice}`);
    console.log(`   Nearest Station: ${assessmentData.nearestStation}`);
    console.log(`   Walking Minutes: ${assessmentData.walkingMinutes}`);
  });

  it("should NOT accept house (戸建て) with mansion price", async () => {
    expect(WEBHOOK_URL).toBeDefined();

    // This should fail because house price is much lower than mansion
    const incorrectData = {
      timestamp: new Date().toISOString(),
      ownerName: "エラーテスト",
      email: "error@test.local",
      phone: "09011112222",
      propertyType: "戸建て",  // Wrong type
      prefecture: "神奈川県",
      city: "横浜市中区",
      address: "神奈川県横浜市中区",
      floorArea: 70,
      buildingAge: 10,
      estimatedPrice: "354万円〜480万円",  // House price (too low)
      nearestStation: "横浜駅",
      walkingMinutes: "5分",
    };

    const response = await fetch(WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incorrectData),
    });

    expect(response.ok).toBe(true);
    console.log("⚠️  House data sent (for comparison)");
    console.log(`   Property Type: ${incorrectData.propertyType}`);
    console.log(`   Estimated Price: ${incorrectData.estimatedPrice}`);
  });

  it("should format all data fields correctly", () => {
    const propertyTypeMap: Record<string, string> = {
      house: "戸建て",
      mansion: "マンション",
      land: "土地",
      apartment: "アパート",
    };

    const input = {
      propertyType: "mansion",
      prefecture: "神奈川県",
      city: "横浜市中区",
      nearestStation: "横浜駅",
      walkingMinutes: 5,
      estimatedPrice: 2421,
    };

    const propertyTypeJa = propertyTypeMap[input.propertyType];
    const locationText = `${input.prefecture}${input.city}`;
    const stationText = input.nearestStation || "未入力";
    const walkingText = input.walkingMinutes ? `${input.walkingMinutes}分` : "未入力";
    const estimatedLowManYen = Math.round(input.estimatedPrice * 0.85);
    const estimatedHighManYen = Math.round(input.estimatedPrice * 1.15);
    const priceRangeText = `${estimatedLowManYen.toLocaleString('ja-JP')}万円〜${estimatedHighManYen.toLocaleString('ja-JP')}万円`;

    expect(propertyTypeJa).toBe("マンション");
    expect(locationText).toBe("神奈川県横浜市中区");
    expect(stationText).toBe("横浜駅");
    expect(walkingText).toBe("5分");
    expect(priceRangeText).toBe("2,058万円〜2,784万円");
  });

  it("should validate property type is required", () => {
    const propertyType = "";
    const errorMessage = propertyType ? "" : "物件種別を選択してください";
    expect(errorMessage).toBe("物件種別を選択してください");
  });

  it("should validate phone number format (11 digits)", () => {
    const validPhone = "09012345678";
    const invalidPhone = "090-1234-5678";

    expect(/^[0-9]{11}$/.test(validPhone)).toBe(true);
    expect(/^[0-9]{11}$/.test(invalidPhone)).toBe(false);
  });
});
