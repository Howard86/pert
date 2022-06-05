import { importFromLocalStorage, saveToLocalStorage } from './services';

describe('services', () => {
  it('should call local storage setItem', () => {
    expect.hasAssertions();
    jest.spyOn(Storage.prototype, 'setItem');
    saveToLocalStorage({
      unit: 'unit',
      tasks: [
        {
          name: 'TEST',
          optimisticEstimate: 0,
          likelyEstimate: 0,
          pessimisticEstimate: 0,
        },
      ],
    });

    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should call local storage getItem', () => {
    expect.hasAssertions();
    jest.spyOn(Storage.prototype, 'getItem');
    importFromLocalStorage({
      unit: 'unit',
      tasks: [
        {
          name: 'TEST',
          optimisticEstimate: 0,
          likelyEstimate: 0,
          pessimisticEstimate: 0,
        },
      ],
    });

    expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
  });
});
