import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Todo } from "../models/todo.model";

@Injectable({ providedIn: 'root' })
export class TodoService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl);
  }

  getTodosByList(listId: number): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.baseUrl}?userId=${listId}`);
  }

  addLocalTodoList(title: string) {
    const existing = JSON.parse(localStorage.getItem('localTodos') || '[]');
    const newList = Array.from({ length: 3 }, (_, i) => ({
      userId: existing.length + 11,
      id: Date.now() + i,
      title: `${title} Task ${i + 1}`,
      completed: false,
      isLocal: true,
      description: `Task description ${i + 1}`
    }));
    localStorage.setItem('localTodos', JSON.stringify([...existing, ...newList]));
  }

  getLocalTodos(): Todo[] {
    return JSON.parse(localStorage.getItem('localTodos') || '[]');
  }
}
