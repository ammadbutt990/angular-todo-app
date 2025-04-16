import { BehaviorSubject } from "rxjs";
import { Todo } from "../models/todo.model";
import { TodoService } from "../services/todo.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  constructor(private todoService: TodoService) {}

  loadTodos() {
    this.todoService.getTodos().subscribe(todos => {
      const all = [...todos, ...this.todoService.getLocalTodos()];
      this.todosSubject.next(all);
    });
  }

  loadListTodos(listId: number) {
    this.todoService.getTodosByList(listId).subscribe(apiTodos => {
      const localTodos = this.todoService.getLocalTodos().filter(t => t.userId === listId);
      this.todosSubject.next([...apiTodos, ...localTodos]);
    });
  }
}
