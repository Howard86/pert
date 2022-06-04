declare type TypedObject<T = unknown> = Record<string, T>;

declare type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
