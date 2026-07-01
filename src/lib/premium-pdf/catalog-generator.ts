import { getInstitutionalAssets } from '@/services/institutional-assets'
import { renderTemplate, buildTemplateData } from '@/lib/premium-pdf/placeholders'
import { getCatalogStyles } from '@/lib/premium-pdf/catalog-styles'
import { pageCover, pageInstitutional, pageHowItWorks } from '@/lib/premium-pdf/catalog-pages-1'
import {
  pageClientData,
  pageConsumptionHistory,
  pageFinancialSimulation,
} from '@/lib/premium-pdf/catalog-pages-2'
import {
  pagePlant,
  pageBenefits,
  pageObservations,
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
    pageInstitutional(),
    pageHowItWorks(),
    pageClientData(),
    pageConsumptionHistory(),
    pageFinancialSimulation(),
    pagePlant(),
    pageBenefits(),
    pageObservations(),
    pageClosing(),
  ]

  const rendered = pages.map((p) => renderTemplate(p, data)).join('\n')

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

  const win = window.open('', '_blank')
  if (!win) {
    alert('Por favor, permita popups para gerar o catálogo.')
    return
  }
  win.document.write(html)
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
