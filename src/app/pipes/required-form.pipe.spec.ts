import { RequiredFormPipe } from './required-form.pipe';

describe('GetFormRequiredPipe', () => {
  it('create an instance', () => {
    const pipe = new RequiredFormPipe();
    expect(pipe).toBeTruthy();
  });
});
