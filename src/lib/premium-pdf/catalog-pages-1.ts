import { ICONS } from '@/lib/premium-pdf/styles'

export function pageCover(): string {
  return `<div class="catalog-page cover-page">
<div class="cover-bg" style="background-image:url('{{IMG_CAPA}}')"></div>
<div class="cover-overlay"></div>
<div class="cover-content">
<div class="cover-logo"><img src="{{LOGO}}" alt="ACERSOL"/></div>
<div><span class="cover-tag">PROPOSTA DE PARTICIPAÇÃO</span>
<h1 style="color:#fff;font-size:42px;font-weight:800;line-height:1.1;margin-top:16px">Energia Solar<br/>Compartilhada</h1></div>
<div class="cover-footer">
<p style="font-size:16px;font-weight:600">{{CLIENTE}}</p>
<p>{{CIDADE}} - {{ESTADO}} | {{DATA}}</p>
<p>Proposta Nº {{NUMERO_PROPOSTA}}</p>
</div></div></div>`
}

export function pageInstitutional(): string {
  return `<div class="catalog-page">
<div class="split-layout">
<div class="split-image"><img src="{{IMG_SUSTENTABILIDADE}}" alt="Sustentabilidade"/></div>
<div class="split-text">
<span class="section-tag">INSTITUCIONAL</span>
<h2>Sobre a ACERSOL</h2>
<p>A ACERSOL é referência nacional em gestão de energia solar compartilhada, conectando associados a usinas fotovoltaicas de alta performance.</p>
<p style="margin-top:8px">Nossa missão é democratizar o acesso à energia limpa, garantindo economia real e contribuição ativa para um futuro sustentável.</p>
</div></div>
<div class="indicators-grid">
<div class="indicator-card"><div class="icon">${ICONS.users}</div><div class="num">{{ASSOCIADOS}}</div><div class="label">Associados</div></div>
<div class="indicator-card"><div class="icon">${ICONS.sun}</div><div class="num">{{USINAS_COUNT}}</div><div class="label">Usinas</div></div>
<div class="indicator-card"><div class="icon">${ICONS.zap}</div><div class="num">{{MEGAWATTS}} MW</div><div class="label">Potência</div></div>
<div class="indicator-card"><div class="icon">${ICONS.bolt}</div><div class="num">{{KWH_ANO}}</div><div class="label">kWh/ano</div></div>
<div class="indicator-card"><div class="icon">${ICONS.leaf}</div><div class="num">{{CO2}} t</div><div class="label">CO₂ evitado</div></div>
<div class="indicator-card"><div class="icon">${ICONS.mapPin}</div><div class="num">{{MUNICIPIOS}}</div><div class="label">Municípios</div></div>
</div></div>`
}

export function pageHowItWorks(): string {
  return `<div class="catalog-page">
<div style="padding:20mm 20mm 0"><span class="section-tag">COMO FUNCIONA</span>
<h2 style="color:#004587;font-size:24px;font-weight:700;margin-top:6px">Sistema de Compensação</h2>
<p style="font-size:12px;color:#555;margin-bottom:16px">Entenda como a energia solar compartilhada chega até você</p></div>
<div class="flow-infographic">
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
<div style="padding:5mm 25mm">
<div class="data-card" style="margin-bottom:8px"><div class="key">1. Associação</div><div class="val">O cliente se associa à ACERSOL e recebe uma cota de créditos de energia</div></div>
<div class="data-card" style="margin-bottom:8px;border-left-color:#38A349"><div class="key">2. Geração</div><div class="val">Nossas usinas geram energia limpa injetada na rede da distribuidora</div></div>
<div class="data-card" style="margin-bottom:8px"><div class="key">3. Compensação</div><div class="val">Os créditos abatem o consumo na fatura de energia do associado</div></div>
<div class="data-card" style="border-left-color:#38A349"><div class="key">4. Economia</div><div class="val">O cliente paga apenas a diferença, com desconto garantido</div></div>
</div></div>`
}
