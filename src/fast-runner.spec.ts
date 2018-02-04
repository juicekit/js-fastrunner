import {expect} from 'chai';
import {spy} from 'sinon';
import {FastRunner} from './fast-runner';

describe('FastRunner', () => {
    it('should resolve if no jobs are on the list', (done) => {
        const runner = new FastRunner([]);
        const worker = spy();

        runner.execute(worker).subscribe(() => {
            done(new Error('runner reported progress'))
        }, () => {
            done(new Error('runner encountered an error'));
        }, () => {
            expect(worker.called).to.equal(false);

            done();
        })
    });

    describe('synchronous', () => {
        it('should resolve if all jobs are executed successfully (1)', (done) => {
            const runner = new FastRunner([
                () => {
                    return true;
                }
            ]);

            const worker = spy((response: any) => {
                return response;
            });

            runner.execute(worker).subscribe(() => {}, () => {
                done(new Error('has error'));
            }, () => {
                expect(worker.calledOnce).to.equal(true);

                done();
            });
        });

        it('should resolve if all jobs are executed successfully (6)', (done) => {
            const runner = new FastRunner([
                () => {
                    return true;
                },
                () => {
                    return true;
                },
                () => {
                    return true;
                },
                () => {
                    return true;
                },
                () => {
                    return true;
                },
                () => {
                    return true;
                }
            ]);

            const progressCallback = spy((response: any) => {
                return response;
            });

            runner.execute(work => work()).subscribe(progressCallback, (error) => {
                done(new Error('did not complete all jobs successfully'));
            }, () => {
                expect(progressCallback.callCount).to.equal(runner.Jobs.length);

                done();
            });
        });

        it('should resolve if all jobs (objects) are executed successfully (6)', (done) => {
            const runner = new FastRunner([
                {
                    test() {
                        return true;
                    }
                },
                {
                    test() {
                        return true;
                    }
                },
                {
                    test() {
                        return true;
                    }
                },
                {
                    test() {
                        return true;
                    }
                },
                {
                    test() {
                        return true;
                    }
                },
                {
                    test() {
                        return true;
                    }
                }
            ]);

            const progressCallback = spy();

            runner.execute(work => work.test()).subscribe(progressCallback, () => {
                done(new Error('did not complete all jobs successfully'));
            }, () => {
                expect(progressCallback.callCount).to.equal(runner.Jobs.length);

                done();
            });
        });

        it('should not resolve if at least 1 job fails (out of 6)', (done) => {
            const runner = new FastRunner([
                () => {
                    return true;
                },
                () => {
                    return true;
                },
                () => {
                    return false;
                },
                () => {
                    return true;
                },
                () => {
                    return true;
                },
                () => {
                    return true;
                }
            ]);

            const worker = spy((response: any, index: number) => {
                return response;
            });

            runner.execute(work => work()).subscribe(() => {}, (job) => {
                expect(job).to.equal(runner.Jobs[2]);
                done();
            });
        });

        it('should not resolve if at least 1 job throws an exception (out of 6)', (done) => {
            const runner = new FastRunner([
                () => {
                    return true;
                },
                () => {
                    return true;
                },
                () => {
                    throw new Error('random exception');
                },
                () => {
                    return true;
                },
                () => {
                    return true;
                },
                () => {
                    return true;
                }
            ]);

            const worker = spy((response: any, index: number) => {
                return response;
            });

            runner.execute(work => work()).subscribe(() => {}, (job) => {
                expect(job).to.equal(runner.Jobs[2]);
                done();
            });
        });

        it('should not resolve if at least 1 job (object) fails (out of 6)', (done) => {
            const runner = new FastRunner([
                {
                    test() {
                        return true;
                    }
                },
                {
                    test() {
                        return true;
                    }
                },
                {
                    test() {
                        return false;
                    }
                },
                {
                    test() {
                        return true;
                    }
                },
                {
                    test() {
                        return true;
                    }
                },
                {
                    test() {
                        return true;
                    }
                }
            ]);

            const worker = spy((job: any, i: number) => {
                return job.test();
            });

            runner.execute(worker => worker.test()).subscribe(() => {}, (job) => {
                expect(job).to.equal(runner.Jobs[2]);
                done();
            }, () => {
                done(new Error('ran all jobs'));
            });
        });
    });

    describe('asynchronous', () => {
        it('should resolve if all jobs are executed successfully (1)', (done) => {
            const runner = new FastRunner([
                () => {
                    return Promise.resolve(true);
                }
            ]);

            const progressCallback = spy();

            runner.execute(work => work()).subscribe(progressCallback, () => {
                done(new Error('did not complete all jobs successfully'));
            }, () => {
                expect(progressCallback.calledOnce).to.equal(true);

                done();
            });
        });

        it('should resolve if all jobs are executed successfully (6)', (done) => {
            const runner = new FastRunner([
                () => {
                    return Promise.resolve(1);
                },
                () => {
                    return Promise.resolve(2);
                },
                () => {
                    return Promise.resolve(3);
                },
                () => {
                    return Promise.resolve(4);
                },
                () => {
                    return Promise.resolve(5);
                },
                () => {
                    return Promise.resolve(6);
                }
            ]);

            const progressCallback = spy();

            runner.execute(work => work()).subscribe(progressCallback, () => {
                done(new Error('did not complete all jobs successfully'));
            }, () => {
                expect(progressCallback.callCount).to.equal(runner.Jobs.length);

                done();
            });
        });

        it('should not resolve if at least 1 job fails (out of 6)', (done) => {
            const runner = new FastRunner([
                () => {
                    return Promise.resolve(1);
                },
                () => {
                    return Promise.resolve(2);
                },
                () => {
                    return Promise.resolve(3);
                },
                () => {
                    return Promise.reject(new Error('error'));
                },
                () => {
                    return Promise.resolve(5);
                },
                () => {
                    return Promise.resolve(6);
                }
            ]);

            runner.execute(work => work()).subscribe(() => {}, (job) => {
                expect(job).to.equal(runner.Jobs[3]);

                done();
            });
        });

        it('should not resolve if at least 1 job throws an exception (out of 6)', (done) => {
            const runner = new FastRunner([
                () => {
                    return Promise.resolve(1);
                },
                () => {
                    return Promise.resolve(2);
                },
                () => {
                    return Promise.resolve(3);
                },
                () => {
                    throw new Error('random exception');
                },
                () => {
                    return Promise.resolve(5);
                },
                () => {
                    return Promise.resolve(6);
                }
            ]);

            runner.execute(work => work()).subscribe(() => {}, (job) => {
                expect(job).to.equal(runner.Jobs[3]);

                done();
            });
        });

        it('should not resolve if at least 1 job has an unhandled promise rejectiomns (out of 6)', (done) => {
            const runner = new FastRunner([
                () => {
                    return Promise.resolve(1);
                },
                () => {
                    return Promise.resolve(2);
                },
                () => {
                    return Promise.resolve(3);
                },
                () => {
                    Promise.reject(new Error('unhandled promise rejection'));
                },
                () => {
                    return Promise.resolve(5);
                },
                () => {
                    return Promise.resolve(6);
                }
            ]);

            runner.execute(work => work()).subscribe(() => {}, (job) => {
                expect(job).to.equal(runner.Jobs[3]);

                done();
            });
        });
    });
});