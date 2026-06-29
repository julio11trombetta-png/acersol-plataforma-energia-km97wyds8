import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Download, Loader2, Database, Shield, FileCode2 } from 'lucide-react'
import { toast } from 'sonner'
import { exportDatabase, exportMySQLSchema } from '@/services/export'

export default function SettingsPage() {
  const [exporting, setExporting] = useState(false)
  const [exportingSchema, setExportingSchema] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportDatabase()
      toast.success('Banco de dados exportado com sucesso')
    } catch {
      toast.error('Falha ao exportar banco de dados')
    } finally {
      setExporting(false)
    }
  }

  const handleExportMySQLSchema = async () => {
    setExportingSchema(true)
    try {
      await exportMySQLSchema()
      toast.success('Esquema MySQL exportado com sucesso')
    } catch {
      toast.error('Falha ao exportar esquema MySQL')
    } finally {
      setExportingSchema(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
          <Settings className="h-5 w-5 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-sm text-muted-foreground">
            Backup, segurança e preferências do sistema
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-5 w-5 text-brand-blue" /> Backup do Banco de Dados
            </CardTitle>
            <CardDescription>
              Exporte todos os dados em formato SQL (SQLite compatível).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleExport}
              disabled={exporting}
              variant="outline"
              className="rounded-full"
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Exportar .sql
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCode2 className="h-5 w-5 text-brand-green" /> Esquema MySQL (DDL)
            </CardTitle>
            <CardDescription>
              Exporte apenas a estrutura do banco em formato MySQL (CREATE TABLE, INDEX, FOREIGN
              KEY).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportMySQLSchema}
              disabled={exportingSchema}
              variant="outline"
              className="rounded-full"
            >
              {exportingSchema ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...
                </>
              ) : (
                <>
                  <FileCode2 className="mr-2 h-4 w-4" /> Exportar Esquema MySQL
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-brand-green" /> Segurança
            </CardTitle>
            <CardDescription>Políticas de acesso e auditoria do sistema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Autenticação obrigatória em todos os módulos</p>
            <p>• RBAC baseado em roles (admin, owner, client)</p>
            <p>• Logs de atividade registrados automaticamente</p>
            <p>• Validação de documentos (CPF/CNPJ) no backend</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
