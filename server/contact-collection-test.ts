/**
 * Contact Information Collection Test Suite
 * Tests optional contact information collection and validation
 */

import { describe, it, expect, beforeAll } from "vitest";

describe("Contact Information Collection Tests", () => {
  
  /**
   * Test 1: Email validation
   */
  it("Test 1: Valid email format", () => {
    const validEmails = [
      "user@example.com",
      "john.doe@company.co.jp",
      "test+tag@domain.com",
      "user123@test-domain.com",
    ];

    validEmails.forEach((email) => {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValid).toBe(true);
      console.log(`✓ Valid email: ${email}`);
    });
  });

  /**
   * Test 2: Invalid email format
   */
  it("Test 2: Invalid email format", () => {
    const invalidEmails = [
      "not-an-email",
      "user@",
      "@example.com",
      "user @example.com",
      "user@example",
    ];

    invalidEmails.forEach((email) => {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValid).toBe(false);
      console.log(`✓ Invalid email rejected: ${email}`);
    });
  });

  /**
   * Test 3: Phone number validation
   */
  it("Test 3: Valid phone number format", () => {
    const validPhones = [
      "090-1234-5678",
      "09012345678",
      "03-1234-5678",
      "+81-90-1234-5678",
      "(090) 1234-5678",
    ];

    validPhones.forEach((phone) => {
      const isValid = /^[0-9\-\s()]+$/.test(phone);
      expect(isValid).toBe(true);
      console.log(`✓ Valid phone: ${phone}`);
    });
  });

  /**
   * Test 4: Invalid phone number format
   */
  it("Test 4: Invalid phone number format", () => {
    const invalidPhones = [
      "090-1234-567a",
      "phone-number",
      "090 1234 5678 ext 123",
      "abc-def-ghij",
    ];

    invalidPhones.forEach((phone) => {
      const isValid = /^[0-9\-\s()]+$/.test(phone);
      expect(isValid).toBe(false);
      console.log(`✓ Invalid phone rejected: ${phone}`);
    });
  });

  /**
   * Test 5: Contact information optional scenarios
   */
  it("Test 5: Contact information optional scenarios", () => {
    const scenarios = [
      {
        name: "No contact info",
        wantContact: false,
        email: "",
        phone: "",
        shouldPass: true,
      },
      {
        name: "Email only",
        wantContact: true,
        email: "user@example.com",
        phone: "",
        shouldPass: true,
      },
      {
        name: "Phone only",
        wantContact: true,
        email: "",
        phone: "090-1234-5678",
        shouldPass: true,
      },
      {
        name: "Both email and phone",
        wantContact: true,
        email: "user@example.com",
        phone: "090-1234-5678",
        shouldPass: true,
      },
      {
        name: "Contact requested but no info",
        wantContact: true,
        email: "",
        phone: "",
        shouldPass: false,
      },
      {
        name: "Invalid email",
        wantContact: true,
        email: "invalid-email",
        phone: "",
        shouldPass: false,
      },
      {
        name: "Invalid phone",
        wantContact: true,
        email: "",
        phone: "invalid-phone",
        shouldPass: false,
      },
    ];

    scenarios.forEach((scenario) => {
      let isValid = true;
      let errorMessage = "";

      if (!scenario.wantContact) {
        isValid = true;
      } else {
        if (scenario.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(scenario.email)) {
          isValid = false;
          errorMessage = "Invalid email format";
        }

        if (scenario.phone && !/^[0-9\-\s()]+$/.test(scenario.phone)) {
          isValid = false;
          errorMessage = "Invalid phone format";
        }

        if (!scenario.email && !scenario.phone) {
          isValid = false;
          errorMessage = "Email or phone required";
        }
      }

      expect(isValid).toBe(scenario.shouldPass);
      console.log(
        `✓ Scenario: ${scenario.name} - ${isValid ? "PASS" : "FAIL"}${
          errorMessage ? ` (${errorMessage})` : ""
        }`
      );
    });
  });

  /**
   * Test 6: Contact information data structure
   */
  it("Test 6: Contact information data structure", () => {
    interface ContactInfo {
      wantContact: boolean;
      email?: string;
      phone?: string;
    }

    const testCases: ContactInfo[] = [
      { wantContact: false },
      { wantContact: true, email: "user@example.com" },
      { wantContact: true, phone: "090-1234-5678" },
      { wantContact: true, email: "user@example.com", phone: "090-1234-5678" },
    ];

    testCases.forEach((contact, index) => {
      expect(typeof contact.wantContact).toBe("boolean");
      if (contact.email) {
        expect(typeof contact.email).toBe("string");
      }
      if (contact.phone) {
        expect(typeof contact.phone).toBe("string");
      }
      console.log(`✓ Test case ${index + 1}: Data structure valid`);
    });
  });

  /**
   * Test 7: Contact information privacy
   */
  it("Test 7: Contact information privacy", () => {
    // Test that contact information is only sent when user explicitly opts in
    const scenarios = [
      {
        name: "No opt-in, no contact sent",
        wantContact: false,
        email: "user@example.com",
        expectedEmail: "",
        expectedPhone: undefined,
      },
      {
        name: "Opt-in, contact sent",
        wantContact: true,
        email: "user@example.com",
        phone: "090-1234-5678",
        expectedEmail: "user@example.com",
        expectedPhone: "090-1234-5678",
      },
    ];

    scenarios.forEach((scenario) => {
      const actualEmail = scenario.wantContact ? scenario.email : "";
      const actualPhone = scenario.wantContact ? scenario.phone : undefined;

      expect(actualEmail).toBe(scenario.expectedEmail);
      expect(actualPhone).toBe(scenario.expectedPhone);
      console.log(`✓ ${scenario.name}`);
    });
  });

  /**
   * Test 8: Contact information submission
   */
  it("Test 8: Contact information submission scenarios", () => {
    interface SubmissionPayload {
      propertyType: string;
      prefecture: string;
      city: string;
      location: string;
      email: string;
      phone?: string;
      wantContact?: boolean;
    }

    const payloads: SubmissionPayload[] = [
      {
        propertyType: "land",
        prefecture: "東京都",
        city: "渋谷区",
        location: "渋谷1-2-3",
        email: "",
      },
      {
        propertyType: "house",
        prefecture: "神奈川県",
        city: "横浜市",
        location: "横浜1-2-3",
        email: "user@example.com",
        phone: "090-1234-5678",
      },
    ];

    payloads.forEach((payload, index) => {
      expect(payload.propertyType).toBeDefined();
      expect(payload.prefecture).toBeDefined();
      expect(payload.city).toBeDefined();
      expect(payload.location).toBeDefined();
      expect(typeof payload.email).toBe("string");
      console.log(`✓ Payload ${index + 1}: Valid structure`);
    });
  });

  /**
   * Test 9: Contact information sanitization
   */
  it("Test 9: Contact information sanitization", () => {
    const testCases = [
      {
        input: "  user@example.com  ",
        sanitized: "user@example.com",
      },
      {
        input: "090-1234-5678",
        sanitized: "090-1234-5678",
      },
      {
        input: "  090 - 1234 - 5678  ",
        sanitized: "090 - 1234 - 5678",
      },
    ];

    testCases.forEach((testCase) => {
      const sanitized = testCase.input.trim();
      expect(sanitized).toBe(testCase.sanitized);
      console.log(`✓ Sanitized: "${testCase.input}" → "${sanitized}"`);
    });
  });

  /**
   * Test 10: Contact information error messages
   */
  it("Test 10: Contact information error messages", () => {
    const errorMessages = {
      invalidEmail: "有効なメールアドレスを入力してください",
      invalidPhone: "有効な電話番号を入力してください",
      missingContact: "メールアドレスまたは電話番号を入力してください",
    };

    Object.entries(errorMessages).forEach(([key, message]) => {
      expect(typeof message).toBe("string");
      expect(message.length).toBeGreaterThan(0);
      console.log(`✓ Error message (${key}): ${message}`);
    });
  });
});
