import { formatCurrency } from '@/lib/formatters'

export type PresentationModel = 'executive' | 'institutional' | 'commercial'

export interface InstitutionalAsset {
  id: string
  title: string
  category: 'plant' | 'panels' | 'industry' | 'nature'
  file?: string
  url?: string
  active: boolean
}

export function getAssetUrl(
  asset: any | undefined,
  fallbackQuery: string,
  w = 1200,
  h = 800,
): string {
  if (asset?.file) {
    return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/institutional_assets/${asset.id}/${asset.file}`
  }
  if (asset?.url) return asset.url
  return `https://img.usecurling.com/p/${w}/${h}?q=${encodeURIComponent(fallbackQuery)}`
}

export function aggregateMonthlyData(monthlyData: any[]) {
  const byMonth: Record<string, { consumo: number; valor: number }> = {}
  for (const m of monthlyData) {
    const key = m.mes || '—'
    if (!byMonth[key]) byMonth[key] = { consumo: 0, valor: 0 }
    byMonth[key].consumo += m.consumo_kwh || 0
    byMonth[key].valor += m.valor_conta || 0
  }
  return Object.entries(byMonth).map(([mes, d]) => ({ mes, ...d }))
}

function svg(content: string, size = 22): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`
}

export const ICONS: Record<string, string> = {
  user: svg('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  building: svg('<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>'),
  sun: svg(
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  ),
  bolt: svg('<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'),
  leaf: svg('<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 11-9 0 7-4 11-9 11M11 20c0-3 1-6 4-9"/>'),
  shield: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  check: svg('<path d="M20 6L9 17l-5-5"/>'),
  trending: svg('<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>'),
  calendar: svg(
    '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  ),
  mapPin: svg(
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  ),
  phone: svg(
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  ),
  mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/>'),
  fileText: svg(
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  ),
  percent: svg(
    '<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  ),
  wallet: svg(
    '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h4v-4z"/>',
  ),
  tools: svg(
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  ),
  users: svg(
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  ),
  globe: svg(
    '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  ),
  award: svg('<circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>'),
  scale: svg('<path d="M12 3v18M5 7h14M5 7l-3 7h6l-3-7M19 7l-3 7h6l-3-7M7 21h10"/>'),
  zap: svg('<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'),
  lock: svg(
    '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  ),
  clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
}

export { formatCurrency }

export function getStyles(model: PresentationModel): string {
  const primary = model === 'institutional' ? '#2d7a2d' : '#004a8c'
  const accent = '#6ab023'
  const tint = model === 'executive' ? '#f8fafc' : model === 'institutional' ? '#f5faf5' : '#fafaff'
  return `<style>
@page{size:A4;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;min-height:297mm;padding:18mm 20mm;page-break-after:always;position:relative;overflow:hidden}
.page:last-child{page-break-after:auto}
h1{font-size:28px;color:${primary};font-weight:700}h2{font-size:18px;color:${primary};font-weight:600;margin-bottom:12px}
h3{font-size:14px;color:${primary};font-weight:600}p{font-size:13px;line-height:1.6}
.card{background:#fff;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.06);padding:16px;margin-bottom:12px}
.indicator-card{background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.05);padding:20px;text-align:center;border-top:4px solid ${accent}}
.indicator-card .num{font-size:32px;font-weight:700;color:${primary}}.indicator-card .label{font-size:12px;color:#666;margin-top:4px}
table{width:100%;border-collapse:collapse;margin:12px 0}th{background:${primary};color:#fff;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px}
td{padding:8px 10px;border-bottom:1px solid #e8e8e8;font-size:12px}tr:nth-child(even){background:${tint}}tr.total-row{background:${accent}22;font-weight:700}
tr{page-break-inside:avoid}
.chart-bars{display:flex;align-items:flex-end;gap:6px;height:180px;margin:16px 0;padding:0 8px}
.chart-bar{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
.bar-fill{width:100%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,${primary},${accent});min-height:4px}
.bar-label{font-size:9px;margin-top:4px;color:#666;text-align:center}.bar-value{font-size:9px;font-weight:600;color:${primary};margin-bottom:2px}
.flow-container{display:flex;align-items:center;justify-content:space-between;margin:30px 0}
.flow-step{text-align:center;flex:1;max-width:140px}
.flow-icon{width:64px;height:64px;border-radius:50%;background:${primary};color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;box-shadow:0 4px 12px rgba(0,0,0,0.15)}
.flow-label{font-size:12px;font-weight:600;color:${primary}}.flow-desc{font-size:10px;color:#666;margin-top:2px}
.flow-arrow{color:${accent};font-size:20px;flex:0}
.benefit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.benefit-card{background:#fff;border:1px solid #e8e8e8;border-radius:8px;padding:14px;text-align:center}
.benefit-card .icon{color:${accent};margin-bottom:8px;display:flex;justify-content:center}.benefit-card .title{font-size:12px;font-weight:600;color:${primary}}.benefit-card .desc{font-size:10px;color:#666;margin-top:2px}
.compare-card{border-radius:12px;padding:20px;text-align:center;flex:1}.compare-before{background:#fef2f2;border:2px solid #fca5a5}.compare-after{background:#f0fdf4;border:2px solid #86efac}
.compare-card .label{font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}.compare-card .value{font-size:28px;font-weight:700}
.compare-before .value{color:#dc2626}.compare-after .value{color:#16a34a}
.cover-page{display:flex;flex-direction:column;justify-content:space-between;color:#fff}
.section-tag{display:inline-block;background:${accent};color:#fff;font-size:10px;padding:2px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
.info-row{display:flex;gap:16px;margin-bottom:12px}.info-item{flex:1}.info-item .key{font-size:10px;color:#999;text-transform:uppercase;letter-spacing:.5px}.info-item .val{font-size:13px;font-weight:600;margin-top:2px}
@media print{.page{box-shadow:none}}
</style>`
}
