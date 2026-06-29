import pb from '@/lib/pocketbase/client'

async function downloadBlob(url: string, fallbackFilename: string): Promise<void> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: pb.authStore.token,
    },
  })

  if (!res.ok) {
    throw new Error('Falha ao exportar banco de dados')
  }

  const blob = await res.blob()
  const downloadUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = downloadUrl

  const disposition = res.headers.get('Content-Disposition')
  const match = disposition?.match(/filename="?([^"]+)"?/)
  a.download = match?.[1] || fallbackFilename

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(downloadUrl)
}

export async function exportDatabase(): Promise<void> {
  const url = `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/export-sql`
  await downloadBlob(url, `acersol_export_${new Date().toISOString().split('T')[0]}.sql`)
}

export async function exportDatabaseMySQL(): Promise<void> {
  const url = `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/export-mysql`
  try {
    await downloadBlob(url, `acersol_export_mysql_${new Date().toISOString().split('T')[0]}.sql`)
  } catch {
    throw new Error('Falha ao exportar banco de dados (MySQL)')
  }
}

export async function exportMySQLSchema(): Promise<void> {
  const url = `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/export-mysql-schema`
  try {
    await downloadBlob(url, `acersol_schema_mysql_${new Date().toISOString().split('T')[0]}.sql`)
  } catch {
    throw new Error('Falha ao exportar esquema MySQL')
  }
}
