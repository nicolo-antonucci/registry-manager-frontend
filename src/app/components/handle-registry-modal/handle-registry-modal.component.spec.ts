import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleRegistryModalComponent } from './handle-registry-modal.component';

describe('HandleRegistryModalComponent', () => {
  let component: HandleRegistryModalComponent;
  let fixture: ComponentFixture<HandleRegistryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandleRegistryModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleRegistryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
