export interface ParsedInvoiceData {
  numero_uc?: string
  distribuidora?: string
  cidade?: string
  estado?: string
  classe?: string
  subclasse?: string
  modalidade?: string
  grupo_tarifario?: string
  monthlyConsumption?: Array<{
    mes: string
    consumo_kwh: number
    valor_conta: number
  }>
}

export interface InvoiceParseResult {
  success: boolean
  data?: ParsedInvoiceData
  error?: string
  fileName: string
}

export class InvoiceParserService {
  async parse(file: File): Promise<InvoiceParseResult> {
    return {
      success: false,
      error: 'OCR não implementado. Preencha os dados manualmente.',
      fileName: file.name,
    }
  }

  async parseBatch(files: File[]): Promise<InvoiceParseResult[]> {
    return Promise.all(files.map((f) => this.parse(f)))
  }

  mapToUnitFields(data: ParsedInvoiceData) {
    return {
      numero_uc: data.numero_uc || '',
      distribuidora: data.distribuidora || '',
      cidade: data.cidade || '',
      estado: data.estado || '',
      classe: data.classe || '',
      subclasse: data.subclasse || '',
      modalidade: data.modalidade || '',
      grupo_tarifario: data.grupo_tarifario || '',
    }
  }

  mapToMonthlyData(data: ParsedInvoiceData) {
    return data.monthlyConsumption || []
  }
}

export const invoiceParser = new InvoiceParserService()
