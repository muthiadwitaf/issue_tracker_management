const prisma = require('../prismaClient');

const userSelect = { id: true, name: true, email: true, createdAt: true };

async function list(req, res, next) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { issues: true } } },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        issues: {
          orderBy: { createdAt: 'desc' },
          include: {
            assignee: { select: userSelect },
            reporter: { select: userSelect },
            labels: { include: { label: true } },
          },
        },
      },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const project = await prisma.project.create({ data: { name, description } });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { name, description } = req.body;
    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: { name, description },
    });
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await prisma.project.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
