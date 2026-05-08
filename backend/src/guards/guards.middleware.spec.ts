import { GuardsMiddleware } from './guards.middleware';

describe('GuardsMiddleware', () => {
  it('should be defined', () => {
    expect(new GuardsMiddleware()).toBeDefined();
  });
});
