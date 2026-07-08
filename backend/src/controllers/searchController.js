const prisma = require('../prismaClient');

async function search(req, res, next) {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ issues: [], projects: [] });

    const [issues, projects] = await Promise.all([
      prisma.issue.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { moduleName: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 8,
        include: { project: true },
      }),
      prisma.project.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: 8,
      }),
    ]);

    res.json({ issues, projects });
  } catch (err) {
    next(err);
  }
}

module.exports = { search };
