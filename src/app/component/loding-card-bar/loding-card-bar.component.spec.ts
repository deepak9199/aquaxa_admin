import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodingCardBarComponent } from './loding-card-bar.component';

describe('LodingCardBarComponent', () => {
  let component: LodingCardBarComponent;
  let fixture: ComponentFixture<LodingCardBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LodingCardBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LodingCardBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
