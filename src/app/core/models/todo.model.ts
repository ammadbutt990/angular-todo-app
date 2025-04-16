export interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
    description?: string;
    isLocal?: boolean;
}