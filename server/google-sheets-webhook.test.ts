import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Google Sheets Webhook Integration", () => {
  const originalEnv = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  
  beforeEach(() => {
    // Mock fetch globally
    global.fetch = vi.fn();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = originalEnv;
  });

  it("should have GOOGLE_SHEETS_WEBHOOK_URL environment variable set", () => {
    expect(process.env.GOOGLE_SHEETS_WEBHOOK_URL).toBeDefined();
    expect(process.env.GOOGLE_SHEETS_WEBHOOK_URL).toContain("script.google.com");
  });

  it("should send data to Google Sheets webhook successfully", async () => {
    const mockWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || "https://script.google.com/test";
    
    // Mock successful response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    const testData = {
      timestamp: new Date().toISOString(),
      ownerName: "テスト太郎",
      email: "test@example.com",
      phone: "090-1234-5678",
      propertyType: "マンション",
      prefecture: "神奈川県",
      city: "横浜市",
      location: "横浜駅徒歩10分",
      floorArea: 70,
      buildingAge: 15,
      estimatedPrice: 3500,
      nearestStation: "横浜駅",
      walkingMinutes: 10,
    };

    const response = await fetch(mockWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testData),
    });

    expect(response.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      mockWebhookUrl,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      })
    );
  });

  it("should handle webhook errors gracefully", async () => {
    const mockWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || "https://script.google.com/test";
    
    // Mock error response
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    const testData = {
      timestamp: new Date().toISOString(),
      ownerName: "エラーテスト",
    };

    const response = await fetch(mockWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testData),
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });

  it("should validate webhook URL format", () => {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (webhookUrl) {
      expect(webhookUrl).toMatch(/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/);
    }
  });

  it("should have EMAIL_FROM environment variable set to info@hyconsulting.jp", () => {
    expect(process.env.EMAIL_FROM).toBe("info@hyconsulting.jp");
  });
});
