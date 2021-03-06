const route = require('express').Router(),
	TaskModel = require('../models/taskModel'),
	UserModel = require('../models/userModel');

// #region GET ------------------------------------------------------------------------------------
route.get('/', (req, res) => {
	TaskModel.find({}).sort({_id: -1}).exec((err, docs) => {
		if (err)
			res.status(404).send(err);
		res.status(200).send(docs);
	});
});
route.get('/:id', (req, res) => {
	TaskModel.findById(req.params.id, (err, doc) => {
		if (err)
			res.status(404).send(err);
		res.status(200).send(doc);
	});
});
// #endregion
// #region POST -----------------------------------------------------------------------------------
route.post('/', (req, res) => {
	// Check required fields
	if(!req.body.name || !req.body.task || !req.body.date || !req.body.owner)
		return res.status(206).send({ success: false, msg: 'Campos incompletos, si no hay usuarios registre algunos, :D', data: req.body });
	// Build a new task
	let task = new TaskModel({
		name: req.body.name,
		task: req.body.task,
		date: req.body.date,
		owner: req.body.owner
	});
	// Insert task into the database
	task.save((err, data) => {
		if (err)
			res.status(404).send(err);
		res.status(200).send({ success: true, msg: 'Tarea registrada', data: data });
	});
});
// #endregion
// #region PUT ------------------------------------------------------------------------------------
route.put('/:id', (req, res) => {
	TaskModel.findById(req.params.id, (err, doc) => {
		if (err)
			res.status(404).send(err);
		if(req.body.task) doc.task = req.body.task;
		if(req.body.name) doc.name = req.body.name;
		if(req.body.date) doc.date = req.body.date;
		if(req.body.owner) doc.owner = req.body.owner;
		doc.toggle = !doc.toggle;
		doc.updated_at = Date.now();
		doc.save((err, doc) => { if(err) res.status(404).send(err); });
		res.status(200).send({ success: true, msg: 'Tarea actualizada', data: doc });
	});
});
// #endregion
// #region DELETE ---------------------------------------------------------------------------------
route.delete('/:id', (req, res) => {
	TaskModel.findByIdAndRemove(req.params.id, err => {
		if (err)
			res.status(404).send(err);
		res.status(200).send({ success: true, msg: 'Borrado satisfactoriamente' });
	});
});
// #endregion

module.exports = route;
