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
import { formatCNPJ, formatCPF, formatPhone } from '@/lib/formatters'
import { updateClient } from '@/services/clients'
import { toast } from 'sonner'
import { Save, Loader2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  energyUnitId: z.string().min(1, 'UC obrigatória'),
  consumptionProfile: z.string().optional(),
  contactInfo: z.string().optional(),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
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
  format?: 'cnpj' | 'cpf' | 'phone'
}

const textFields: FieldDef[] = [
  { name: 'name', label: 'Nome / Razão Social', placeholder: 'Ex: Empresa Ltda', full: true },
  { name: 'energyUnitId', label: 'Unidade Consumidora (UC)', placeholder: 'Número' },
  { name: 'consumptionProfile', label: 'Perfil de Consumo', placeholder: 'Comercial' },
  { name: 'contactInfo', label: 'Contato', placeholder: 'E-mail ou Telefone' },
  { name: 'phone', label: 'Telefone', placeholder: '(00) 00000-0000', format: 'phone' },
  { name: 'email', label: 'E-mail', placeholder: 'contato@email.com' },
  { name: 'cnpj', label: 'CNPJ', placeholder: '00.000.000/0001-00', format: 'cnpj' },
  { name: 'cpf', label: 'CPF', placeholder: '000.000.000-00', format: 'cpf' },
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
      cnpj: client.cnpj || '',
      cpf: client.cpf || '',
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
    if (format === 'cnpj') return formatCNPJ(value)
    if (format === 'cpf') return formatCPF(value)
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
