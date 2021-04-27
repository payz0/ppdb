import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingListUlangComponent } from './setting-list-ulang.component';

describe('SettingListUlangComponent', () => {
  let component: SettingListUlangComponent;
  let fixture: ComponentFixture<SettingListUlangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingListUlangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingListUlangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
