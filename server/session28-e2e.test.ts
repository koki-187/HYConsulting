import { describe, it, expect } from "vitest";

describe("Session 28 - End-to-End Integration Test", () => {
  const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  it("should send complete assessment data to Google Sheets", async () => {
    expect(WEBHOOK_URL).toBeDefined();
    expect(WEBHOOK_URL).toContain("script.google.com");

    // Test data: 横浜市中区 マンション (テストタロウデータ)
    const assessmentData = {
      timestamp: new Date().toISOString(),
      ownerName: "テスト太郎",
      email: "test@example.com",
      phone: "09012345678",
      propertyType: "マンション",
      prefecture: "神奈川県",
      city: "横浜市中区",
      address: "神奈川県横浜市中区 (横浜駅徒歩5分)",
      floorArea: 70,
      buildingAge: 10,
      estimatedPrice: "2,421万円〜3,275万円",
      nearestStation: "横浜駅",
      walkingMinutes: "5分",
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

    console.log("✅ Assessment data sent successfully to Google Sheets");
    console.log(`   Sheet: ${result.sheet}`);
    console.log(`   Data: ${assessmentData.ownerName}, ${assessmentData.propertyType}, ${assessmentData.estimatedPrice}`);
  });

  it("should send contact form data to Google Sheets", async () => {
    expect(WEBHOOK_URL).toBeDefined();

    // Test data: 問い合わせフォーム
    const contactData = {
      timestamp: new Date().toISOString(),
      name: "問い合わせ太郎",
      email: "contact@example.com",
      phone: "08012345678",
      message: "不動産の売却について相談したいです。",
    };

    const response = await fetch(WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    expect(response.ok).toBe(true);
    const result = await response.json();
    expect(result.status).toBe("success");
    expect(result.sheet).toBe("問い合わせフォームデータ");

    console.log("✅ Contact form data sent successfully to Google Sheets");
    console.log(`   Sheet: ${result.sheet}`);
    console.log(`   Data: ${contactData.name}, ${contactData.message}`);
  });

  it("should validate phone number format (11 digits)", () => {
    const validPhone = "09012345678";
    const invalidPhone1 = "090-1234-5678";
    const invalidPhone2 = "0901234567";
    const invalidPhone3 = "090123456789";

    expect(/^[0-9]{11}$/.test(validPhone)).toBe(true);
    expect(/^[0-9]{11}$/.test(invalidPhone1)).toBe(false);
    expect(/^[0-9]{11}$/.test(invalidPhone2)).toBe(false);
    expect(/^[0-9]{11}$/.test(invalidPhone3)).toBe(false);
  });

  it("should format price range correctly", () => {
    const estimatedPrice = 2848; // 2,848万円
    const estimatedLowManYen = Math.round(estimatedPrice * 0.85);
    const estimatedHighManYen = Math.round(estimatedPrice * 1.15);
    const priceRangeText = `${estimatedLowManYen.toLocaleString('ja-JP')}万円〜${estimatedHighManYen.toLocaleString('ja-JP')}万円`;

    expect(priceRangeText).toBe("2,421万円〜3,275万円");
  });

  it("should format property data for Google Sheets", () => {
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
    };

    const propertyTypeJa = propertyTypeMap[input.propertyType];
    const locationText = `${input.prefecture}${input.city}`;
    const stationText = input.nearestStation || "未入力";
    const walkingText = input.walkingMinutes ? `${input.walkingMinutes}分` : "未入力";

    expect(propertyTypeJa).toBe("マンション");
    expect(locationText).toBe("神奈川県横浜市中区");
    expect(stationText).toBe("横浜駅");
    expect(walkingText).toBe("5分");
  });
});
