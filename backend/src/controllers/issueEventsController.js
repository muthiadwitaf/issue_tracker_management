const prisma = require('../prismaClient');

const userSelect = { id: true, name: true, email: true, createdAt: true };

async function list(req, res, next) {
  try {
    const events = await prisma.issueEvent.findMany({
      where: { issueId: Number(req.params.id) },
      orderBy: { createdAt: 'asc' },
      include: { actor: { select: userSelect }, attachments: true },
    });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

async function createComment(req, res, next) {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ error: 'body is required' });
    const event = await prisma.issueEvent.create({
      data: {
        issueId: Number(req.params.id),
        type: 'COMMENT',
        body,
        actorId: req.user.id,
      },
      include: { actor: { select: userSelect } },
    });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, createComment };
