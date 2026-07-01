export function pageClientData(): string {
  return `<div class="catalog-page">
<div style="padding:20mm 20mm 5mm"><span class="section-tag">DADOS DO CLIENTE</span>
<h2 style="color:#004587;font-size:22px;font-weight:700;margin-top:6px">Informações Cadastrais</h2></div>
<div class="data-grid">
<div class="data-card"><div class="key">Cliente</div><div class="val">{{CLIENTE}}</div></div>
<div class="data-card"><div class="key">CPF / CNPJ</div><div class="val">{{CPF_CNPJ}}</div></div>
<div class="data-card"><div class="key">Cidade</div><div class="val">{{CIDADE}}</div></div>
<div class="data-card"><div class="key">Estado</div><div class="val">{{ESTADO}}</div></div>
<div class="data-card"><div class="key">Distribuidora</div><div class="val">{{DISTRIBUIDORA}}</div></div>
<div class="data-card"><div class="key">Responsável</div><div class="val">{{RESPONSAVEL}}</div></div>
</div>
<div style="padding:8mm 20mm 5mm"><span class="section-tag">UNIDADES CONSUMIDORAS</span></div>
<table class="uc-table" style="margin:0 20mm;width:calc(100% - 40mm)">
<thead><tr><th>Unidade (UC)</th><th>Local</th><th>Classe</th><th>Consumo Médio</th></tr></thead>
<tbody>
{{#UNIDADES}}
<tr><td>{{UC}}</td><td>{{ENDERECO}}</td><td>{{CLASSE}}</td><td>{{CONSUMO}}</td></tr>
{{/UNIDADES}}
</tbody></table>
</div>`
}

export function pageConsumptionHistory(): string {
  return `<div class="catalog-page">
<div style="padding:20mm 20mm 5mm"><span class="section-tag">HISTÓRICO DE CONSUMO</span>
<h2 style="color:#004587;font-size:22px;font-weight:700;margin-top:6px">Análise de Consumo</h2></div>
<div class="dash-cards">
<div class="dash-card"><div class="num">{{VALOR_ATUAL}}</div><div class="label">Média Conta Mensal</div></div>
<div class="dash-card"><div class="num">{{ECONOMIA_MENSAL}}</div><div class="label">Economia Mensal</div></div>
<div class="dash-card"><div class="num">{{ECONOMIA_ANUAL}}</div><div class="label">Economia Anual</div></div>
</div>
<div style="padding:8mm 20mm 5mm"><span class="section-tag">DETALHAMENTO MENSAL</span></div>
<table class="uc-table" style="margin:0 20mm;width:calc(100% - 40mm)">
<thead><tr><th>Mês</th><th>Consumo</th><th>Valor da Conta</th><th>Preço kWh</th></tr></thead>
<tbody>
{{#HISTORICO}}
<tr><td>{{MES}}</td><td>{{CONSUMO}}</td><td>{{VALOR}}</td><td>{{PRECO_KWH}}</td></tr>
{{/HISTORICO}}
</tbody></table>
</div>`
}

export function pageFinancialSimulation(): string {
  return `<div class="catalog-page">
<div style="padding:20mm 20mm 0"><span class="section-tag">SIMULAÇÃO FINANCEIRA</span>
<h2 style="color:#004587;font-size:22px;font-weight:700;margin-top:6px">Comparativo de Economia</h2></div>
<div class="compare-container">
<div class="compare-box compare-before">
<div class="label">Sem ACERSOL</div>
<div class="value">{{VALOR_ATUAL}}</div>
<div style="font-size:10px;color:#999;margin-top:4px">Valor atual mensal</div>
</div>
<div class="compare-arrow">→</div>
<div class="compare-box compare-after">
<div class="label">Com ACERSOL</div>
<div class="value">{{VALOR_ESTIMADO}}</div>
<div style="font-size:10px;color:#999;margin-top:4px">Valor estimado mensal</div>
</div>
</div>
<div class="savings-highlight">
<div class="big">{{ECONOMIA_PERCENTUAL}}</div>
<div class="label">de economia na fatura de energia</div>
</div>
<div class="dash-cards" style="padding:0 20mm 15mm">
<div class="dash-card" style="border-top-color:#38A349"><div class="num">{{ECONOMIA_MENSAL}}</div><div class="label">Economia Mensal</div></div>
<div class="dash-card" style="border-top-color:#004587"><div class="num">{{ECONOMIA_ANUAL}}</div><div class="label">Economia Anual</div></div>
<div class="dash-card" style="border-top-color:#FFB800"><div class="num">{{ECONOMIA_PERCENTUAL}}</div><div class="label">Redução Total</div></div>
</div>
</div>`
}
