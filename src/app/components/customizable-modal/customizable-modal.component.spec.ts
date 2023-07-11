import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizableModalComponent } from './customizable-modal.component';

describe('CustomizableModalComponent', () => {
  let component: CustomizableModalComponent;
  let fixture: ComponentFixture<CustomizableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizableModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
