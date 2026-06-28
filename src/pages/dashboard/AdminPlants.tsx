import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPlants, createPlant, updatePlant, deletePlant } from '@/services/plants'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Zap, Edit, Trash2, MapPin, Network } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCNPJ, formatCPF, formatPhone } from '@/lib/formatters'
import { UTILITY_PROVIDERS, BRAZILIAN_STATES } from '@/lib/regional-data'

const plantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nome muito curto'),
  capacity: z.coerce.number().min(1, 'Capacidade deve ser maior que 0'),
  location: z.string().min(3, 'Localização inválida'),
  technologyType: z.string().min(2, 'Tipo de tecnologia obrigatória'),
  status: z.string().optional(),
  generation_now: z.coerce.number().optional(),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'E-mail inválido'),
  address: z.string().optional(),
  utilityProvider: z.string().min(1, 'Concessionária obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
})

type PlantData = z.infer<typeof plantSchema>

export default function AdminPlants() {
  const [plants, setPlants] = useState<PlantData[]>([])
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlant, setEditingPlant] = useState<PlantData | null>(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const form = useForm<PlantData>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: '',
      capacity: 0,
      location: '',
      technologyType: '',
      status: 'Online',
      generation_now: 0,
      cnpj: '',
      cpf: '',
      phone: '',
      email: '',
      address: '',
      utilityProvider: 'RGE',
      state: 'RS',
    },
  })

  const loadData = async (query = '') => {
    try {
      const data = await getPlants(1, query)
      setPlants(
        data.items.map((d) => ({
          id: d.id,
          name: d.name,
          capacity: d.capacity,
          location: d.location,
          technologyType: d.technologyType,
          status: d.status,
          generation_now: d.generation_now,
          cnpj: d.cnpj || '',
          cpf: d.cpf || '',
          phone: d.phone || '',
          email: d.email || '',
          address: d.address || '',
          utilityProvider: d.utilityProvider || 'RGE',
          state: d.state || 'RS',
        })),
      )
    } catch (err) {
      toast.error('Erro ao carregar usinas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    const debounce = setTimeout(() => {
      loadData(search)
    }, 400)
    return () => clearTimeout(debounce)
  }, [search])

  useRealtime('plants', () => {
    loadData(search)
  })

  const openDialog = (plant?: PlantData) => {
    if (plant) {
      setEditingPlant(plant)
      form.reset(plant)
    } else {
      setEditingPlant(null)
      form.reset({
        name: '',
        capacity: 0,
        location: '',
        technologyType: '',
        status: 'Online',
        generation_now: 0,
        cnpj: '',
        cpf: '',
        phone: '',
        email: '',
        address: '',
        utilityProvider: 'RGE',
        state: 'RS',
      })
    }
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: PlantData) => {
    try {
      if (editingPlant?.id) {
        await updatePlant(editingPlant.id, data)
        toast.success('Usina atualizada com sucesso!')
      } else {
        await createPlant(data)
        toast.success('Usina registrada com sucesso!')
      }
      setIsDialogOpen(false)
    } catch (err) {
      toast.error('Erro ao salvar usina')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePlant(id)
      toast.info('Usina removida')
    } catch (err) {
      toast.error('Erro ao remover usina')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Usinas</h2>
          <p className="text-muted-foreground">Administre o parque gerador e suas capacidades.</p>
        </div>
        <Button
          onClick={() => openDialog()}
          className="bg-brand-green hover:bg-green-700 text-white rounded-full shadow-md transition-transform active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Usina
        </Button>
      </div>

      <Card className="border-muted shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b bg-muted/10">
          <div className="flex justify-between items-center">
            <CardTitle>Usinas Operacionais</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou local..."
                className="pl-9 rounded-full bg-background border-muted"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-4">
              <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
              <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
              <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
            </div>
          ) : plants.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Network className="h-12 w-12 text-brand-green opacity-80" />}
                title="Nenhuma Usina Registrada"
                description="Sua rede ainda não possui fontes de geração conectadas. Adicione uma usina para iniciar a alocação de créditos."
                action={
                  <Button
                    onClick={() => openDialog()}
                    className="mt-4 rounded-full bg-brand-green hover:bg-green-700 text-white shadow-md"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Cadastrar Primeira Usina
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Nome da Usina</TableHead>
                    <TableHead>Capacidade (kW/MW)</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Tipo de Tecnologia</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plants.map((plant) => (
                    <TableRow key={plant.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium pl-6">
                        <button
                          onClick={() =>
                            plant.id && navigate(`/dashboard/admin/usinas/${plant.id}`)
                          }
                          className="flex items-center gap-3 hover:text-brand-green transition-colors text-left"
                        >
                          <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                          </div>
                          {plant.name}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900"
                        >
                          {plant.capacity} kW
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {plant.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-sm font-medium">
                          {plant.technologyType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDialog(plant)}
                            className="hover:bg-brand-green/10 hover:text-brand-green"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => plant.id && handleDelete(plant.id)}
                            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {plants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        Nenhuma usina encontrada para "{search}".
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl">
          <div className="p-6 border-b bg-muted/10">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingPlant ? 'Editar Usina' : 'Nova Usina'}
              </DialogTitle>
              <DialogDescription>
                Registre os dados técnicos e de propriedade da central geradora.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Usina</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Usina Solar Alvorada"
                          className="bg-muted/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacidade (kW/MW)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 500"
                            className="bg-muted/30"
                            {...field}
                          />
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
                          <Input
                            placeholder="Ex: Solar Fotovoltaica..."
                            className="bg-muted/30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localização</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Uberlândia/MG ou Endereço"
                          className="bg-muted/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="utilityProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concessionária</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-muted/30">
                              <SelectValue placeholder="Selecione a concessionária" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {UTILITY_PROVIDERS.map((provider) => (
                              <SelectItem key={provider} value={provider}>
                                {provider}
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
                              <SelectValue placeholder="Selecione o estado" />
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-muted/30">
                              <SelectValue placeholder="Selecione o status" />
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
                          <Input
                            type="number"
                            placeholder="Ex: 650"
                            className="bg-muted/30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00.000.000/0001-00"
                            className="bg-muted/30"
                            {...field}
                            onChange={(e) => field.onChange(formatCNPJ(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000.000.000-00"
                            className="bg-muted/30"
                            {...field}
                            onChange={(e) => field.onChange(formatCPF(e.target.value))}
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
                            placeholder="(00) 00000-0000"
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
                          <Input
                            placeholder="contato@email.com"
                            className="bg-muted/30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rua, número, bairro, cidade/UF"
                          className="bg-muted/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full px-6"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-green hover:bg-green-700 text-white rounded-full px-8 shadow-md"
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
