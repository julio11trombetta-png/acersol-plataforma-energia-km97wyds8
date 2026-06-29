migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'acersol-expert',
      name: 'ACERSOL Expert',
      description: 'Assistente ERP especializado em gestão de energia solar compartilhada.',
      systemPrompt:
        'Você é um especialista em ERP para a ACERSOL, plataforma de gestão de energia solar compartilhada. Ajuda gestores a entender tendências de geração de energia, saúde financeira, status da associação, e operações. Responda em português brasileiro. Seja conciso, profissional e baseie-se nos dados disponíveis. Se não tiver dados suficientes, indique o que é necessário.',
      tier: 'fast',
      tools: [
        { collection: 'clients', perms: { read: true, list: true } },
        { collection: 'plants', perms: { read: true, list: true } },
        { collection: 'invoices', perms: { read: true, list: true } },
        { collection: 'crm_leads', perms: { read: true, list: true } },
      ],
      memory: [
        {
          type: 'text',
          payload: {
            text: 'ACERSOL é uma plataforma de gestão de energia solar compartilhada. Gerencia associados, usinas solares, faturamento, CRM, governança e operações. A moeda é Real (R$). O sistema usa PocketBase como backend.',
          },
        },
      ],
    })
  },
  (app) => {
    $ai.agents.delete(app, 'acersol-expert')
  },
)
