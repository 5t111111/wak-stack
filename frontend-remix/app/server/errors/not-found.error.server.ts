export class NotFoundError extends Error {
  static {
    this.prototype.name = "NotFoundError";
  }
}
