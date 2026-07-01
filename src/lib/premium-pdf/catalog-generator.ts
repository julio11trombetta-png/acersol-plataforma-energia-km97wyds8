import { getInstitutionalAssets } from '@/services/institutional-assets'
import { renderTemplate, buildTemplateData } from '@/lib/premium-pdf/placeholders'
import { getCatalogStyles } from '@/lib/premium-pdf/catalog-styles'
import {
  pageCover,
  pageDiagnostico,
  pageInstitutional,
  pageHowItWorks,
} from '@/lib/premium-pdf/catalog-pages-1'
import { pageConsumptionHistory, pageFinancialSimulation } from '@/lib/premium-pdf/catalog-pages-2'
import {
  pagePlant,
  pageBenefits,
  pageNextSteps,
  pageClosing,
} from '@/lib/premium-pdf/catalog-pages-3'
import { PresentationModel } from '@/lib/premium-pdf/styles'

export async function generatePremiumCatalogPDF(
  budget: any,
  units: any[],
  monthlyData: any[],
): Promise<void> {
  let assets: any[] = []
  try {
    assets = await getInstitutionalAssets(true)
  } catch {
    /* fallbacks in getAssetUrl */
  }

  const model = (budget.presentation_model || 'executive') as PresentationModel
  const data = buildTemplateData(budget, units, monthlyData, assets)

  const pages = [
    pageCover(),
    pageDiagnostico(),
    pageInstitutional(),
    pageHowItWorks(),
    pageConsumptionHistory(),
    pageFinancialSimulation(),
    pagePlant(),
    pageBenefits(),
    pageNextSteps(),
    pageClosing(),
  ]

  const rendered = pages.map((p, i) => renderTemplate(p, data, i + 1)).join('\n')

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Proposta ${budget.numero || ''} - ACERSOL</title>
  ${getCatalogStyles(model)}
</head>
<body>
  ${rendered}
</body>
</html>`

  if (html.includes('NaN') || html.includes('undefined') || html.includes('null')) {
    console.warn(
      'Budget PDF: Dados inválidos detectados (NaN, null ou undefined). Substituindo por placeholders.',
    )
  }
  const sanitizedHtml = html
    .replace(/\bNaN\b/g, '—')
    .replace(/\bundefined\b/g, 'Aguardando dados')
    .replace(/\bnull\b/g, 'Aguardando dados')

  const placeholdersRegex = /\{\{[A-Z_0-9]+\}\}/g
  const leftOver = html.match(placeholdersRegex)
  if (leftOver && leftOver.length > 0) {
    alert(
      'Erro de validação: Variáveis não substituídas encontradas: ' +
        leftOver.slice(0, 3).join(', '),
    )
    return
  }

  if (html.includes('5.200+') || html.includes('18.5M')) {
    alert(
      'Erro de validação: Dados fictícios detectados. Substitua por dados reais ou marque como "Em atualização".',
    )
    return
  }

  const win = window.open('', '_blank')
  if (!win) {
    alert('Por favor, permita popups para gerar o catálogo.')
    return
  }
  win.document.write(sanitizedHtml)
  win.document.close()

  win.onload = () => {
    setTimeout(() => {
      win.focus()
      win.print()
    }, 800)
  }

  setTimeout(() => {
    if (win.document.readyState === 'complete') {
      win.focus()
      win.print()
    }
  }, 2000)
}
