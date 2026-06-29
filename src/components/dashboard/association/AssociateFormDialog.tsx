import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UTILITY_PROVIDERS, BRAZILIAN_STATES } from '@/lib/regional-data'
import { formatDocument, formatPhone, formatCEP } from '@/lib/formatters'
import { validateDocument } from '@/lib/document-validation'
import { lookupCEP, lookupCNPJ } from '@/lib/lookups'
import { ProfileMultiSelect } from '@/components/dashboard/relationship/ProfileMultiSelect'
import { createClient, updateClient, checkDocumentExists } from '@/services/clients'
import { toast } from 'sonner'
import { Search, Loader2 } from 'lucide-react'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  document_number: z
    .string()
    .min(1, 'Documento obrigatório')
    .refine((v) => {
      const d = v.replace(/\D/g, '')
      return d.length === 11 || d.length === 14 ? validateDocument(v) : false
    }, 'Documento inválido'),
  associateType: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  profession: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'E-mail inválido'),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  utilityProvider: z.string().min(1, 'Concessionária obrigatória'),
  associateStatus: z.string().min(1, 'Status obrigatório'),
  entryDate: z.string().optional(),
  exitDate: z.string().optional(),
  observations: z.string().optional(),
  energyUnitId: z.string().optional(),
  consumptionProfile: z.string().optional(),
  contactInfo: z.string().optional(),
  discount_percentage: z.string().optional(),
  profiles: z.array(z.string()).optional(),
})
type FormData = z.infer<typeof schema>

export function AssociateFormDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing: any
  onSaved: () => void
}) {
  const [saving, setSaving] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      utilityProvider: 'RGE',
      associateStatus: 'Ativo',
      associateType: 'Pessoa Física',
    },
  })

  const handleOpen = (o: boolean) => {
    if (o && editing) {
      let parsedProfiles: string[] = []
      try {
        const p = editing.profiles
        parsedProfiles = typeof p === 'string' ? JSON.parse(p || '[]') : Array.isArray(p) ? p : []
      } catch {
        parsedProfiles = []
      }
      reset({ ...editing, profiles: parsedProfiles })
    } else if (o) {
      reset({
        utilityProvider: 'RGE',
        associateStatus: 'Ativo',
        associateType: 'Pessoa Física',
        profiles: ['Associado'],
      })
    }
    onOpenChange(o)
  }

  const handleCEP = async () => {
    const cep = watch('zipCode')?.replace(/\D/g, '') || ''
    if (cep.length !== 8) return toast.error('CEP inválido')
    try {
      const d = await lookupCEP(cep)
      setValue('address', d.logradouro)
      setValue('neighborhood', d.bairro)
      setValue('city', d.localidade)
      setValue('state', d.uf)
      toast.success('Endereço preenchido')
    } catch {
      toast.error('CEP não encontrado')
    }
  }

  const handleCNPJ = async () => {
    const doc = watch('document_number')?.replace(/\D/g, '') || ''
    if (doc.length !== 14) return
    try {
      const d = await lookupCNPJ(doc)
      setValue('name', d.nome)
      setValue('address', d.endereco)
      setValue('neighborhood', d.bairro)
      setValue('city', d.municipio)
      setValue('state', d.uf)
      setValue('zipCode', d.cep)
      setValue('email', d.email)
      setValue('phone', d.telefone)
      toast.success('Dados do CNPJ preenchidos')
    } catch {
      toast.error('CNPJ não encontrado')
    }
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      const exists = await checkDocumentExists(data.document_number, editing?.id)
      if (exists) {
        toast.error('Documento já cadastrado')
        setSaving(false)
        return
      }
      const payload = {
        ...data,
        profiles: JSON.stringify(data.profiles || []),
        discount_percentage: data.discount_percentage ? Number(data.discount_percentage) : 0,
      }
      if (editing?.id) {
        await updateClient(editing.id, payload)
        toast.success('Associado atualizado!')
      } else {
        await createClient(payload)
        toast.success('Associado cadastrado!')
      }
      handleOpen(false)
      onSaved()
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const L = ({ children, e }: { children: React.ReactNode; e?: string }) => (
    <>
      {children}
      {e && <p className="text-xs text-red-500 mt-1">{e}</p>}
    </>
  )

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar Associado' : 'Novo Associado'}</DialogTitle>
          <DialogDescription>Preencha os dados do associado.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <Label>Nome / Razão Social *</Label>
              <L e={errors.name?.message}>
                <Input {...register('name')} placeholder="Nome completo" />
              </L>
            </div>
            <div className="space-y-1">
              <Label>CPF / CNPJ *</Label>
              <div className="flex gap-2">
                <Input
                  {...register('document_number')}
                  onChange={(e) => setValue('document_number', formatDocument(e.target.value))}
                  placeholder="000.000.000-00"
                />
                <Button type="button" size="icon" variant="outline" onClick={handleCNPJ}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {errors.document_number && (
                <p className="text-xs text-red-500">{errors.document_number.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select
                value={watch('associateType')}
                onValueChange={(v) => setValue('associateType', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    'Pessoa Física',
                    'Pessoa Jurídica',
                    'Produtor Rural',
                    'Condomínio',
                    'Poder Público',
                    'Cooperativa',
                  ].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Data de Nascimento</Label>
              <Input type="date" {...register('birthDate')} />
            </div>
            <div className="space-y-1">
              <Label>Gênero</Label>
              <Select value={watch('gender')} onValueChange={(v) => setValue('gender', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {['Masculino', 'Feminino', 'Outro'].map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Estado Civil</Label>
              <Select
                value={watch('maritalStatus')}
                onValueChange={(v) => setValue('maritalStatus', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {['Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'União Estável'].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Profissão</Label>
              <Input {...register('profession')} placeholder="Profissão" />
            </div>
            <div className="space-y-1">
              <Label>Telefone</Label>
              <Input
                {...register('phone')}
                onChange={(e) => setValue('phone', formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-1">
              <Label>WhatsApp</Label>
              <Input
                {...register('whatsapp')}
                onChange={(e) => setValue('whatsapp', formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-1">
              <Label>E-mail</Label>
              <Input {...register('email')} placeholder="email@exemplo.com" />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>CEP</Label>
              <div className="flex gap-2">
                <Input
                  {...register('zipCode')}
                  onChange={(e) => setValue('zipCode', formatCEP(e.target.value))}
                  placeholder="00000-000"
                />
                <Button type="button" size="icon" variant="outline" onClick={handleCEP}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Endereço</Label>
              <Input {...register('address')} placeholder="Rua, número" />
            </div>
            <div className="space-y-1">
              <Label>Bairro</Label>
              <Input {...register('neighborhood')} />
            </div>
            <div className="space-y-1">
              <Label>Cidade</Label>
              <Input {...register('city')} />
            </div>
            <div className="space-y-1">
              <Label>Estado</Label>
              <Select value={watch('state')} onValueChange={(v) => setValue('state', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((s) => (
                    <SelectItem key={s.code} value={s.code}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Concessionária *</Label>
              <Select
                value={watch('utilityProvider')}
                onValueChange={(v) => setValue('utilityProvider', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UTILITY_PROVIDERS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status *</Label>
              <Select
                value={watch('associateStatus')}
                onValueChange={(v) => setValue('associateStatus', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Ativo', 'Suspenso', 'Pendente', 'Bloqueado', 'Em Análise', 'Inativo'].map(
                    (s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Unidade Consumidora</Label>
              <Input {...register('energyUnitId')} placeholder="UC" />
            </div>
            <div className="space-y-1">
              <Label>Perfil de Consumo</Label>
              <Input {...register('consumptionProfile')} placeholder="Comercial" />
            </div>
            <div className="space-y-1">
              <Label>Desconto (%)</Label>
              <Input
                type="number"
                step="0.01"
                {...register('discount_percentage')}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label>Data de Entrada</Label>
              <Input type="date" {...register('entryDate')} />
            </div>
            <div className="space-y-1">
              <Label>Data de Saída</Label>
              <Input type="date" {...register('exitDate')} />
            </div>
            <div className="md:col-span-2">
              <ProfileMultiSelect
                value={watch('profiles') || []}
                onChange={(v) => setValue('profiles', v)}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Observações</Label>
              <Textarea {...register('observations')} rows={2} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full px-6"
              onClick={() => handleOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-brand-blue hover:bg-blue-800 text-white rounded-full px-8"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
