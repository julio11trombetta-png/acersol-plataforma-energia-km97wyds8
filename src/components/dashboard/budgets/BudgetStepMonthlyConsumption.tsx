import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Upload, FileText, X, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { calculateIndicators, type MonthlyRecord } from '@/lib/budget-calculations'

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

interface Props {
  units: any[]
  monthlyData: Record<string, MonthlyRecord[]>
  setMonthlyData: (data: Record<string, MonthlyRecord[]>) => void
  files: File[]
  setFiles: (files: File[]) => void
}

export function BudgetStepMonthlyConsumption({
  units,
  monthlyData,
  setMonthlyData,
  files,
  setFiles,
}: Props) {
  const [selectedUnit, setSelectedUnit] = useState('')

  const currentUnitId = useMemo(() => {
    if (selectedUnit && units.find((u) => u._tempId === selectedUnit)) return selectedUnit
    return units[0]?._tempId || ''
  }, [selectedUnit, units])

  const currentRecords: MonthlyRecord[] = useMemo(() => {
    if (!currentUnitId) return []
    return (
      monthlyData[currentUnitId] || MONTHS.map((m) => ({ mes: m, consumo_kwh: 0, valor_conta: 0 }))
    )
  }, [currentUnitId, monthlyData])

  const indicators = useMemo(() => calculateIndicators(currentRecords), [currentRecords])

  const updateRecord = (idx: number, field: 'consumo_kwh' | 'valor_conta', value: number) => {
    const updated = [...currentRecords]
    updated[idx] = { ...updated[idx], [field]: value }
    setMonthlyData({ ...monthlyData, [currentUnitId]: updated })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setFiles([...files, ...Array.from(e.dataTransfer.files)])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles([...files, ...Array.from(e.target.files)])
  }

  const removeFile = (idx: number) => setFiles(files.filter((_, i) => i !== idx))

  if (units.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Consumo Mensal</h3>
        <p className="text-sm text-muted-foreground">
          Adicione unidades consumidoras na etapa anterior.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Consumo Mensal por UC</h3>
      <Select value={currentUnitId} onValueChange={setSelectedUnit}>
        <SelectTrigger>
          <SelectValue placeholder="Selecionar UC..." />
        </SelectTrigger>
        <SelectContent>
          {units.map((u) => (
            <SelectItem key={u._tempId} value={u._tempId}>
              UC: {u.numero_uc} - {u.distribuidora || '—'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div
        className="border-2 border-dashed rounded-lg p-4 text-center hover:border-brand-blue/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('monthly-file-input')?.click()}
      >
        <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
        <p className="text-xs text-muted-foreground">Arraste faturas ou clique para selecionar</p>
        <input
          id="monthly-file-input"
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={handleFileInput}
        />
      </div>
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-lg p-2">
              <FileText className="h-4 w-4 text-brand-blue" />
              <span className="text-sm flex-1 truncate">{f.name}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(i)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Mês</TableHead>
              <TableHead>Consumo (kWh)</TableHead>
              <TableHead>Valor (R$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecords.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-sm">{r.mes}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    className="h-8 w-32"
                    value={r.consumo_kwh === 0 ? '' : r.consumo_kwh}
                    onChange={(e) =>
                      updateRecord(
                        i,
                        'consumo_kwh',
                        e.target.value === '' ? 0 : Number(e.target.value),
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 w-32"
                    value={r.valor_conta === 0 ? '' : r.valor_conta}
                    onChange={(e) =>
                      updateRecord(
                        i,
                        'valor_conta',
                        e.target.value === '' ? 0 : Number(e.target.value),
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-muted-foreground">Média Consumo</span>
            </div>
            <p className="text-lg font-bold text-blue-600">
              {indicators.avgConsumption.toFixed(0)} kWh
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-muted-foreground">Média Conta</span>
            </div>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(indicators.avgBillValue)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown className="h-3 w-3 text-orange-600" />
              <span className="text-xs text-muted-foreground">Mín/Máx kWh</span>
            </div>
            <p className="text-sm font-bold text-orange-600">
              {indicators.minConsumption.toFixed(0)} / {indicators.maxConsumption.toFixed(0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="h-3 w-3 text-purple-600" />
              <span className="text-xs text-muted-foreground">Total Anual</span>
            </div>
            <p className="text-sm font-bold text-purple-600">
              {indicators.totalConsumption.toFixed(0)} kWh
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
