export type FN<P extends Array<any> = [], R = void> = (...args: P) => R;

export interface O<T = any> {
	[key: string]: T;
}

export type PickKeys<S extends {}, T extends {} = {}> = keyof (S & T);

export type ValueOf<T, K extends keyof T> = T[K];

export type Merge<S extends {}, T extends {} = {}> = S & T;

export type CustomObject<V> = { [key: string]: V };

export type PartialPart<T, P extends keyof T> = Merge<Omit<T, P>, Partial<Pick<T, P>>>;
