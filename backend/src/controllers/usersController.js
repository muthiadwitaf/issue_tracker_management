const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');

const SALT_ROUNDS = 10;

const publicSelect = { id: true, name: true, email: true, createdAt: true };

async function list(req, res, next) {
  try {
    const users = await prisma.user.findMany({ orderBy: { name: 'asc' }, select: publicSelect });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) }, select: publicSelect });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: publicSelect,
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const data = { name, email };
    if (password) {
      data.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data,
      select: publicSelect,
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
