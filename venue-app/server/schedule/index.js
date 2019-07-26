//@flow
/**
 * Scheduling module. This module allows for scheduling of tasks on the site
 * in a persistent way (i.e. surviving server restarts).
 *
 * Other modules can use the scheduler in the following manner...
 *
 * var scheduler = require("../../path/to/schedule");
 *
 * function handleSiteEvent(data){
 * 		...
 *   	scheduler.now("handle task", data);
 *   	OR
 *   	scheduler.schedule("tomorrow at 1pm", "handle task", data);
 * 		...
 * }
 */

var Agenda = require("agenda");
var agenda = exports.agenda = null;

// EXAMPLE JOB
// var showMessageJob = require('./jobs/showMessage');
var sectionEventJob = require('./jobs/sectionEvent');

function setupJobs(){
    // EXAMPLE JOB SETUP
    // showMessageJob.setup(agenda);
    sectionEventJob.setup(agenda);
}

function configurePeriodicJobs(){
  // EXAMPLE JOB SCHEDULING
  // agenda.every('5 seconds', 'show message');
}

/**
 * The main purpose of this method is to remove nested mongoose objects.
 * TODO improve the performance of this method
 * @param  {object} ob Javascript object with nested mongodb objects
 * @return {object}    Javascript object containing only strings, numbers,
 *                                arrays and nested objects
 */
function removeNestedObjects(ob: Object): Object{
  return JSON.parse(JSON.stringify(ob));
}

/**
 * Starts agenda listener and initializes job handlers.
 * @param  {app config} config
 */
exports.start = (config: {mongo: {uri: String}}) => {
  agenda = exports.agenda = new Agenda({
    db: {
      address: config.mongo.uri,
      collection: 'agendaJobs'
    }
  });

  agenda.on('ready', function(){
    setupJobs();
    configurePeriodicJobs();
  });

  agenda.start();
};

/**
 * Schedule a job to be performed ASAP
 * @param  {string}   task   job name
 * @param  {any}   params parameters to job
 * @param  {Function} cb     called after job added to queue
 * @return {Job} Agenda job object
 */
exports.now = (task: String, params: Object) => {
  return new Promise(resolve => {
    agenda.now(task, params, () => {
      resolve();
    });
  });
};

/**
 * Schedule a job to be performed at a designated time
 * @param  {Date or stirng}   when   "tomorrow at noon" or Date()
 * @param  {string}   task   job name
 * @param  {any}   params parameters to job
 * @param  {Function} cb     called after job added to queue
 * @return {Job} Agenda job object
 */
exports.schedule = (when: Date, task: String, params: Object) => {
  params = removeNestedObjects(params);
  return new Promise((resolve, reject) => {
    agenda.schedule(when, task, params, () => resolve());
  });
};

/**
 * Cancels a scheduled a job matching the query
 * @param  {Object} query i.e. "eventInfoId: 'a1200412933532'"
 */
exports.cancel = (query: Object) => {
  query = removeNestedObjects(query);
   return new Promise((resolve, reject) => {
     agenda.cancel(query, (err, numRemoved)=> err ?
      reject(err) : resolve(numRemoved)
     );
  });
}

/**
 * Searches using a  full mongodb-native find query.
 * @param  {Object} query i.e. "eventInfoId: 'a1200412933532'"
 */
exports.jobs = (query: Object) => {
  query = removeNestedObjects(query);
  return new Promise((resolve, reject) =>
    agenda.jobs(query, (err, jobs) => err ? reject(err) : resolve(jobs))
  );
};
