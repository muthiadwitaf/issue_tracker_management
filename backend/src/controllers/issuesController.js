const prisma = require('../prismaClient');

const userSelect = { id: true, name: true, email: true, createdAt: true };

const includeRelations = {
  project: true,
  reporter: { select: userSelect },
  assignee: { select: userSelect },
  labels: { include: { label: true } },
};

const statusLabels = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  TESTING: 'Testing',
  DEPLOY: 'Deploy',
  TESTED: 'Tested',
  REVIEWED: 'Reviewed',
  CLOSED: 'Closed',
};

const ACTIVE_STATUS_FILTER = { not: 'CLOSED' };

function toArray(value) {
  if (value === undefined || value === null || value === '') return [];
  return Array.isArray(value) ? value : [value];
}

async function attachFiles(eventId, files) {
  if (!files?.length) return;
  await prisma.issueAttachment.createMany({
    data: files.map((file) => ({
      eventId,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    })),
  });
}

async function list(req, res, next) {
  try {
    const { projectId, status, assigneeId, priority, labelId, overdue } = req.query;
    const where = {};
    if (projectId) where.projectId = Number(projectId);
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = Number(assigneeId);
    if (priority) where.priority = priority;
    if (labelId) where.labels = { some: { labelId: Number(labelId) } };
    if (overdue === 'true') {
      where.dueDate = { lt: new Date() };
      where.status = ACTIVE_STATUS_FILTER;
    }

    const issues = await prisma.issue.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: includeRelations,
    });
    res.json(issues);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: Number(req.params.id) },
      include: includeRelations,
    });
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const {
      title,
      description,
      priority,
      projectId,
      assigneeId,
      startDate,
      dueDate,
      moduleName,
      informantName,
    } = req.body;
    const labelIds = toArray(req.body.labelIds);
    if (!title || !projectId) return res.status(400).json({ error: 'title and projectId are required' });
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        priority,
        moduleName: moduleName || null,
        informantName: informantName || null,
        projectId: Number(projectId),
        reporterId: req.user.id,
        assigneeId: assigneeId ? Number(assigneeId) : null,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        labels: labelIds.length ? { create: labelIds.map((labelId) => ({ labelId: Number(labelId) })) } : undefined,
      },
      include: includeRelations,
    });
    const event = await prisma.issueEvent.create({
      data: {
        issueId: issue.id,
        type: 'CREATED',
        detail: 'Issue created',
        actorId: req.user.id,
      },
    });
    await attachFiles(event.id, req.files);
    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { title, description, priority, projectId, reporterId, assigneeId, startDate, dueDate, moduleName, informantName } =
      req.body;
    const issue = await prisma.issue.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        description,
        priority,
        moduleName: moduleName === null ? null : moduleName || undefined,
        informantName: informantName === null ? null : informantName || undefined,
        projectId: projectId ? Number(projectId) : undefined,
        reporterId: reporterId === null ? null : reporterId ? Number(reporterId) : undefined,
        assigneeId: assigneeId === null ? null : assigneeId ? Number(assigneeId) : undefined,
        startDate: startDate === null ? null : startDate ? new Date(startDate) : undefined,
        dueDate: dueDate === null ? null : dueDate ? new Date(dueDate) : undefined,
      },
      include: includeRelations,
    });
    res.json(issue);
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status, solution } = req.body;
    const existing = await prisma.issue.findUnique({ where: { id: Number(req.params.id) } });
    if (!existing) return res.status(404).json({ error: 'Issue not found' });

    const issue = await prisma.issue.update({
      where: { id: Number(req.params.id) },
      data: { status, solution },
      include: includeRelations,
    });

    const statusChanged = Boolean(status) && status !== existing.status;
    const solutionChanged = solution !== undefined && (solution || null) !== (existing.solution || null);
    const hasFiles = Boolean(req.files?.length);

    if (statusChanged || solutionChanged || hasFiles) {
      const details = [];
      if (statusChanged) details.push(`Status changed from ${statusLabels[existing.status]} to ${statusLabels[status]}`);
      if (solutionChanged) details.push('Solution updated');
      if (hasFiles) details.push(`${req.files.length} evidence file(s) attached`);

      const event = await prisma.issueEvent.create({
        data: {
          issueId: issue.id,
          type: 'STATUS_CHANGE',
          detail: details.join('; '),
          actorId: req.user.id,
        },
      });
      await attachFiles(event.id, req.files);
    }

    res.json(issue);
  } catch (err) {
    next(err);
  }
}

async function assign(req, res, next) {
  try {
    const { assigneeId } = req.body;
    const existing = await prisma.issue.findUnique({ where: { id: Number(req.params.id) } });
    if (!existing) return res.status(404).json({ error: 'Issue not found' });

    const newAssigneeId = assigneeId ? Number(assigneeId) : null;

    const issue = await prisma.issue.update({
      where: { id: Number(req.params.id) },
      data: { assigneeId: newAssigneeId },
      include: includeRelations,
    });

    if (newAssigneeId !== existing.assigneeId) {
      await prisma.issueEvent.create({
        data: {
          issueId: issue.id,
          type: 'ASSIGNMENT_CHANGE',
          detail: newAssigneeId
            ? `Assigned to ${issue.assignee?.name} by ${req.user.name}`
            : 'Unassigned',
          actorId: req.user.id,
        },
      });

      if (newAssigneeId) {
        await prisma.notification.create({
          data: {
            userId: newAssigneeId,
            issueId: issue.id,
            message: `You were assigned to "${issue.title}" by ${req.user.name}`,
          },
        });
      }
    }

    res.json(issue);
  } catch (err) {
    next(err);
  }
}

async function updateLabels(req, res, next) {
  try {
    const issueId = Number(req.params.id);
    const { labelIds = [] } = req.body;

    await prisma.$transaction([
      prisma.issueLabel.deleteMany({ where: { issueId } }),
      prisma.issueLabel.createMany({
        data: labelIds.map((labelId) => ({ issueId, labelId: Number(labelId) })),
        skipDuplicates: true,
      }),
    ]);

    const issue = await prisma.issue.findUnique({ where: { id: issueId }, include: includeRelations });

    await prisma.issueEvent.create({
      data: {
        issueId,
        type: 'LABEL_CHANGE',
        detail: `Labels updated (${issue.labels.map((l) => l.label.name).join(', ') || 'none'})`,
        actorId: req.user.id,
      },
    });

    res.json(issue);
  } catch (err) {
    next(err);
  }
}

async function updateStartDate(req, res, next) {
  try {
    const { startDate } = req.body;
    const issue = await prisma.issue.update({
      where: { id: Number(req.params.id) },
      data: { startDate: startDate ? new Date(startDate) : null },
      include: includeRelations,
    });

    await prisma.issueEvent.create({
      data: {
        issueId: issue.id,
        type: 'START_DATE_CHANGE',
        detail: startDate ? `Start date set to ${new Date(startDate).toLocaleDateString()}` : 'Start date cleared',
        actorId: req.user.id,
      },
    });

    res.json(issue);
  } catch (err) {
    next(err);
  }
}

async function updateDueDate(req, res, next) {
  try {
    const { dueDate } = req.body;
    const issue = await prisma.issue.update({
      where: { id: Number(req.params.id) },
      data: { dueDate: dueDate ? new Date(dueDate) : null },
      include: includeRelations,
    });

    await prisma.issueEvent.create({
      data: {
        issueId: issue.id,
        type: 'DUE_DATE_CHANGE',
        detail: dueDate ? `Due date set to ${new Date(dueDate).toLocaleDateString()}` : 'Due date cleared',
        actorId: req.user.id,
      },
    });

    res.json(issue);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await prisma.issue.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  updateStatus,
  assign,
  updateLabels,
  updateStartDate,
  updateDueDate,
  remove,
};
