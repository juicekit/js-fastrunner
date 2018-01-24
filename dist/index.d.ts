export declare class FastRunner {
    private jobs;
    constructor(jobs: any[]);
    execute<T>(worker: (job: any) => Promise<T | any>): Promise<T | any>;
}
