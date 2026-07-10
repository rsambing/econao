import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ContentCard from './ContentCard';

// Em vez de mockar o react-router-dom (o v7 usa "exports" subpaths que o
// resolvedor do Jest do react-scripts não segue bem com jest.requireActual),
// verificamos a navegação real através de um componente sonda que mostra o
// caminho atual — testamos o comportamento, não a implementação.
function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

const item = {
  id: 42,
  type: 'VIDEO',
  title: 'Reformas económicas dos anos 90',
  theme: 'Reformas Económicas',
  region: 'Nacional',
  imageUrl: 'https://exemplo.ao/capa.jpg'
};

function renderCard(props = {}) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <ContentCard item={{ ...item, ...props }} />
      <LocationProbe />
    </MemoryRouter>
  );
}

describe('ContentCard', () => {
  it('mostra o título, o tema e a região do conteúdo', () => {
    renderCard();
    expect(screen.getByText(item.title)).toBeInTheDocument();
    expect(screen.getByText(item.theme)).toBeInTheDocument();
    expect(screen.getByText(item.region)).toBeInTheDocument();
  });

  it('não mostra o selo Jindungo quando o conteúdo não é exclusivo', () => {
    renderCard({ isExclusive: false });
    expect(screen.queryByText('Jindungo')).not.toBeInTheDocument();
  });

  it('mostra o selo Jindungo quando o conteúdo é exclusivo', () => {
    renderCard({ isExclusive: true });
    expect(screen.getByText('Jindungo')).toBeInTheDocument();
  });

  it('navega para o detalhe do conteúdo ao clicar em "Explorar conteúdo"', async () => {
    renderCard();
    await userEvent.click(screen.getByText('Explorar conteúdo'));
    expect(screen.getByTestId('location')).toHaveTextContent(`/content/${item.id}`);
  });
});
