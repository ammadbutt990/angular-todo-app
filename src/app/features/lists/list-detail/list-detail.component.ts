import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo } from '../../../core/models/todo.model';
import { TodoFacade } from '../../../core/facades/todo.facade';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../../core/services/todo.service';

@Component({
  selector: 'app-list-detail',
  standalone: false,
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  newTaskForm!: FormGroup;

  displayedColumns: string[] = ['id', 'title', 'description', 'status'];
  dataSource = new MatTableDataSource<Todo>();
  listId!: number;


  constructor(private fb: FormBuilder, private todoService: TodoService, private route: ActivatedRoute, private facade: TodoFacade) { }

  ngOnInit(): void {
    this.listId = +this.route.snapshot.paramMap.get('id')!;

    this.newTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });

    this.facade.loadListTodos(this.listId);
    this.facade.todos$.subscribe(tasks => {
      this.dataSource.data = tasks.sort((a, b) => b.id - a.id);
      this.dataSource.paginator = this.paginator;
    });
  }

  onAddTask() {
    if (this.newTaskForm.invalid) return;
    const { title, description } = this.newTaskForm.value;
    const task: Todo = {
      id: this.dataSource.data.length + 1,
      userId: this.listId,
      title,
      description,
      completed: false,
      isLocal: true 
    };
    const local = this.todoService.getLocalTodos();
    local.push(task);
    localStorage.setItem('localTodos', JSON.stringify(local));
    this.newTaskForm.reset();
    this.facade.loadListTodos(this.listId);
  }

  onToggleTaskCompletion(task: Todo) {
    if (!task.isLocal) return;

    const todos = this.todoService.getLocalTodos();
    const index = todos.findIndex(t => t.id === task.id);
    if (index !== -1) {
      todos[index].completed = !todos[index].completed;
      localStorage.setItem('localTodos', JSON.stringify(todos));
      this.facade.loadListTodos(this.listId);
    }
  }

}
