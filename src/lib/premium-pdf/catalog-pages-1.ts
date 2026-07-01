import { ICONS } from '@/lib/premium-pdf/styles'

export function pageCover(): string {
  return `
    <div class="catalog-page page-cover">
      <div class="cover-bg" style="background-image:url('{{IMG_CAPA}}')"></div>
      <div class="cover-gradient"></div>
      <div class="cover-content">
        <img src="{{LOGO}}" alt="ACERSOL" class="logo" />
        <div class="title-block">
          <h1>PROPOSTA COMERCIAL</h1>
          <h2>Sistema de Compensação de<br/>Energia Elétrica (SCEE)</h2>
        </div>
        <div class="client-block">
          <span class="label">Cliente</span>
          <span class="value">{{CLIENTE}}</span>
        </div>
        <div class="info-block">
          <div class="info-item">
            <span class="icon">${ICONS.fileText}</span>
            <div>
              <span class="label">Proposta nº</span>
              <span class="value">{{NUMERO_PROPOSTA}}</span>
            </div>
          </div>
          <div class="info-item">
            <span class="icon">${ICONS.calendar}</span>
            <div>
              <span class="label">Data</span>
              <span class="value">{{DATA}}</span>
            </div>
          </div>
        </div>
        <div class="footer-block">
          <span>Energia renovável. Economia inteligente.</span>
          <span class="page-num">01</span>
        </div>
      </div>
    </div>
  `
}

export function pageDiagnostico(): string {
  return `
    <div class="catalog-page page-diagnostico">
      <div class="header">
        <h1 class="page-title">DIAGNÓSTICO DO CLIENTE</h1>
        <h2 class="page-subtitle">Resumo executivo</h2>
      </div>
      <div class="content">
        <p class="text">Após a análise das informações fornecidas, identificamos um grande potencial de economia através da participação no Sistema de Compensação de Energia Elétrica (SCEE), permitindo que sua unidade consumidora receba créditos de energia gerados por nossas usinas solares.</p>
        
        <div class="diag-split">
          <div class="diag-blue-box">
            <div class="diag-item">
              <span class="icon">${ICONS.building}</span>
              <div class="diag-text">
                <span class="label">Distribuidora</span>
                <span class="value">{{DISTRIBUIDORA}}</span>
              </div>
            </div>
            <div class="diag-item">
              <span class="icon">${ICONS.mapPin}</span>
              <div class="diag-text">
                <span class="label">Cidade</span>
                <span class="value">{{CIDADE_ESTADO}}</span>
              </div>
            </div>
            <div class="diag-item">
              <span class="icon">${ICONS.fileText}</span>
              <div class="diag-text">
                <span class="label">Unidade Consumidora</span>
                <span class="value">{{UC_CODE}}</span>
              </div>
            </div>
            <div class="diag-item">
              <span class="icon">${ICONS.zap}</span>
              <div class="diag-text">
                <span class="label">Consumo Médio</span>
                <span class="value">{{MEDIA_KWH_LABEL}}</span>
              </div>
            </div>
            <div class="diag-item">
              <span class="icon">${ICONS.percent}</span>
              <div class="diag-text">
                <span class="label">Potencial de Economia</span>
                <span class="value">Aprox. {{ECONOMIA_PERCENTUAL_LABEL}}</span>
              </div>
            </div>
            <div class="diag-item highlight">
              <span class="icon">${ICONS.wallet}</span>
              <div class="diag-text">
                <span class="label">Economia Estimada</span>
                <span class="value">{{ECONOMIA_MENSAL_LABEL}}/mês</span>
              </div>
            </div>
            <div class="diag-disclaimer">
              ** Esta proposta foi elaborada exclusivamente para a {{CLIENTE}}, considerando os dados informados no momento da simulação.
            </div>
          </div>
          <div class="diag-image">
            <img src="{{IMG_SUSTENTABILIDADE}}" alt="Diagnóstico" />
          </div>
        </div>
      </div>
      {{FOOTER}}
    </div>
  `
}

export function pageInstitutional(): string {
  return `
    <div class="catalog-page page-institutional">
      <div class="header">
        <h1 class="page-title">QUEM É A ACERSOL</h1>
      </div>
      <div class="content">
        <p class="text intro-text">A ACERSOL é uma associação civil sem fins lucrativos que atua no compartilhamento de créditos de energia elétrica através do Sistema de Compensação de Energia Elétrica (SCEE). Nosso propósito é democratizar o acesso à energia renovável, proporcionando economia, sustentabilidade e segurança jurídica a nossos associados.</p>
        
        <div class="mvv-grid">
          <div class="mvv-card">
            <div class="icon-wrap"><div class="icon">${ICONS.users}</div></div>
            <h3>MISSÃO</h3>
            <p>Promover economia e sustentabilidade através da energia compartilhada.</p>
          </div>
          <div class="mvv-card">
            <div class="icon-wrap"><div class="icon">${ICONS.sun}</div></div>
            <h3>VISÃO</h3>
            <p>Ser referência regional em gestão de energia compartilhada.</p>
          </div>
          <div class="mvv-card">
            <div class="icon-wrap"><div class="icon">${ICONS.shield}</div></div>
            <h3>VALORES</h3>
            <p>Transparência, ética, sustentabilidade, cooperação e foco no associado.</p>
          </div>
        </div>

        <h2 class="section-subtitle">NOSSOS DIFERENCIAIS</h2>
        <div class="diferenciais-grid">
          <div class="diff-card">
            <div class="icon">${ICONS.zap}</div>
            <div>
              <h4>Energia Compartilhada</h4>
              <p>Créditos gerados por usinas solares para abater sua conta.</p>
            </div>
          </div>
          <div class="diff-card">
            <div class="icon">${ICONS.wallet}</div>
            <div>
              <h4>Sem Investimento</h4>
              <p>Você não precisa investir na compra de equipamentos ou instalação.</p>
            </div>
          </div>
          <div class="diff-card">
            <div class="icon">${ICONS.trending}</div>
            <div>
              <h4>Economia Real</h4>
              <p>Redução dos custos com energia elétrica todos os meses.</p>
            </div>
          </div>
          <div class="diff-card">
            <div class="icon">${ICONS.building}</div>
            <div>
              <h4>Gestão Completa</h4>
              <p>Cuidamos de todo o processo junto à distribuidora e órgãos reguladores.</p>
            </div>
          </div>
          <div class="diff-card">
            <div class="icon">${ICONS.user}</div>
            <div>
              <h4>Atendimento Personalizado</h4>
              <p>Suporte próximo e atendimento humanizado.</p>
            </div>
          </div>
          <div class="diff-card">
            <div class="icon">${ICONS.leaf}</div>
            <div>
              <h4>Sustentabilidade</h4>
              <p>Energia limpa que contribui com o meio ambiente e o futuro.</p>
            </div>
          </div>
        </div>
      </div>
      {{FOOTER}}
    </div>
  `
}

export function pageHowItWorks(): string {
  return `
    <div class="catalog-page page-how-it-works">
      <div class="header">
        <h1 class="page-title">COMO FUNCIONA O SCEE</h1>
        <h2 class="page-subtitle">Entenda o processo</h2>
      </div>
      <div class="content">
        <div class="timeline">
          <div class="tl-item">
            <div class="tl-number">1</div>
            <div class="tl-icon">${ICONS.sun}</div>
            <div class="tl-content">
              <h3>USINA SOLAR</h3>
              <p>A ACERSOL gera energia limpa em suas usinas fotovoltaicas.</p>
            </div>
          </div>
          <div class="tl-arrow"></div>
          <div class="tl-item">
            <div class="tl-number">2</div>
            <div class="tl-icon">${ICONS.building}</div>
            <div class="tl-content">
              <h3>DISTRIBUIDORA</h3>
              <p>A energia gerada é injetada na rede da distribuidora local.</p>
            </div>
          </div>
          <div class="tl-arrow"></div>
          <div class="tl-item">
            <div class="tl-number">3</div>
            <div class="tl-icon">${ICONS.zap}</div>
            <div class="tl-content">
              <h3>CRÉDITOS DE ENERGIA</h3>
              <p>Os créditos são gerados e disponibilizados para os associados da ACERSOL.</p>
            </div>
          </div>
          <div class="tl-arrow"></div>
          <div class="tl-item">
            <div class="tl-number">4</div>
            <div class="tl-icon">${ICONS.user}</div>
            <div class="tl-content">
              <h3>UNIDADE CONSUMIDORA</h3>
              <p>Os créditos são direcionados para sua unidade consumidora.</p>
            </div>
          </div>
          <div class="tl-arrow"></div>
          <div class="tl-item">
            <div class="tl-number">5</div>
            <div class="tl-icon">${ICONS.wallet}</div>
            <div class="tl-content">
              <h3>ECONOMIA NA FATURA</h3>
              <p>Os créditos abatem o consumo da sua conta de energia elétrica.</p>
            </div>
          </div>
        </div>
        
        <div class="tl-badge">
          <span class="icon">${ICONS.check}</span> Tudo isso sem instalação, sem obras e sem investimento.
        </div>
      </div>
      {{FOOTER}}
    </div>
  `
}
