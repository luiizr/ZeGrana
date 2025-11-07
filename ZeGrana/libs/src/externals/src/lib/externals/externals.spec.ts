import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Externals } from './externals';

describe('Externals', () => {
  let component: Externals;
  let fixture: ComponentFixture<Externals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Externals],
    }).compileComponents();

    fixture = TestBed.createComponent(Externals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
