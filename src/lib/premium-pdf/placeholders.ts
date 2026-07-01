import { formatCurrency } from '@/lib/formatters'
import { getAssetUrl } from '@/lib/premium-pdf/styles'
import logoHorizontal from '@/assets/logomarca-horizontal-jpg-d6a8a.jpg'

export interface TemplateData {
  [key: string]: string | number | TemplateData[] | TemplateData
}

export function renderTemplate(html: string, data: TemplateData): string {
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
  return result
}

function findAsset(assets: any[], cat: string) {
  return assets.find((a) => a.category === cat)
}

function buildChartHtml(history: any[], maxConsumo: number): string {
  const bars = history
    .map((m) => {
      const rawVal = parseFloat(m.CONSUMO.replace(/[^\d.-]/g, '')) || 0
      const h = maxConsumo > 0 ? Math.max((rawVal / maxConsumo) * 100, 5) : 5
      const label = m.MES.substring(0, 3)
      return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">
      <div style="font-size:9px;font-weight:700;color:var(--primary);margin-bottom:4px">${rawVal}</div>
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
  const economiaPct = budget.economia_percentual || 0
  const filledMonthly = monthlyData.filter((m) => m.consumo_kwh > 0 || m.valor_conta > 0)

  const avgConta =
    filledMonthly.length > 0
      ? filledMonthly.reduce((s, m) => s + (m.valor_conta || 0), 0) / filledMonthly.length
      : budget.valor_conta || 0

  const avgConsumo =
    filledMonthly.length > 0
      ? filledMonthly.reduce((s, m) => s + (m.consumo_kwh || 0), 0) / filledMonthly.length
      : budget.creditos_necessarios || 0

  const maxConsumo =
    filledMonthly.length > 0
      ? Math.max(...filledMonthly.map((m) => m.consumo_kwh || 0))
      : budget.creditos_necessarios || 100

  const valorAtual = budget.valor_conta || avgConta
  const valorEstimado = valorAtual * (1 - economiaPct / 100)

  const mockUnits =
    units.length > 0
      ? units.map((u) => ({
          UC: u.numero_uc || '—',
          ENDERECO: [u.cidade, u.estado].filter(Boolean).join(' - ') || '—',
          CLASSE: u.classe || '—',
          CONSUMO: `${(u.averageConsumption || 0).toFixed(0)} kWh`,
        }))
      : [
          {
            UC: budget.uc || '—',
            ENDERECO: [budget.cidade, budget.estado].filter(Boolean).join(' - ') || '—',
            CLASSE: budget.classe || '—',
            CONSUMO: `${budget.creditos_necessarios || 0} kWh`,
          },
        ]

  const mockHistory =
    filledMonthly.length > 0
      ? filledMonthly.map((m) => ({
          MES: m.mes || '—',
          CONSUMO: `${(m.consumo_kwh || 0).toFixed(0)}`,
          VALOR: formatCurrency(m.valor_conta || 0),
          PRECO_KWH:
            m.consumo_kwh > 0 ? `R$ ${((m.valor_conta || 0) / m.consumo_kwh).toFixed(2)}` : '—',
        }))
      : [
          {
            MES: 'Estimado',
            CONSUMO: `${avgConsumo.toFixed(0)}`,
            VALOR: formatCurrency(valorAtual),
            PRECO_KWH: '—',
          },
        ]

  const chartHtml = buildChartHtml(mockHistory, maxConsumo)
  const obsText = budget.observacoes?.trim() || ''

  return {
    LOGO: logoUrl,
    CLIENTE: client?.name || client?.company || '—',
    CPF_CNPJ: client?.document_number || client?.cnpj || '—',
    CIDADE: budget.cidade || '—',
    ESTADO: budget.estado || '—',
    DISTRIBUIDORA: budget.distribuidora || '—',
    NUMERO_PROPOSTA: budget.numero || '—',
    DATA: budget.created
      ? new Date(budget.created).toLocaleDateString('pt-BR')
      : new Date().toLocaleDateString('pt-BR'),
    RESPONSAVEL: budget.responsavel || 'Equipe ACERSOL',
    ECONOMIA_PERCENTUAL: `${economiaPct}%`,
    ECONOMIA_MENSAL: formatCurrency(budget.economia_mensal || (valorAtual * economiaPct) / 100),
    ECONOMIA_ANUAL: formatCurrency(
      budget.economia_anual || ((valorAtual * economiaPct) / 100) * 12,
    ),
    CREDITOS_NECESSARIOS: `${Math.round(budget.creditos_necessarios || avgConsumo)}`,
    VALOR_ATUAL: formatCurrency(valorAtual),
    VALOR_ESTIMADO: formatCurrency(valorEstimado),
    MEDIA_KWH: Math.round(avgConsumo),
    USINA: budget.expand?.plant_id?.name || 'Usina Fotovoltaica ACERSOL',
    POTENCIA: `${budget.expand?.plant_id?.potencia_instalada || budget.expand?.plant_id?.capacity || 1000} kWp`,
    GERACAO: `${budget.expand?.plant_id?.generation_now || 120000} kWh/mês`,
    OBSERVACOES: obsText,
    SHOW_OBS: obsText ? 'block' : 'none',
    MAPA: '',
    CHART_HTML: chartHtml,
    IMG_CAPA: getAssetUrl(findAsset(assets, 'plant'), 'solar%20plant%20aerial', 1200, 1600),
    IMG_USINA: getAssetUrl(findAsset(assets, 'plant'), 'solar%20energy%20farm', 1200, 800),
    IMG_CLIENTE: logoUrl,
    IMG_SUSTENTABILIDADE: getAssetUrl(findAsset(assets, 'nature'), 'green%20nature', 800, 1000),
    IMG_EQUIPE: getAssetUrl(findAsset(assets, 'industry'), 'industry%20solar%20energy', 1200, 800),
    IMG_DRONE: getAssetUrl(findAsset(assets, 'panels'), 'solar%20panels%20drone', 1200, 800),
    IMG_BACKGROUND: getAssetUrl(findAsset(assets, 'nature'), 'nature%20landscape', 1200, 1600),
    ASSOCIADOS: '5.200+',
    USINAS_COUNT: '24',
    MEGAWATTS: '12,5',
    KWH_ANO: '18.5M',
    CO2: '5.400',
    MUNICIPIOS: '85',
    UNIDADES: mockUnits,
    HISTORICO: mockHistory,
  }
}
