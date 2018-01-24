import { expect } from 'chai';
import { spy } from 'sinon';
import { FastRunner } from './index';

describe('FastRunner', () => {
    it('should resolve if no jobs are on the list', (done) => {
        const runner = new FastRunner([]);
        const worker = spy();

        runner.execute(worker).then(() => {
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

            runner.execute(worker).then(() => {
                expect(worker.calledOnce).to.equal(true);

                done();
            }).catch(done);
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

            const worker = spy((response: any) => {
                return response;
            });

            runner.execute(worker).then(() => {
                expect(worker.callCount).to.equal(runner.Jobs.length);

                done();
            }).catch(() => {
                done(new Error('did not complete all jobs successfully'));
            });
        });

        it('should not resolve if at least jobs fails (out of 6)', (done) => {
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

            runner.execute(worker).then(() => {
                done(new Error('ran all jobs'));
            }).catch(() => {
                expect(worker.callCount).to.equal(2);

                done();
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

            const worker = spy((response: any, index: number) => {
                return response;
            });

            runner.execute(worker).then(() => {
                expect(worker.calledOnce).to.equal(true);

                done();
            }).catch(() => {
                done(new Error('did not complete all jobs successfully'));
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

            const worker = spy((response: any, index: number) => {
                return response;
            });

            runner.execute(worker).then(() => {
                expect(worker.callCount).to.equal(runner.Jobs.length);

                done();
            }).catch(() => {
                done(new Error('did not complete all jobs successfully'));
            });
        });

        it('should not resolve if at least jobs fails (out of 6)', (done) => {
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
                    return Promise.reject(4);
                },
                () => {
                    return Promise.resolve(5);
                },
                () => {
                    return Promise.resolve(6);
                }
            ]);

            const worker = spy((response: any, index: number) => {
                return response;
            });

            runner.execute(worker).then(() => {
                done(new Error('ran all jobs'));
            }).catch(() => {
                expect(worker.callCount).to.equal(3);

                done();
            });
        });
    });
});