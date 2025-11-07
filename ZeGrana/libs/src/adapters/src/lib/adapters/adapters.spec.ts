import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Adapters } from './adapters';

describe('Adapters', () => {
  let component: Adapters;
  let fixture: ComponentFixture<Adapters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adapters],
    }).compileComponents();

    fixture = TestBed.createComponent(Adapters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
