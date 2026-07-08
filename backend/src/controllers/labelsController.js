const prisma = require('../prismaClient');

async function list(req, res, next) {
  try {
    const labels = await prisma.label.findMany({ orderBy: { name: 'asc' } });
    res.json(labels);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const label = await prisma.label.create({ data: { name, color } });
    res.status(201).json(label);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await prisma.label.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, remove };
