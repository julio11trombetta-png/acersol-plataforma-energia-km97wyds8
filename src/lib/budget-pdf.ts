import { formatCurrency } from '@/lib/formatters'

export function generateBudgetPDF(budget: any) {
  const client = budget.expand?.client_id || budget.expand?.lead_id
  const today = new Date().toLocaleDateString('pt-BR')
  const validade = budget.validade ? new Date(budget.validade).toLocaleDateString('pt-BR') : '—'
  const mensal = formatCurrency(budget.economia_mensal || 0)
  const anual = formatCurrency(budget.economia_anual || 0)
  const conta = formatCurrency(budget.valor_conta || 0)

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Proposta ${budget.numero}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a1a}
.page{padding:40px;max-width:800px;margin:0 auto;page-break-after:always;min-height:90vh}
.page:last-child{page-break-after:auto}
h1{color:#16a34a;font-size:24px;margin-bottom:8px}h2{color:#16a34a;font-size:18px;margin:20px 0 10px}
.header{display:flex;justify-content:space-between;border-bottom:3px solid #16a34a;padding-bottom:16px;margin-bottom:24px}
.header h1{font-size:28px}.header p{font-size:12px;color:#555;margin-top:2px}
.info-box{background:#f5f5f5;padding:12px 16px;border-radius:6px;font-size:13px;line-height:1.8;margin-bottom:16px}
table{width:100%;border-collapse:collapse;margin:12px 0}
th{background:#16a34a;color:#fff;padding:8px;text-align:left;font-size:12px}
td{padding:8px;border-bottom:1px solid #ddd;font-size:12px}
.chart-bar{display:flex;align-items:end;gap:20px;height:200px;margin:20px 0}
.bar{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:end}
.bar-fill{width:100%;border-radius:4px 4px 0 0}.bar-label{font-size:11px;margin-top:6px}
.benefits li{margin-bottom:8px;font-size:13px;line-height:1.5}
.sign{margin-top:60px;display:flex;justify-content:space-between}
.sign div{width:45%;border-top:1px solid #333;padding-top:8px;font-size:11px;color:#555}
@media print{body{print-color-adjust:exact}}
</style></head><body>
<div class="page"><div class="header"><div><h1>ACERSOL</h1><p>Energia Solar Compartilhada</p><p>contato@acersol.com.br | (11) 4000-0000</p></div>
<div style="text-align:right"><h1 style="font-size:20px">PROPOSTA DE PARTICIPAÇÃO</h1><p>Nº ${budget.numero || '—'}</p><p>${today}</p></div></div>
<h2>Dados do Cliente</h2><div class="info-box"><strong>${client?.name || client?.company || '—'}</strong><br>
Cidade: ${budget.cidade || '—'} - ${budget.estado || '—'}<br>Distribuidora: ${budget.distribuidora || '—'}<br>
UC: ${budget.uc || '—'}<br>Responsável: ${budget.responsavel || '—'}</div></div>
<div class="page"><h2>Histórico de Consumo</h2>
<table><tr><th>Mês</th><th>Consumo (kWh)</th><th>Valor da Conta</th></tr>
<tr><td>Média Mensal</td><td>${budget.consumo_medio || 0}</td><td>${conta}</td></tr></table>
<h2>Comparativo: Antes vs. Depois</h2><div class="chart-bar">
<div class="bar"><div class="bar-fill" style="background:#ef4444;height:100%"><span style="color:#fff;font-size:11px;padding:4px">${conta}</span></div><div class="bar-label">Sem ACERSOL</div></div>
<div class="bar"><div class="bar-fill" style="background:#16a34a;height:${100 - (budget.economia_percentual || 0)}%"><span style="color:#fff;font-size:11px;padding:4px">${formatCurrency((budget.valor_conta || 0) - (budget.economia_mensal || 0))}</span></div><div class="bar-label">Com ACERSOL</div></div>
</div><p style="font-size:13px;margin-top:12px">Economia mensal: <strong>${mensal}</strong> | Economia anual: <strong>${anual}</strong> (${budget.economia_percentual || 0}%)</p></div>
<div class="page"><h2>Modelo de Associação</h2><div class="info-box">
<p style="margin-bottom:10px"><strong>Como funciona a energia solar compartilhada?</strong></p>
<p style="margin-bottom:8px">A ACERSOL opera usinas solares que geram energia limpa. Como associado, você recebe créditos de energia proporcionais à sua cota, que abatem o valor da sua fatura.</p>
<p style="margin-bottom:8px">✓ Sem instalação de equipamentos na sua propriedade</p>
<p style="margin-bottom:8px">✓ Sem investimento inicial</p>
<p style="margin-bottom:8px">✓ Sem manutenção</p>
<p>Você continua com sua distribuidora, mas paga menos pela energia consumida.</p>
</div></div>
<div class="page"><h2>Benefícios da Associação</h2><ul class="benefits">
<li><strong>Energia Limpa:</strong> 100% de energia renovável, reduzindo sua pegada de carbono.</li>
<li><strong>Sem Manutenção:</strong> Toda a manutenção é responsabilidade da ACERSOL.</li>
<li><strong>Economia Garantida:</strong> Redução de ${budget.economia_percentual || 0}% na fatura de energia.</li>
<li><strong>Conformidade Legal:</strong> Atende à Lei 14.300/2022 e resoluções da ANEEL.</li>
<li><strong>Sem Investimento:</strong> Sem custos iniciais ou hidden fees.</li>
<li><strong>Flexibilidade:</strong> Créditos utilizáveis conforme seu consumo.</li>
</ul></div>
<div class="page"><h2>Condições e Validação</h2><div class="info-box">
<p><strong>Validade da Proposta:</strong> ${validade}</p>
<p><strong>Economia Mensal Estimada:</strong> ${mensal}</p>
<p><strong>Economia Anual Estimada:</strong> ${anual}</p>
<p><strong>Créditos Necessários:</strong> ${budget.creditos_necessarios || 0} kWh/mês</p>
<p><strong>Status:</strong> ${budget.status || 'Rascunho'}</p>
</div><p style="font-size:12px;color:#555;margin:16px 0">Esta proposta tem caráter informativo e não constitui vínculo contratual. A formalização ocorre mediante assinatura do contrato de associação.</p>
<div class="sign"><div>Assinatura do Cliente</div><div>Assinatura ACERSOL</div></div>
<p style="text-align:center;margin-top:40px;color:#16a34a;font-weight:bold">ACERSOL - Energia Solar Compartilhada</p></div>
</body></html>`

  const win = window.open('', '_blank')
  if (!win) {
    alert('Por favor, permita popups para gerar o PDF.')
    return
  }
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 500)
}
