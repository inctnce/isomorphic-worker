type Worker = <C, A, R>(func: Function, context?: C, ...args: A[]) => Promise<R> | R;

export default Worker;
