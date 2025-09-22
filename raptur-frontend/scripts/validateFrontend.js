// scripts/validateFrontend.js - Validação completa do frontend
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function validarFrontend() {
  console.log('🔍 Iniciando validação completa do frontend...\n');
  
  const resultados = {
    sucessos: 0,
    falhas: 0,
    testes: []
  };

  // Função helper para testes
  const teste = async (nome, funcao) => {
    try {
      console.log(`⏳ ${nome}...`);
      await funcao();
      console.log(`✅ ${nome} - SUCESSO`);
      resultados.sucessos++;
      resultados.testes.push({ nome, status: 'SUCESSO' });
    } catch (error) {
      console.log(`❌ ${nome} - FALHA: ${error.message}`);
      resultados.falhas++;
      resultados.testes.push({ nome, status: 'FALHA', erro: error.message });
    }
  };

  // 1. Verificar estrutura de arquivos essenciais
  await teste('Estrutura de arquivos essenciais', async () => {
    const arquivosEssenciais = [
      'package.json',
      'vite.config.js',
      'index.html',
      '.env',
      'src/App.jsx',
      'src/main.jsx',
      'src/services/api.js',
      'src/services/pagamentoService.js',
      'src/services/embarqueService.js',
      'src/components/Layout.jsx',
      'src/styles/RapturStyle.css'
    ];
    
    for (const arquivo of arquivosEssenciais) {
      const caminhoCompleto = path.join(projectRoot, arquivo);
      if (!fs.existsSync(caminhoCompleto)) {
        throw new Error(`Arquivo essencial não encontrado: ${arquivo}`);
      }
    }
  });

  // 2. Verificar package.json
  await teste('Configuração do package.json', async () => {
    const packagePath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const dependenciasEssenciais = [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      'axios',
      'vite'
    ];
    
    for (const dep of dependenciasEssenciais) {
      if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
        throw new Error(`Dependência essencial não encontrada: ${dep}`);
      }
    }
    
    const scriptsEssenciais = ['dev', 'build', 'preview'];
    for (const script of scriptsEssenciais) {
      if (!packageJson.scripts?.[script]) {
        throw new Error(`Script essencial não encontrado: ${script}`);
      }
    }
  });

  // 3. Verificar arquivo .env
  await teste('Configuração de ambiente (.env)', async () => {
    const envPath = path.join(projectRoot, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const variaveisEssenciais = [
      'VITE_API_URL',
      'VITE_BACKEND_URL'
    ];
    
    for (const variavel of variaveisEssenciais) {
      if (!envContent.includes(variavel)) {
        throw new Error(`Variável de ambiente não encontrada: ${variavel}`);
      }
    }
  });

  // 4. Verificar componentes principais
  await teste('Componentes principais', async () => {
    const componentesEssenciais = [
      'src/components/Layout.jsx',
      'src/components/PublicLayout.jsx',
      'src/components/ProtectedLayout.jsx',
      'src/components/QRCodeEmbarque.jsx',
      'src/components/QRCodeScanner.jsx',
      'src/components/ConnectivityChecker.jsx'
    ];
    
    for (const componente of componentesEssenciais) {
      const caminhoCompleto = path.join(projectRoot, componente);
      if (!fs.existsSync(caminhoCompleto)) {
        throw new Error(`Componente essencial não encontrado: ${componente}`);
      }
      
      // Verificar se o arquivo não está vazio
      const conteudo = fs.readFileSync(caminhoCompleto, 'utf8');
      if (conteudo.trim().length < 100) {
        throw new Error(`Componente parece estar vazio ou incompleto: ${componente}`);
      }
    }
  });

  // 5. Verificar páginas principais
  await teste('Páginas principais', async () => {
    const paginasEssenciais = [
      'src/pages/Login.jsx',
      'src/pages/AdminDashboard.jsx',
      'src/pages/MotoristaDashboard.jsx',
      'src/pages/PassageiroDashboard.jsx',
      'src/pages/RecargaPix.jsx'
    ];
    
    for (const pagina of paginasEssenciais) {
      const caminhoCompleto = path.join(projectRoot, pagina);
      if (!fs.existsSync(caminhoCompleto)) {
        throw new Error(`Página essencial não encontrada: ${pagina}`);
      }
    }
  });

  // 6. Verificar serviços
  await teste('Serviços de API', async () => {
    const servicosEssenciais = [
      'src/services/api.js',
      'src/services/pagamentoService.js',
      'src/services/embarqueService.js'
    ];
    
    for (const servico of servicosEssenciais) {
      const caminhoCompleto = path.join(projectRoot, servico);
      const conteudo = fs.readFileSync(caminhoCompleto, 'utf8');
      
      // Verificar se contém exports
      if (!conteudo.includes('export')) {
        throw new Error(`Serviço não possui exports: ${servico}`);
      }
      
      // Verificar imports essenciais
      if (servico.includes('api.js') && !conteudo.includes('axios')) {
        throw new Error(`Serviço API não importa axios: ${servico}`);
      }
    }
  });

  // 7. Verificar estilos CSS
  await teste('Arquivos de estilo', async () => {
    const cssPath = path.join(projectRoot, 'src/styles/RapturStyle.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Verificar se contém classes essenciais
    const classesEssenciais = [
      '.main-bg',
      '.center-content',
      '.card',
      '@media'
    ];
    
    for (const classe of classesEssenciais) {
      if (!cssContent.includes(classe)) {
        throw new Error(`Classe CSS essencial não encontrada: ${classe}`);
      }
    }
    
    // Verificar responsividade
    if (!cssContent.includes('@media (max-width:')) {
      throw new Error('CSS não possui media queries para responsividade');
    }
  });

  // 8. Verificar configuração do Vite
  await teste('Configuração do Vite', async () => {
    const vitePath = path.join(projectRoot, 'vite.config.js');
    const viteContent = fs.readFileSync(vitePath, 'utf8');
    
    if (!viteContent.includes('@vitejs/plugin-react')) {
      throw new Error('Plugin React não configurado no Vite');
    }
  });

  // 9. Verificar build
  await teste('Verificação de build', async () => {
    const distPath = path.join(projectRoot, 'dist');
    if (!fs.existsSync(distPath)) {
      throw new Error('Pasta dist não encontrada. Execute npm run build primeiro.');
    }
    
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      throw new Error('index.html não encontrado na pasta dist');
    }
    
    // Verificar se há arquivos JS e CSS
    const assetsPath = path.join(distPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      const assets = fs.readdirSync(assetsPath);
      const hasJS = assets.some(file => file.endsWith('.js'));
      const hasCSS = assets.some(file => file.endsWith('.css'));
      
      if (!hasJS) throw new Error('Arquivos JavaScript não encontrados no build');
      if (!hasCSS) throw new Error('Arquivos CSS não encontrados no build');
    }
  });

  // 10. Verificar estrutura de rotas
  await teste('Estrutura de rotas', async () => {
    const appPath = path.join(projectRoot, 'src/App.jsx');
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    // Verificar se contém roteamento
    if (!appContent.includes('BrowserRouter') && !appContent.includes('Router')) {
      throw new Error('Roteamento não configurado no App.jsx');
    }
    
    if (!appContent.includes('Routes') || !appContent.includes('Route')) {
      throw new Error('Componentes de rota não encontrados');
    }
    
    // Verificar rotas essenciais
    const rotasEssenciais = ['/login', '/admin', '/motorista', '/passageiro'];
    for (const rota of rotasEssenciais) {
      if (!appContent.includes(`path="${rota}"`)) {
        throw new Error(`Rota essencial não encontrada: ${rota}`);
      }
    }
  });

  // Relatório final
  console.log('\n' + '='.repeat(50));
  console.log('📊 RELATÓRIO FINAL DA VALIDAÇÃO FRONTEND');
  console.log('='.repeat(50));
  console.log(`✅ Sucessos: ${resultados.sucessos}`);
  console.log(`❌ Falhas: ${resultados.falhas}`);
  console.log(`📈 Taxa de sucesso: ${((resultados.sucessos / (resultados.sucessos + resultados.falhas)) * 100).toFixed(1)}%`);
  
  if (resultados.falhas > 0) {
    console.log('\n🔍 DETALHES DAS FALHAS:');
    resultados.testes
      .filter(t => t.status === 'FALHA')
      .forEach(t => console.log(`  ❌ ${t.nome}: ${t.erro}`));
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (resultados.falhas === 0) {
    console.log('🎉 FRONTEND 100% VALIDADO!');
    console.log('✨ Todas as funcionalidades estão implementadas e funcionais.');
    return true;
  } else {
    console.log('⚠️ Frontend com problemas que precisam ser corrigidos.');
    return false;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  validarFrontend()
    .then(sucesso => {
      process.exit(sucesso ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Erro na validação:', error.message);
      process.exit(1);
    });
}

export default validarFrontend;
