export function pageConsumptionHistory(): string {
  return `
    <div class="catalog-page page-analysis">
      <div class="header">
        <h1 class="page-title">ANÁLISE DAS FATURAS</h1>
        <h2 class="page-subtitle">Histórico de consumo (12 meses)</h2>
      </div>
      <div class="content">
        {{CHART_CONSUMO}}
        {{CHART_VALOR}}
        
        <div class="analysis-summary">
          <div class="summary-card bg-primary">
            <div class="label">CONSUMO MÉDIO</div>
            <div class="value">{{MEDIA_KWH_LABEL}}</div>
            <div class="unit">kWh/mês</div>
          </div>
          <div class="summary-card bg-accent">
            <div class="label">CONTA MÉDIA</div>
            <div class="value">{{CONTA_MEDIA_LABEL}}</div>
            <div class="unit">/mês</div>
          </div>
          <div class="summary-card bg-dark">
            <div class="label">PREÇO MÉDIO</div>
            <div class="value">{{PRECO_MEDIO_LABEL}}</div>
            <div class="unit">/kWh</div>
          </div>
        </div>
      </div>
      {{FOOTER}}
    </div>
  `
}

export function pageFinancialSimulation(): string {
  return `
    <div class="catalog-page page-simulation">
      <div class="header">
        <h1 class="page-title">SIMULAÇÃO FINANCEIRA</h1>
        <h2 class="page-subtitle">Antes x Depois</h2>
      </div>
      <div class="content">
        <div class="sim-compare">
          <div class="sim-box before">
            <div class="box-header">SEM ACERSOL</div>
            <div class="box-value">{{VALOR_ATUAL_LABEL}}</div>
            <div class="box-label">Conta média<br/>mensal</div>
          </div>
          <div class="sim-box after">
            <div class="box-header">COM ACERSOL</div>
            <div class="box-value">{{VALOR_ESTIMADO_LABEL}}</div>
            <div class="box-label">Conta média<br/>mensal</div>
          </div>
          <div class="sim-economy-badge">
            <span>ECONOMIA</span>
            <strong>{{ECONOMIA_PERCENTUAL_LABEL}}</strong>
          </div>
        </div>

        <div class="sim-results">
          <div class="res-box">
            <div class="res-val">{{ECONOMIA_MENSAL_LABEL}}</div>
            <div class="res-lbl">Economia mensal</div>
          </div>
          <div class="res-box">
            <div class="res-val">{{ECONOMIA_ANUAL_LABEL}}</div>
            <div class="res-lbl">Economia anual</div>
          </div>
        </div>

        <div class="sim-disclaimer">
          <span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>
          Economia estimada considerando o consumo médio atual e a disponibilidade de créditos da usina designada.
        </div>
      </div>
      {{FOOTER}}
    </div>
  `
}
