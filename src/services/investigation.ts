import pb from '@/lib/pocketbase/client'

export interface InvestigationResult {
  type: string
  id: string
  friendly_code: string
  uuid: string
  label: string
  created: string
}

export async function investigationSearch(query: string): Promise<InvestigationResult[]> {
  const res = await pb.send(`/backend/v1/investigation/search?q=${encodeURIComponent(query)}`, {
    method: 'GET',
  })
  return (res.results || []) as InvestigationResult[]
}

export const getInvestigationTimeline = async (recordId: string) => {
  const [auditLogs, custody, versions] = await Promise.all([
    pb
      .collection('audit_logs')
      .getList(1, 100, {
        filter: `record_id = "${recordId}"`,
        sort: '-created',
        expand: 'userId',
      })
      .catch(() => ({ items: [] })),
    pb
      .collection('chain_of_custody')
      .getFullList({
        filter: `record_id = "${recordId}"`,
        sort: '-created',
        expand: 'userId',
      })
      .catch(() => []),
    pb
      .collection('document_versions')
      .getFullList({
        filter: `record_id = "${recordId}"`,
        sort: '-version_number',
        expand: 'uploaded_by',
      })
      .catch(() => []),
  ])

  return {
    auditLogs: auditLogs.items || [],
    custody,
    versions,
  }
}
