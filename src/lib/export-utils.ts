export function sanitizeExportData(
  headers: string[],
  rows: (string | number)[][],
): { headers: string[]; rows: (string | number)[][] } {
  const idIdx = headers.findIndex(
    (h) => h.toLowerCase() === 'id' || h.toLowerCase() === 'internal id',
  )
  if (idIdx === -1) return { headers, rows }
  return {
    headers: headers.filter((_, i) => i !== idIdx),
    rows: rows.map((row) => row.filter((_, i) => i !== idIdx)),
  }
}

export function exportToExcel(filename: string, headers: string[], rows: (string | number)[][]) {
  const sanitized = sanitizeExportData(headers, rows)
  const csv = [sanitized.headers, ...sanitized.rows]
    .map((row) =>
      row
        .map((cell) => {
          const s = String(cell ?? '')
          return s.includes(';') || s.includes('"') || s.includes('\n')
            ? `"${s.replace(/"/g, '""')}"`
            : s
        })
        .join(';'),
    )
    .join('\n')
  const bom = '\uFEFF'
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportToPDF(title: string, headers: string[], rows: (string | number)[][]) {
  const sanitized = sanitizeExportData(headers, rows)
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:30px}
h1{color:#004587;margin-bottom:20px}table{width:100%;border-collapse:collapse}
th{background:#004587;color:#fff;padding:8px;text-align:left;font-size:12px}
td{padding:8px;border-bottom:1px solid #ddd;font-size:12px}</style></head><body>
<h1>${title}</h1><table><tr>${sanitized.headers.map((h) => `<th>${h}</th>`).join('')}</tr>
${sanitized.rows.map((r) => `<tr>${r.map((c) => `<td>${c ?? ''}</td>`).join('')}</tr>`).join('')}
</table></body></html>`
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 400)
}
