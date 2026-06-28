import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UTILITY_PROVIDERS, BRAZILIAN_STATES } from '@/lib/regional-data'
import { formatDocument, formatPhone } from '@/lib/formatters'
import { validateCPF, validateCNPJ } from '@/lib/document-validation'
import { updateClient, checkDocumentExists } from '@/services/clients'
import { toast } from 'sonner'
import { Save, Loader2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  energyUnitId: z.string().min(1, 'UC obrigatória'),
  consumptionProfile: z.string().optional(),
  contactInfo: z.string().optional(),
  document_number: z
    .string()
    .min(1, 'CPF ou CNPJ obrigatório')
    .refine((val) => {
      const digits = val.replace(/\D/g, '')
      if (digits.length === 11) return validateCPF(digits)
      if (digits.length === 14) return validateCNPJ(digits)
      return false
    }, 'Documento inválido'),
  phone: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'E-mail inválido'),
  address: z.string().optional(),
  utilityProvider: z.string().optional(),
  state: z.string().optional(),
  discount_percentage: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface FieldDef {
  name: keyof FormData
  label: string
  placeholder: string
  full?: boolean
  format?: 'cnpj' | 'cpf' | 'phone' | 'document'
}

const textFields: FieldDef[] = [
  { name: 'name', label: 'Nome / Razão Social', placeholder: 'Ex: Empresa Ltda', full: true },
  { name: 'energyUnitId', label: 'Unidade Consumidora (UC)', placeholder: 'Número' },
  { name: 'consumptionProfile', label: 'Perfil de Consumo', placeholder: 'Comercial' },
  { name: 'contactInfo', label: 'Contato', placeholder: 'E-mail ou Telefone' },
  { name: 'phone', label: 'Telefone', placeholder: '(00) 00000-0000', format: 'phone' },
  { name: 'email', label: 'E-mail', placeholder: 'contato@email.com' },
  {
    name: 'document_number',
    label: 'CPF ou CNPJ',
    placeholder: '000.000.000-00 ou 00.000.000/0001-00',
    format: 'document',
    full: true,
  },
  { name: 'address', label: 'Endereço', placeholder: 'Rua, número, bairro', full: true },
]

export function ClientInfoTab({ client }: { client: any }) {
  const [saving, setSaving] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: client.name || '',
      energyUnitId: client.energyUnitId || '',
      consumptionProfile: client.consumptionProfile || '',
      contactInfo: client.contactInfo || '',
      document_number: client.document_number || '',
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || '',
      utilityProvider: client.utilityProvider || 'RGE',
      state: client.state || 'RS',
      discount_percentage: client.discount_percentage ? String(client.discount_percentage) : '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      const exists = await checkDocumentExists(data.document_number, client.id)
      if (exists) {
        form.setError('document_number', { message: 'Este CPF/CNPJ já está cadastrado' })
        setSaving(false)
        return
      }
      await updateClient(client.id, {
        ...data,
        discount_percentage: data.discount_percentage ? Number(data.discount_percentage) : 0,
      })
      toast.success('Informações atualizadas!')
    } catch {
      toast.error('Erro ao atualizar')
    } finally {
      setSaving(false)
    }
  }

  const applyFormat = (format: string | undefined, value: string) => {
    if (format === 'document') return formatDocument(value)
    if (format === 'phone') return formatPhone(value)
    return value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {textFields.map((f) => (
                <FormField
                  key={f.name}
                  control={form.control}
                  name={f.name as any}
                  render={({ field }) => (
                    <FormItem className={f.full ? 'md:col-span-2' : ''}>
                      <FormLabel>{f.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={f.placeholder}
                          className="bg-muted/30"
                          {...field}
                          onChange={(e) => field.onChange(applyFormat(f.format, e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name="utilityProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concessionária</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-muted/30">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UTILITY_PROVIDERS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-muted/30">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BRAZILIAN_STATES.map((s) => (
                          <SelectItem key={s.code} value={s.code}>
                            {s.name} ({s.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="0"
                        className="bg-muted/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-brand-blue hover:bg-blue-800 text-white rounded-full px-8"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
