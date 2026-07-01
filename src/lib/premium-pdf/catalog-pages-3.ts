import { ICONS } from '@/lib/premium-pdf/styles'

export function pagePlant(): string {
  return `<div class="catalog-page">
<img class="plant-photo" src="{{IMG_USINA}}" alt="Usina Solar"/>
<div style="padding:12mm 20mm 5mm"><span class="section-tag">USINA DESIGNADA</span>
<h2 style="color:#004587;font-size:22px;font-weight:700;margin-top:6px">{{USINA}}</h2></div>
<div class="plant-grid">
<div class="plant-grid-item"><div class="icon">${ICONS.zap}</div><div class="num">{{POTENCIA}}</div><div class="label">Potência Instalada</div></div>
<div class="plant-grid-item"><div class="icon">${ICONS.sun}</div><div class="num">{{GERACAO}}</div><div class="label">Geração Média</div></div>
<div class="plant-grid-item"><div class="icon">${ICONS.percent}</div><div class="num">{{ECONOMIA_PERCENTUAL}}</div><div class="label">Economia</div></div>
<div class="plant-grid-item"><div class="icon">${ICONS.shield}</div><div class="num">Ativa</div><div class="label">Status</div></div>
</div>
<div style="padding:5mm 20mm">
<p style="font-size:11px;color:#555;line-height:1.7">A usina designada para sua compensação energética opera com tecnologia fotovoltaica de última geração, garantindo geração estável e créditos suficientes para abater seu consumo mensal.</p>
</div>
</div>`
}

export function pageBenefits(): string {
  const items = [
    { i: ICONS.wallet, t: 'Sem Investimento', d: 'Zero custo inicial' },
    { i: ICONS.tools, t: 'Sem Obras', d: 'Nenhuma instalação' },
    { i: ICONS.shield, t: 'Lei 14.300', d: 'Conformidade legal' },
    { i: ICONS.leaf, t: 'Energia Limpa', d: '100% renovável' },
    { i: ICONS.trending, t: 'Economia Real', d: 'Redução garantida' },
    { i: ICONS.clock, t: 'Sem Manutenção', d: 'Cuidamos de tudo' },
    { i: ICONS.lock, t: 'Contrato Seguro', d: 'Vínculo formal' },
    { i: ICONS.users, t: 'Associação', d: 'Modelo cooperativo' },
    { i: ICONS.globe, t: 'Sustentabilidade', d: 'CO₂ reduzido' },
    { i: ICONS.award, t: 'Qualidade', d: 'Equipamentos premium' },
    { i: ICONS.scale, t: 'Transparência', d: 'Créditos rastreáveis' },
    { i: ICONS.check, t: 'Aprovação', d: 'Sem burocracia' },
  ]
  const cards = items
    .map(
      (b) =>
        `<div class="benefit-card"><div class="icon">${b.i}</div><div class="title">${b.t}</div><div class="desc">${b.d}</div></div>`,
    )
    .join('')
  return `<div class="catalog-page">
<div style="padding:20mm 20mm 5mm"><span class="section-tag">BENEFÍCIOS</span>
<h2 style="color:#004587;font-size:22px;font-weight:700;margin-top:6px">Vantagens da Associação</h2></div>
<div class="benefits-grid">${cards}</div>
</div>`
}

export function pageObservations(): string {
  return `<div class="catalog-page">
<div style="padding:25mm 20mm 0"><span class="section-tag">OBSERVAÇÕES</span>
<h2 style="color:#004587;font-size:22px;font-weight:700;margin-top:6px">Condições e Validade</h2></div>
<div style="padding:10mm 20mm">
<p style="font-size:12px;line-height:1.7;color:#555">Esta proposta tem caráter informativo e não constitui vínculo contratual. A formalização ocorre mediante assinatura do contrato de associação e do estatuto social da ACERSOL.</p>
<div class="obs-box">
<p style="font-weight:600;color:#004587;margin-bottom:6px">Validade da Proposta</p>
<p>Esta proposta é válida por 30 dias a partir da data de emissão. Após este período, as condições podem ser reavaliadas.</p>
</div>
<div class="obs-box" style="border-left-color:#38A349;margin-top:10px">
<p style="font-weight:600;color:#38A349;margin-bottom:6px">Observações Específicas</p>
<p>{{OBSERVACOES}}</p>
</div>
<div style="text-align:center;margin-top:16mm">
<div class="qr-placeholder">${ICONS.fileText}</div>
<p style="font-size:10px;color:#999;margin-top:4px">Escaneie para mais informações</p>
</div>
</div></div>`
}

export function pageClosing(): string {
  return `<div class="catalog-page closing-page">
<div class="closing-logo"><img src="{{LOGO}}" alt="ACERSOL"/></div>
<div class="closing-message">Bem-vindo ao futuro da energia</div>
<div class="closing-sub">Juntos por um Brasil mais sustentável</div>
<div class="contact-row">
<div class="contact-item">${ICONS.phone} (54) 9267-9352</div>
<div class="contact-item">${ICONS.mail} contato@acersol.com.br</div>
<div class="contact-item">${ICONS.mapPin} Brasil</div>
</div>
<div class="sign-area">
<div class="sign-box">Representante ACERSOL<br/>{{RESPONSAVEL}}</div>
<div class="sign-box">Cliente<br/>{{CLIENTE}}</div>
</div>
<p style="font-size:9px;color:#999;margin-top:24mm">ACERSOL - CNPJ: 65.133.572/0001-94</p>
</div>`
}
