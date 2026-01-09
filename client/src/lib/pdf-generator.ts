/**
 * PDF Report Generator
 * Generates professional assessment reports as PDF documents
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface AssessmentReportData {
  propertyData: {
    propertyType: string;
    prefecture: string;
    city: string;
    location: string;
    floorArea?: number;
    buildingAge?: number;
  };
  result: {
    estimatedLowYen: number;
    estimatedHighYen: number;
    explanation: string;
    compsUsedCount: number;
    marketTrend?: string;
    pricePerM2?: number;
    comparableCount?: number;
    confidence?: number;
  };
  generatedDate: Date;
}

/**
 * Format price for display
 */
const formatPrice = (price: number): string => {
  if (price >= 100000000) {
    return `¥${(price / 100000000).toFixed(1)}億`;
  }
  if (price >= 10000) {
    return `¥${(price / 10000).toFixed(0)}万`;
  }
  return `¥${price.toLocaleString()}`;
};

/**
 * Generate HTML content for PDF
 */
const generateHTMLContent = (data: AssessmentReportData): string => {
  const midPrice = (data.result.estimatedLowYen + data.result.estimatedHighYen) / 2;
  const priceRange = data.result.estimatedHighYen - data.result.estimatedLowYen;
  const rangePercent = ((priceRange / midPrice) * 100).toFixed(1);

  return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>不動産査定レポート</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          background: white;
          padding: 40px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #0066cc;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 28px;
          color: #0066cc;
          margin-bottom: 10px;
        }
        
        .header p {
          color: #666;
          font-size: 14px;
        }
        
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #0066cc;
          border-left: 4px solid #0066cc;
          padding-left: 12px;
          margin-bottom: 15px;
        }
        
        .property-info {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
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
          min-width: 150px;
        }
        
        .info-value {
          color: #333;
          text-align: right;
          flex: 1;
        }
        
        .price-box {
          background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
          color: white;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 20px;
        }
        
        .price-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 10px;
        }
        
        .price-value {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .price-range {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .analysis-box {
          background: #f0f7ff;
          border-left: 4px solid #0066cc;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        
        .analysis-label {
          font-weight: bold;
          color: #0066cc;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .analysis-value {
          color: #333;
          font-size: 14px;
        }
        
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .grid-item {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
        }
        
        .grid-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }
        
        .grid-value {
          font-size: 18px;
          font-weight: bold;
          color: #0066cc;
        }
        
        .disclaimer {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 5px;
          padding: 15px;
          margin-top: 30px;
          font-size: 12px;
          color: #856404;
        }
        
        .disclaimer-title {
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #999;
        }
        
        @media print {
          body {
            padding: 0;
          }
          .section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>不動産査定レポート</h1>
          <p>HY Consulting - 不動産査定システム</p>
        </div>
        
        <div class="section">
          <div class="section-title">査定対象物件</div>
          <div class="property-info">
            <div class="info-row">
              <span class="info-label">物件種別</span>
              <span class="info-value">${data.propertyData.propertyType === 'land' ? '土地' : data.propertyData.propertyType === 'house' ? '戸建て' : 'マンション'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">所在地</span>
              <span class="info-value">${data.propertyData.prefecture} ${data.propertyData.city} ${data.propertyData.location}</span>
            </div>
            ${data.propertyData.floorArea ? `
            <div class="info-row">
              <span class="info-label">面積</span>
              <span class="info-value">${data.propertyData.floorArea} ㎡</span>
            </div>
            ` : ''}
            ${data.propertyData.buildingAge ? `
            <div class="info-row">
              <span class="info-label">築年数</span>
              <span class="info-value">${data.propertyData.buildingAge} 年</span>
            </div>
            ` : ''}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">査定結果</div>
          <div class="price-box">
            <div class="price-label">概算査定価格</div>
            <div class="price-value">${formatPrice(midPrice)}</div>
            <div class="price-range">（${formatPrice(data.result.estimatedLowYen)} ～ ${formatPrice(data.result.estimatedHighYen)}）</div>
          </div>
          
          <div class="grid">
            <div class="grid-item">
              <div class="grid-label">単価（㎡当たり）</div>
              <div class="grid-value">${data.result.pricePerM2 ? `¥${(data.result.pricePerM2 / 10000).toFixed(1)}万` : 'N/A'}</div>
            </div>
            <div class="grid-item">
              <div class="grid-label">信頼度</div>
              <div class="grid-value">${data.result.confidence || 75}%</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">市場分析</div>
          <div class="analysis-box">
            <div class="analysis-label">市場トレンド</div>
            <div class="analysis-value">${data.result.marketTrend === '上昇傾向' ? '上昇傾向' : data.result.marketTrend === '下降傾向' ? '下降傾向' : '安定'}</div>
          </div>
          <div class="analysis-box">
            <div class="analysis-label">査定に使用した取引件数</div>
            <div class="analysis-value">${data.result.compsUsedCount} 件</div>
          </div>
          <div class="analysis-box">
            <div class="analysis-label">周辺取引件数</div>
            <div class="analysis-value">${data.result.comparableCount || 0} 件</div>
          </div>
        </div>
        
        <div class="disclaimer">
          <div class="disclaimer-title">⚠️ 重要なご注意</div>
          <p>本査定結果は、国土交通省の不動産取引価格情報データベースと類似物件の取引事例に基づいた参考値です。実際の売却価格は、市場の需給、物件の状態、交渉などにより異なる場合があります。詳細な査定については、公式サイトのお問い合わせフォームからご相談ください。</p>
        </div>
        
        <div class="footer">
          <p>生成日時: ${data.generatedDate.toLocaleString('ja-JP')}</p>
          <p>© 2026 HY Consulting. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate PDF report from assessment data
 */
export const generateAssessmentPDF = async (
  data: AssessmentReportData,
  fileName: string = 'assessment-report.pdf'
): Promise<void> => {
  try {
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = generateHTMLContent(data);
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    document.body.appendChild(container);

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const imgData = canvas.toDataURL('image/png');

    // Add pages
    while (heightLeft >= 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm
      if (heightLeft > 0) {
        pdf.addPage();
        position = -297;
      }
    }

    // Download PDF
    pdf.save(fileName);

    // Clean up
    document.body.removeChild(container);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('PDF生成に失敗しました');
  }
};

/**
 * Generate PDF and open in new window
 */
export const previewAssessmentPDF = async (
  data: AssessmentReportData
): Promise<void> => {
  try {
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = generateHTMLContent(data);
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    document.body.appendChild(container);

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const imgData = canvas.toDataURL('image/png');

    while (heightLeft >= 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
      if (heightLeft > 0) {
        pdf.addPage();
        position = -297;
      }
    }

    // Open in new window
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');

    // Clean up
    document.body.removeChild(container);
  } catch (error) {
    console.error('PDF preview error:', error);
    throw new Error('PDF プレビューに失敗しました');
  }
};
