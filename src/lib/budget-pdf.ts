import { generatePremiumCatalogPDF } from '@/lib/premium-pdf/catalog-generator'
import { getBudgetUnits } from '@/services/budget-units'
import { getMonthlyConsumption } from '@/services/budget-monthly-consumption'

export async function generateBudgetPDF(budget: any) {
  try {
    let units = budget.expand?.budget_units || []
    if (units.length === 0 && budget.id) {
      units = await getBudgetUnits(budget.id)
    }

    let monthlyData = []
    if (budget.id) {
      monthlyData = await getMonthlyConsumption(budget.id)
    } else {
      // Extract from units if available
      units.forEach((u: any) => {
        if (u.expand?.budget_monthly_consumption) {
          monthlyData.push(...u.expand.budget_monthly_consumption)
        }
      })
    }

    await generatePremiumCatalogPDF(budget, units, monthlyData)
  } catch (error) {
    console.error('Error generating premium PDF:', error)
    alert('Erro ao gerar o PDF da proposta. Tente novamente.')
  }
}
