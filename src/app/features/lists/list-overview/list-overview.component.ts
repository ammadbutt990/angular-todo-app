import { Component, OnInit, ViewChild } from '@angular/core';
import { Todo } from '../../../core/models/todo.model';
import { TodoFacade } from '../../../core/facades/todo.facade';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../../core/services/todo.service';

@Component({
  selector: 'app-list-overview',
  standalone: false,
  templateUrl: './list-overview.component.html',
  styleUrl: './list-overview.component.scss'
})
export class ListOverviewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  newListForm!: FormGroup;
  displayedColumns: string[] = ['listId', 'title', 'totalTasks', 'completedTasks'];
  dataSource = new MatTableDataSource<{ listId: number; title: string; totalTasks: number; completedTasks: number }>();


  constructor(private fb: FormBuilder, private todoService: TodoService, private facade: TodoFacade) { }


  ngOnInit(): void {
    this.newListForm = this.fb.group({
      title: ['', Validators.required]
    });
    this.facade.loadTodos();
    this.facade.todos$.subscribe(todos => {
      const grouped = new Map<number, Todo[]>();
      for (let todo of todos) {
        if (!grouped.has(todo.userId)) grouped.set(todo.userId, []);
        grouped.get(todo.userId)!.push(todo);
      }
      const data = Array.from(grouped, ([listId, tasks]) => ({
        listId,
        title: tasks[0]?.title? tasks[0]?.title:`--`,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length
      })).sort((a, b) => b.listId - a.listId);
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  onAddList() {
    if (this.newListForm.invalid) return;
    const title = this.newListForm.value.title.trim();
    this.todoService.addLocalTodoList(title);
    this.newListForm.reset();
    this.facade.loadTodos();
  }

}

