"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FastRunner {
    constructor(jobs) {
        this.jobs = jobs;
    }
    execute(worker) {
        var size = this.jobs.length;
        if (size == 0) {
            return Promise.resolve();
        }
        else if (size == 1) {
            return worker(this.jobs[0]);
        }
        else {
            const head = this.jobs.shift();
            let deferred = worker(head);
            this.jobs.forEach(function (service) {
                deferred = deferred.then(function () {
                    return worker(service);
                });
            });
            return deferred;
        }
    }
}
exports.FastRunner = FastRunner;
;
