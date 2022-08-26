describe('Equality', () => {
  it('eq with Boolean', () => {
      let b1 = true;
      let b2 = null;

      expect(b1).toEqual(b2);
  });

  it('eq with Boolean', () => {
      let b1 = true;
      let b2 = null;

      expect(b1).toBeTrue();
  });
});