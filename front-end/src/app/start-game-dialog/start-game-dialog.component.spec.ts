import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartGameDialogComponent } from './start-game-dialog.component';

describe('StartGameDialogComponent', () => {
  let component: StartGameDialogComponent;
  let fixture: ComponentFixture<StartGameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartGameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
