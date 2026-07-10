import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import BackButton from './BackButton';

// Sonda que mostra o caminho atual — usada para confirmar a navegação real
// em vez de mockar o react-router-dom (ver nota em ContentCard.test.js).
function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderWithRouter(ui) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      {ui}
      <LocationProbe />
    </MemoryRouter>
  );
}

describe('BackButton', () => {
  it('mostra o rótulo "Voltar" por omissão', () => {
    renderWithRouter(<BackButton />);
    expect(screen.getByText('Voltar')).toBeInTheDocument();
  });

  it('aceita um rótulo personalizado', () => {
    renderWithRouter(<BackButton label="Cancelar" />);
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('com "to" definido, navega sempre para esse destino fixo', async () => {
    renderWithRouter(<BackButton to="/forum" />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('location')).toHaveTextContent('/forum');
  });

  it('sem "to" e sem histórico anterior, usa o "fallback"', async () => {
    // jsdom começa cada teste com window.history.length === 1 (sem histórico
    // anterior), por isso o BackButton deve recorrer ao fallback em vez de
    // tentar navigate(-1).
    renderWithRouter(<BackButton fallback="/quizzes" />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('location')).toHaveTextContent('/quizzes');
  });
});
