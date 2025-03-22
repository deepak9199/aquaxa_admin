import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodingBarsComponent } from './loding-bars.component';

describe('LodingBarsComponent', () => {
  let component: LodingBarsComponent;
  let fixture: ComponentFixture<LodingBarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LodingBarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LodingBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
