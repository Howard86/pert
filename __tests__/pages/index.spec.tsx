import { screen } from '@testing-library/react';
import { appRender } from 'test-utils';

import Home from '@/pages/index';

describe('home', () => {
  it('renders Home', () => {
    expect.hasAssertions();
    appRender(<Home />);

    expect(document.title).toBe('PERT Analysis');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'PERT Analysis',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
