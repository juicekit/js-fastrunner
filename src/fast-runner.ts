
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/combineAll';
import 'rxjs/add/observable/throw';

export class FastRunner {
    constructor(private jobs: any[]) {
    }

    get Jobs() {
        return this.jobs;
    }

    execute<T>(worker: (job: any, index: number) => any): Observable<T> {
        if (this.Jobs.length === 0) {
            return Observable.of();
        }

        return Observable.forkJoin(this.Jobs.map((job, index) => {

            let result;

            try {
                result = worker(job, index);
            } catch (e) {
                return Observable.throw(job);
            }


            if (result instanceof Promise) {
                return result.catch(() => Promise.reject(job));
            } else if (result instanceof Observable) {
                return result;
            } else if (result) {
                return Observable.of(result);
            }

            return Observable.throw(job);
        })).combineAll();
    }
}