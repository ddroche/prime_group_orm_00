var express = require('express');
var router = express.Router();
var Talent = require('../models/talent');
var Talents = require('../models/collections/talents');
var Skill = require('../models/skill');

/* GET all talent. */
router.get('/', function(req, res, next) {
  Talents.forge()
    .fetch({withRelated: ['skills']})
    .then(function(collection) {
      res.json({data: collection.toJSON()});
    })
    .catch(function(err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});
/* POST talent */
router.post('/', function(req, res, next) {
  console.log(req.body);
  var skills = req.body.skills;
  if (skills) {
    skills = skills.split(',').map(function(skill){
      return skill.trim();
    });
  }

  Talent.forge({
    talent_legacy_id: req.body.talentLegacyId,
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    city: req.body.city,
    state: req.body.state
  })
    .save()
    .then(function(talent) {
      talent.load(['skills'])
        .then(function (model) {

          //attach skills to talent
          model.skills().attach(skills);

          res.json({talentId: talent.get('talent_id')

        })

      })
      .catch(function(err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function(err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});

/* UPDATE talent */
router.put('/:talentId', function(req, res, next) {
  Talent.forge({
    talent_id: req.params.talentId
  })
    .fetch({require: true})
    .then(function(talent) {
      talent.save({
        talent_legacy_id: req.body.talentLegacyId,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        city: req.body.city,
        state: req.body.state
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

/* DELETE talent */
router.delete('/:talentId', function(req, res, next) {
  Talent.forge({
    talent_id: req.params.talentId
  })
    .fetch({require: true})
    .then(function(talent) {
      talent.destroy()
        .then(function() { res.sendStatus(200); })
        .catch(function(err) {
          res.status(500).json({error: true, data: {message: err.message}});
        });
    })
    .catch(function(err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});


module.exports = router;
