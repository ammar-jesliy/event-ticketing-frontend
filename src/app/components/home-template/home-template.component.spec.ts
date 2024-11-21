import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTemplateComponent } from './home-template.component';

describe('HomeTemplateComponent', () => {
  let component: HomeTemplateComponent;
  let fixture: ComponentFixture<HomeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
