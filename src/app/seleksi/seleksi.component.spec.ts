import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleksiComponent } from './seleksi.component';

describe('SeleksiComponent', () => {
  let component: SeleksiComponent;
  let fixture: ComponentFixture<SeleksiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleksiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
