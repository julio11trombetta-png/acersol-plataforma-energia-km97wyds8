import { PresentationModel } from '@/lib/premium-pdf/styles'

export function getCatalogStyles(model: PresentationModel = 'executive'): string {
  let primary = '#004587'
  let accent = '#38A349'
  let tint = '#f8fafc'

  if (model === 'institutional') {
    primary = '#2d7a2d'
    accent = '#6ab023'
    tint = '#f5faf5'
  } else if (model === 'commercial') {
    primary = '#1e3a8a'
    accent = '#f59e0b'
    tint = '#fffbeb'
  }

  return `<style>
:root {
  --primary: ${primary};
  --accent: ${accent};
  --tint: ${tint};
}
@page { size: A4; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.catalog-page { width: 210mm; min-height: 297mm; page-break-after: always; position: relative; background: #fff; display: flex; flex-direction: column; }
.catalog-page:last-child { page-break-after: auto; }
.flex-page { display: flex; flex-direction: column; }
.page-header { padding: 25mm 20mm 10mm; flex-shrink: 0; }
.page-header h2 { color: var(--primary); font-size: 26px; font-weight: 700; margin-top: 6px; }
.page-header .subtitle { font-size: 14px; color: #555; margin-top: 6px; }
.cover-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
.cover-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4)); }
.cover-content { position: relative; z-index: 1; padding: 25mm 20mm; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1; }
.cover-logo img { height: 48px; filter: brightness(0) invert(1); }
.cover-tag { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; font-size: 12px; padding: 6px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 2px; }
.cover-title h1 { color: #fff; font-size: 46px; font-weight: 800; line-height: 1.1; margin-top: 20px; }
.cover-footer { color: #fff; }
.split-layout { display: flex; height: 130mm; flex-shrink: 0; }
.split-image { flex: 1; overflow: hidden; }
.split-image img { width: 100%; height: 100%; object-fit: cover; }
.split-text { flex: 1; padding: 20mm; display: flex; flex-direction: column; justify-content: center; background: var(--tint); }
.section-tag { display: inline-block; background: var(--accent); color: #fff; font-size: 10px; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; align-self: flex-start; font-weight: 600; margin-bottom: 8px; }
.split-text h2 { color: var(--primary); font-size: 26px; font-weight: 700; margin-bottom: 14px; margin-top: 10px; }
.split-text p { font-size: 13px; line-height: 1.7; color: #444; }
.indicators-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 15mm 20mm; align-content: center; }
.indicator-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); padding: 24px; text-align: center; border-top: 4px solid var(--accent); }
.indicator-card .icon { color: var(--primary); margin-bottom: 12px; display: flex; justify-content: center; }
.indicator-card .icon svg { width: 28px; height: 28px; }
.indicator-card .num { font-size: 24px; font-weight: 800; color: var(--primary); }
.indicator-card .label { font-size: 12px; color: #666; margin-top: 4px; font-weight: 500; }
.flow-infographic { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 10mm 15mm; }
.flow-step { text-align: center; flex: 1; max-width: 85px; }
.flow-icon { width: 60px; height: 60px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
.flow-label { font-size: 10px; font-weight: 700; color: var(--primary); }
.flow-arrow { color: var(--accent); font-size: 20px; font-weight: 700; }
.data-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 5mm 20mm; }
.data-card { background: var(--tint); border-radius: 10px; padding: 16px; border-left: 4px solid var(--primary); }
.data-card .key { font-size: 10px; color: #777; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
.data-card .val { font-size: 14px; font-weight: 700; margin-top: 4px; color: #222; }
.uc-table { width: 100%; border-collapse: collapse; }
.uc-table th { background: var(--primary); color: #fff; padding: 10px; font-size: 11px; text-align: left; text-transform: uppercase; letter-spacing: 0.5px; }
.uc-table td { padding: 10px; border-bottom: 1px solid #e8e8e8; font-size: 12px; color: #333; }
.uc-table tr { page-break-inside: avoid; }
.uc-table tr:nth-child(even) { background: var(--tint); }
.dash-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 5mm 20mm; }
.dash-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 20px; text-align: center; border-top: 4px solid var(--accent); }
.dash-card .num { font-size: 22px; font-weight: 800; color: var(--primary); }
.dash-card .label { font-size: 11px; color: #666; margin-top: 4px; font-weight: 500; }
.compare-container { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 15mm 20mm 10mm; }
.compare-box { flex: 1; border-radius: 16px; padding: 32px 20px; text-align: center; }
.compare-before { background: #fef2f2; border: 2px solid #fca5a5; }
.compare-after { background: #f0fdf4; border: 2px solid #86efac; }
.compare-box .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-weight: 700; }
.compare-box .value { font-size: 32px; font-weight: 800; }
.compare-before .value { color: #dc2626; }
.compare-after .value { color: #16a34a; }
.compare-arrow { font-size: 32px; color: var(--accent); font-weight: 800; }
.savings-highlight { text-align: center; padding: 0 20mm 10mm; }
.savings-highlight .big { font-size: 56px; font-weight: 800; color: var(--accent); line-height: 1; }
.savings-highlight .label { font-size: 15px; color: #555; font-weight: 500; margin-top: 8px; }
.plant-photo { width: 100%; height: 120mm; object-fit: cover; }
.plant-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 8mm 20mm; }
.plant-grid-item { background: var(--tint); border-radius: 10px; padding: 16px; text-align: center; }
.plant-grid-item .icon { color: var(--primary); margin-bottom: 8px; display: flex; justify-content: center; }
.plant-grid-item .icon svg { width: 24px; height: 24px; }
.plant-grid-item .num { font-size: 16px; font-weight: 800; color: var(--primary); }
.plant-grid-item .label { font-size: 10px; color: #666; font-weight: 500; margin-top: 4px; }
.benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 10mm 20mm; }
.benefit-card { background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.02); page-break-inside: avoid; }
.benefit-card .icon { color: var(--accent); margin-bottom: 12px; display: flex; justify-content: center; }
.benefit-card .icon svg { width: 32px; height: 32px; }
.benefit-card .title { font-size: 13px; font-weight: 700; color: var(--primary); margin-bottom: 4px; }
.benefit-card .desc { font-size: 11px; color: #666; line-height: 1.5; }
.obs-box { background: var(--tint); border-radius: 12px; padding: 20px; margin-top: 15px; border-left: 4px solid var(--primary); page-break-inside: avoid; }
.obs-box p { font-size: 13px; line-height: 1.7; color: #444; }
.qr-placeholder { width: 120px; height: 120px; background: #fff; border: 1px solid #ddd; border-radius: 8px; margin: 12px auto; display: flex; align-items: center; justify-content: center; color: var(--primary); }
.qr-placeholder svg { width: 48px; height: 48px; opacity: 0.5; }
.closing-page { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40mm 25mm; text-align: center; background: var(--tint); min-height: 297mm; flex-grow: 1; }
.closing-logo img { height: 60px; margin-bottom: 30px; }
.closing-message { font-size: 22px; color: var(--primary); font-weight: 800; margin-bottom: 8px; }
.closing-sub { font-size: 14px; color: #666; margin-bottom: 40px; }
.contact-row { display: flex; gap: 32px; margin-bottom: 50px; }
.contact-item { font-size: 13px; color: #444; display: flex; align-items: center; gap: 8px; font-weight: 500; }
.contact-item svg { color: var(--accent); }
.sign-area { display: flex; justify-content: space-between; width: 100%; margin-top: 40px; }
.sign-box { width: 42%; border-top: 1px solid #999; padding-top: 12px; font-size: 12px; color: #333; text-align: center; font-weight: 600; }
.page-footer { padding: 8mm 20mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; margin-top: auto; flex-shrink: 0; background: #fff; }
.page-footer .logo img { height: 24px; filter: grayscale(100%) opacity(0.5); }
.page-footer .info { font-size: 10px; color: #999; display: flex; gap: 16px; align-items: center; }
.page-footer .page-number { font-size: 11px; font-weight: 600; color: #bbb; }
</style>`
}
