import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCrmLeads } from '@/services/crm'
import { getAllClients } from '@/services/clients'
import { getAllPlants } from '@/services/plants'
import { createBudget, createBudgetFile, logBudgetAction } from '@/services/budgets'
import { createCrmLead } from '@/services/crm'
import {
  calculateMonthlySavings,
  calculateAnnualSavings,
  calculateRequiredCredits,
} from '@/lib/budget-calculations'
import { useAuth } from '@/stores/use-auth-store'
import { toast } from 'sonner'
import { BudgetStepClient } from './BudgetStepClient'
import { BudgetStepInvoice } from './BudgetStepInvoice'
import { BudgetStepSimulation } from './BudgetStepSimulation'

const STEPS = ['Cliente/Lead', 'Fatura', 'Simulação', 'Usina', 'Finalização']

export function BudgetStepper() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [leads, setLeads] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [plants, setPlants] = useState<any[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState<any>({
    clientType: 'lead',
    lead_id: '',
    client_id: '',
    newClientName: '',
    newClientDoc: '',
    newClientPhone: '',
    newClientEmail: '',
    cidade: '',
    estado: 'RS',
    distribuidora: 'RGE',
    uc: '',
    classe: '',
    subclasse: '',
    modalidade: '',
    grupo: '',
    consumo_medio: 0,
    valor_conta: 0,
    impostos_icms: 18,
    impostos_pis: 0.65,
    impostos_cofins: 3.0,
    economia_percentual: 15,
    plant_id: '',
    validade: '',
    observacoes: '',
    status: 'Rascunho',
  })

  useEffect(() => {
    Promise.all([getCrmLeads(), getAllClients(), getAllPlants()]).then(([l, c, p]) => {
      setLeads(l as any[])
      setClients(c as any[])
      setPlants((p as any[]).filter((pl) => pl.status === 'Ativa'))
    })
  }, [])

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
  const savings = calculateMonthlySavings(form.valor_conta, form.economia_percentual)
  const annualSavings = calculateAnnualSavings(savings)
  const reqCredits = calculateRequiredCredits(form.consumo_medio)

  const handleSubmit = async (finalStatus: string) => {
    setSaving(true)
    try {
      let leadId = form.clientType === 'lead' ? form.lead_id : ''
      if (form.clientType === 'new') {
        const lead = await createCrmLead({
          company: form.newClientName,
          cnpj: form.newClientDoc,
          type: 'Comercial',
          status: 'Novos Leads',
        })
        leadId = lead.id
      }
      const payload = {
        lead_id: leadId,
        client_id: form.clientType === 'client' ? form.client_id : '',
        plant_id: form.plant_id,
        status: finalStatus,
        validade: form.validade || null,
        cidade: form.cidade,
        estado: form.estado,
        distribuidora: form.distribuidora,
        uc: form.uc,
        classe: form.classe,
        subclasse: form.subclasse,
        modalidade: form.modalidade,
        grupo: form.grupo,
        consumo_medio: form.consumo_medio,
        valor_conta: form.valor_conta,
        economia_percentual: form.economia_percentual,
        economia_mensal: savings,
        economia_anual: annualSavings,
        creditos_necessarios: reqCredits,
        creditos_disponiveis: 0,
        responsavel: user?.name || '',
        observacoes: form.observacoes,
        impostos_icms: form.impostos_icms,
        impostos_pis: form.impostos_pis,
        impostos_cofins: form.impostos_cofins,
      }
      const budget = await createBudget(payload)
      for (const f of files) await createBudgetFile(budget.id, f, f.name)
      await logBudgetAction(budget.id, 'Create', `Orçamento criado com status: ${finalStatus}`)
      toast.success('Orçamento criado com sucesso!')
      navigate('/dashboard/admin/comercial/orcamentos')
    } catch {
      toast.error('Erro ao criar orçamento')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shrink-0',
                step > i + 1
                  ? 'bg-green-500 text-white'
                  : step === i + 1
                    ? 'bg-brand-blue text-white'
                    : 'bg-muted text-muted-foreground',
              )}
            >
              {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className="ml-2 text-xs hidden md:inline font-medium">{label}</span>
            {i < STEPS.length - 1 && (
              <div
                className={cn('flex-1 h-0.5 mx-2', step > i + 1 ? 'bg-green-500' : 'bg-border')}
              />
            )}
          </div>
        ))}
      </div>
      <Card className="border-muted shadow-sm">
        <CardContent className="p-6">
          {step === 1 && <BudgetStepClient form={form} set={set} leads={leads} clients={clients} />}
          {step === 2 && (
            <BudgetStepInvoice form={form} set={set} files={files} setFiles={setFiles} />
          )}
          {(step === 3 || step === 4 || step === 5) && (
            <BudgetStepSimulation
              form={form}
              set={set}
              plants={plants}
              savings={savings}
              annualSavings={annualSavings}
              reqCredits={reqCredits}
              step={step}
              saving={saving}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Button
          variant="outline"
          className="rounded-full px-6"
          onClick={() =>
            step === 1 ? navigate('/dashboard/admin/comercial/orcamentos') : setStep(step - 1)
          }
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> {step === 1 ? 'Cancelar' : 'Voltar'}
        </Button>
        {step < 5 && (
          <Button
            className="bg-brand-blue hover:bg-blue-800 text-white rounded-full px-8"
            onClick={() => setStep(step + 1)}
          >
            Próximo <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
