import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('mostra as iniciais do nome quando não há foto de perfil', () => {
    render(<Avatar name="Maria Fernandes" />);
    expect(screen.getByText('MF')).toBeInTheDocument();
  });

  it('mostra "?" quando não há nome nem foto', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('usa apenas a primeira inicial quando o nome tem uma só palavra', () => {
    render(<Avatar name="Ana" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('mostra a imagem em vez das iniciais quando existe url', () => {
    render(<Avatar name="Carlos Silva" url="https://exemplo.ao/foto.jpg" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://exemplo.ao/foto.jpg');
    expect(screen.queryByText('CS')).not.toBeInTheDocument();
  });
});
