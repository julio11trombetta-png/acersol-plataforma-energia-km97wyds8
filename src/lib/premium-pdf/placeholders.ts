import { formatCurrency } from '@/lib/formatters'
import { getAssetUrl, ICONS } from '@/lib/premium-pdf/styles'
import logoHorizontal from '@/assets/logomarca-horizontal-jpg-d6a8a.jpg'

function safeNum(v: any): number {
  const n = Number(v)
  return isNaN(n) || !isFinite(n) ? 0 : n
}

export interface TemplateData {
  [key: string]: string | number | TemplateData[] | TemplateData
}

export function renderTemplate(html: string, data: TemplateData, pageNum: number): string {
  let result = html
  result = result.replace(
    /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_, key: string, content: string) => {
      const items = data[key]
      if (!Array.isArray(items)) return ''
      return items
        .map((item: any) =>
          content.replace(/\{\{(\w+)\}\}/g, (_m: string, k: string) => String(item[k] ?? '')),
        )
        .join('')
    },
  )
  result = result.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const val = data[key]
    return val !== undefined && val !== null ? String(val) : ''
  })
  result = result.replace(/\{\{PAGE_NUM\}\}/g, String(pageNum))
  return result
}

function findAsset(assets: any[], cat: string, usedKeys: string[] = []) {
  const matches = assets.filter(
    (a) => a.category === cat && !usedKeys.includes(a.id || a.url || ''),
  )
  if (matches.length > 0) {
    const selected = matches[Math.floor(Math.random() * matches.length)]
    usedKeys.push(selected.id || selected.url || '')
    return selected
  }
  return assets.find((a) => a.category === cat)
}

function formatMoneyOrEmpty(val: number): string {
  if (!val || isNaN(val) || val <= 0) return 'Aguardando dados'
  return formatCurrency(val)
}

function formatNumOrEmpty(val: number, suffix = ''): string {
  if (!val || isNaN(val) || val <= 0) return '—'
  return `${val.toLocaleString('pt-BR')}${suffix}`
}

function buildChartHtml(history: any[], maxConsumo: number): string {
  if (history.length === 0 || maxConsumo <= 0) {
    return `
      <div style="background:#f8fafc; border-radius:12px; padding:40px 20px; border:1px solid #e8e8e8; text-align:center;">
        <div style="color:var(--primary); margin-bottom:12px; display:flex; justify-content:center;">${ICONS.clock || ''}</div>
        <h3 style="font-size:16px;color:#555;margin-bottom:8px;">Aguardando histórico de consumo</h3>
        <p style="font-size:13px;color:#888;">Os dados de faturamento mensal estão sendo processados.</p>
      </div>
    `
  }

  const bars = history
    .map((m) => {
      const rawVal = parseFloat(m.CONSUMO.replace(/[^\d.-]/g, '')) || 0
      const h = maxConsumo > 0 ? Math.max((rawVal / maxConsumo) * 100, 5) : 5
      const label = String(m.MES).substring(0, 3)
      return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">
      <div style="font-size:9px;font-weight:700;color:var(--primary);margin-bottom:4px">${rawVal > 0 ? rawVal : ''}</div>
      <div style="width:100%;border-radius:4px 4px 0 0;background:linear-gradient(180deg, var(--primary), var(--accent));height:${h}%;min-height:4px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"></div>
      <div style="font-size:10px;margin-top:6px;color:#666;text-align:center;font-weight:600;text-transform:uppercase;">${label}</div>
    </div>`
    })
    .join('')

  return `
    <div style="background:#f8fafc; border-radius:12px; padding:20px; border:1px solid #e8e8e8;">
      <h3 style="font-size:13px;color:#555;margin-bottom:16px;text-align:center;text-transform:uppercase;letter-spacing:1px;">Evolução do Consumo de Energia (kWh)</h3>
      <div style="display:flex;align-items:flex-end;gap:8px;height:180px;padding:0 8px;border-bottom:2px solid #e2e8f0;">
        ${bars}
      </div>
    </div>
  `
}

export function buildTemplateData(
  budget: any,
  units: any[],
  monthlyData: any[],
  assets: any[],
): TemplateData {
  const client = budget.expand?.client_id || budget.expand?.lead_id
  const logoUrl = `${window.location.origin}${logoHorizontal}`
  const economiaPct = safeNum(budget.economia_percentual) || 0
  const filledMonthly = monthlyData.filter((m) => m.consumo_kwh > 0 || m.valor_conta > 0)

  const avgConta =
    filledMonthly.length > 0
      ? filledMonthly.reduce((s, m) => s + safeNum(m.valor_conta), 0) / filledMonthly.length
      : safeNum(budget.valor_conta) || 0

  const avgConsumo =
    filledMonthly.length > 0
      ? filledMonthly.reduce((s, m) => s + safeNum(m.consumo_kwh), 0) / filledMonthly.length
      : safeNum(budget.creditos_necessarios) || 0

  const maxConsumo =
    filledMonthly.length > 0
      ? Math.max(...filledMonthly.map((m) => safeNum(m.consumo_kwh)))
      : safeNum(budget.creditos_necessarios) || 100

  const valorAtual = safeNum(budget.valor_conta) || avgConta
  const valorEstimado = valorAtual * (1 - economiaPct / 100)

  const ucs =
    units.length > 0
      ? units
      : [
          {
            numero_uc: budget.uc,
            cidade: budget.cidade,
            estado: budget.estado,
            classe: budget.classe,
            averageConsumption: budget.creditos_necessarios,
          },
        ].filter((u) => u.numero_uc || u.cidade)

  const tableUnidades =
    ucs.length > 0
      ? `<table class="uc-table">
    <thead>
      <tr>
        <th>Unidade (UC)</th>
        <th>Endereço / Local</th>
        <th>Classe</th>
        <th>Consumo Médio</th>
      </tr>
    </thead>
    <tbody>
      ${ucs
        .map(
          (u) => `<tr>
        <td><strong>${u.numero_uc || '—'}</strong></td>
        <td>${[u.cidade, u.estado].filter(Boolean).join(' - ') || '—'}</td>
        <td>${u.classe || '—'}</td>
        <td>${u.averageConsumption > 0 ? `${Math.round(u.averageConsumption)} kWh` : '—'}</td>
      </tr>`,
        )
        .join('')}
    </tbody>
  </table>`
      : `<div style="padding:20px; text-align:center; background:#f8fafc; border-radius:8px; border:1px dashed #ccc; color:#666;">Aguardando dados das unidades consumidoras</div>`

  const historyDisplay =
    filledMonthly.length > 0
      ? filledMonthly.map((m) => ({
          MES: m.mes || '—',
          CONSUMO: m.consumo_kwh > 0 ? `${Math.round(m.consumo_kwh)}` : '—',
          VALOR: m.valor_conta > 0 ? formatCurrency(m.valor_conta) : '—',
          PRECO_KWH:
            m.consumo_kwh > 0 && m.valor_conta > 0
              ? `R$ ${(m.valor_conta / m.consumo_kwh).toFixed(2)}`
              : '—',
        }))
      : []

  const tableHistorico =
    historyDisplay.length > 0
      ? `<table class="uc-table">
    <thead>
      <tr>
        <th>Mês/Ano</th>
        <th>Consumo Total (kWh)</th>
        <th>Valor Faturado</th>
        <th>Preço Médio (kWh)</th>
      </tr>
    </thead>
    <tbody>
      ${historyDisplay
        .map(
          (h) => `<tr>
        <td><strong>${h.MES}</strong></td>
        <td>${h.CONSUMO}</td>
        <td>${h.VALOR}</td>
        <td>${h.PRECO_KWH}</td>
      </tr>`,
        )
        .join('')}
    </tbody>
  </table>`
      : `<div style="padding:20px; text-align:center; background:#f8fafc; border-radius:8px; border:1px dashed #ccc; color:#666;">Aguardando histórico de faturamento</div>`

  const chartHtml = buildChartHtml(historyDisplay, maxConsumo)
  const obsText = budget.observacoes?.trim() || ''

  const usedAssets: string[] = []
  const imgCapa = getAssetUrl(
    findAsset(assets, 'plant', usedAssets),
    'solar%20plant%20aerial',
    1200,
    1600,
  )
  const imgSustentabilidade = getAssetUrl(
    findAsset(assets, 'nature', usedAssets),
    'green%20nature',
    800,
    1000,
  )
  const imgUsina = getAssetUrl(
    findAsset(assets, 'plant', usedAssets),
    'solar%20energy%20farm',
    1200,
    800,
  )

  const potUsina =
    safeNum(budget.expand?.plant_id?.potencia_instalada) ||
    safeNum(budget.expand?.plant_id?.capacity)
  const geracaoUsina = safeNum(budget.expand?.plant_id?.generation_now)

  const getFooter = () => {
    return `<div class="page-footer">
      <div class="logo"><img src="${logoUrl}" alt="ACERSOL"/></div>
      <div class="info">
        <span>(54) 9267-9352</span>
        <span>contato@acersol.com.br</span>
        <span>www.acersol.com.br</span>
      </div>
      <div class="page-number">{{PAGE_NUM}}</div>
    </div>`
  }

  return {
    LOGO: logoUrl,
    CLIENTE: client?.name || client?.company || 'Não informado',
    CPF_CNPJ: client?.document_number || client?.cnpj || '—',
    CIDADE: budget.cidade || '—',
    ESTADO: budget.estado || '—',
    CIDADE_ESTADO: [budget.cidade, budget.estado].filter(Boolean).join(' - ') || 'Não informado',
    DISTRIBUIDORA: budget.distribuidora || '—',
    NUMERO_PROPOSTA: budget.numero || '—',
    DATA: budget.created
      ? new Date(budget.created).toLocaleDateString('pt-BR')
      : new Date().toLocaleDateString('pt-BR'),
    RESPONSAVEL: budget.responsavel || 'Equipe ACERSOL',
    ECONOMIA_PERCENTUAL_LABEL: economiaPct > 0 ? `${economiaPct}%` : '—',
    ECONOMIA_MENSAL_LABEL: formatMoneyOrEmpty(
      budget.economia_mensal || (valorAtual * economiaPct) / 100,
    ),
    ECONOMIA_ANUAL_LABEL: formatMoneyOrEmpty(
      budget.economia_anual || ((valorAtual * economiaPct) / 100) * 12,
    ),
    CREDITOS_NECESSARIOS_LABEL: formatNumOrEmpty(budget.creditos_necessarios || avgConsumo),
    VALOR_ATUAL_LABEL: formatMoneyOrEmpty(valorAtual),
    VALOR_ESTIMADO_LABEL: formatMoneyOrEmpty(valorEstimado),
    MEDIA_KWH_LABEL: formatNumOrEmpty(avgConsumo),
    QTD_UCS: ucs.length > 0 ? String(ucs.length) : '—',
    USINA: budget.expand?.plant_id?.name || 'Usina Fotovoltaica ACERSOL',
    POTENCIA_LABEL: formatNumOrEmpty(potUsina, ' kWp'),
    GERACAO_LABEL: formatNumOrEmpty(geracaoUsina, ' kWh/mês'),
    STATUS_USINA: budget.expand?.plant_id?.status || 'Em Operação',
    OBSERVACOES: obsText,
    SHOW_OBS: obsText ? 'block' : 'none',
    CHART_HTML: chartHtml,
    TABLE_UNIDADES: tableUnidades,
    TABLE_HISTORICO: tableHistorico,
    IMG_CAPA: imgCapa,
    IMG_USINA: imgUsina,
    IMG_SUSTENTABILIDADE: imgSustentabilidade,
    DADO_ASSOCIADOS: 'Em atualização',
    DADO_USINAS: 'Em atualização',
    DADO_MW: 'Em atualização',
    DADO_GERACAO: 'Em atualização',
    DADO_CO2: 'Em atualização',
    DADO_CIDADES: 'Em atualização',
    FOOTER: getFooter(),
  }
}
