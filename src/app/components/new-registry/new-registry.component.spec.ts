import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegistryComponent } from './new-registry.component';

describe('NewRegistryComponent', () => {
  let component: NewRegistryComponent;
  let fixture: ComponentFixture<NewRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRegistryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
