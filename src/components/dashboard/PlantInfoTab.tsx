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
import { updatePlant, checkDocumentExists } from '@/services/plants'
import { toast } from 'sonner'
import { Save, Loader2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  capacity: z.coerce.number().min(1, 'Capacidade > 0'),
  location: z.string().optional(),
  technologyType: z.string().optional(),
  status: z.string().optional(),
  generation_now: z.coerce.number().optional(),
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
})

type FormData = z.infer<typeof schema>

export function PlantInfoTab({ plant }: { plant: any }) {
  const [saving, setSaving] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: plant.name || '',
      capacity: plant.capacity || 0,
      location: plant.location || '',
      technologyType: plant.technologyType || '',
      status: plant.status || 'Online',
      generation_now: plant.generation_now || 0,
      document_number: plant.document_number || '',
      phone: plant.phone || '',
      email: plant.email || '',
      address: plant.address || '',
      utilityProvider: plant.utilityProvider || 'RGE',
      state: plant.state || 'RS',
    },
  })

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      const exists = await checkDocumentExists(data.document_number, plant.id)
      if (exists) {
        form.setError('document_number', { message: 'Este CPF/CNPJ já está cadastrado' })
        setSaving(false)
        return
      }
      await updatePlant(plant.id, data)
      toast.success('Informações atualizadas!')
    } catch {
      toast.error('Erro ao atualizar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Usina</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nome da Usina</FormLabel>
                    <FormControl>
                      <Input className="bg-muted/30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade (kW)</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-muted/30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="technologyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Tecnologia</FormLabel>
                    <FormControl>
                      <Input placeholder="Solar Fotovoltaica" className="bg-muted/30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Uberlândia/MG" className="bg-muted/30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-muted/30">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Em obras">Em obras</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="generation_now"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geração Atual (kW)</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-muted/30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="document_number"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>CPF ou CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000.000.000-00 ou 00.000.000/0001-00"
                        className="bg-muted/30"
                        {...field}
                        onChange={(e) => field.onChange(formatDocument(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-muted/30"
                        {...field}
                        onChange={(e) => field.onChange(formatPhone(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input className="bg-muted/30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input className="bg-muted/30" {...field} />
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
                className="bg-brand-green hover:bg-green-700 text-white rounded-full px-8"
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
