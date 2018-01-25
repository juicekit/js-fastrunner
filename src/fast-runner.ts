
import { Observable } from 'rxjs/Observable';
import { Subject} from 'rxjs/Subject';;

export class FastRunner {
    constructor(private jobs: any[]) {
    }

    get Jobs() {
        return this.jobs;
    }

    execute<T>(worker: (job: any, index: number) => any): Observable<T> {
        const verification = new Subject<T>(),
            progress = new Subject<T>(),
            totalJobs = this.Jobs.length;

        let jobsInProgress = 0;

        progress.subscribe((job: T) => {
            verification.next(job);
    
            if (++jobsInProgress >= totalJobs) {
                verification.complete();
            }
        }, (error: T|Error) => {
            verification.error(error);
            verification.complete();
        });

        this.Jobs.forEach((job, index) => {
            try {
                const result = worker(job, index);

                if (result) {
                    if (result instanceof Promise) {
                        result.then(() => {
                            progress.next(job);
                        }).catch(() => {
                            progress.error(job);
                        });
                    } else {
                        // simulate asynchronous event
                        Promise.resolve().then(() => {
                            progress.next(job); 
                        });
                    }
                } else {
                    progress.error(job);
                }
            } catch(e) {
                progress.error(job);
            }
        });

        if (totalJobs === 0) {
            verification.complete();
        }

        return verification;
    }
}