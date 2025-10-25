# RAPTUR Frontend 2.0

Sistema de Gestão de Transporte Público - Interface Web Moderna

## 🎨 Tecnologias

- **React 19** - Framework UI
- **Vite** - Build tool ultrarrápido
- **TailwindCSS 4** - Estilização moderna
- **shadcn/ui** - Componentes de alta qualidade
- **Wouter** - Roteamento leve
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **html5-qrcode** - Scanner QR Code
- **react-qr-code** - Geração de QR Code
- **TypeScript** - Tipagem estática

## 🚀 Funcionalidades

### ✅ Autenticação
- Login com CPF e senha
- Registro de passageiros
- Gerenciamento de sessão com JWT
- Logout seguro

### ✅ Passageiro
- Visualização de saldo
- QR Code para embarque
- Recarga via PIX (QR Code dinâmico)
- Histórico de recargas
- Perfil completo

### ✅ Carteirinha do Idoso
- Solicitação automática (verifica idade 60+)
- Carteirinha visual bonita (verde + dourado)
- QR Code para embarque gratuito
- Validade de 5 anos
- Status ativo/inativo

### ✅ Motorista
- Visualização de viagens agendadas
- Iniciar/finalizar viagens
- Acompanhamento em tempo real
- Histórico de viagens
- Totalizadores (passageiros, arrecadação)

### ✅ Cobrador
- Scanner QR Code em tempo real
- Validação de embarques
- Seleção de viagem ativa
- Lista de embarques do dia
- Identificação de gratuidades

### ✅ Dashboard
- Estatísticas gerais (admin)
- Navegação por perfil
- Cards interativos
- Responsivo

## 📁 Estrutura

```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes shadcn/ui
│   │   ├── Layout.tsx       # Layout compartilhado
│   │   ├── QRScanner.tsx    # Scanner QR Code
│   │   ├── QRCodeDisplay.tsx # Exibição QR Code
│   │   └── RecargaPIX.tsx   # Modal de recarga
│   ├── pages/
│   │   ├── Home.tsx         # Redirecionamento
│   │   ├── Login.tsx        # Tela de login
│   │   ├── Register.tsx     # Cadastro
│   │   ├── Dashboard.tsx    # Dashboard principal
│   │   ├── Passageiro.tsx   # Área do passageiro
│   │   ├── CarteirinhaIdoso.tsx # Carteirinha
│   │   ├── Motorista.tsx    # Área do motorista
│   │   └── Cobrador.tsx     # Scanner do cobrador
│   ├── lib/
│   │   ├── api.ts           # Cliente Axios + endpoints
│   │   ├── store.ts         # Zustand store (auth)
│   │   └── utils.ts         # Utilitários
│   ├── App.tsx              # Rotas
│   ├── index.css            # Tema RAPTUR
│   └── main.tsx             # Entry point
└── public/                  # Assets estáticos
```

## 🎨 Design System

### Cores

```css
/* Verde Esmeralda - Primary */
--primary: oklch(0.45 0.15 165); /* #00764A */

/* Dourado - Secondary/Accent */
--secondary: oklch(0.75 0.12 85); /* #F5A623 */
```

### Componentes

- **Cards** - Informações organizadas
- **Buttons** - Primary, Secondary, Outline, Ghost
- **Inputs** - Validação e formatação
- **Modals** - Diálogos interativos
- **QR Codes** - Scanner e display

## 🔧 Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env
VITE_API_URL=http://localhost:3000/api
VITE_MERCADOPAGO_PUBLIC_KEY=sua_public_key
```

## 🏃 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview do build
pnpm preview
```

## 📱 Responsividade

- **Mobile First** - Design otimizado para celular
- **Breakpoints** - sm (640px), md (768px), lg (1024px)
- **Touch Friendly** - Botões e áreas clicáveis grandes
- **Scanner** - Funciona em mobile e desktop

## 🔐 Segurança

- **JWT** - Token armazenado em localStorage
- **Interceptors** - Adiciona token automaticamente
- **Auto Logout** - Em caso de token inválido (401)
- **Validação** - Formulários com validação client-side

## 🚀 Deploy (Vercel)

```bash
# Build command
pnpm build

# Output directory
dist

# Environment Variables
VITE_API_URL=https://sua-api.railway.app/api
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
```

## 📊 Fluxos Principais

### Login
1. Usuário insere CPF e senha
2. Frontend envia para `/api/auth/login`
3. Backend retorna token + dados do usuário
4. Token salvo em localStorage
5. Redirecionamento para dashboard

### Recarga PIX
1. Passageiro clica em "Adicionar Créditos"
2. Informa valor desejado
3. Frontend chama `/api/pix/recarga`
4. Backend gera QR Code Mercado Pago
5. Usuário paga com app do banco
6. Webhook atualiza saldo automaticamente
7. Frontend verifica status a cada 3s

### Embarque (Cobrador)
1. Cobrador seleciona viagem ativa
2. Abre scanner QR Code
3. Passageiro mostra QR Code
4. Scanner lê e envia para `/api/embarques/validar`
5. Backend valida (saldo, gratuidade, etc.)
6. Retorna sucesso + tipo de embarque
7. Embarque registrado na lista

### Carteirinha Idoso
1. Passageiro clica em "Solicitar"
2. Backend verifica idade (60+)
3. Gera número único (0001-2025)
4. Cria QR Code assinado
5. Gera PDF com layout verde + dourado
6. Retorna carteirinha completa
7. Frontend exibe visual bonito

## 🎯 Próximas Melhorias

- [ ] Modo offline (Service Worker)
- [ ] Notificações push
- [ ] Histórico de embarques (passageiro)
- [ ] Relatórios (admin)
- [ ] Gestão de usuários (admin)
- [ ] Gestão de ônibus/rotas (admin)
- [ ] Chat de suporte
- [ ] Tema escuro completo
- [ ] PWA (instalável)
- [ ] App mobile (React Native)

## 📝 Licença

MIT

---

**Desenvolvido com 💚 pela equipe Raptur**

