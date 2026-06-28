import pb from '@/lib/pocketbase/client'

export async function exportDatabase(): Promise<void> {
  const url = `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/export-sql`
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
  a.download = `acersol_export_${new Date().toISOString().split('T')[0]}.sql`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(downloadUrl)
}
