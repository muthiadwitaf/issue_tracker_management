const prisma = require('../prismaClient');

const ACTIVE_STATUS_FILTER = { not: 'CLOSED' };

async function stats(req, res, next) {
  try {
    const { projectId } = req.query;
    const baseWhere = projectId ? { projectId: Number(projectId) } : {};

    const [byStatus, byPriority, totalIssues, totalProjects, openByProject, openByAssignee, overdueCount] =
      await Promise.all([
        prisma.issue.groupBy({ by: ['status'], _count: { _all: true }, where: baseWhere }),
        prisma.issue.groupBy({ by: ['priority'], _count: { _all: true }, where: baseWhere }),
        prisma.issue.count({ where: baseWhere }),
        prisma.project.count(),
        prisma.issue.groupBy({
          by: ['projectId'],
          _count: { _all: true },
          where: { ...baseWhere, status: ACTIVE_STATUS_FILTER },
        }),
        prisma.issue.groupBy({
          by: ['assigneeId'],
          _count: { _all: true },
          where: { ...baseWhere, status: ACTIVE_STATUS_FILTER, assigneeId: { not: null } },
        }),
        prisma.issue.count({
          where: { ...baseWhere, dueDate: { lt: new Date() }, status: ACTIVE_STATUS_FILTER },
        }),
      ]);

    const projectIds = openByProject.map((p) => p.projectId);
    const assigneeIds = openByAssignee.map((a) => a.assigneeId).filter(Boolean);

    const [projects, assignees] = await Promise.all([
      prisma.project.findMany({ where: { id: { in: projectIds } } }),
      prisma.user.findMany({ where: { id: { in: assigneeIds } }, select: { id: true, name: true } }),
    ]);

    const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.name]));
    const assigneeMap = Object.fromEntries(assignees.map((a) => [a.id, a.name]));

    res.json({
      totalIssues,
      totalProjects,
      overdueCount,
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
      byPriority: byPriority.map((p) => ({ priority: p.priority, count: p._count._all })),
      openByProject: openByProject.map((p) => ({
        projectId: p.projectId,
        projectName: projectMap[p.projectId] || 'Unknown',
        count: p._count._all,
      })),
      openByAssignee: openByAssignee.map((a) => ({
        assigneeId: a.assigneeId,
        assigneeName: assigneeMap[a.assigneeId] || 'Unknown',
        count: a._count._all,
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { stats };
