import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DataService  } from '../service/data.service';
import { HttpClientModule } from '@angular/common/http';

import { MapGoogleComponent } from './map-google.component';

describe('MapGoogleComponent', () => {
  let component: MapGoogleComponent;
  let fixture: ComponentFixture<MapGoogleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule],
      declarations: [ MapGoogleComponent ],
      providers: [DataService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
