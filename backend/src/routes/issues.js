const express = require('express');
const controller = require('../controllers/issuesController');
const eventsController = require('../controllers/issueEventsController');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', upload.array('files', 5), controller.create);
router.put('/:id', controller.update);
router.patch('/:id/status', upload.array('files', 5), controller.updateStatus);
router.patch('/:id/assign', controller.assign);
router.patch('/:id/labels', controller.updateLabels);
router.patch('/:id/start-date', controller.updateStartDate);
router.patch('/:id/due-date', controller.updateDueDate);
router.delete('/:id', controller.remove);

router.get('/:id/events', eventsController.list);
router.post('/:id/events', eventsController.createComment);

module.exports = router;
