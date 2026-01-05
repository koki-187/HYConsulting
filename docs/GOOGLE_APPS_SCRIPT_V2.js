// Google Apps Script - Version 2 (ヘッダー最適化版)
// 設定
var SHEET_NAME = "査定依頼データ";
var NOTIFICATION_EMAIL = "navigator-187@docomo.ne.jp";

// POST リクエストを受け取る関数
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // シートが存在しない場合は作成し、わかりやすいヘッダーを追加
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // ヘッダー行を追加（日本語でわかりやすく）
      var headers = [
        "受付日時",
        "お名前",
        "メールアドレス",
        "電話番号",
        "物件種別",
        "都道府県",
        "市区町村",
        "所在地（番地）",
        "床面積（㎡）",
        "築年数（年）",
        "推定価格（万円）",
        "最寄り駅",
        "駅徒歩（分）"
      ];
      
      sheet.appendRow(headers);
      
      // ヘッダー行のスタイル設定
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#4285F4");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
    }
    
    // データ行を追加
    sheet.appendRow([
      new Date().toLocaleString("ja-JP"),
      data.ownerName || "",
      data.email || "",
      data.phone || "",
      data.propertyType || "",
      data.prefecture || "",
      data.city || "",
      data.location || "",
      data.floorArea || "",
      data.buildingAge || "",
      data.estimatedPrice || "",
      data.nearestStation || "",
      data.walkingMinutes || ""
    ]);
    
    // メール通知を送信
    sendNotificationEmail(data);
    
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

// メール通知関数
function sendNotificationEmail(data) {
  var subject = "[新規査定依頼] " + (data.ownerName || "匿名") + "様から査定依頼が届きました";
  
  var body = "新規の不動産査定依頼が届きました。\n\n";
  body += "【お客様情報】\n";
  body += "お名前: " + (data.ownerName || "未入力") + "\n";
  body += "メールアドレス: " + (data.email || "未入力") + "\n";
  body += "電話番号: " + (data.phone || "未入力") + "\n\n";
  body += "【物件情報】\n";
  body += "物件種別: " + (data.propertyType || "未入力") + "\n";
  body += "所在地: " + (data.prefecture || "") + (data.city || "") + (data.location || "") + "\n";
  body += "床面積: " + (data.floorArea || "未入力") + "㎡\n";
  body += "築年数: " + (data.buildingAge || "未入力") + "年\n";
  body += "最寄り駅: " + (data.nearestStation || "未入力") + "（徒歩" + (data.walkingMinutes || "未入力") + "分）\n\n";
  body += "【査定結果】\n";
  body += "推定価格: " + (data.estimatedPrice || "未入力") + "万円\n\n";
  body += "---\n";
  body += "Google スプレッドシートで詳細を確認してください。\n";
  body += "https://docs.google.com/spreadsheets/d/1lBNwObU7s7aF6zhXn7BKXNPWCM3OUR5xu986KIEo-xo/edit";
  
  try {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      body: body
    });
  } catch (error) {
    Logger.log("Email error: " + error.toString());
  }
}
