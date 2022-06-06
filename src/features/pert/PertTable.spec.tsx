import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { themeRender } from 'test-utils';

import PertTable from './PerTable';

describe('pert table', () => {
  const typeTestData = async (
    user: ReturnType<typeof userEvent['setup']>,
    {
      index,
      name,
      optimisticEstimate,
      likelyEstimate,
      pessimisticEstimate,
    }: Pert.Task & { index: number },
  ) => {
    await user.type(screen.getByTestId(`task-${index}-name`), name);
    await user.type(
      screen.getByTestId(`task-${index}-optimistic`),
      optimisticEstimate.toString(),
    );
    await user.type(
      screen.getByTestId(`task-${index}-likely`),
      likelyEstimate.toString(),
    );
    await user.type(
      screen.getByTestId(`task-${index}-pessimistic`),
      pessimisticEstimate.toString(),
    );

    expect(screen.getByTestId(`task-${index}-name`)).toHaveValue(name);
    expect(screen.getByTestId(`task-${index}-optimistic`)).toHaveValue(
      optimisticEstimate,
    );
    expect(screen.getByTestId(`task-${index}-likely`)).toHaveValue(
      likelyEstimate,
    );
    expect(screen.getByTestId(`task-${index}-pessimistic`)).toHaveValue(
      pessimisticEstimate,
    );
  };

  it('should contains <table> tag', () => {
    expect.hasAssertions();
    themeRender(<PertTable />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should contain name, optimistic estimate, most likely estimate and pessimistic estimate for each task', () => {
    expect.hasAssertions();
    themeRender(<PertTable />);

    expect(screen.getByTestId('task-0-name')).toBeInTheDocument();
    expect(screen.getByTestId('task-0-optimistic')).toBeInTheDocument();
    expect(screen.getByTestId('task-0-likely')).toBeInTheDocument();
    expect(screen.getByTestId('task-0-pessimistic')).toBeInTheDocument();
  });

  it('should calculate average and variance for each task', async () => {
    expect.hasAssertions();
    const user = userEvent.setup();
    themeRender(<PertTable />);

    await typeTestData(user, {
      index: 0,
      name: 'TEST_NAME_1',
      optimisticEstimate: 10,
      likelyEstimate: 10,
      pessimisticEstimate: 40,
    });

    expect(screen.getByTestId('task-0-average')).toHaveTextContent('15.00');
    expect(screen.getByTestId('task-0-variance')).toHaveTextContent('5.00');
  });

  it('should have append & remove button to add or remove more rows', async () => {
    expect.hasAssertions();
    const user = userEvent.setup();
    themeRender(<PertTable />);

    expect(screen.getByTestId('remove-0')).toHaveAttribute('disabled');
    expect(screen.queryByTestId('task-1-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-1-optimistic')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-1-likely')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-1-pessimistic')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('append'));

    expect(screen.getByTestId('remove-0')).not.toHaveAttribute('disabled');
    expect(screen.getByTestId('task-1-name')).toBeInTheDocument();
    expect(screen.getByTestId('task-1-optimistic')).toBeInTheDocument();
    expect(screen.getByTestId('task-1-likely')).toBeInTheDocument();
    expect(screen.getByTestId('task-1-pessimistic')).toBeInTheDocument();

    await typeTestData(user, {
      index: 1,
      name: 'TEST_NAME_1',
      optimisticEstimate: 10,
      likelyEstimate: 10,
      pessimisticEstimate: 40,
    });

    expect(screen.queryByTestId('task-2-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-2-optimistic')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-2-likely')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-2-pessimistic')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('append'));

    expect(screen.getByTestId('task-2-name')).toBeInTheDocument();
    expect(screen.getByTestId('task-2-optimistic')).toBeInTheDocument();
    expect(screen.getByTestId('task-2-likely')).toBeInTheDocument();
    expect(screen.getByTestId('task-2-pessimistic')).toBeInTheDocument();

    await user.click(screen.getByTestId('remove-0'));

    expect(screen.queryByTestId('task-2-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-2-optimistic')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-2-likely')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-2-pessimistic')).not.toBeInTheDocument();

    expect(screen.getByTestId('task-0-name')).toHaveValue('TEST_NAME_1');
    expect(screen.getByTestId('task-0-optimistic')).toHaveValue(10);
    expect(screen.getByTestId('task-0-likely')).toHaveValue(10);
    expect(screen.getByTestId('task-0-pessimistic')).toHaveValue(40);
  });

  it('should calculate optimistic sum, most likely sum, pessimistic sum, overall average and variance for all tasks', async () => {
    expect.hasAssertions();
    const user = userEvent.setup();
    themeRender(<PertTable />);

    await typeTestData(user, {
      index: 0,
      name: 'TEST_NAME_0',
      optimisticEstimate: 10,
      likelyEstimate: 10,
      pessimisticEstimate: 40,
    });
    await user.click(screen.getByTestId('append'));
    await typeTestData(user, {
      index: 1,
      name: 'TEST_NAME_1',
      optimisticEstimate: 20,
      likelyEstimate: 20,
      pessimisticEstimate: 80,
    });
    expect(screen.getByTestId('optimistic-sum')).toHaveTextContent('30.00');
    expect(screen.getByTestId('likely-sum')).toHaveTextContent('30.00');
    expect(screen.getByTestId('pessimistic-sum')).toHaveTextContent('120.00');
    expect(screen.getByTestId('tasks-average')).toHaveTextContent('45.00');
    expect(screen.getByTestId('tasks-variance')).toHaveTextContent('11.18');
  });

  it('should contain a save button', () => {
    expect.hasAssertions();
    themeRender(<PertTable />);
    expect(
      screen.getByRole('button', { name: 'Save within Browser' }),
    ).toHaveAttribute('type', 'submit');
  });

  it('should contain a import button', () => {
    expect.hasAssertions();
    themeRender(<PertTable />);
    expect(
      screen.getByRole('button', { name: 'Import from Browser' }),
    ).toBeInTheDocument();
  });
});
