const prisma = require('../prismaClient');

async function list(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const notifications = await prisma.notification.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: { issue: true },
    });
    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const notification = await prisma.notification.update({
      where: { id: Number(req.params.id) },
      data: { read: true },
    });
    res.json(notification);
  } catch (err) {
    next(err);
  }
}

async function markAllRead(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    await prisma.notification.updateMany({
      where: { userId: Number(userId), read: false },
      data: { read: true },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, markRead, markAllRead };
