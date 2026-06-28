import { formatCurrency } from '@/lib/formatters'

export function generateInvoicePDF(invoice: any) {
  const client = invoice.expand?.clientId
  const discount = Number(client?.discount_percentage) || 0
  const subtotal = Number(invoice.amount) || 0
  const discountAmount = (subtotal * discount) / 100
  const salesTax = 0
  const shipping = 0
  const total = subtotal - discountAmount + salesTax + shipping
  const today = new Date().toLocaleDateString('pt-BR')
  const dueDate = invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('pt-BR') : '—'
  const invoiceNum = invoice.id ? invoice.id.slice(0, 8).toUpperCase() : '—'
  const taxId = `TAX-${String(invoice.month || '')
    .replace(/\s/g, '')
    .toUpperCase()}`

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Fatura ${invoice.month}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a1a;padding:40px;max-width:800px;margin:0 auto}
.header{display:flex;justify-content:space-between;border-bottom:3px solid #16a34a;padding-bottom:20px;margin-bottom:30px}
.company h1{font-size:28px;color:#16a34a}.company p{font-size:13px;color:#555;margin-top:4px}
.doc-info{text-align:right}.doc-info h2{font-size:24px}.doc-info p{font-size:13px;color:#555;margin-top:4px}
.section-title{font-size:12px;font-weight:bold;text-transform:uppercase;color:#888;margin-bottom:8px;letter-spacing:1px}
.info-box{background:#f5f5f5;padding:12px 16px;border-radius:6px;font-size:14px;line-height:1.6}
.info-grid{display:flex;gap:20px;margin-bottom:25px}.info-grid>div{flex:1}
table{width:100%;border-collapse:collapse;margin-bottom:20px}
th{background:#16a34a;color:#fff;padding:10px;text-align:left;font-size:13px}
td{padding:10px;border-bottom:1px solid #ddd;font-size:13px}
.totals{margin-left:auto;width:300px}.totals table{width:100%}.totals td{border:none;padding:6px 10px}
.total-row{font-weight:bold;font-size:16px;border-top:2px solid #16a34a}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #ddd;text-align:center}
.footer p{font-size:13px;color:#555;margin-bottom:8px}.thanks{font-size:18px;font-weight:bold;color:#16a34a;margin-top:12px}
@media print{body{padding:20px}}
</style></head><body>
<div class="header"><div class="company"><h1>ACERSOL</h1><p>Energia Solar Compartilhada</p><p>Av. Paulista, 1000 - São Paulo, SP</p><p>contato@acersol.com.br | (11) 4000-0000</p></div>
<div class="doc-info"><h2>FATURA</h2><p>Data: ${today}</p><p>Fatura Nº: ${invoiceNum}</p><p>ID da Taxa: ${taxId}</p></div></div>
<div class="info-grid"><div><div class="section-title">Conta Para</div><div class="info-box"><strong>${client?.name || '—'}</strong><br>${client?.address || '—'}<br>${client?.phone || '—'}<br>${client?.email || '—'}</div></div>
<div><div class="section-title">Enviar Para</div><div class="info-box">${client?.name || '—'}<br>${client?.address || '—'}<br>UC: ${client?.energyUnitId || '—'}</div></div></div>
<table><tr><th>Vendedor</th><th>Correio Número</th><th>Data de Envio</th><th>Enviado Via</th><th>Termos</th></tr>
<tr><td>ACERSOL</td><td>${invoiceNum}</td><td>${today}</td><td>E-mail</td><td>Venc: ${dueDate}</td></tr></table>
<table><tr><th>Quantidade</th><th>Descrição</th><th>Preço Unitário</th><th>Quantia</th></tr>
<tr><td>1</td><td>Energia Solar - ${invoice.month}</td><td>${formatCurrency(subtotal)}</td><td>${formatCurrency(subtotal)}</td></tr>
${discount > 0 ? `<tr><td>1</td><td>Desconto (${discount}%)</td><td>-${formatCurrency(discountAmount)}</td><td>-${formatCurrency(discountAmount)}</td></tr>` : ''}</table>
<div class="totals"><table>
<tr><td>Subtotal</td><td style="text-align:right">${formatCurrency(subtotal)}</td></tr>
${discount > 0 ? `<tr><td>Desconto (${discount}%)</td><td style="text-align:right">-${formatCurrency(discountAmount)}</td></tr>` : ''}
<tr><td>Imposto da Taxa</td><td style="text-align:right">${formatCurrency(0)}</td></tr>
<tr><td>Taxa de Venda</td><td style="text-align:right">${formatCurrency(salesTax)}</td></tr>
<tr><td>Envio e Manejo</td><td style="text-align:right">${formatCurrency(shipping)}</td></tr>
<tr class="total-row"><td>Total</td><td style="text-align:right">${formatCurrency(total)}</td></tr>
</table></div>
<div class="footer"><p>Faça todos os cheques pagáveis à ACERSOL Energia Solar Compartilhada</p><p>Vencimento: ${dueDate} | Status: ${invoice.status || 'Pendente'}</p><p class="thanks">OBRIGADO POR SEU NEGÓCIO!</p></div>
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
