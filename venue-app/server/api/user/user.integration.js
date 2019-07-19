'use strict';

import app from '../..';
import User from './user.model';
import request from 'supertest';
import SectionEvent from '../sectionevent/sectionevent.model';

var moment = require('moment');
var scheduler = require('../../schedule');
var auth = require("../../auth/local/test.integration");
var superwith = require("../superwith.integration");
var mongoose = require('mongoose');

import {exampleStudent, exampleSectionEvent} from '../../config/seed';

describe('User API:', function() {
  var user;

    describe('GET /api/users', function() {
        var users;

        before((done)=>{
            auth.admin.request(app)
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                users = res.body;
                done();
            });
        });

        it("should get a list of all users", (done) => {
            expect(users).to.be.a('array');
            done();
        });
    });


    describe('GET /api/users/me with options', function() {
        superwith.test(auth.student.request(app), '/api/users/me', [
            {
                param: 'withSections=true',
                should: 'populate user sections',
                test: (student) => {
                    expect(student.sections).to.be.a('array');
                    expect(student.sections[0]).to.have.property('_id');
                }
            },
            {
                param: 'withEvents=true',
                should: 'populate user events',
                test: (student) => {
                    // TODO it should return an array
                    student.events = Object.keys(student.events).map(k => student.events[k]);
                    expect(student.events).to.be.a('array');
                    expect(student.events[0]).to.have.property('_id');
                }
            },
            {
                param: 'withSectionEvents=true',
                should: 'populate user section events',
                test: (student) => {
                    expect(student.sectionEvents).to.be.a('array');
                    expect(student.sectionEvents[0]).to.have.property('_id');
                }
            },
            {
                param: 'withCourses=true',
                should: 'populate user courses',
                test: (student) => {
                    //TODO should return an array
                    student.courses = Object.keys(student.courses).map(k => student.courses[k]);
                    expect(student.courses).to.be.a('array');
                    expect(student.courses[0]).to.have.property('_id');
                }
            },
            {
                param: 'withSectionEvents=true&withSubmissionFlag=true',
                should: 'populate user section events with submission flag',
                test: (student) => {
                    expect(student.sectionEvents).to.be.a('array');
                    expect(student.sectionEvents[0]).to.have.property('submitted');
                }
            },
        ]);
    });

    describe('PUT /api/users/updateInstructorStatus', function() {
        var users;
        var studentId;

        before(() => {
          return User.createAsync({
              provider: 'cas',
              firstName: "teststudent",
              lastName: '',
              role: 'user',
              email: "testStudent@university.edu",
              password: "asdasdasdasd",
              isVerified: true,
              isInstructor: false
          }).then((user) => {
            studentId = user._id;
          })
        })

        it("should change student to instructor", (done) => {
          auth.admin.request(app)
          .put('/api/users/updateInstructorStatus')
          .send({
            userId: studentId,
            status: true
          })
          .expect(204)
          .expect('Content-Type', /json/)
          .end((err, res) => {
              User.findByIdAsync(studentId)
                .then(user => {
                  expect(user.isInstructor).to.be.true;
                  done();
                })
          });

        });

        it("should change instructor to student", (done) => {
          auth.admin.request(app)
          .put('/api/users/updateInstructorStatus')
          .send({
            userId: studentId,
            status: false
          })
          .expect(204)
          .expect('Content-Type', /json/)
          .end((err, res) => {
              User.findByIdAsync(studentId)
                .then(user => {
                  expect(user.isInstructor).to.be.false;
                  done();
                })
          });

        });

      });

    describe('PUT /api/users/updateAdminStatus', function() {

    var users;
    var instructorId;

    before(() => {
      return User.createAsync({
          provider: 'cas',
          firstName: "testinstructor",
          lastName: '',
          role: 'user',
          email: "testinstructor@university.edu",
          password: "asdasdasdasd",
          isVerified: true,
          isInstructor: true
      }).then((user) => {
        instructorId = user._id;
      })
    })

    it("should change instructor to admin", (done) => {
      auth.admin.request(app)
      .put('/api/users/updateAdminStatus')
      .send({
        userId: instructorId,
        status: true
      })
      .expect(204)
      .expect('Content-Type', /json/)
      .end((err, res) => {
          User.findByIdAsync(instructorId)
            .then(user => {
              expect(user.role).to.equal('admin');
              done();
            })
      });

    });

    it("should change admin to instructor", (done) => {
      auth.admin.request(app)
      .put('/api/users/updateAdminStatus')
      .send({
        userId: instructorId,
        status: false
      })
      .expect(204)
      .expect('Content-Type', /json/)
      .end((err, res) => {
          User.findByIdAsync(instructorId)
            .then(user => {
              expect(user.role).to.equal('user');
              done();
            })
      });

    });

  });

});

describe('User notification:', function() {

    var student;
    var fullEvent;

    before(() => {
      return SectionEvent.findByIdAsync(exampleSectionEvent._id)
        .then(se=>{
          return se.getFullEvent()
        }).then(evnt => {
          fullEvent = evnt;
        });
    });

    before(() =>{
      return User.findByIdAsync(exampleStudent._id).then(user => {
        student = user;
      });
    });

    describe("Populate a student's notifications", () => {

      before(() => student.clearNotifications());

      before(() => student.updateNotifications(fullEvent));

      it("should have user notifications", () => {
        return student.getNotifications().then((jobs) => {
          expect(jobs.length).to.be.at.least(1);
        });
      });
    });

    describe("update student notifications after time change", () => {

      before(() => {
        // Change time by an hour
        fullEvent.info.times = [{
          start: moment().add(1, 'hour').toDate(),
          end: moment().add(1, 'hour').add(30,'minutes').toDate()
        }];
      });

      before(() => student.updateNotifications(fullEvent));

      it("should update when event times change", () => {
        return student.getNotifications().then((jobs) => {
          expect(jobs.length).to.be.equal(1);
          expect(moment(jobs[0].attrs.nextRunAt).fromNow().toString()).to.equal("in 30 minutes");
        });
      });

    });
});
