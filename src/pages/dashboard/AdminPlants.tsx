import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Zap, AlertCircle, Edit, Trash2, MapPin, Network } from 'lucide-react'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'

const plantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nome muito curto'),
  capacity: z.coerce.number().min(1, 'Capacidade deve ser maior que 0'),
  location: z.string().min(3, 'Localização inválida'),
  distributor: z.string().min(2, 'Concessionária obrigatória'),
  inverterBrand: z.string().min(2, 'Marca do inversor obrigatória'),
  installationDate: z.date({
    required_error: 'A data de instalação é obrigatória.',
  }),
})

type PlantData = z.infer<typeof plantSchema>

export default function AdminPlants() {
  const [plants, setPlants] = useState<PlantData[]>([])
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlant, setEditingPlant] = useState<PlantData | null>(null)

  const form = useForm<PlantData>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: '',
      capacity: 0,
      location: '',
      distributor: '',
      inverterBrand: '',
    },
  })

  const filteredPlants = useMemo(() => {
    return plants.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()),
    )
  }, [plants, search])

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
        distributor: '',
        inverterBrand: '',
        installationDate: new Date(),
      })
    }
    setIsDialogOpen(true)
  }

  const onSubmit = (data: PlantData) => {
    if (editingPlant) {
      setPlants(
        plants.map((p) => (p.id === editingPlant.id ? { ...data, id: editingPlant.id } : p)),
      )
      toast.success('Usina atualizada com sucesso!')
    } else {
      setPlants([...plants, { ...data, id: Math.random().toString(36).substring(7) }])
      toast.success('Usina registrada com sucesso!')
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setPlants(plants.filter((p) => p.id !== id))
    toast.info('Usina removida')
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
          className="bg-brand-green hover:bg-green-700 text-white rounded-full shadow-md"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Usina
        </Button>
      </div>

      <Alert
        variant="destructive"
        className="bg-orange-50 text-orange-900 border-orange-200 dark:bg-orange-950/30 dark:text-orange-200 dark:border-orange-900"
      >
        <AlertCircle className="h-4 w-4" color="currentColor" />
        <AlertTitle>Backend Não Conectado</AlertTitle>
        <AlertDescription>
          Os dados inseridos não serão persistidos no banco de dados. Conecte o Supabase ou Skip
          Cloud para ativar a persistência.
        </AlertDescription>
      </Alert>

      <Card className="border-muted shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>Usinas Operacionais</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou local..."
                className="pl-9 rounded-full bg-muted/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {plants.length === 0 ? (
            <EmptyState
              icon={<Network className="h-10 w-10 text-brand-green" />}
              title="Nenhuma Usina Registrada"
              description="Sua rede ainda não possui fontes de geração conectadas. Adicione uma usina para iniciar a alocação de créditos."
              action={
                <Button
                  onClick={() => openDialog()}
                  className="mt-4 rounded-full bg-brand-green hover:bg-green-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> Registrar Primeira Usina
                </Button>
              }
            />
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Identificação da Usina</TableHead>
                    <TableHead>Capacidade (kWp)</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Infraestrutura</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlants.map((plant) => (
                    <TableRow key={plant.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          {plant.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Instalada em {format(plant.installationDate, 'MM/yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          {plant.capacity} kWp
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {plant.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{plant.distributor}</div>
                        <div className="text-xs text-muted-foreground">
                          Inversor: {plant.inverterBrand}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openDialog(plant)}>
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => plant.id && handleDelete(plant.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPlants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <div className="p-6 pb-0">
            <DialogHeader>
              <DialogTitle>{editingPlant ? 'Editar Usina' : 'Nova Usina'}</DialogTitle>
              <DialogDescription>Registre os dados técnicos da central geradora.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 pt-4 max-h-[70vh] overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Nome da Usina</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Usina Solar Alvorada" {...field} />
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
                        <FormLabel>Capacidade Total (kWp)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ex: 500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localização (Cidade/UF)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Uberlândia/MG" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="distributor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concessionária</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CEMIG">CEMIG</SelectItem>
                            <SelectItem value="CPFL">CPFL</SelectItem>
                            <SelectItem value="ENEL">ENEL</SelectItem>
                            <SelectItem value="NEOENERGIA">NEOENERGIA</SelectItem>
                            <SelectItem value="EQUATORIAL">EQUATORIAL</SelectItem>
                            <SelectItem value="COPEL">COPEL</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inverterBrand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca do Inversor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Fronius, Sungrow..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="installationDate"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Data de Instalação</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP', { locale: ptBR })
                                ) : (
                                  <span>Selecione a data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-brand-green hover:bg-green-700 text-white">
                    {editingPlant ? 'Salvar Alterações' : 'Cadastrar Usina'}
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
