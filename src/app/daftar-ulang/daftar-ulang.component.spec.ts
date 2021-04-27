import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarUlangComponent } from './daftar-ulang.component';

describe('DaftarUlangComponent', () => {
  let component: DaftarUlangComponent;
  let fixture: ComponentFixture<DaftarUlangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarUlangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarUlangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
