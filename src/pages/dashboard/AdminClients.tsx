import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Users, AlertCircle, Edit, Trash2, Building, Zap } from 'lucide-react'
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
  consumption: z.coerce.number().min(1, 'Consumo deve ser maior que 0'),
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
      consumption: 0,
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
        consumption: 0,
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
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full shadow-md transition-transform active:scale-95"
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

      <Card className="border-muted shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b bg-muted/10">
          <div className="flex justify-between items-center">
            <CardTitle>Clientes Registrados</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou documento..."
                className="pl-9 rounded-full bg-background border-muted"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {clients.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Users className="h-12 w-12 text-brand-blue opacity-80" />}
                title="Nenhum Cliente Registrado"
                description="Você ainda não possui clientes cadastrados na plataforma. Comece adicionando o primeiro consumidor."
                action={
                  <Button
                    onClick={() => openDialog()}
                    className="mt-4 rounded-full bg-brand-blue hover:bg-blue-800 text-white shadow-md"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Cadastrar Novo
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Nome / Razão Social</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Consumo (kWh)</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-brand-blue/10 flex items-center justify-center">
                            <Building className="h-4 w-4 text-brand-blue" />
                          </div>
                          {client.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{client.document}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{client.email}</div>
                        <div className="text-xs text-muted-foreground">{client.phone}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-semibold bg-brand-blue/10 text-brand-blue border-brand-blue/20"
                        >
                          <Zap className="mr-1 h-3 w-3" />
                          {client.consumption} kWh
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDialog(client)}
                            className="hover:bg-brand-blue/10 hover:text-brand-blue"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => client.id && handleDelete(client.id)}
                            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredClients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
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
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl">
          <div className="p-6 border-b bg-muted/10">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados oficiais do consumidor para acesso à plataforma.
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
                      <FormLabel>Nome Completo ou Razão Social</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Empresa de Energia Ltda"
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
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF / CNPJ</FormLabel>
                      <FormControl>
                        <Input placeholder="Apenas números" className="bg-muted/30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contato@empresa.com"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" className="bg-muted/30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="consumption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consumo de Energia (kWh/mês)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 850"
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
                    className="bg-brand-blue hover:bg-blue-800 text-white rounded-full px-8 shadow-md"
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
