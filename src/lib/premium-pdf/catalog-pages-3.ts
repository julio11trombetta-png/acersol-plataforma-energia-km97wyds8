import { ICONS } from '@/lib/premium-pdf/styles'

export function pagePlant(): string {
  return `<div class="catalog-page flex-page">
<img class="plant-photo" src="{{IMG_USINA}}" alt="Usina Solar"/>
<div style="padding:15mm 20mm 5mm; flex-shrink: 0;">
  <span class="section-tag">USINA DESIGNADA</span>
  <h2 style="color:var(--primary);font-size:26px;font-weight:700;margin-top:6px;">{{USINA}}</h2>
</div>
<div class="plant-grid" style="flex-shrink: 0;">
  <div class="plant-grid-item"><div class="icon">${ICONS.zap}</div><div class="num">{{POTENCIA}}</div><div class="label">Potência Instalada</div></div>
  <div class="plant-grid-item"><div class="icon">${ICONS.sun}</div><div class="num">{{GERACAO}}</div><div class="label">Geração Mensal Média</div></div>
  <div class="plant-grid-item"><div class="icon">${ICONS.percent}</div><div class="num">{{ECONOMIA_PERCENTUAL}}</div><div class="label">Desconto Aplicado</div></div>
  <div class="plant-grid-item"><div class="icon">${ICONS.shield}</div><div class="num">Ativa</div><div class="label">Status de Operação</div></div>
</div>
<div style="padding:10mm 20mm; flex-grow: 1;">
  <div class="data-card" style="background:#fff; border:1px solid #eee; border-left:4px solid var(--accent); padding:24px;">
    <p style="font-size:14px;color:#444;line-height:1.8;">A usina designada para a sua compensação energética opera com tecnologia fotovoltaica de última geração, garantindo uma geração estável e confiável de créditos suficientes para abater o seu consumo mensal. A ACERSOL monitora o desempenho da usina em tempo real, realizando manutenções preventivas para assegurar a máxima eficiência.</p>
  </div>
</div>
</div>`
}

export function pageBenefits(): string {
  const items = [
    {
      i: ICONS.wallet,
      t: 'Sem Investimento',
      d: 'Zero custo de adesão e sem taxas de instalação.',
    },
    { i: ICONS.tools, t: 'Sem Obras', d: 'Nenhuma alteração estrutural no seu imóvel.' },
    {
      i: ICONS.shield,
      t: 'Lei 14.300/22',
      d: 'Total conformidade com o marco legal da Geração Distribuída.',
    },
    { i: ICONS.leaf, t: 'Energia Limpa', d: '100% renovável, reduzindo a pegada de carbono.' },
    { i: ICONS.trending, t: 'Economia Real', d: 'Redução na conta de luz desde o primeiro mês.' },
    {
      i: ICONS.clock,
      t: 'Sem Manutenção',
      d: 'A operação e manutenção das usinas são por nossa conta.',
    },
    { i: ICONS.lock, t: 'Contrato Seguro', d: 'Garantias jurídicas e transparência total.' },
    {
      i: ICONS.users,
      t: 'Associação Forte',
      d: 'Modelo cooperativo/associativo sólido e comprovado.',
    },
    {
      i: ICONS.globe,
      t: 'Sustentabilidade',
      d: 'Contribuição direta para a preservação ambiental.',
    },
    {
      i: ICONS.award,
      t: 'Alta Qualidade',
      d: 'Usinas com equipamentos Tier 1 e inversores premium.',
    },
    {
      i: ICONS.scale,
      t: 'Transparência',
      d: 'Acompanhamento claro dos créditos e consumo gerado.',
    },
    { i: ICONS.check, t: 'Adesão Simples', d: 'Processo rápido, 100% digital e sem burocracia.' },
  ]
  const cards = items
    .map(
      (b) =>
        `<div class="benefit-card"><div class="icon">${b.i}</div><div class="title">${b.t}</div><div class="desc">${b.d}</div></div>`,
    )
    .join('')
  return `<div class="catalog-page">
<div style="padding:25mm 20mm 10mm;">
  <span class="section-tag">BENEFÍCIOS EXCLUSIVOS</span>
  <h2 style="color:var(--primary);font-size:26px;font-weight:700;margin-top:6px;">Por que escolher a ACERSOL?</h2>
</div>
<div class="benefits-grid">
  ${cards}
</div>
</div>`
}

export function pageObservations(): string {
  return `<div class="catalog-page">
<div style="padding:25mm 20mm 10mm;">
  <span class="section-tag">OBSERVAÇÕES IMPORTANTES</span>
  <h2 style="color:var(--primary);font-size:26px;font-weight:700;margin-top:6px;">Condições e Validade da Proposta</h2>
</div>
<div style="padding:0 20mm;">
  <p style="font-size:14px;line-height:1.7;color:#555;margin-bottom:20px;">Esta proposta comercial foi elaborada com base no histórico de consumo apresentado e nas regras tarifárias vigentes da concessionária local. Trata-se de um documento informativo, não constituindo por si só um vínculo contratual definitivo.</p>
  
  <div class="obs-box">
    <p style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:8px">Validade da Proposta</p>
    <p>As condições, o percentual de desconto e os valores estimados nesta proposta são válidos por <strong>30 dias</strong> contados a partir de {{DATA}}. Após este período, a disponibilidade de cota na usina designada e as condições comerciais poderão ser reavaliadas.</p>
  </div>
  
  <div class="obs-box" style="border-left-color:var(--accent);margin-top:20px">
    <p style="font-size:15px;font-weight:700;color:var(--accent);margin-bottom:8px">Formalização</p>
    <p>A efetivação da parceria se dará mediante a assinatura digital do Termo de Adesão ao Estatuto da Associação. Todo o trâmite junto à distribuidora de energia ({{DISTRIBUIDORA}}) será conduzido pela equipe técnica da ACERSOL sem custos adicionais para o associado.</p>
  </div>
  
  <div class="obs-box" style="border-left-color:#eab308;margin-top:20px; display: {{SHOW_OBS}};">
    <p style="font-size:15px;font-weight:700;color:#ca8a04;margin-bottom:8px">Notas Específicas do Consultor</p>
    <p>{{OBSERVACOES}}</p>
  </div>

  <div style="text-align:center;margin-top:30mm">
    <div class="qr-placeholder">${ICONS.globe}</div>
    <p style="font-size:12px;color:#999;margin-top:8px">www.acersol.com.br</p>
  </div>
</div>
</div>`
}

export function pageClosing(): string {
  return `<div class="catalog-page closing-page">
<div class="closing-logo"><img src="{{LOGO}}" alt="ACERSOL"/></div>
<div class="closing-message">Bem-vindo ao futuro da energia.</div>
<div class="closing-sub">Sua parceria sustentável e inteligente com a ACERSOL.</div>
<div class="contact-row">
  <div class="contact-item">${ICONS.phone} (54) 9267-9352</div>
  <div class="contact-item">${ICONS.mail} contato@acersol.com.br</div>
  <div class="contact-item">${ICONS.mapPin} Rio Grande do Sul, Brasil</div>
</div>
<div class="sign-area">
  <div class="sign-box">
    <span style="display:block;margin-bottom:4px;font-size:14px;color:var(--primary)">Representante ACERSOL</span>
    {{RESPONSAVEL}}
  </div>
  <div class="sign-box">
    <span style="display:block;margin-bottom:4px;font-size:14px;color:var(--primary)">Cliente / Associado</span>
    {{CLIENTE}}
  </div>
</div>
<p style="font-size:11px;color:#999;margin-top:30mm;text-transform:uppercase;letter-spacing:1px;">ACERSOL - ASSOCIAÇÃO COMPANHIA DE ENERGIA RENOVÁVEL SOLAR<br/>CNPJ: 65.133.572/0001-94</p>
</div>`
}
