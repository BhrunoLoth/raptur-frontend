// src/test/Login.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../pages/Login';
import * as userService from '../services/userService';

// Mock do userService
vi.mock('../services/userService', () => ({
  login: vi.fn(),
}));

// Mock do react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper para o Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('deve renderizar formulário de login', () => {
    render(
      <RouterWrapper>
        <Login />
      </RouterWrapper>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  test('deve mostrar erro com campos vazios', async () => {
    render(
      <RouterWrapper>
        <Login />
      </RouterWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/preencha todos os campos/i)).toBeInTheDocument();
    });
  });

  test('deve mostrar erro com email inválido', async () => {
    render(
      <RouterWrapper>
        <Login />
      </RouterWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const senhaInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    fireEvent.change(senhaInput, { target: { value: 'senha123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/digite um e-mail válido/i)).toBeInTheDocument();
    });
  });

  test('deve fazer login com sucesso para admin', async () => {
    const mockResponse = {
      token: 'fake-token',
      usuario: {
        id: '1',
        nome: 'Admin',
        email: 'admin@raptur.com',
        perfil: 'admin'
      }
    };

    userService.login.mockResolvedValue(mockResponse);

    render(
      <RouterWrapper>
        <Login />
      </RouterWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const senhaInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'admin@raptur.com' } });
    fireEvent.change(senhaInput, { target: { value: 'admin123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('usuario', JSON.stringify(mockResponse.usuario));
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('deve fazer login com sucesso para motorista', async () => {
    const mockResponse = {
      token: 'fake-token',
      usuario: {
        id: '2',
        nome: 'Motorista',
        email: 'motorista@raptur.com',
        perfil: 'motorista'
      }
    };

    userService.login.mockResolvedValue(mockResponse);

    render(
      <RouterWrapper>
        <Login />
      </RouterWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const senhaInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'motorista@raptur.com' } });
    fireEvent.change(senhaInput, { target: { value: 'senha123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/motorista/dashboard');
    });
  });

  test('deve fazer login com sucesso para passageiro', async () => {
    const mockResponse = {
      token: 'fake-token',
      usuario: {
        id: '3',
        nome: 'Passageiro',
        email: 'passageiro@raptur.com',
        perfil: 'passageiro'
      }
    };

    userService.login.mockResolvedValue(mockResponse);

    render(
      <RouterWrapper>
        <Login />
      </RouterWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const senhaInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'passageiro@raptur.com' } });
    fireEvent.change(senhaInput, { target: { value: 'senha123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/passageiro/dashboard');
    });
  });

  test('deve mostrar erro de login inválido', async () => {
    userService.login.mockRejectedValue(new Error('Credenciais inválidas'));

    render(
      <RouterWrapper>
        <Login />
      </RouterWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const senhaInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'usuario@teste.com' } });
    fireEvent.change(senhaInput, { target: { value: 'senhaerrada' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  test('deve mostrar loading durante o login', async () => {
    userService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <RouterWrapper>
        <Login />
      </RouterWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const senhaInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'usuario@teste.com' } });
    fireEvent.change(senhaInput, { target: { value: 'senha123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/entrando/i)).toBeInTheDocument();
  });

  test('deve limpar erro ao digitar novamente', async () => {
    render(
      <RouterWrapper>
        <Login />
      </RouterWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Gerar erro primeiro
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/preencha todos os campos/i)).toBeInTheDocument();
    });

    // Digitar no campo deve limpar o erro
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    
    await waitFor(() => {
      expect(screen.queryByText(/preencha todos os campos/i)).not.toBeInTheDocument();
    });
  });

  test('deve redirecionar para troca de senha se necessário', async () => {
    const mockResponse = {
      token: 'fake-token',
      usuario: {
        id: '4',
        nome: 'Usuário',
        email: 'usuario@teste.com',
        perfil: 'passageiro',
        precisaTrocarSenha: true
      }
    };

    userService.login.mockResolvedValue(mockResponse);

    render(
      <RouterWrapper>
        <Login />
      </RouterWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const senhaInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'usuario@teste.com' } });
    fireEvent.change(senhaInput, { target: { value: 'senha123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/trocar-senha');
    });
  });
});

