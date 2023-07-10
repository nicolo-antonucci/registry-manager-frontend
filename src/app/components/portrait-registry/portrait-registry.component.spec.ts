import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortraitRegistryComponent } from './portrait-registry.component';

describe('PortraitRegistryComponent', () => {
  let component: PortraitRegistryComponent;
  let fixture: ComponentFixture<PortraitRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortraitRegistryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortraitRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
