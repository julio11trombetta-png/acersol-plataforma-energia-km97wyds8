export function getCatalogStyles(): string {
  return `<style>
@page{size:A4;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.catalog-page{width:210mm;min-height:297mm;page-break-after:always;position:relative;overflow:hidden;background:#fff}
.catalog-page:last-child{page-break-after:auto}
.cover-page{display:flex;flex-direction:column}
.cover-bg{position:absolute;inset:0;background-size:cover;background-position:center}
.cover-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,69,135,0.88),rgba(56,163,73,0.72))}
.cover-content{position:relative;z-index:1;padding:25mm 20mm;display:flex;flex-direction:column;justify-content:space-between;min-height:297mm}
.cover-logo img{height:40px;filter:brightness(0) invert(1)}
.cover-tag{display:inline-block;background:rgba(255,255,255,0.2);color:#fff;font-size:11px;padding:4px 14px;border-radius:20px;text-transform:uppercase;letter-spacing:2px}
.cover-title h1{color:#fff;font-size:42px;font-weight:800;line-height:1.1;margin-top:16px}
.cover-footer{color:#fff}.cover-footer p{font-size:13px;margin-bottom:4px;opacity:0.9}
.split-layout{display:flex;height:120mm}
.split-image{flex:1;overflow:hidden}.split-image img{width:100%;height:100%;object-fit:cover}
.split-text{flex:1;padding:20mm;display:flex;flex-direction:column;justify-content:center;background:#f8fafc}
.section-tag{display:inline-block;background:#38A349;color:#fff;font-size:10px;padding:3px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;align-self:flex-start}
.split-text h2{color:#004587;font-size:24px;font-weight:700;margin-bottom:12px}
.split-text p{font-size:12px;line-height:1.7;color:#555}
.indicators-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:15mm 20mm}
.indicator-card{background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.06);padding:20px;text-align:center;border-top:4px solid #38A349}
.indicator-card .icon{color:#004587;margin-bottom:8px;display:flex;justify-content:center}
.indicator-card .num{font-size:26px;font-weight:800;color:#004587}
.indicator-card .label{font-size:11px;color:#666;margin-top:2px}
.flow-infographic{display:flex;align-items:center;justify-content:center;gap:2px;padding:20mm 10mm}
.flow-step{text-align:center;flex:1;max-width:75px}
.flow-icon{width:54px;height:54px;border-radius:50%;background:#004587;color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;box-shadow:0 4px 12px rgba(0,69,135,0.2)}
.flow-label{font-size:9px;font-weight:600;color:#004587}
.flow-arrow{color:#38A349;font-size:16px}
.data-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:5mm 20mm}
.data-card{background:#f8fafc;border-radius:10px;padding:14px;border-left:4px solid #004587}
.data-card .key{font-size:9px;color:#999;text-transform:uppercase;letter-spacing:0.5px}
.data-card .val{font-size:13px;font-weight:600;margin-top:2px}
.uc-table{width:100%;border-collapse:collapse}
.uc-table th{background:#004587;color:#fff;padding:8px;font-size:10px;text-align:left;text-transform:uppercase}
.uc-table td{padding:8px;border-bottom:1px solid #e8e8e8;font-size:11px}
.uc-table tr:nth-child(even){background:#f8fafc}
.dash-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:5mm 20mm}
.dash-card{background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);padding:18px;text-align:center;border-top:4px solid #38A349}
.dash-card .num{font-size:22px;font-weight:800;color:#004587}
.dash-card .label{font-size:10px;color:#666;margin-top:2px}
.compare-container{display:flex;align-items:center;justify-content:center;gap:16px;padding:15mm 20mm}
.compare-box{flex:1;border-radius:16px;padding:28px;text-align:center}
.compare-before{background:#fef2f2;border:2px solid #fca5a5}
.compare-after{background:#f0fdf4;border:2px solid #86efac}
.compare-box .label{font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
.compare-box .value{font-size:34px;font-weight:800}
.compare-before .value{color:#dc2626}.compare-after .value{color:#16a34a}
.compare-arrow{font-size:28px;color:#38A349}
.savings-highlight{text-align:center;padding:0 20mm 10mm}
.savings-highlight .big{font-size:48px;font-weight:800;color:#38A349}
.savings-highlight .label{font-size:13px;color:#666}
.plant-photo{width:100%;height:110mm;object-fit:cover}
.plant-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:8mm 20mm}
.plant-grid-item{background:#f8fafc;border-radius:10px;padding:14px;text-align:center}
.plant-grid-item .icon{color:#004587;margin-bottom:6px;display:flex;justify-content:center}
.plant-grid-item .num{font-size:16px;font-weight:700;color:#004587}
.plant-grid-item .label{font-size:9px;color:#666}
.benefits-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:10mm 20mm}
.benefit-card{background:#fff;border:1px solid #e8e8e8;border-radius:10px;padding:14px;text-align:center}
.benefit-card .icon{color:#38A349;margin-bottom:6px;display:flex;justify-content:center}
.benefit-card .title{font-size:11px;font-weight:600;color:#004587}
.benefit-card .desc{font-size:9px;color:#666;margin-top:2px}
.obs-box{background:#f8fafc;border-radius:12px;padding:18px;margin-top:10px;border-left:4px solid #004587}
.obs-box p{font-size:12px;line-height:1.7;color:#555}
.qr-placeholder{width:90px;height:90px;background:#f0f0f0;border-radius:8px;margin:8px auto;display:flex;align-items:center;justify-content:center;color:#999}
.closing-page{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:40mm 25mm;text-align:center}
.closing-logo img{height:50px;margin-bottom:24px}
.closing-message{font-size:18px;color:#004587;font-weight:700;margin-bottom:6px}
.closing-sub{font-size:12px;color:#666;margin-bottom:28px}
.contact-row{display:flex;gap:24px;margin-bottom:36px}
.contact-item{font-size:11px;color:#555;display:flex;align-items:center;gap:6px}
.sign-area{display:flex;justify-content:space-between;width:100%;margin-top:30px}
.sign-box{width:45%;border-top:1px solid #333;padding-top:8px;font-size:10px;color:#555;text-align:center}
@media print{.catalog-page{box-shadow:none}}
</style>`
}
