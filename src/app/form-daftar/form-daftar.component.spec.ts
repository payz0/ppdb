import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { DataService  } from '../service/data.service';
import { FormsModule } from '@angular/forms';

import { FormDaftarComponent } from './form-daftar.component';

describe('FormDaftarComponent', () => {
  let component: FormDaftarComponent;
  let fixture: ComponentFixture<FormDaftarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[FormsModule, HttpClientModule],
      providers: [DataService],
      declarations: [ FormDaftarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDaftarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
