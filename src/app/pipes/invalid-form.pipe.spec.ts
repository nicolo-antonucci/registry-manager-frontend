import { InvalidFormPipe } from './invalid-form.pipe';

describe('GetFormValidPipe', () => {
  it('create an instance', () => {
    const pipe = new InvalidFormPipe();
    expect(pipe).toBeTruthy();
  });
});
