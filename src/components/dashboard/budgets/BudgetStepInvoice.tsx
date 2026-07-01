import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  form: any
  set: (k: string, v: any) => void
  files: File[]
  setFiles: (files: File[]) => void
}

export function BudgetStepInvoice({ form, set, files, setFiles }: Props) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    setFiles([...files, ...dropped])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles([...files, ...Array.from(e.target.files)])
  }

  const removeFile = (idx: number) => setFiles(files.filter((_, i) => i !== idx))

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Análise de Fatura de Energia</h3>
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center hover:border-brand-blue/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('budget-file-input')?.click()}
      >
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Arraste faturas aqui ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG, WEBP</p>
        <input
          id="budget-file-input"
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={handleFileInput}
        />
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-lg p-2">
              <FileText className="h-4 w-4 text-brand-blue" />
              <span className="text-sm flex-1 truncate">{f.name}</span>
              <span className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(i)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
        <div className="space-y-1">
          <Label>Consumo Médio (kWh/mês)</Label>
          <Input
            type="number"
            value={form.consumo_medio}
            onChange={(e) => set('consumo_medio', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label>Valor da Conta (R$)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.valor_conta}
            onChange={(e) => set('valor_conta', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label>Classe</Label>
          <Input
            placeholder="Ex: Comercial"
            value={form.classe}
            onChange={(e) => set('classe', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Subclasse</Label>
          <Input
            placeholder="Ex: Comercial Atividade Rural"
            value={form.subclasse}
            onChange={(e) => set('subclasse', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Modalidade</Label>
          <Input
            placeholder="Ex: Convencional"
            value={form.modalidade}
            onChange={(e) => set('modalidade', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Grupo Tarifário</Label>
          <Input
            placeholder="Ex: Grupo A"
            value={form.grupo}
            onChange={(e) => set('grupo', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>ICMS (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.impostos_icms}
            onChange={(e) => set('impostos_icms', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label>PIS (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.impostos_pis}
            onChange={(e) => set('impostos_pis', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label>COFINS (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.impostos_cofins}
            onChange={(e) => set('impostos_cofins', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label>Economia Desejada (%)</Label>
          <Input
            type="number"
            step="0.1"
            value={form.economia_percentual}
            onChange={(e) => set('economia_percentual', Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
