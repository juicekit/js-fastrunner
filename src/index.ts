
export class FastRunner {
    constructor(private jobs: any[]) {
    }

    get Jobs() {
        return this.jobs;
    }

    execute<T>(worker: (job: any, index: number) => Promise<T|any>): Promise<T|any> {
        var size = this.jobs.length;

        if (size == 0) {
            return Promise.resolve();
        }

        let work = this.run(this.jobs[0]).then((response) => {
            return worker(response, 0);
        })

        if (size > 1) {
            const runner = this.run;

            this.jobs.slice(1).forEach(function (job: any, i) {
                work = work.then(function () {
                    return runner(job);
                }).then((response) => {
                    // head is remove so advance index +1 
                    return worker(response, i + 1);
                });
            });
        }

        return work;
    }

    private run(job: Function) {
        const response = job.call(this);

        if (response instanceof Promise) {
            return response;
        } else if (!!response) {
            return Promise.resolve(response);
        }

        return Promise.reject(response);
    }
}