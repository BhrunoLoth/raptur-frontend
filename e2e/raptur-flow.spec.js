// e2e/raptur-flow.spec.js
import { test, expect } from '@playwright/test';

test.describe('Fluxo Completo Raptur', () => {
  test.beforeEach(async ({ page }) => {
    // Interceptar chamadas da API para mock
    await page.route('**/api/**', async (route) => {
      const url = route.request().url();
      const method = route.request().method();
      
      // Mock da API de login
      if (url.includes('/api/auth/login') && method === 'POST') {
        const postData = route.request().postDataJSON();
        
        if (postData.email === 'admin@raptur.com') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              token: 'mock-admin-token',
              usuario: {
                id: '1',
                nome: 'Administrador',
                email: 'admin@raptur.com',
                perfil: 'admin'
              }
            })
          });
        } else if (postData.email === 'motorista@raptur.com') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              token: 'mock-motorista-token',
              usuario: {
                id: '2',
                nome: 'João Motorista',
                email: 'motorista@raptur.com',
                perfil: 'motorista'
              }
            })
          });
        } else if (postData.email === 'passageiro@raptur.com') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              token: 'mock-passageiro-token',
              usuario: {
                id: '3',
                nome: 'Maria Passageira',
                email: 'passageiro@raptur.com',
                perfil: 'passageiro'
              }
            })
          });
        } else {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ erro: 'Usuário não encontrado' })
          });
        }
        return;
      }

      // Mock da API de passageiros (saldo)
      if (url.includes('/api/passageiros/3') && method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '3',
            nome: 'Maria Passageira',
            email: 'passageiro@raptur.com',
            saldo: 25.50,
            qrCode: 'mock-qr-code-content'
          })
        });
        return;
      }

      // Mock da API de recarga Pix
      if (url.includes('/api/pix/cobrar') && method === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            qrCode: 'mock-pix-qr-code',
            copiaCola: 'mock-pix-copia-cola',
            pagamentoId: 'mock-payment-123'
          })
        });
        return;
      }

      // Mock da API de idosos
      if (url.includes('/api/idosos') && method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            idosos: [
              {
                id: 'idoso-123',
                nome: 'Maria da Silva',
                cpf: '123.456.789-00',
                dataNascimento: '1950-05-15',
                numeroCarteira: '0001-2025',
                dataEmissao: '2025-01-15',
                dataValidade: '2030-01-15',
                fotoUrl: '/uploads/idosos/foto-123.jpg',
                ativo: true,
                createdAt: '2025-01-15'
              }
            ],
            totalPages: 1,
            currentPage: 1,
            totalItems: 1
          })
        });
        return;
      }

      if (url.includes('/api/idosos/idoso-123') && method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'idoso-123',
            nome: 'Maria da Silva',
            cpf: '123.456.789-00',
            dataNascimento: '1950-05-15',
            numeroCarteira: '0001-2025',
            dataEmissao: '2025-01-15',
            dataValidade: '2030-01-15',
            fotoUrl: '/uploads/idosos/foto-123.jpg',
            qrConteudo: JSON.stringify({
              id: 'idoso-123',
              nome: 'Maria da Silva',
              cpf: '123.456.789-00',
              numeroCarteira: '0001-2025',
              dataValidade: '2030-01-15',
              tipo: 'carteirinha_idoso'
            }),
            ativo: true,
            createdAt: '2025-01-15'
          })
        });
        return;
      }

      // Mock da validação de QR Code
      if (url.includes('/api/idosos/validar-qr') && method === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            valido: true,
            mensagem: 'Carteirinha válida',
            idoso: {
              nome: 'Maria da Silva',
              numeroCarteira: '0001-2025',
              dataValidade: '2030-01-15'
            }
          })
        });
        return;
      }

      // Para outras rotas, continuar normalmente
      await route.continue();
    });
  });

  test('Login como Admin e navegação', async ({ page }) => {
    await page.goto('/');

    // Fazer login como admin
    await page.fill('input[name="email"]', 'admin@raptur.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');

    // Verificar redirecionamento para dashboard admin
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Navegar para carteirinhas do idoso
    await page.click('text=Carteirinha Idoso');
    await expect(page).toHaveURL('/idosos');
    await expect(page.locator('text=Carteirinhas do Idoso')).toBeVisible();
  });

  test('Login como Motorista e scanner QR', async ({ page }) => {
    await page.goto('/');

    // Fazer login como motorista
    await page.fill('input[name="email"]', 'motorista@raptur.com');
    await page.fill('input[name="senha"]', 'senha123');
    await page.click('button[type="submit"]');

    // Verificar redirecionamento para dashboard motorista
    await expect(page).toHaveURL('/motorista/dashboard');
    await expect(page.locator('text=Dashboard do Motorista')).toBeVisible();

    // Navegar para scanner QR
    await page.click('text=Scanner QR');
    await expect(page).toHaveURL('/scannerqrcode');
    await expect(page.locator('text=Scanner QR Code')).toBeVisible();
  });

  test('Login como Passageiro e recarga Pix', async ({ page }) => {
    await page.goto('/');

    // Fazer login como passageiro
    await page.fill('input[name="email"]', 'passageiro@raptur.com');
    await page.fill('input[name="senha"]', 'senha123');
    await page.click('button[type="submit"]');

    // Verificar redirecionamento para dashboard passageiro
    await expect(page).toHaveURL('/passageiro/dashboard');
    await expect(page.locator('text=Dashboard do Passageiro')).toBeVisible();

    // Verificar exibição do saldo
    await expect(page.locator('text=R$ 25,50')).toBeVisible();

    // Navegar para recarga
    await page.click('text=Recarregar');
    await expect(page).toHaveURL('/passageiro/recarga');

    // Fazer recarga
    await page.fill('input[name="valor"]', '10');
    await page.click('button:has-text("Gerar QR Code")');

    // Verificar se QR Code foi gerado
    await expect(page.locator('text=QR Code gerado')).toBeVisible();
    await expect(page.locator('text=mock-pix-copia-cola')).toBeVisible();
  });

  test('Fluxo completo de carteirinha do idoso', async ({ page }) => {
    await page.goto('/');

    // Login como admin
    await page.fill('input[name="email"]', 'admin@raptur.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');

    // Navegar para carteirinhas
    await page.click('text=Carteirinha Idoso');
    await expect(page).toHaveURL('/idosos');

    // Verificar lista de idosos
    await expect(page.locator('text=Maria da Silva')).toBeVisible();
    await expect(page.locator('text=123.456.789-00')).toBeVisible();
    await expect(page.locator('text=0001-2025')).toBeVisible();

    // Visualizar carteirinha
    await page.click('button[title="Visualizar carteirinha"]');
    await expect(page).toHaveURL('/idosos/idoso-123');

    // Verificar componente da carteirinha
    await expect(page.locator('text=Raptur')).toBeVisible();
    await expect(page.locator('text=Cartão de Idoso – Uso Gratuito')).toBeVisible();
    await expect(page.locator('text=Maria da Silva')).toBeVisible();
    await expect(page.locator('text=123.456.789-00')).toBeVisible();
    await expect(page.locator('text=0001-2025')).toBeVisible();

    // Testar botão de impressão (verificar se existe)
    await expect(page.locator('button:has-text("Imprimir")')).toBeVisible();

    // Testar QR Code modal
    await page.click('button:has-text("QR Code")');
    await expect(page.locator('text=QR Code da Carteirinha')).toBeVisible();
    await page.click('button:has-text("Fechar")');
  });

  test('Validação de QR Code pelo motorista', async ({ page }) => {
    await page.goto('/');

    // Login como motorista
    await page.fill('input[name="email"]', 'motorista@raptur.com');
    await page.fill('input[name="senha"]', 'senha123');
    await page.click('button[type="submit"]');

    // Navegar para scanner
    await page.click('text=Scanner QR');

    // Simular validação de QR Code (input manual para teste)
    const qrContent = JSON.stringify({
      id: 'idoso-123',
      nome: 'Maria da Silva',
      cpf: '123.456.789-00',
      numeroCarteira: '0001-2025',
      dataValidade: '2030-01-15',
      tipo: 'carteirinha_idoso'
    });

    // Se houver campo de input manual para QR
    const qrInput = page.locator('input[placeholder*="QR"]').first();
    if (await qrInput.isVisible()) {
      await qrInput.fill(qrContent);
      await page.click('button:has-text("Validar")');
      
      // Verificar resultado da validação
      await expect(page.locator('text=Carteirinha válida')).toBeVisible();
      await expect(page.locator('text=Maria da Silva')).toBeVisible();
    }
  });

  test('Erro de login com credenciais inválidas', async ({ page }) => {
    await page.goto('/');

    // Tentar login com credenciais inválidas
    await page.fill('input[name="email"]', 'usuario@inexistente.com');
    await page.fill('input[name="senha"]', 'senhaerrada');
    await page.click('button[type="submit"]');

    // Verificar mensagem de erro
    await expect(page.locator('text=Usuário não encontrado')).toBeVisible();
    
    // Verificar que permaneceu na página de login
    await expect(page).toHaveURL('/');
  });

  test('Navegação entre perfis e logout', async ({ page }) => {
    // Login como admin
    await page.goto('/');
    await page.fill('input[name="email"]', 'admin@raptur.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');

    // Fazer logout
    await page.click('button:has-text("Sair")');
    await expect(page).toHaveURL('/login');

    // Login como passageiro
    await page.fill('input[name="email"]', 'passageiro@raptur.com');
    await page.fill('input[name="senha"]', 'senha123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/passageiro/dashboard');

    // Verificar que não tem acesso a funcionalidades de admin
    await page.goto('/idosos');
    // Deve ser redirecionado ou mostrar erro de acesso
    await expect(page).not.toHaveURL('/idosos');
  });

  test('Responsividade mobile', async ({ page }) => {
    // Configurar viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');

    // Fazer login
    await page.fill('input[name="email"]', 'admin@raptur.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]');

    // Verificar se menu mobile funciona
    const menuButton = page.locator('button[aria-label*="menu"]').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.locator('text=Carteirinha Idoso')).toBeVisible();
    }

    // Navegar para carteirinhas
    await page.click('text=Carteirinha Idoso');
    await expect(page).toHaveURL('/idosos');

    // Verificar se tabela é responsiva
    await expect(page.locator('text=Maria da Silva')).toBeVisible();
  });
});

