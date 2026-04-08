// OOP: Abstraction and Generics
// SOLID: Dependency Inversion (Services depend on interfaces, not implementations)
// Purpose: A base interface defining common database operations

export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

// NOTE: Specific Repositories will implement this interface 
// or define more specific methods tailored to their models.
