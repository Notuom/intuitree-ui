import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionTreeComponent } from './execution-tree.component';

describe('ExecutionTreeComponent', () => {
  let component: ExecutionTreeComponent;
  let fixture: ComponentFixture<ExecutionTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
