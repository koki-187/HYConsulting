/**
 * Email Templates for Assessment Results
 * Generates HTML email templates for sending assessment results to users
 */

export interface AssessmentEmailData {
  propertyType: string;
  prefecture: string;
  city: string;
  location: string;
  estimatedLowYen: number;
  estimatedHighYen: number;
  estimatedPrice: number;
  message: string;
  confidence: number;
  pricePerM2?: number;
  floorArea?: number;
  buildingAge?: number;
  marketTrend?: string;
}

/**
 * Generate HTML email template for assessment results
 */
export function generateAssessmentEmailHTML(data: AssessmentEmailData): string {
  const lowPrice = formatYen(data.estimatedLowYen);
  const highPrice = formatYen(data.estimatedHighYen);
  const estimatedPrice = formatYen(data.estimatedPrice * 10000);
  const pricePerM2 = data.pricePerM2 ? formatYen(data.pricePerM2) : "N/A";
  
  const propertyTypeLabel = getPropertyTypeLabel(data.propertyType);
  const marketTrendLabel = getMarketTrendLabel(data.marketTrend || "stable");
  const marketTrendColor = getMarketTrendColor(data.marketTrend || "stable");

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>不動産査定結果 - HY Consulting</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #0052CC 0%, #0066FF 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px 20px;
    }
    
    .greeting {
      font-size: 16px;
      margin-bottom: 30px;
      color: #333;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #0052CC;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #0052CC;
    }
    
    .property-info {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    .info-label {
      font-weight: bold;
      color: #666;
      min-width: 120px;
    }
    
    .info-value {
      color: #333;
      text-align: right;
      flex: 1;
    }
    
    .price-box {
      background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%);
      border-left: 4px solid #0052CC;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .price-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .price-range {
      font-size: 24px;
      font-weight: bold;
      color: #0052CC;
      margin-bottom: 10px;
    }
    
    .price-detail {
      font-size: 13px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .confidence-meter {
      margin-top: 15px;
      font-size: 12px;
    }
    
    .confidence-label {
      color: #666;
      margin-bottom: 5px;
    }
    
    .confidence-bar {
      background-color: #e0e0e0;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .confidence-fill {
      background: linear-gradient(90deg, #0052CC, #0066FF);
      height: 100%;
      border-radius: 4px;
    }
    
    .market-trend {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    
    .trend-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      color: white;
      margin-right: 10px;
    }
    
    .trend-stable {
      background-color: #4CAF50;
    }
    
    .trend-rising {
      background-color: #2196F3;
    }
    
    .trend-falling {
      background-color: #FF9800;
    }
    
    .message-box {
      background-color: #f0f4ff;
      border-left: 4px solid #0052CC;
      padding: 15px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.8;
      color: #333;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #0052CC 0%, #0066FF 100%);
      color: white;
      padding: 12px 30px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin-top: 20px;
      font-size: 14px;
    }
    
    .cta-button:hover {
      opacity: 0.9;
    }
    
    .footer {
      background-color: #f5f5f5;
      padding: 30px 20px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
    }
    
    .footer-links {
      margin-bottom: 15px;
    }
    
    .footer-links a {
      color: #0052CC;
      text-decoration: none;
      margin: 0 10px;
    }
    
    .footer-links a:hover {
      text-decoration: underline;
    }
    
    .disclaimer {
      font-size: 11px;
      color: #999;
      margin-top: 15px;
      line-height: 1.6;
    }
    
    @media (max-width: 600px) {
      .container {
        width: 100%;
        border-radius: 0;
      }
      
      .header {
        padding: 30px 15px;
      }
      
      .header h1 {
        font-size: 22px;
      }
      
      .content {
        padding: 25px 15px;
      }
      
      .info-row {
        flex-direction: column;
      }
      
      .info-label {
        margin-bottom: 5px;
      }
      
      .info-value {
        text-align: left;
      }
      
      .price-range {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🏠 不動産査定結果</h1>
      <p>HY Consulting - オンライン無料査定</p>
    </div>
    
    <!-- Content -->
    <div class="content">
      <!-- Greeting -->
      <div class="greeting">
        <p>いつもお世話になっております。</p>
        <p>ご依頼いただいた不動産の査定が完了いたしました。</p>
      </div>
      
      <!-- Property Information -->
      <div class="section">
        <div class="section-title">📍 物件情報</div>
        <div class="property-info">
          <div class="info-row">
            <span class="info-label">物件種別</span>
            <span class="info-value">${propertyTypeLabel}</span>
          </div>
          <div class="info-row">
            <span class="info-label">所在地</span>
            <span class="info-value">${data.prefecture}${data.city}${data.location}</span>
          </div>
          ${data.floorArea ? `
          <div class="info-row">
            <span class="info-label">面積</span>
            <span class="info-value">${data.floorArea.toLocaleString()} ㎡</span>
          </div>
          ` : ''}
          ${data.buildingAge ? `
          <div class="info-row">
            <span class="info-label">築年数</span>
            <span class="info-value">${data.buildingAge} 年</span>
          </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Valuation Results -->
      <div class="section">
        <div class="section-title">💰 査定結果</div>
        <div class="price-box">
          <div class="price-label">推定価格範囲</div>
          <div class="price-range">${lowPrice} ～ ${highPrice}</div>
          <div class="price-detail">推定価格: <strong>${estimatedPrice}</strong></div>
          ${data.pricePerM2 ? `<div class="price-detail">㎡単価: <strong>${pricePerM2}</strong></div>` : ''}
          
          <div class="confidence-meter">
            <div class="confidence-label">査定信頼度: ${data.confidence}%</div>
            <div class="confidence-bar">
              <div class="confidence-fill" style="width: ${data.confidence}%"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Market Trend -->
      <div class="section">
        <div class="section-title">📈 市場動向</div>
        <div class="market-trend">
          <span class="trend-badge trend-${data.marketTrend || 'stable'}">${marketTrendLabel}</span>
          <p style="margin-top: 10px; font-size: 13px; color: #666;">
            現在の市場は${marketTrendLabel}です。概算査定価格は最新の市場データに基づいています。
          </p>
        </div>
      </div>
      
      <!-- Assessment Message -->
      <div class="section">
        <div class="section-title">📝 査定コメント</div>
        <div class="message-box">
          ${data.message}
        </div>
      </div>
      
      <!-- CTA -->
      <div style="text-align: center;">
        <a href="https://hy-consulting.jp" class="cta-button">詳細情報を確認する</a>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-links">
        <a href="https://hy-consulting.jp">ホーム</a>
        <a href="https://hy-consulting.jp/service">サービス</a>
        <a href="https://hy-consulting.jp/contact">お問い合わせ</a>
      </div>
      
      <p>© 2026 HY Consulting. All rights reserved.</p>
      
      <div class="disclaimer">
        <p>このメールは自動送信されています。返信しないでください。</p>
        <p>本査定結果は参考値です。実際の価格は市場動向、物件の状態、取引条件などにより異なる場合があります。</p>
        <p>詳細な査定については、専門家へのご相談をお勧めします。</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate plain text email template for assessment results
 */
export function generateAssessmentEmailText(data: AssessmentEmailData): string {
  const lowPrice = formatYen(data.estimatedLowYen);
  const highPrice = formatYen(data.estimatedHighYen);
  const estimatedPrice = formatYen(data.estimatedPrice * 10000);
  const propertyTypeLabel = getPropertyTypeLabel(data.propertyType);
  const marketTrendLabel = getMarketTrendLabel(data.marketTrend || "stable");

  return `
不動産査定結果

いつもお世話になっております。
ご依頼いただいた不動産の査定が完了いたしました。

【物件情報】
物件種別: ${propertyTypeLabel}
所在地: ${data.prefecture}${data.city}${data.location}
${data.floorArea ? `面積: ${data.floorArea.toLocaleString()} ㎡` : ''}
${data.buildingAge ? `築年数: ${data.buildingAge} 年` : ''}

【査定結果】
推定価格範囲: ${lowPrice} ～ ${highPrice}
推定価格: ${estimatedPrice}
査定信頼度: ${data.confidence}%

【市場動向】
${marketTrendLabel}

【査定コメント】
${data.message}

詳細情報: https://hy-consulting.jp

---
© 2026 HY Consulting. All rights reserved.

このメールは自動送信されています。返信しないでください。
本査定結果は参考値です。実際の価格は市場動向、物件の状態、取引条件などにより異なる場合があります。
  `;
}

/**
 * Helper function to format yen currency
 */
function formatYen(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Helper function to get property type label
 */
function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    land: "土地",
    house: "戸建て",
    mansion: "マンション",
    apartment: "アパート",
  };
  return labels[type] || type;
}

/**
 * Helper function to get market trend label
 */
function getMarketTrendLabel(trend: string): string {
  const labels: Record<string, string> = {
    stable: "安定",
    rising: "上昇傾向",
    falling: "下落傾向",
  };
  return labels[trend] || trend;
}

/**
 * Helper function to get market trend color
 */
function getMarketTrendColor(trend: string): string {
  const colors: Record<string, string> = {
    stable: "#4CAF50",
    rising: "#2196F3",
    falling: "#FF9800",
  };
  return colors[trend] || "#4CAF50";
}
