import { ICONS } from '@/lib/premium-pdf/styles'

export function pagePlant(): string {
  return `
    <div class="catalog-page page-plant">
      <div class="header">
        <h1 class="page-title">USINA DESIGNADA</h1>
        <h2 class="page-subtitle">{{USINA}}</h2>
      </div>
      <div class="content">
        <div class="plant-image-container">
          <img src="{{IMG_USINA}}" alt="Usina Solar" class="plant-image" onerror="this.style.display='none'"/>
        </div>
        
        <div class="plant-info-grid">
          <div class="p-info-item">
            <span class="icon">${ICONS.mapPin}</span>
            <div class="p-text">
              <span class="label">Localização</span>
              <span class="value">{{USINA_LOCAL}}</span>
            </div>
          </div>
          <div class="p-info-item">
            <span class="icon">${ICONS.zap}</span>
            <div class="p-text">
              <span class="label">Tecnologia</span>
              <span class="value">{{USINA_TECNOLOGIA}}</span>
            </div>
          </div>
          <div class="p-info-item">
            <span class="icon">${ICONS.bolt}</span>
            <div class="p-text">
              <span class="label">Potência Instalada</span>
              <span class="value">{{POTENCIA_LABEL}}</span>
            </div>
          </div>
          <div class="p-info-item">
            <span class="icon">${ICONS.clock}</span>
            <div class="p-text">
              <span class="label">Entrada em Operação</span>
              <span class="value">{{USINA_ENTRADA}}</span>
            </div>
          </div>
          <div class="p-info-item">
            <span class="icon">${ICONS.sun}</span>
            <div class="p-text">
              <span class="label">Geração Média Mensal</span>
              <span class="value">{{GERACAO_LABEL}}</span>
            </div>
          </div>
          <div class="p-info-item">
            <span class="icon">${ICONS.shield}</span>
            <div class="p-text">
              <span class="label">Status</span>
              <span class="value">{{STATUS_USINA}}</span>
            </div>
          </div>
        </div>

        <div class="plant-map-container">
          <div class="map-label">Localização aproximada da usina</div>
          <img src="{{IMG_MAPA}}" alt="Mapa da Usina" class="map-img"/>
        </div>
      </div>
      {{FOOTER}}
    </div>
  `
}

export function pageBenefits(): string {
  const items = [
    { i: ICONS.wallet, t: 'Sem investimento', d: 'Você não investe em equipamentos.' },
    { i: ICONS.tools, t: 'Sem obras', d: 'Não é necessário realizar obras ou instalações.' },
    { i: ICONS.clock, t: 'Sem manutenção', d: 'Nós cuidamos de tudo para você.' },
    { i: ICONS.trending, t: 'Economia imediata', d: 'Redução da conta de energia todos os meses.' },
    { i: ICONS.leaf, t: 'Energia renovável', d: 'Fonte limpa que reduz impactos ambientais.' },
    {
      i: ICONS.shield,
      t: 'Segurança jurídica',
      d: 'Atuação em conformidade com a legislação vigente.',
    },
    { i: ICONS.user, t: 'Atendimento local', d: 'Suporte próximo e atendimento ágil.' },
    { i: ICONS.scale, t: 'Transparência', d: 'Processos claros e prestação de contas.' },
    {
      i: ICONS.users,
      t: 'Acesso facilitado',
      d: 'Quem pode participar: empresas, produtores, entidades e órgãos públicos.',
    },
  ]

  const cards = items
    .map(
      (b) => `
    <div class="ben-card">
      <div class="ben-icon">${b.i}</div>
      <h4 class="ben-title">${b.t}</h4>
      <p class="ben-desc">${b.d}</p>
    </div>
  `,
    )
    .join('')

  return `
    <div class="catalog-page page-benefits">
      <div class="header">
        <h1 class="page-title">BENEFÍCIOS PARA VOCÊ</h1>
        <h2 class="page-subtitle">Vantagens de participar da ACERSOL</h2>
      </div>
      <div class="content">
        <div class="ben-hero"><img src="{{IMG_BENEFICIOS}}" alt="Benefícios" onerror="this.style.display='none'"/></div>
        <div class="benefits-grid-9">
          ${cards}
        </div>
      </div>
      {{FOOTER}}
    </div>
  `
}

export function pageNextSteps(): string {
  return `
    <div class="catalog-page page-steps">
      <div class="header">
        <h1 class="page-title">PRÓXIMOS PASSOS</h1>
        <h2 class="page-subtitle">Como será o processo de adesão</h2>
      </div>
      <div class="content">
        <div class="steps-hero"><img src="{{IMG_PASSOS}}" alt="Próximos Passos" onerror="this.style.display='none'"/></div>
        <div class="steps-timeline">
          <div class="step-row">
            <div class="step-num bg-primary">1</div>
            <div class="step-text">
              <h4>Adesão</h4>
              <p>Assinatura do termo de participação na ACERSOL.</p>
            </div>
          </div>
          <div class="step-row">
            <div class="step-num bg-accent">2</div>
            <div class="step-text">
              <h4>Documentação</h4>
              <p>Envio da documentação da unidade consumidora.</p>
            </div>
          </div>
          <div class="step-row">
            <div class="step-num bg-accent">3</div>
            <div class="step-text">
              <h4>Cadastro</h4>
              <p>Realizamos o cadastro junto à distribuidora.</p>
            </div>
          </div>
          <div class="step-row">
            <div class="step-num bg-accent">4</div>
            <div class="step-text">
              <h4>Validação</h4>
              <p>A distribuidora valida e habilita sua participação.</p>
            </div>
          </div>
          <div class="step-row">
            <div class="step-num bg-accent">5</div>
            <div class="step-text">
              <h4>Ativação</h4>
              <p>Início da geração de créditos para sua unidade.</p>
            </div>
          </div>
          <div class="step-row">
            <div class="step-num bg-accent">6</div>
            <div class="step-text">
              <h4>Economia</h4>
              <p>Créditos começam a abater sua conta de energia.</p>
            </div>
          </div>
        </div>

        <div class="prazo-box">
          <div class="icon">${ICONS.calendar}</div>
          <div class="text">
            <strong>PRAZO ESTIMADO</strong>
            <p>O processo completo leva em média de 30 a 45 dias após o envio da documentação completa.</p>
          </div>
        </div>
      </div>
      {{FOOTER}}
    </div>
  `
}

export function pageClosing(): string {
  return `
    <div class="catalog-page page-closing">
      <div class="header">
        <h1 class="page-title">ENCERRAMENTO</h1>
        <h2 class="page-subtitle">Conte com a ACERSOL</h2>
      </div>
      <div class="content">
        <p class="closing-text">Agradecemos a oportunidade de apresentar esta proposta.<br/>Estamos à disposição para esclarecer quaisquer dúvidas e iniciar essa parceria que trará economia e sustentabilidade para sua entidade.</p>
        
        <div class="closing-image-container">
          <img src="{{IMG_PAINEL}}" alt="Encerramento" />
        </div>

        <div class="closing-bottom">
          <div class="closing-contacts">
            <h4>Fale com a ACERSOL</h4>
            <div class="c-item"><span class="icon">${ICONS.phone}</span> (54) 9 9922-0000</div>
            <div class="c-item"><span class="icon">${ICONS.mail}</span> contato@acersol.com.br</div>
            <div class="c-item"><span class="icon">${ICONS.globe}</span> www.acersol.com.br</div>
            <div class="c-item"><span class="icon">${ICONS.mapPin}</span> Constantina - RS</div>
          </div>
          <div class="closing-qr">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.acersol.com.br" alt="QR Code" />
          </div>
        </div>

        <div class="closing-signatures">
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-name">Responsável ACERSOL</div>
            <div class="sig-date">Data: ___/___/___</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-name">Ciente do Cliente</div>
            <div class="sig-date">Data: ___/___/___</div>
          </div>
        </div>
      </div>
      {{FOOTER}}
    </div>
  `
}
