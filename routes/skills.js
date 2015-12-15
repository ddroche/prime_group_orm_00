/**
 * Created by Roche on 12/15/15.
 */
var express = require('express');
var router = express.Router();
var Skill = require('../models/skill');
var Skills = require('../models/collections/skills');

/* GET all the skills */
router.get('/', function(req, res, next) {
  Skills.forge()
    .fetch()
    .then(function(collection) {
      res.json({data: collection.toJSON()});
    })
    .catch(function(err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});

/* Post new skill */
router.post('/', function(req, res, next) {
  Skill.forge({
    skill_name: req.body.skillName
  })
    .save()
    .then(function(skill) {
      res.json({skillId: skill.get('skill_id')});
    })
    .catch(function(err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});

/* UPDATE SKILL */
router.put('/:skillId', function(req, res, next) {
  Skill.forge({
    skill_id: req.params.skillId
  })
    .fetch({require: true})
    .then(function(skill) {
      skill.save({
        skill_name: req.body.skillName
      })
        .then(function() { res.sendStatus(200); })
        .catch(function(err) {
          res.status(500).json({error: true, data: {message: err.message}});
        });
    })
  .catch(function(err) {
    res.status(500).json({error: true, data: {message: err.message}});
  });
});

router.delete('/:skillId', function(req, res, next) {
  Skill.forge({//querying for skill based on skillID passed in
    skill_id: req.params.skillId //this is coming from database
  })
    .fetch({require: true})
    .then(function(skill) {
      skill.destroy()
        .then(function() {res.sendStatus(200); })
        .catch(function(err) {
          res.status(500).json({error: true, data: {message: err.message}});
        });
    })
    .catch(function(err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});
module.exports = router;
