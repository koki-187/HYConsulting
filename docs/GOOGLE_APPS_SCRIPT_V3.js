/**
 * Google Apps Script V3 - Dual Sheet Support
 * 
 * Features:
 * - Support for 2 sheets: "無料不動産査定" and "問い合わせフォームデータ"
 * - Automatic sheet detection based on data fields
 * - Email notifications to navigator-187@docomo.ne.jp
 * - Auto-reply emails from info@hyconsulting.jp
 * - Japanese headers for all columns
 * 
 * Setup:
 * 1. Create a new Google Sheets with 2 sheets:
 *    - Sheet 1: "無料不動産査定"
 *    - Sheet 2: "問い合わせフォームデータ"
 * 2. Deploy this script as a web app
 * 3. Set "Execute as: Me" and "Who has access: Anyone"
 * 4. Copy the deployment URL to GOOGLE_SHEETS_WEBHOOK_URL
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Determine which sheet to use based on data fields
    const isAssessmentForm = data.propertyType !== undefined;
    const sheetName = isAssessmentForm ? "無料不動産査定" : "問い合わせフォームデータ";
    
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }
    
    // Initialize headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      if (isAssessmentForm) {
        sheet.appendRow([
          "受付日時",
          "お名前",
          "メールアドレス",
          "電話番号",
          "物件種別",
          "都道府県",
          "市区町村",
          "所在地",
          "床面積（㎡）",
          "築年数（年）",
          "推定価格（万円）",
          "最寄り駅",
          "駅徒歩（分）"
        ]);
      } else {
        sheet.appendRow([
          "受付日時",
          "お名前",
          "メールアドレス",
          "電話番号",
          "お問い合わせ内容"
        ]);
      }
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4A90E2");
      headerRange.setFontColor("#FFFFFF");
    }
    
    // Prepare row data
    let rowData;
    if (isAssessmentForm) {
      rowData = [
        data.timestamp || new Date().toISOString(),
        data.ownerName || "",
        data.email || "",
        data.phone || "",
        data.propertyType || "",
        data.prefecture || "",
        data.city || "",
        data.address || "",
        data.floorArea || "",
        data.buildingAge || "",
        data.estimatedPrice || "",
        data.nearestStation || "",
        data.walkingMinutes || ""
      ];
    } else {
      rowData = [
        data.timestamp || new Date().toISOString(),
        data.name || "",
        data.email || "",
        data.phone || "",
        data.message || ""
      ];
    }
    
    // Append data to sheet
    sheet.appendRow(rowData);
    
    // Send notification email to admin
    try {
      const adminEmail = "navigator-187@docomo.ne.jp";
      const subject = isAssessmentForm 
        ? `【新規査定依頼】${data.propertyType} - ${data.prefecture}${data.city}`
        : `【新規お問い合わせ】${data.name}様より`;
      
      let body = `新しい${isAssessmentForm ? "査定依頼" : "お問い合わせ"}が届きました。\n\n`;
      body += `受付日時: ${data.timestamp || new Date().toISOString()}\n`;
      body += `お名前: ${data.name || data.ownerName || ""}\n`;
      body += `メールアドレス: ${data.email || ""}\n`;
      body += `電話番号: ${data.phone || ""}\n\n`;
      
      if (isAssessmentForm) {
        body += `物件種別: ${data.propertyType || ""}\n`;
        body += `所在地: ${data.address || ""}\n`;
        body += `推定価格: ${data.estimatedPrice || ""}\n`;
        body += `最寄り駅: ${data.nearestStation || ""}\n`;
        body += `駅徒歩: ${data.walkingMinutes || ""}\n`;
      } else {
        body += `お問い合わせ内容:\n${data.message || ""}\n`;
      }
      
      MailApp.sendEmail({
        to: adminEmail,
        subject: subject,
        body: body
      });
    } catch (emailError) {
      Logger.log("Failed to send admin notification email: " + emailError);
    }
    
    // Send auto-reply email to customer
    if (data.email) {
      try {
        const customerEmail = data.email;
        const subject = isAssessmentForm 
          ? "【HYコンサルティング】査定依頼を受け付けました"
          : "【HYコンサルティング】お問い合わせを受け付けました";
        
        let body = `${data.name || data.ownerName || "お客"}様\n\n`;
        body += `この度は、HYコンサルティングにお問い合わせいただき、誠にありがとうございます。\n\n`;
        
        if (isAssessmentForm) {
          body += `以下の内容で査定依頼を受け付けました。\n\n`;
          body += `物件種別: ${data.propertyType || ""}\n`;
          body += `所在地: ${data.address || ""}\n`;
          body += `推定価格: ${data.estimatedPrice || ""}\n\n`;
          body += `担当者より、2営業日以内にご連絡させていただきます。\n`;
        } else {
          body += `お問い合わせ内容を受け付けました。\n\n`;
          body += `担当者より、2営業日以内にご連絡させていただきます。\n`;
        }
        
        body += `\n今しばらくお待ちくださいませ。\n\n`;
        body += `────────────────────\n`;
        body += `HYコンサルティング\n`;
        body += `〒244-0003\n`;
        body += `神奈川県横浜市戸塚区戸塚町\n`;
        body += `TEL: 045-123-4567\n`;
        body += `Email: info@hyconsulting.jp\n`;
        body += `────────────────────\n`;
        
        MailApp.sendEmail({
          to: customerEmail,
          subject: subject,
          body: body,
          name: "HYコンサルティング"
        });
      } catch (emailError) {
        Logger.log("Failed to send auto-reply email: " + emailError);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data saved successfully",
      sheet: sheetName
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Error: " + error);
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "Google Apps Script V3 is running",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
