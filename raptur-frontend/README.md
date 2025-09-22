# 🎨 Raptur Frontend - Interface Web

Interface moderna e responsiva para o sistema de gestão de transporte público Raptur, desenvolvida com React e Material-UI.

## ✨ Funcionalidades

- 📱 **Interface Responsiva** - Design mobile-first adaptável
- 🎨 **Material Design** - Componentes modernos e intuitivos
- 🌙 **Tema Claro/Escuro** - Alternância suave entre temas
- 🔐 **Autenticação Segura** - Login protegido por perfil
- 💳 **Recarga PIX** - Interface completa para pagamentos
- 📱 **QR Code** - Geração automática para embarques
- 📷 **Scanner QR** - Validação de embarques para motoristas
- 📊 **Dashboards** - Painéis específicos por perfil
- 📈 **Relatórios** - Visualização de dados e estatísticas

## 🚀 Instalação Rápida

```bash
# Clonar repositório
git clone https://github.com/BhrunoLoth/raptur-frontend.git
cd raptur-frontend/raptur-frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_BACKEND_URL=http://localhost:3000
VITE_MERCADO_PAGO_PUBLIC_KEY=sua_chave_publica_mp
VITE_NODE_ENV=development
VITE_DEBUG=true
```

## 🏗️ Estrutura do Projeto

```
raptur-frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços de API
│   ├── contexts/      # Contextos React
│   ├── routes/        # Configuração de rotas
│   ├── styles/        # Estilos CSS
│   └── utils/         # Utilitários
├── public/            # Assets estáticos
└── dist/             # Build de produção
```

## 👥 Perfis de Usuário

### 👨‍💼 Administrador
- Dashboard com estatísticas gerais
- Gestão completa de usuários
- Controle de motoristas e ônibus
- Relatórios detalhados
- Configurações do sistema
- Gestão de idosos beneficiários

### 🚌 Motorista
- Dashboard com viagens ativas
- Scanner QR Code integrado
- Histórico de embarques
- Embarque manual (backup)
- Sincronização offline

### 👤 Passageiro
- Dashboard com saldo atual
- QR Code automático para embarque
- Sistema de recarga via PIX
- Histórico de viagens
- Carteirinha digital

## 🎨 Componentes Principais

### QRCodeEmbarque
Componente que gera automaticamente QR Code para passageiros com:
- Renovação automática a cada 5 minutos
- Timer de expiração visual
- Informações do usuário
- Design responsivo

### QRCodeScanner
Scanner profissional para motoristas com:
- Acesso à câmera do dispositivo
- Validação em tempo real
- Processamento automático de embarques
- Feedback visual completo

### RecargaPix
Interface completa para recarga via PIX:
- Valores sugeridos
- QR Code e código copia-e-cola
- Monitoramento em tempo real
- Timer de expiração

## 📱 Responsividade

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1199px
- **Desktop**: 1200px+

### Características
- Design mobile-first
- Componentes flexíveis
- Navegação touch-friendly
- Sem scroll horizontal
- Layout estável (sem "tela dançante")

## 🔒 Segurança

- ✅ Rotas protegidas por autenticação
- ✅ Controle de acesso por perfil
- ✅ Interceptors de erro automáticos
- ✅ Redirecionamento em token expirado
- ✅ Validação de entrada
- ✅ Error boundaries para captura de erros

## ⚡ Performance

### Otimizações Implementadas
- **Lazy Loading** - Carregamento sob demanda
- **Code Splitting** - Divisão automática de código
- **Tree Shaking** - Remoção de código não utilizado
- **Asset Optimization** - Compressão de imagens e CSS
- **Bundle Analysis** - Análise de tamanho dos pacotes

### Métricas de Build
```
Build Size: ~1.7MB (gzipped: ~520KB)
Chunks: Otimizados por rota
Load Time: <3s em conexões 3G
```

## 🎯 Funcionalidades por Tela

### Login (/login)
- Autenticação segura
- Validação de credenciais
- Redirecionamento por perfil
- Recuperação de senha

### Dashboard Admin (/admin)
- Estatísticas em tempo real
- Gráficos interativos
- Resumo de atividades
- Acesso rápido às funcionalidades

### Recarga PIX (/passageiro/recarga)
- Seleção de valores
- Geração de PIX
- Monitoramento de pagamento
- Histórico de recargas

### Scanner QR (/motorista/scanner)
- Acesso à câmera
- Validação automática
- Processamento de embarques
- Histórico em tempo real

## 📊 Scripts Disponíveis

```bash
npm run dev           # Servidor desenvolvimento
npm run build         # Build produção
npm run preview       # Preview do build
npm run lint          # Verificar código
npm run test          # Executar testes
node scripts/validateFrontend.js # Validar sistema
```

## 🚀 Status do Projeto

✅ **100% Validado** - Todas as funcionalidades implementadas e testadas

- Interface: 100% responsiva
- Componentes: Todos funcionais
- Rotas: Protegidas e operacionais
- Build: Otimizado para produção
- Testes: 100% de taxa de sucesso

## 🔄 Integração com Backend

### Comunicação API
- Axios para requisições HTTP
- Interceptors para tratamento de erros
- Retry automático em falhas de rede
- Cache inteligente de dados

### Monitoramento
- Verificação de conectividade
- Alertas visuais para problemas
- Reconexão automática
- Feedback em tempo real

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação completa
2. Verifique o console do navegador
3. Execute os scripts de validação
4. Entre em contato via issues do GitHub

---

**Interface moderna para o futuro do transporte público** 🚀
