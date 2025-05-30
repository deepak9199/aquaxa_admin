import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiveInFunComponent } from './dive-in-fun.component';

describe('DiveInFunComponent', () => {
  let component: DiveInFunComponent;
  let fixture: ComponentFixture<DiveInFunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiveInFunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiveInFunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
