import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { DataService  } from '../service/data.service';
import { FormsModule } from '@angular/forms';

import { SettingProfilComponent } from './setting-profil.component';

describe('SettingProfilComponent', () => {
  let component: SettingProfilComponent;
  let fixture: ComponentFixture<SettingProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[FormsModule, HttpClientModule ],
      providers: [DataService],
      declarations: [ SettingProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
