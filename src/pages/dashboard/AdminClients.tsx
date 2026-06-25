import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Users, AlertCircle, Edit, Trash2, Building } from 'lucide-react'
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

const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nome muito curto'),
  document: z.string().min(11, 'Documento inválido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.string().min(5, 'Endereço inválido'),
  distributor: z.string().min(2, 'Concessionária obrigatória'),
  ucNumber: z.string().min(5, 'Número da UC inválido'),
})

type ClientData = z.infer<typeof clientSchema>

export default function AdminClients() {
  const [clients, setClients] = useState<ClientData[]>([])
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientData | null>(null)

  const form = useForm<ClientData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      document: '',
      email: '',
      phone: '',
      address: '',
      distributor: '',
      ucNumber: '',
    },
  })

  const filteredClients = useMemo(() => {
    return clients.filter(
      (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.document.includes(search),
    )
  }, [clients, search])

  const openDialog = (client?: ClientData) => {
    if (client) {
      setEditingClient(client)
      form.reset(client)
    } else {
      setEditingClient(null)
      form.reset({
        name: '',
        document: '',
        email: '',
        phone: '',
        address: '',
        distributor: '',
        ucNumber: '',
      })
    }
    setIsDialogOpen(true)
  }

  const onSubmit = (data: ClientData) => {
    if (editingClient) {
      setClients(
        clients.map((c) => (c.id === editingClient.id ? { ...data, id: editingClient.id } : c)),
      )
      toast.success('Cliente atualizado com sucesso!')
    } else {
      setClients([...clients, { ...data, id: Math.random().toString(36).substring(7) }])
      toast.success('Cliente registrado com sucesso!')
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setClients(clients.filter((c) => c.id !== id))
    toast.info('Cliente removido')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Clientes</h2>
          <p className="text-muted-foreground">
            Cadastre e gerencie os consumidores da plataforma.
          </p>
        </div>
        <Button
          onClick={() => openDialog()}
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full shadow-md"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
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
            <CardTitle>Clientes Registrados</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou documento..."
                className="pl-9 rounded-full bg-muted/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <EmptyState
              icon={<Users className="h-10 w-10 text-brand-blue" />}
              title="Nenhum Cliente Registrado"
              description="Você ainda não possui clientes cadastrados na plataforma. Comece adicionando o primeiro consumidor."
              action={
                <Button onClick={() => openDialog()} className="mt-4 rounded-full">
                  <Plus className="mr-2 h-4 w-4" /> Registrar Primeiro Cliente
                </Button>
              }
            />
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Nome / Razão Social</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Concessionária (UC)</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          {client.name}
                        </div>
                      </TableCell>
                      <TableCell>{client.document}</TableCell>
                      <TableCell>
                        <div className="text-sm">{client.email}</div>
                        <div className="text-xs text-muted-foreground">{client.phone}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-normal bg-blue-50 text-brand-blue border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                        >
                          {client.distributor}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          UC: {client.ucNumber}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openDialog(client)}>
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => client.id && handleDelete(client.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredClients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum cliente encontrado para "{search}".
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
              <DialogTitle>{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
              <DialogDescription>
                Preencha os dados do consumidor para acesso à plataforma.
              </DialogDescription>
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
                        <FormLabel>Nome Completo ou Razão Social</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Empresa de Energia Ltda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF / CNPJ</FormLabel>
                        <FormControl>
                          <Input placeholder="Apenas números" {...field} />
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
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contato@empresa.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Endereço Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, Número, Bairro, Cidade - Estado" {...field} />
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
                    name="ucNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade Consumidora (UC)</FormLabel>
                        <FormControl>
                          <Input placeholder="Número da UC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-brand-blue text-white">
                    {editingClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}
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
