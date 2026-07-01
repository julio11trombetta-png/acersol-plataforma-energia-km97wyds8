import { PresentationModel } from '@/lib/premium-pdf/styles'

export function getCatalogStyles(model: PresentationModel = 'executive'): string {
  const primary = '#003b73' // Dark blue
  const accent = '#5fa324' // Green
  const bgLight = '#f8fafc'

  return `<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
    :root {
      --primary: ${primary};
      --accent: ${accent};
      --bg-light: ${bgLight};
      --text: #333;
      --text-light: #666;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Montserrat', sans-serif; color: var(--text); -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #e0e0e0; }
    .catalog-page { width: 210mm; height: 297mm; background: #fff; position: relative; overflow: hidden; page-break-after: always; display: flex; flex-direction: column; margin: 0 auto; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    @media print {
      body { background: #fff; }
      .catalog-page { margin: 0; box-shadow: none; }
    }
    
    /* Cover Page */
    .page-cover { justify-content: flex-end; }
    .cover-bg { position: absolute; inset: 0; background-size: cover; background-position: center; z-index: 1; background-color: var(--primary); }
    .cover-gradient { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,59,115,1) 0%, rgba(0,59,115,0.7) 50%, rgba(0,0,0,0) 100%); z-index: 2; }
    .cover-content { position: relative; z-index: 3; padding: 25mm 20mm; color: #fff; display: flex; flex-direction: column; height: 100%; }
    .cover-content .logo { width: 180px; filter: brightness(0) invert(1); margin-bottom: auto; }
    .title-block { margin-bottom: 30px; }
    .title-block h1 { font-size: 32px; font-weight: 800; letter-spacing: 1px; margin-bottom: 8px; }
    .title-block h2 { font-size: 20px; font-weight: 500; line-height: 1.4; color: #e2e8f0; }
    .client-block { margin-bottom: 20px; }
    .client-block .label { display: block; font-size: 12px; color: var(--accent); font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
    .client-block .value { display: block; font-size: 18px; font-weight: 700; }
    .info-block { display: flex; flex-direction: column; gap: 15px; margin-bottom: 40px; }
    .info-item { display: flex; align-items: center; gap: 10px; }
    .info-item .icon { width: 20px; height: 20px; color: #fff; opacity: 0.8; }
    .info-item .icon svg { width: 100%; height: 100%; }
    .info-item .label { display: block; font-size: 10px; color: #ccc; }
    .info-item .value { display: block; font-size: 13px; font-weight: 600; }
    .footer-block { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; font-size: 12px; font-weight: 600; }
    .footer-block .page-num { font-size: 24px; font-weight: 800; }

    /* Common Header & Footer */
    .header { padding: 20mm 20mm 10mm; }
    .page-title { font-size: 14px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .page-subtitle { font-size: 22px; font-weight: 700; color: var(--primary); }
    .content { flex: 1; padding: 0 20mm 20mm; }
    .pdf-footer { height: 15mm; border-top: 2px solid var(--primary); display: flex; justify-content: space-between; align-items: center; padding: 0 20mm; font-size: 10px; color: #666; font-weight: 600; position: absolute; bottom: 0; left: 0; right: 0; background: #fff; }
    .footer-page { font-size: 12px; font-weight: 800; color: var(--primary); }

    /* P2: Diagnostico */
    .text { font-size: 13px; line-height: 1.6; color: var(--text-light); margin-bottom: 20px; }
    .diag-split { display: flex; gap: 20px; height: 170mm; }
    .diag-blue-box { background: var(--primary); color: #fff; flex: 1.2; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 15px; }
    .diag-item { display: flex; align-items: flex-start; gap: 12px; }
    .diag-item .icon { width: 24px; height: 24px; color: var(--accent); flex-shrink: 0; }
    .diag-item .icon svg { width: 100%; height: 100%; }
    .diag-text .label { display: block; font-size: 10px; opacity: 0.8; text-transform: uppercase; margin-bottom: 2px; }
    .diag-text .value { display: block; font-size: 14px; font-weight: 600; }
    .diag-item.highlight { background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; margin-top: 10px; }
    .diag-item.highlight .icon { color: #fff; }
    .diag-item.highlight .value { font-size: 18px; color: var(--accent); }
    .diag-disclaimer { font-size: 9px; opacity: 0.6; margin-top: auto; line-height: 1.4; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; }
    .diag-image { flex: 0.8; border-radius: 12px; overflow: hidden; }
    .diag-image img { width: 100%; height: 100%; object-fit: cover; }

    /* P3: Institucional */
    .intro-text { font-weight: 500; font-size: 14px; }
    .mvv-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 30px; }
    .mvv-card { text-align: center; }
    .mvv-card .icon-wrap { width: 50px; height: 50px; border: 2px solid var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
    .mvv-card .icon { width: 24px; height: 24px; color: var(--primary); }
    .mvv-card .icon svg { width: 100%; height: 100%; }
    .mvv-card h3 { font-size: 12px; color: var(--primary); font-weight: 700; margin-bottom: 6px; }
    .mvv-card p { font-size: 11px; color: var(--text-light); line-height: 1.4; }
    .section-subtitle { font-size: 14px; color: var(--accent); font-weight: 700; text-transform: uppercase; margin-bottom: 15px; }
    .diferenciais-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .diff-card { display: flex; gap: 12px; align-items: flex-start; }
    .diff-card .icon { width: 28px; height: 28px; color: var(--primary); flex-shrink: 0; }
    .diff-card .icon svg { width: 100%; height: 100%; }
    .diff-card h4 { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
    .diff-card p { font-size: 11px; color: var(--text-light); line-height: 1.4; }

    /* P4: Timeline */
    .timeline { padding: 10px 0; margin-left: 20px; }
    .tl-item { display: flex; align-items: center; gap: 20px; margin-bottom: 15px; }
    .tl-number { width: 30px; height: 30px; border-radius: 50%; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; flex-shrink: 0; z-index: 2; }
    .tl-icon { width: 40px; height: 40px; color: var(--primary); flex-shrink: 0; }
    .tl-icon svg { width: 100%; height: 100%; }
    .tl-content h3 { font-size: 14px; color: var(--text); font-weight: 700; margin-bottom: 4px; }
    .tl-content p { font-size: 12px; color: var(--text-light); line-height: 1.4; }
    .tl-arrow { width: 2px; height: 30px; background: #e2e8f0; margin-left: 14px; margin-bottom: 15px; }
    .tl-badge { background: var(--primary); color: #fff; padding: 15px 20px; border-radius: 8px; display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 13px; margin-top: 30px; }
    .tl-badge .icon { width: 20px; height: 20px; color: var(--accent); }
    .tl-badge .icon svg { width: 100%; height: 100%; }

    /* P5: Analysis */
    .chart-container { margin-bottom: 25px; }
    .chart-container h3 { font-size: 11px; color: var(--text); font-weight: 700; margin-bottom: 10px; text-transform: uppercase; }
    .chart-area { height: 140px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: flex-end; gap: 8px; padding-top: 10px; position: relative; }
    .chart-col { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; }
    .chart-val { font-size: 9px; color: var(--primary); font-weight: 600; margin-bottom: 4px; }
    .chart-bar { width: 100%; background: var(--accent); border-radius: 3px 3px 0 0; min-height: 2px; }
    .chart-lbl { font-size: 9px; color: #999; margin-top: 4px; text-transform: uppercase; font-weight: 600; }
    .svg-chart { display: block; border-bottom: none; padding-top: 0; }
    .chart-empty { height: 140px; display: flex; align-items: center; justify-content: center; background: var(--bg-light); border-radius: 8px; color: #999; font-size: 12px; font-weight: 600; }
    .analysis-summary { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 30px; }
    .summary-card { padding: 20px; border-radius: 12px; color: #fff; text-align: center; }
    .bg-primary { background: var(--primary); }
    .bg-accent { background: var(--accent); }
    .bg-dark { background: #1e293b; }
    .summary-card .label { font-size: 10px; font-weight: 600; opacity: 0.9; margin-bottom: 8px; }
    .summary-card .value { font-size: 22px; font-weight: 800; line-height: 1; }
    .summary-card .unit { font-size: 11px; opacity: 0.8; margin-top: 4px; }

    /* P6: Simulation */
    .sim-compare { display: flex; align-items: center; justify-content: space-between; gap: 20px; position: relative; margin-top: 20px; }
    .sim-box { flex: 1; padding: 40px 20px; text-align: center; border-radius: 16px; }
    .sim-box.before { background: #64748b; color: #fff; }
    .sim-box.after { background: var(--accent); color: #fff; }
    .box-header { font-size: 12px; font-weight: 700; margin-bottom: 15px; letter-spacing: 1px; }
    .box-value { font-size: 32px; font-weight: 800; margin-bottom: 10px; line-height: 1; }
    .box-label { font-size: 12px; opacity: 0.9; line-height: 1.4; }
    .sim-economy-badge { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 100px; height: 100px; background: #fff; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 4px solid var(--bg-light); color: var(--primary); z-index: 10; }
    .sim-economy-badge span { font-size: 9px; font-weight: 700; }
    .sim-economy-badge strong { font-size: 26px; font-weight: 800; line-height: 1; margin-top: 2px; }
    .sim-results { display: flex; gap: 20px; margin-top: 40px; }
    .res-box { flex: 1; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center; }
    .res-val { font-size: 28px; font-weight: 800; color: var(--primary); margin-bottom: 6px; }
    .res-lbl { font-size: 13px; color: var(--text-light); font-weight: 600; }
    .sim-disclaimer { margin-top: 30px; display: flex; gap: 10px; font-size: 11px; color: #666; background: var(--bg-light); padding: 15px; border-radius: 8px; }
    .sim-disclaimer .icon { width: 16px; height: 16px; color: var(--accent); flex-shrink: 0; }
    .sim-disclaimer .icon svg { width: 100%; height: 100%; }

    /* P7: Usina */
    .plant-image-container { height: 70mm; border-radius: 12px; overflow: hidden; margin-bottom: 25px; }
    .plant-image { width: 100%; height: 100%; object-fit: cover; }
    .plant-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
    .p-info-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-light); border-radius: 8px; }
    .p-info-item .icon { width: 24px; height: 24px; color: var(--primary); }
    .p-info-item .icon svg { width: 100%; height: 100%; }
    .p-text .label { display: block; font-size: 10px; color: var(--text-light); margin-bottom: 2px; }
    .p-text .value { display: block; font-size: 13px; font-weight: 600; color: var(--text); }
    .plant-map-container { background: #e2e8f0; height: 40mm; border-radius: 12px; position: relative; overflow: hidden; }
    .map-label { position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); padding: 6px 12px; border-radius: 4px; font-size: 10px; font-weight: 600; z-index: 2; }
    .map-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; mix-blend-mode: multiply; }

    /* P8: Beneficios */
    .benefits-grid-9 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
    .ben-card { padding: 20px 15px; text-align: center; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; flex-direction: column; align-items: center; }
    .ben-icon { width: 36px; height: 36px; color: var(--accent); margin-bottom: 12px; }
    .ben-icon svg { width: 100%; height: 100%; }
    .ben-title { font-size: 12px; font-weight: 700; color: var(--primary); margin-bottom: 6px; }
    .ben-desc { font-size: 11px; color: var(--text-light); line-height: 1.4; }

    /* P9: Passos */
    .steps-timeline { display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; margin-top: 10px; }
    .step-row { display: flex; gap: 15px; align-items: flex-start; }
    .step-num { width: 32px; height: 32px; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; flex-shrink: 0; }
    .step-text h4 { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; padding-top: 6px; }
    .step-text p { font-size: 12px; color: var(--text-light); line-height: 1.4; }
    .prazo-box { border: 1px solid #e2e8f0; border-left: 4px solid var(--accent); padding: 20px; border-radius: 8px; display: flex; gap: 15px; align-items: center; }
    .prazo-box .icon { width: 32px; height: 32px; color: var(--accent); }
    .prazo-box .icon svg { width: 100%; height: 100%; }
    .prazo-box .text strong { display: block; font-size: 11px; color: var(--primary); margin-bottom: 4px; }
    .prazo-box .text p { font-size: 12px; color: var(--text-light); margin: 0; }

    /* P10: Closing */
    .closing-text { font-size: 14px; line-height: 1.6; color: var(--text); margin-bottom: 30px; }
    .closing-image-container { height: 80mm; border-radius: 12px; overflow: hidden; margin-bottom: 30px; }
    .closing-image-container img { width: 100%; height: 100%; object-fit: cover; }
    .closing-bottom { display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px; background: var(--bg-light); padding: 20px; border-radius: 12px; }
    .closing-contacts h4 { font-size: 12px; font-weight: 700; color: var(--primary); margin-bottom: 12px; }
    .c-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-light); margin-bottom: 8px; }
    .c-item .icon { width: 16px; height: 16px; color: var(--accent); }
    .c-item .icon svg { width: 100%; height: 100%; }
    .closing-qr { width: 80px; height: 80px; }
    .closing-qr img { width: 100%; height: 100%; mix-blend-mode: darken; }
    .closing-signatures { display: flex; justify-content: space-between; gap: 40px; margin-top: auto; }
    .sig-box { flex: 1; text-align: center; }
    .sig-line { height: 1px; background: #cbd5e1; margin-bottom: 10px; }
    .sig-name { font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
    .sig-date { font-size: 10px; color: #999; }

    .page-footer { position: absolute; bottom: 0; left: 0; right: 0; height: 15mm; border-top: 2px solid var(--primary); display: flex; justify-content: space-between; align-items: center; padding: 0 20mm; font-size: 10px; color: #666; font-weight: 600; background: #fff; }
    .page-footer .logo img { height: 18px; }
    .page-footer .info { display: flex; gap: 15px; }
    .page-footer .page-number { font-size: 12px; font-weight: 800; color: var(--primary); }
    .page-hero-img { height: 40mm; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
    .page-hero-img img { width: 100%; height: 100%; object-fit: cover; }
    .sim-image { height: 40mm; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
    .sim-image img { width: 100%; height: 100%; object-fit: cover; }
    .ben-hero { height: 40mm; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
    .ben-hero img { width: 100%; height: 100%; object-fit: cover; }
    .steps-hero { height: 40mm; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
    .steps-hero img { width: 100%; height: 100%; object-fit: cover; }
  </style>`
}
