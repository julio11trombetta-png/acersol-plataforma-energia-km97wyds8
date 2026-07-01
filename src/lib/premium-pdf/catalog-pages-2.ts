export function pageClientData(): string {
  return `<div class="catalog-page">
<div style="padding:25mm 20mm 10mm;">
  <span class="section-tag">DADOS DO CLIENTE</span>
  <h2 style="color:var(--primary);font-size:26px;font-weight:700;margin-top:6px;">Informações Cadastrais</h2>
</div>
<div class="data-grid">
  <div class="data-card"><div class="key">Cliente</div><div class="val">{{CLIENTE}}</div></div>
  <div class="data-card"><div class="key">CPF / CNPJ</div><div class="val">{{CPF_CNPJ}}</div></div>
  <div class="data-card"><div class="key">Cidade</div><div class="val">{{CIDADE}}</div></div>
  <div class="data-card"><div class="key">Estado</div><div class="val">{{ESTADO}}</div></div>
  <div class="data-card"><div class="key">Distribuidora</div><div class="val">{{DISTRIBUIDORA}}</div></div>
  <div class="data-card"><div class="key">Responsável</div><div class="val">{{RESPONSAVEL}}</div></div>
</div>
<div style="padding:15mm 20mm 5mm;">
  <span class="section-tag" style="background:var(--primary)">UNIDADES CONSUMIDORAS</span>
</div>
<div style="padding:0 20mm;">
  <table class="uc-table">
    <thead>
      <tr>
        <th>Unidade (UC)</th>
        <th>Endereço / Local</th>
        <th>Classe</th>
        <th>Consumo Médio</th>
      </tr>
    </thead>
    <tbody>
      {{#UNIDADES}}
      <tr>
        <td><strong>{{UC}}</strong></td>
        <td>{{ENDERECO}}</td>
        <td>{{CLASSE}}</td>
        <td>{{CONSUMO}}</td>
      </tr>
      {{/UNIDADES}}
    </tbody>
  </table>
</div>
</div>`
}

export function pageConsumptionHistory(): string {
  return `<div class="catalog-page">
<div style="padding:25mm 20mm 5mm;">
  <span class="section-tag">HISTÓRICO DE CONSUMO</span>
  <h2 style="color:var(--primary);font-size:26px;font-weight:700;margin-top:6px;">Análise de Consumo</h2>
</div>
<div class="dash-cards">
  <div class="dash-card"><div class="num">{{VALOR_ATUAL}}</div><div class="label">Média Fatura Atual</div></div>
  <div class="dash-card" style="border-top-color:var(--primary)"><div class="num">{{MEDIA_KWH}} kWh</div><div class="label">Média de Consumo</div></div>
  <div class="dash-card"><div class="num">{{ECONOMIA_MENSAL}}</div><div class="label">Economia Mensal Estimada</div></div>
</div>
<div style="padding:5mm 20mm;">
  {{CHART_HTML}}
</div>
<div style="padding:5mm 20mm 5mm;">
  <span class="section-tag" style="background:var(--primary)">DETALHAMENTO MENSAL</span>
</div>
<div style="padding:0 20mm;">
  <table class="uc-table">
    <thead>
      <tr>
        <th>Mês/Ano</th>
        <th>Consumo Total</th>
        <th>Valor Faturado</th>
        <th>Preço Médio (kWh)</th>
      </tr>
    </thead>
    <tbody>
      {{#HISTORICO}}
      <tr>
        <td><strong>{{MES}}</strong></td>
        <td>{{CONSUMO}}</td>
        <td>{{VALOR}}</td>
        <td>{{PRECO_KWH}}</td>
      </tr>
      {{/HISTORICO}}
    </tbody>
  </table>
</div>
</div>`
}

export function pageFinancialSimulation(): string {
  return `<div class="catalog-page flex-page">
<div style="padding:25mm 20mm 10mm; flex-shrink: 0;">
  <span class="section-tag">SIMULAÇÃO FINANCEIRA</span>
  <h2 style="color:var(--primary);font-size:26px;font-weight:700;margin-top:6px;">Comparativo de Economia</h2>
</div>
<div class="compare-container" style="flex-shrink: 0;">
  <div class="compare-box compare-before">
    <div class="label">Sem ACERSOL</div>
    <div class="value">{{VALOR_ATUAL}}</div>
    <div style="font-size:12px;color:#999;margin-top:6px">Valor médio mensal atual</div>
  </div>
  <div class="compare-arrow">→</div>
  <div class="compare-box compare-after">
    <div class="label">Com ACERSOL</div>
    <div class="value">{{VALOR_ESTIMADO}}</div>
    <div style="font-size:12px;color:#999;margin-top:6px">Valor estimado mensal</div>
  </div>
</div>
<div class="savings-highlight" style="flex-shrink: 0; padding-top: 10mm;">
  <div class="big">{{ECONOMIA_PERCENTUAL}}</div>
  <div class="label">de desconto garantido na fatura de energia compensada</div>
</div>
<div class="dash-cards" style="padding:10mm 20mm; flex-grow: 1; align-content: start;">
  <div class="dash-card" style="border-top-color:var(--accent)">
    <div class="num">{{ECONOMIA_MENSAL}}</div>
    <div class="label">Economia Mensal</div>
  </div>
  <div class="dash-card" style="border-top-color:var(--primary)">
    <div class="num">{{ECONOMIA_ANUAL}}</div>
    <div class="label">Economia Anual</div>
  </div>
  <div class="dash-card" style="border-top-color:#eab308">
    <div class="num">{{CREDITOS_NECESSARIOS}}</div>
    <div class="label">Créditos/Mês (kWh)</div>
  </div>
</div>
</div>`
}
