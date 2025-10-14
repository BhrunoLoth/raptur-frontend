// src/test/Carteirinha.test.jsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Carteirinha from '../components/Carteirinha';

// Mock do QRCodeCanvas
vi.mock('qrcode.react', () => ({
  QRCodeCanvas: ({ value, size }) => (
    <div data-testid="qr-code" data-value={value} data-size={size}>
      QR Code Mock
    </div>
  ),
}));

describe('Carteirinha Component', () => {
  const mockIdoso = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nome: 'Maria da Silva Santos',
    cpf: '123.456.789-00',
    dataNascimento: '1950-05-15',
    numeroCarteira: '0001-2025',
    dataEmissao: '2025-01-15',
    dataValidade: '2030-01-15',
    fotoUrl: '/uploads/idosos/foto-123.jpg',
    qrConteudo: JSON.stringify({
      id: '123e4567-e89b-12d3-a456-426614174000',
      nome: 'Maria da Silva Santos',
      cpf: '123.456.789-00',
      numeroCarteira: '0001-2025',
      dataValidade: '2030-01-15',
      tipo: 'carteirinha_idoso'
    }),
    ativo: true
  };

  test('deve renderizar carteirinha com todas as informações', () => {
    render(<Carteirinha idoso={mockIdoso} />);

    // Verificar cabeçalho
    expect(screen.getByText('Raptur')).toBeInTheDocument();
    expect(screen.getByText('Cartão de Idoso – Uso Gratuito')).toBeInTheDocument();

    // Verificar dados do idoso
    expect(screen.getByText('Maria da Silva Santos')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('0001-2025')).toBeInTheDocument();
    expect(screen.getByText('15/05/1950')).toBeInTheDocument();
    expect(screen.getByText('15/01/2025')).toBeInTheDocument();
    expect(screen.getByText('15/01/2030')).toBeInTheDocument();

    // Verificar rodapé
    expect(screen.getByText('Apresente este cartão ao motorista durante o embarque.')).toBeInTheDocument();
  });

  test('deve renderizar foto quando disponível', () => {
    render(<Carteirinha idoso={mockIdoso} />);

    const foto = screen.getByAltText('Maria da Silva Santos');
    expect(foto).toBeInTheDocument();
    expect(foto).toHaveAttribute('src', expect.stringContaining('/uploads/idosos/foto-123.jpg'));
  });

  test('deve renderizar placeholder quando foto não disponível', () => {
    const idosoSemFoto = { ...mockIdoso, fotoUrl: null };
    render(<Carteirinha idoso={idosoSemFoto} />);

    expect(screen.getByText('Sem foto')).toBeInTheDocument();
  });

  test('deve renderizar QR Code com conteúdo correto', () => {
    render(<Carteirinha idoso={mockIdoso} />);

    const qrCode = screen.getByTestId('qr-code');
    expect(qrCode).toBeInTheDocument();
    expect(qrCode).toHaveAttribute('data-value', mockIdoso.qrConteudo);
    expect(qrCode).toHaveAttribute('data-size', '80');
  });

  test('deve formatar CPF corretamente', () => {
    const idosoComCpfSemFormatacao = {
      ...mockIdoso,
      cpf: '12345678900'
    };
    
    render(<Carteirinha idoso={idosoComCpfSemFormatacao} />);
    
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
  });

  test('deve formatar datas corretamente', () => {
    render(<Carteirinha idoso={mockIdoso} />);

    // Verificar formato brasileiro das datas
    expect(screen.getByText('15/05/1950')).toBeInTheDocument(); // Data de nascimento
    expect(screen.getByText('15/01/2025')).toBeInTheDocument(); // Data de emissão
    expect(screen.getByText('15/01/2030')).toBeInTheDocument(); // Data de validade
  });

  test('deve ter classes CSS corretas para impressão', () => {
    const { container } = render(<Carteirinha idoso={mockIdoso} />);

    const carteirinhaContainer = container.querySelector('.carteirinha-container');
    const carteirinhaCard = container.querySelector('.carteirinha-card');
    const carteirinhaHeader = container.querySelector('.carteirinha-header');
    const carteirinhaContent = container.querySelector('.carteirinha-content');
    const carteirinhaFooter = container.querySelector('.carteirinha-footer');

    expect(carteirinhaContainer).toBeInTheDocument();
    expect(carteirinhaCard).toBeInTheDocument();
    expect(carteirinhaHeader).toBeInTheDocument();
    expect(carteirinhaContent).toBeInTheDocument();
    expect(carteirinhaFooter).toBeInTheDocument();
  });

  test('deve ter dimensões corretas para impressão', () => {
    const { container } = render(<Carteirinha idoso={mockIdoso} />);

    const carteirinhaCard = container.querySelector('.carteirinha-card');
    expect(carteirinhaCard).toHaveStyle({
      width: '340px',
      height: '216px'
    });
  });

  test('deve renderizar com cores corretas', () => {
    const { container } = render(<Carteirinha idoso={mockIdoso} />);

    const header = container.querySelector('.carteirinha-header');
    const footer = container.querySelector('.carteirinha-footer');

    expect(header).toHaveClass('bg-green-600');
    expect(footer).toHaveClass('bg-orange-500');
  });

  test('deve renderizar labels dos campos', () => {
    render(<Carteirinha idoso={mockIdoso} />);

    expect(screen.getByText('Nome:')).toBeInTheDocument();
    expect(screen.getByText('CPF:')).toBeInTheDocument();
    expect(screen.getByText('Nº:')).toBeInTheDocument();
    expect(screen.getByText('Nascimento:')).toBeInTheDocument();
    expect(screen.getByText('Emissão:')).toBeInTheDocument();
    expect(screen.getByText('Validade:')).toBeInTheDocument();
  });

  test('deve ser um componente forwardRef', () => {
    const ref = { current: null };
    render(<Carteirinha ref={ref} idoso={mockIdoso} />);
    
    expect(ref.current).not.toBeNull();
  });

  test('deve renderizar com dados mínimos', () => {
    const idosoMinimo = {
      nome: 'João Silva',
      cpf: '000.000.000-00',
      dataNascimento: '1960-01-01',
      numeroCarteira: '0002-2025',
      dataEmissao: '2025-01-01',
      dataValidade: '2030-01-01',
      qrConteudo: '{"test": true}',
      fotoUrl: null
    };

    render(<Carteirinha idoso={idosoMinimo} />);

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('000.000.000-00')).toBeInTheDocument();
    expect(screen.getByText('0002-2025')).toBeInTheDocument();
    expect(screen.getByText('Sem foto')).toBeInTheDocument();
  });
});

