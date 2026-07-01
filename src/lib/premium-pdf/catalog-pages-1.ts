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
    <p class="cover-slogan" style="font-size:20px; color:#e2e8f0; margin-top: 16px; font-weight: 500;">Energia Compartilhada. Economia Inteligente.</p>
  </div>
  <div class="cover-footer">
    <p style="font-size:20px;font-weight:700;margin-bottom:8px;">{{CLIENTE}}</p>
    <p style="font-size:14px; opacity:0.9; margin-bottom:4px;">{{CIDADE_ESTADO}} | {{DATA}}</p>
    <p style="font-size:14px; opacity:0.9; margin-bottom:4px;">Proposta Nº {{NUMERO_PROPOSTA}}</p>
    <p style="font-size:14px; opacity:0.9;">Consultor: {{RESPONSAVEL}}</p>
  </div>
</div>
</div>`
}

export function pageDiagnostico(): string {
  return `<div class="catalog-page flex-page">
<div class="page-header">
  <span class="section-tag">RESUMO EXECUTIVO</span>
  <h2>Diagnóstico Energético</h2>
</div>
<div class="page-content" style="flex-grow: 1; padding: 0 20mm;">
  <p class="intro-text" style="font-size:16px; line-height:1.6; color:#444; margin-bottom: 30px;">Após a análise das informações fornecidas, identificamos potencial para redução dos custos com energia elétrica através da modalidade de Geração Distribuída Compartilhada.</p>
  
  <div class="diag-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
    <div class="data-card">
      <div class="key">Cliente</div>
      <div class="val">{{CLIENTE}}</div>
    </div>
    <div class="data-card">
      <div class="key">Localidade</div>
      <div class="val">{{CIDADE_ESTADO}}</div>
    </div>
    <div class="data-card">
      <div class="key">Concessionária</div>
      <div class="val">{{DISTRIBUIDORA}}</div>
    </div>
    <div class="data-card">
      <div class="key">Unidades (UCs)</div>
      <div class="val">{{QTD_UCS}}</div>
    </div>
    <div class="data-card">
      <div class="key">Consumo Médio</div>
      <div class="val">{{MEDIA_KWH_LABEL}}</div>
    </div>
    <div class="data-card" style="border-left-color:var(--accent); background:#f0fdf4;">
      <div class="key" style="color:var(--accent);">Economia Estimada</div>
      <div class="val" style="color:var(--accent); font-size:18px;">{{ECONOMIA_PERCENTUAL_LABEL}}</div>
    </div>
  </div>
</div>
{{FOOTER}}
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
<div class="indicators-grid" style="flex-grow: 1;">
  <div class="indicator-card"><div class="icon">${ICONS.users}</div><div class="num" style="font-size:20px;">{{DADO_ASSOCIADOS}}</div><div class="label">Associados</div></div>
  <div class="indicator-card"><div class="icon">${ICONS.sun}</div><div class="num" style="font-size:20px;">{{DADO_USINAS}}</div><div class="label">Usinas</div></div>
  <div class="indicator-card"><div class="icon">${ICONS.zap}</div><div class="num" style="font-size:20px;">{{DADO_MW}}</div><div class="label">Potência</div></div>
  <div class="indicator-card"><div class="icon">${ICONS.bolt}</div><div class="num" style="font-size:20px;">{{DADO_GERACAO}}</div><div class="label">Geração Limpa</div></div>
  <div class="indicator-card"><div class="icon">${ICONS.leaf}</div><div class="num" style="font-size:20px;">{{DADO_CO2}}</div><div class="label">Sustentabilidade</div></div>
  <div class="indicator-card"><div class="icon">${ICONS.mapPin}</div><div class="num" style="font-size:20px;">{{DADO_CIDADES}}</div><div class="label">Cobertura</div></div>
</div>
{{FOOTER}}
</div>`
}

export function pageHowItWorks(): string {
  return `<div class="catalog-page flex-page">
<div class="page-header">
  <span class="section-tag">COMO FUNCIONA</span>
  <h2>Sistema de Compensação</h2>
  <p class="subtitle">Entenda como a energia solar compartilhada chega até você de forma simples e transparente.</p>
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
    <div class="val" style="font-weight:400;">O cliente se associa à ACERSOL e recebe uma cota de créditos de energia proporcional ao seu consumo.</div>
  </div>
  <div class="data-card" style="margin-bottom:12px;border-left-color:var(--accent)">
    <div class="key">2. Geração</div>
    <div class="val" style="font-weight:400;">Nossas usinas geram energia limpa que é injetada diretamente na rede da distribuidora local.</div>
  </div>
  <div class="data-card" style="margin-bottom:12px">
    <div class="key">3. Compensação</div>
    <div class="val" style="font-weight:400;">A distribuidora converte a energia injetada em créditos que abatem o consumo na sua fatura de energia.</div>
  </div>
  <div class="data-card" style="border-left-color:var(--accent)">
    <div class="key">4. Economia</div>
    <div class="val" style="font-weight:400;">Você paga apenas a diferença para a distribuidora e a fatura da ACERSOL com desconto garantido, gerando economia todo mês.</div>
  </div>
</div>
{{FOOTER}}
</div>`
}
