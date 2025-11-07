import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Libs } from './libs';

describe('Libs', () => {
  let component: Libs;
  let fixture: ComponentFixture<Libs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Libs],
    }).compileComponents();

    fixture = TestBed.createComponent(Libs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
