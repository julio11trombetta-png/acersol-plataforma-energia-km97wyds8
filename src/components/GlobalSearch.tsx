import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { Users, Zap, TrendingUp, Search as SearchIcon } from 'lucide-react'
import pb from '@/lib/pocketbase/client'

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [clients, setClients] = useState<any[]>([])
  const [plants, setPlants] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setClients([])
      setPlants([])
      setLeads([])
      return
    }
    const q = query.trim()
    Promise.all([
      pb
        .collection('clients')
        .getList(1, 5, { filter: `name ~ "${q}"` })
        .catch(() => ({ items: [] })),
      pb
        .collection('plants')
        .getList(1, 5, { filter: `name ~ "${q}"` })
        .catch(() => ({ items: [] })),
      pb
        .collection('crm_leads')
        .getList(1, 5, { filter: `company ~ "${q}"` })
        .catch(() => ({ items: [] })),
    ]).then(([c, p, l]) => {
      setClients(c.items)
      setPlants(p.items)
      setLeads(l.items)
    })
  }, [query])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Buscar associados, usinas, leads..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {query.length >= 2 ? 'Nenhum resultado encontrado.' : 'Digite para buscar...'}
        </CommandEmpty>
        {clients.length > 0 && (
          <CommandGroup heading="Associados">
            {clients.map((c) => (
              <CommandItem
                key={c.id}
                onSelect={() => {
                  setOpen(false)
                  navigate(`/dashboard/admin/clientes/${c.id}`)
                }}
              >
                <Users className="mr-2 h-4 w-4" /> {c.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {plants.length > 0 && (
          <CommandGroup heading="Usinas">
            {plants.map((p) => (
              <CommandItem
                key={p.id}
                onSelect={() => {
                  setOpen(false)
                  navigate(`/dashboard/admin/usinas/${p.id}`)
                }}
              >
                <Zap className="mr-2 h-4 w-4" /> {p.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {leads.length > 0 && (
          <CommandGroup heading="Leads">
            {leads.map((l) => (
              <CommandItem key={l.id} onSelect={() => setOpen(false)}>
                <TrendingUp className="mr-2 h-4 w-4" /> {l.company}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
