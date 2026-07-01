import { ICONS } from '@/lib/premium-pdf/styles'

export function pageCover(): string {
  return `<div class="catalog-page flex-page cover-page">
<div class="cover-bg" style="background-image:url('{{IMG_CAPA}}')"></div>
<div class="cover-overlay"></div>
<div class="cover-content">
  <div class="cover-logo"><img src="{{LOGO}}" alt="ACERSOL"/></div>
  <div class="cover-title">
    <span class="cover-tag">PROPOSTA DE PARTICIPAÇÃO</span>
    <h1>Energia Solar<br/>Compartilhada</h1>
  </div>
  <div class="cover-footer">
    <p style="font-size:18px;font-weight:700;margin-bottom:8px;">{{CLIENTE}}</p>
    <p>{{CIDADE}} - {{ESTADO}} | {{DATA}}</p>
    <p>Proposta Nº {{NUMERO_PROPOSTA}}</p>
  </div>
</div>
</div>`
}

export function pageInstitutional(): string {
  return `<div class="catalog-page flex-page">
<div class="split-layout">
  <div class="split-image"><img src="{{IMG_SUSTENTABILIDADE}}" alt="Sustentabilidade"/></div>
  <div class="split-text">
    <span class="section-tag">INSTITUCIONAL</span>
    <h2>Sobre a ACERSOL</h2>
    <p>A ACERSOL é referência nacional em gestão de energia solar compartilhada, conectando associados a usinas fotovoltaicas de alta performance.</p>
    <p style="margin-top:12px">Nossa missão é democratizar o acesso à energia limpa, garantindo economia real e contribuição ativa para um futuro sustentável sem a necessidade de investimentos ou obras no seu imóvel.</p>
  </div>
</div>
<div class="indicators-grid">
  <div class="indicator-card"><div class="icon">${ICONS.users}</div><div class="num">{{ASSOCIADOS}}</div><div class="label">Associados</div></div>
  <div class="indicator-card"><div class="icon">${ICONS.sun}</div><div class="num">{{USINAS_COUNT}}</div><div class="label">Usinas</div></div>
  <div class="indicator-card"><div class="icon">${ICONS.zap}</div><div class="num">{{MEGAWATTS}} MW</div><div class="label">Potência</div></div>
  <div class="indicator-card"><div class="icon">${ICONS.bolt}</div><div class="num">{{KWH_ANO}}</div><div class="label">kWh/ano</div></div>
  <div class="indicator-card"><div class="icon">${ICONS.leaf}</div><div class="num">{{CO2}} t</div><div class="label">CO₂ evitado</div></div>
  <div class="indicator-card"><div class="icon">${ICONS.mapPin}</div><div class="num">{{MUNICIPIOS}}</div><div class="label">Municípios</div></div>
</div>
</div>`
}

export function pageHowItWorks(): string {
  return `<div class="catalog-page flex-page">
<div style="padding:25mm 20mm 0; flex-shrink: 0;">
  <span class="section-tag">COMO FUNCIONA</span>
  <h2 style="color:var(--primary);font-size:26px;font-weight:700;margin-top:6px;margin-bottom:6px;">Sistema de Compensação</h2>
  <p style="font-size:14px;color:#555;">Entenda como a energia solar compartilhada chega até você de forma simples e transparente.</p>
</div>
<div class="flow-infographic" style="flex-shrink: 0;">
  <div class="flow-step"><div class="flow-icon">${ICONS.user}</div><div class="flow-label">Cliente</div></div>
  <div class="flow-arrow">→</div>
  <div class="flow-step"><div class="flow-icon">${ICONS.building}</div><div class="flow-label">ACERSOL</div></div>
  <div class="flow-arrow">→</div>
  <div class="flow-step"><div class="flow-icon">${ICONS.sun}</div><div class="flow-label">Usina</div></div>
  <div class="flow-arrow">→</div>
  <div class="flow-step"><div class="flow-icon">${ICONS.zap}</div><div class="flow-label">Distribuidora</div></div>
  <div class="flow-arrow">→</div>
  <div class="flow-step"><div class="flow-icon">${ICONS.percent}</div><div class="flow-label">Créditos</div></div>
  <div class="flow-arrow">→</div>
  <div class="flow-step"><div class="flow-icon">${ICONS.fileText}</div><div class="flow-label">Conta</div></div>
</div>
<div style="padding:10mm 20mm; flex-grow: 1;">
  <div class="data-card" style="margin-bottom:12px">
    <div class="key">1. Associação</div>
    <div class="val">O cliente se associa à ACERSOL e recebe uma cota de créditos de energia proporcional ao seu consumo.</div>
  </div>
  <div class="data-card" style="margin-bottom:12px;border-left-color:var(--accent)">
    <div class="key">2. Geração</div>
    <div class="val">Nossas usinas geram energia limpa que é injetada diretamente na rede da distribuidora local.</div>
  </div>
  <div class="data-card" style="margin-bottom:12px">
    <div class="key">3. Compensação</div>
    <div class="val">A distribuidora converte a energia injetada em créditos que abatem o consumo na sua fatura de energia.</div>
  </div>
  <div class="data-card" style="border-left-color:var(--accent)">
    <div class="key">4. Economia</div>
    <div class="val">Você paga apenas a diferença para a distribuidora e a fatura da ACERSOL com desconto garantido, gerando economia todo mês.</div>
  </div>
</div>
</div>`
}
