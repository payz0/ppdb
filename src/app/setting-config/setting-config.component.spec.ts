import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { DataService  } from '../service/data.service';
import { FormsModule } from '@angular/forms';

import { SettingConfigComponent } from './setting-config.component';

describe('SettingConfigComponent', () => {
  let component: SettingConfigComponent;
  let fixture: ComponentFixture<SettingConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[FormsModule, HttpClientModule],
      providers: [DataService],
      declarations: [ SettingConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
