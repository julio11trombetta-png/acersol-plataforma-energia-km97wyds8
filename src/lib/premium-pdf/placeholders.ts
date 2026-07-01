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
  const valorAtual =
    budget.valor_conta ||
    filledMonthly.reduce((s, m) => s + (m.valor_conta || 0), 0) / (filledMonthly.length || 1)
  const valorEstimado = valorAtual * (1 - economiaPct / 100)

  const mockUnits =
    units.length > 0
      ? units.map((u) => ({
          UC: u.numero_uc || '—',
          ENDERECO: `${u.cidade || '—'}/${u.estado || '—'}`,
          CLASSE: u.classe || '—',
          CONSUMO: `${(u.averageConsumption || 0).toFixed(0)} kWh`,
        }))
      : [
          {
            UC: budget.uc || '—',
            ENDERECO: `${budget.cidade || '—'}/${budget.estado || '—'}`,
            CLASSE: budget.classe || '—',
            CONSUMO: `${budget.creditos_necessarios || 0} kWh`,
          },
        ]

  const mockHistory =
    filledMonthly.length > 0
      ? filledMonthly.map((m) => ({
          MES: m.mes || '—',
          CONSUMO: `${(m.consumo_kwh || 0).toFixed(0)} kWh`,
          VALOR: formatCurrency(m.valor_conta || 0),
          PRECO_KWH:
            m.consumo_kwh > 0 ? `R$ ${((m.valor_conta || 0) / m.consumo_kwh).toFixed(2)}` : '—',
        }))
      : [{ MES: '—', CONSUMO: '—', VALOR: formatCurrency(valorAtual), PRECO_KWH: '—' }]

  return {
    LOGO: logoUrl,
    CLIENTE: client?.name || client?.company || '—',
    CPF_CNPJ: client?.document_number || client?.cnpj || '—',
    CIDADE: budget.cidade || '—',
    ESTADO: budget.estado || '—',
    DISTRIBUIDORA: budget.distribuidora || '—',
    NUMERO_PROPOSTA: budget.numero || '—',
    DATA: new Date().toLocaleDateString('pt-BR'),
    RESPONSAVEL: budget.responsavel || '—',
    ECONOMIA_PERCENTUAL: `${economiaPct}%`,
    ECONOMIA_MENSAL: formatCurrency(budget.economia_mensal || 0),
    ECONOMIA_ANUAL: formatCurrency(budget.economia_anual || 0),
    VALOR_ATUAL: formatCurrency(valorAtual),
    VALOR_ESTIMADO: formatCurrency(valorEstimado),
    USINA: budget.expand?.plant_id?.name || 'Usina ACERSOL',
    POTENCIA: `${budget.expand?.plant_id?.potencia_instalada || budget.expand?.plant_id?.capacity || 0} kWp`,
    GERACAO: `${budget.expand?.plant_id?.generation_now || 0} kWh/mês`,
    OBSERVACOES: budget.observacoes || 'Nenhuma observação específica.',
    MAPA: '',
    QR_CODE: '',
    IMG_CAPA: getAssetUrl(findAsset(assets, 'plant'), 'solar%20plant%20aerial', 1200, 1600),
    IMG_USINA: getAssetUrl(findAsset(assets, 'plant'), 'solar%20energy%20farm', 1200, 800),
    IMG_CLIENTE: logoUrl,
    IMG_SUSTENTABILIDADE: getAssetUrl(findAsset(assets, 'nature'), 'green%20nature', 800, 1000),
    IMG_EQUIPE: getAssetUrl(findAsset(assets, 'industry'), 'industry%20solar%20energy', 1200, 800),
    IMG_DRONE: getAssetUrl(findAsset(assets, 'panels'), 'solar%20panels%20drone', 1200, 800),
    IMG_BACKGROUND: getAssetUrl(findAsset(assets, 'nature'), 'nature%20landscape', 1200, 1600),
    ASSOCIADOS: '500+',
    USINAS_COUNT: '12',
    MEGAWATTS: '5,2',
    KWH_ANO: '8.500.000',
    CO2: '2.400',
    MUNICIPIOS: '45',
    UNIDADES: mockUnits,
    HISTORICO: mockHistory,
  }
}
