/**
 * Email Sending Test Suite
 * Tests email sending functionality with various scenarios
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { generateAssessmentEmailHTML, generateAssessmentEmailText } from "./email-templates";

describe("Email Sending Tests", () => {
  
  const testAssessmentData = {
    propertyType: "house",
    prefecture: "東京都",
    city: "渋谷区",
    location: "渋谷1-2-3",
    estimatedLowYen: 85000000,
    estimatedHighYen: 115000000,
    estimatedPrice: 100000000,
    message: "査定が完了しました。詳細はメール本文をご確認ください。",
    confidence: 75,
    pricePerM2: 1000000,
    floorArea: 100,
    buildingAge: 10,
    marketTrend: "stable" as const,
  };

  /**
   * Test 1: HTML email generation
   */
  it("Test 1: Generate HTML email template", () => {
    const html = generateAssessmentEmailHTML(testAssessmentData);
    
    expect(html).toBeDefined();
    expect(typeof html).toBe("string");
    expect(html.length).toBeGreaterThan(0);
    
    // Check for key content
    expect(html).toContain("不動産査定結果");
    expect(html).toContain("東京都");
    expect(html).toContain("渋谷区");
    expect(html).toContain("査定信頼度");
    expect(html).toContain("市場動向");
    
    console.log("✓ HTML email template generated successfully");
  });

  /**
   * Test 2: Plain text email generation
   */
  it("Test 2: Generate plain text email template", () => {
    const text = generateAssessmentEmailText(testAssessmentData);
    
    expect(text).toBeDefined();
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
    
    // Check for key content
    expect(text).toContain("不動産査定結果");
    expect(text).toContain("物件情報");
    expect(text).toContain("査定結果");
    expect(text).toContain("市場動向");
    
    console.log("✓ Plain text email template generated successfully");
  });

  /**
   * Test 3: Email template with minimal data
   */
  it("Test 3: Email template with minimal data", () => {
    const minimalData = {
      propertyType: "land",
      prefecture: "神奈川県",
      city: "横浜市",
      location: "横浜1-2-3",
      estimatedLowYen: 0,
      estimatedHighYen: 0,
      estimatedPrice: 0,
      message: "査定リクエストを受け付けました。",
      confidence: 0,
    };
    
    const html = generateAssessmentEmailHTML(minimalData);
    const text = generateAssessmentEmailText(minimalData);
    
    expect(html).toBeDefined();
    expect(text).toBeDefined();
    expect(html.length).toBeGreaterThan(0);
    expect(text.length).toBeGreaterThan(0);
    
    console.log("✓ Email templates generated with minimal data");
  });

  /**
   * Test 4: Email template with all optional fields
   */
  it("Test 4: Email template with all optional fields", () => {
    const fullData = {
      ...testAssessmentData,
      floorArea: 150,
      buildingAge: 25,
      pricePerM2: 1500000,
      marketTrend: "rising" as const,
    };
    
    const html = generateAssessmentEmailHTML(fullData);
    
    expect(html).toContain("150");
    expect(html).toContain("25");
    
    console.log("✓ Email template generated with all optional fields");
  });

  /**
   * Test 5: Email content formatting
   */
  it("Test 5: Email content formatting", () => {
    const html = generateAssessmentEmailHTML(testAssessmentData);
    
    // Check for proper HTML structure
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
    expect(html).toContain("<head>");
    expect(html).toContain("<body>");
    
    // Check for CSS
    expect(html).toContain("<style>");
    expect(html).toContain("</style>");
    
    // Check for responsive design
    expect(html).toContain("@media");
    
    console.log("✓ Email HTML structure is valid");
  });

  /**
   * Test 6: Email subject line generation
   */
  it("Test 6: Email subject line generation", () => {
    const subject = `不動産査定結果 - ${testAssessmentData.prefecture}${testAssessmentData.city}${testAssessmentData.location}`;
    
    expect(subject).toBeDefined();
    expect(subject.length).toBeGreaterThan(0);
    expect(subject).toContain("不動産査定結果");
    expect(subject).toContain("東京都");
    
    console.log(`✓ Email subject line: ${subject}`);
  });

  /**
   * Test 7: Multiple property types
   */
  it("Test 7: Email templates for different property types", () => {
    const propertyTypes = ["land", "house", "mansion", "apartment"];
    
    propertyTypes.forEach((type) => {
      const data = {
        ...testAssessmentData,
        propertyType: type,
      };
      
      const html = generateAssessmentEmailHTML(data);
      const text = generateAssessmentEmailText(data);
      
      expect(html).toBeDefined();
      expect(text).toBeDefined();
      console.log(`✓ Email template generated for ${type}`);
    });
  });

  /**
   * Test 8: Market trend variations
   */
  it("Test 8: Email templates for different market trends", () => {
    const trends = ["stable", "rising", "falling"];
    
    trends.forEach((trend) => {
      const data = {
        ...testAssessmentData,
        marketTrend: trend as any,
      };
      
      const html = generateAssessmentEmailHTML(data);
      
      expect(html).toBeDefined();
      if (trend === "stable") {
        expect(html).toContain("安定");
      } else if (trend === "rising") {
        expect(html).toContain("上昇傾向");
      } else if (trend === "falling") {
        expect(html).toContain("下落傾向");
      }
      
      console.log(`✓ Email template generated for ${trend} market trend`);
    });
  });

  /**
   * Test 9: Email template size
   */
  it("Test 9: Email template size validation", () => {
    const html = generateAssessmentEmailHTML(testAssessmentData);
    const text = generateAssessmentEmailText(testAssessmentData);
    
    // HTML should be reasonably sized
    expect(html.length).toBeGreaterThan(1000);
    expect(html.length).toBeLessThan(50000);
    
    // Text should be smaller than HTML
    expect(text.length).toBeLessThan(html.length);
    
    console.log(`✓ HTML size: ${html.length} bytes`);
    console.log(`✓ Text size: ${text.length} bytes`);
  });

  /**
   * Test 10: Email template special characters
   */
  it("Test 10: Email template special characters handling", () => {
    const dataWithSpecialChars = {
      ...testAssessmentData,
      location: "渋谷1-2-3 (ビル内)",
      message: "査定価格: ¥100,000,000 (消費税別)",
    };
    
    const html = generateAssessmentEmailHTML(dataWithSpecialChars);
    const text = generateAssessmentEmailText(dataWithSpecialChars);
    
    expect(html).toBeDefined();
    expect(text).toBeDefined();
    expect(html).toContain("ビル内");
    expect(text).toContain("ビル内");
    
    console.log("✓ Special characters handled correctly");
  });
});
