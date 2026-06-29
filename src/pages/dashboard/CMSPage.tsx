import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Newspaper, FileText } from 'lucide-react'
import { getNews, createNews, getBlogPosts, createBlogPost } from '@/services/cms'
import { useRealtime } from '@/hooks/use-realtime'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function CMSPage() {
  const [news, setNews] = useState<any[]>([])
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState('news')
  const [form, setForm] = useState({ title: '', content: '', author: '', published: false })

  const loadData = async () => {
    try {
      const [n, b] = await Promise.all([getNews(), getBlogPosts()])
      setNews(n)
      setBlogs(b)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('news', () => loadData())
  useRealtime('blog_posts', () => loadData())

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Título obrigatório')
      return
    }
    try {
      if (tab === 'news')
        await createNews({ ...form, publishedAt: form.published ? new Date().toISOString() : null })
      else
        await createBlogPost({
          ...form,
          publishedAt: form.published ? new Date().toISOString() : null,
        })
      toast.success('Conteúdo publicado!')
      setIsOpen(false)
      setForm({ title: '', content: '', author: '', published: false })
    } catch {
      toast.error('Erro ao publicar')
    }
  }

  const renderList = (items: any[], isBlog: boolean) =>
    items.length === 0 ? (
      <EmptyState
        icon={<Newspaper className="h-10 w-10 text-brand-blue" />}
        title="Nenhum conteúdo"
        description="Crie o primeiro conteúdo."
      />
    ) : (
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBlog && item.author ? `${item.author} • ` : ''}
                  {item.content?.slice(0, 80) || ''}
                </p>
              </div>
              <Badge
                variant={item.published ? 'default' : 'secondary'}
                className={item.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : ''}
              >
                {item.published ? 'Publicado' : 'Rascunho'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
            <Newspaper className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">CMS</h2>
            <p className="text-sm text-muted-foreground">Notícias e conteúdo do blog</p>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Conteúdo
        </Button>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-10">
          <TabsTrigger value="news">Notícias</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
        </TabsList>
        <TabsContent value="news">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-muted/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            renderList(news, false)
          )}
        </TabsContent>
        <TabsContent value="blog">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-muted/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            renderList(blogs, true)
          )}
        </TabsContent>
      </Tabs>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tab === 'news' ? 'Nova Notícia' : 'Novo Post'}</DialogTitle>
            <DialogDescription>Crie conteúdo para o portal.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            {tab === 'blog' && (
              <div className="space-y-2">
                <Label>Autor</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <Input
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />{' '}
              Publicar imediatamente
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" className="rounded-full" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
              onClick={handleSubmit}
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
