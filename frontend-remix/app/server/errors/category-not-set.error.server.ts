export class CategoryNotSetError extends Error {
  static {
    this.prototype.name = "CategoryNotSetError";
  }
}
