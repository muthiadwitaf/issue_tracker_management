const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PASSWORD = 'password123';

async function main() {
  await prisma.notification.deleteMany();
  await prisma.issueEvent.deleteMany();
  await prisma.issueLabel.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.label.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const [admin, alice, bob, carol, dina, evan] = await Promise.all([
    prisma.user.create({ data: { name: 'Admin User', email: 'admin@example.com', passwordHash } }),
    prisma.user.create({ data: { name: 'Alice Programmer', email: 'alice@example.com', passwordHash } }),
    prisma.user.create({ data: { name: 'Bob Programmer', email: 'bob@example.com', passwordHash } }),
    prisma.user.create({ data: { name: 'Carol Reporter', email: 'carol@example.com', passwordHash } }),
    prisma.user.create({ data: { name: 'Dina Analyst', email: 'dina@example.com', passwordHash } }),
    prisma.user.create({ data: { name: 'Evan Reviewer', email: 'evan@example.com', passwordHash } }),
  ]);

  await prisma.user.createMany({
    data: [
      { name: 'Wafi', email: 'xafihernand27@gmail.com', passwordHash },
      { name: 'Adilson', email: 'adil@matrixintegrasi.com', passwordHash },
      { name: 'Gorby', email: 'gorby@matrixintegrasi.com', passwordHash },
      { name: 'Puspita', email: 'pita@matrixintegrasi.com', passwordHash },
      { name: 'Faris', email: 'faris@matrixintegrasi.com', passwordHash },
      { name: 'Hamzah', email: 'hamzah@matrixintegrasi.com', passwordHash },
      { name: 'Hanif', email: 'hanif@matrixintegrasi.com', passwordHash },
      { name: 'Imron', email: 'imron@matrixintegrasi.com', passwordHash },
      { name: 'Iskandar', email: 'is@matrixintegrasi.com', passwordHash },
      { name: 'Yusuf', email: 'yusuf@matrixintegrasi.com', passwordHash },
      { name: 'Husein', email: 'husein@matrixintegrasi.com', passwordHash },
      { name: "Muthi'ah", email: 'tia@matrixintegrasi.com', passwordHash },
      { name: 'Anis', email: 'anis@matrixintegrasi.com', passwordHash },
      { name: 'Untung', email: 'toto@matrixintegrasi.com', passwordHash },
      { name: 'Zaka', email: 'zaka@matrixintegrasi.com', passwordHash },
    ],
  });

  const [
    etle2025,
    etlePoldaJabar,
    sakiDi,
    sakiPaten,
    etleRevamp,
    etleRevit,
    etleAtms,
    erpApp,
    hrApp,
    hospitalApp,
    patimban,
  ] = await Promise.all([
    prisma.project.create({ data: { name: 'ETLE 2025', description: 'Sistem tilang elektronik tahun 2025' } }),
    prisma.project.create({ data: { name: 'ETLE Polda Jabar', description: 'ETLE khusus wilayah Polda Jawa Barat' } }),
    prisma.project.create({ data: { name: 'SAKI DI', description: 'Sistem Akuntansi Instansi - Direktorat' } }),
    prisma.project.create({ data: { name: 'SAKI Paten', description: 'Sistem Akuntansi Instansi - modul Paten' } }),
    prisma.project.create({ data: { name: 'ETLE REVAMP', description: 'Revamp arsitektur & UI sistem ETLE' } }),
    prisma.project.create({ data: { name: 'ETLE REVIT', description: 'Integrasi ETLE dengan sistem Revit' } }),
    prisma.project.create({ data: { name: 'ETLE ATMS', description: 'Integrasi ETLE dengan Advanced Traffic Management System' } }),
    prisma.project.create({ data: { name: 'ERP APP', description: 'Aplikasi Enterprise Resource Planning internal' } }),
    prisma.project.create({ data: { name: 'HR-APP', description: 'Aplikasi manajemen SDM & payroll' } }),
    prisma.project.create({ data: { name: 'Hospital APP', description: 'Aplikasi manajemen rumah sakit' } }),
    prisma.project.create({ data: { name: 'PATIMBAN', description: 'Sistem informasi Pelabuhan Patimban' } }),
  ]);

  const [bugLabel, featureLabel, improvementLabel, docsLabel, infrastructureLabel, othersLabel] = await Promise.all([
    prisma.label.create({ data: { name: 'Bug', color: '#C62828' } }),
    prisma.label.create({ data: { name: 'Feature Request', color: '#0F6CBD' } }),
    prisma.label.create({ data: { name: 'Improvement', color: '#0F7B6C' } }),
    prisma.label.create({ data: { name: 'Documentation', color: '#5C6B7A' } }),
    prisma.label.create({ data: { name: 'Infrastructure', color: '#B45309' } }),
    prisma.label.create({ data: { name: 'Others', color: '#6D28D9' } }),
  ]);

  const now = new Date('2026-07-07T12:00:00Z').getTime();

  const issue1 = await prisma.issue.create({
    data: {
      title: 'Kamera ETLE tidak mendeteksi pelanggaran di malam hari',
      description: 'Kamera di beberapa titik gagal menangkap gambar pelanggaran saat kondisi minim cahaya.',
      status: 'OPEN',
      priority: 'HIGH',
      startDate: new Date(now - 7 * DAY_MS),
      dueDate: new Date(now - 2 * DAY_MS),
      projectId: etle2025.id,
      reporterId: carol.id,
      assigneeId: alice.id,
    },
  });
  const issue2 = await prisma.issue.create({
    data: {
      title: 'Dashboard ETLE Polda Jabar tidak bisa filtering data',
      description: 'Fitur filter tanggal & lokasi di dashboard ETLE Polda Jabar tidak berfungsi, data tidak berubah saat filter diterapkan.',
      status: 'TESTING',
      priority: 'MEDIUM',
      informantName: 'User Dashboard Polda Jabar',
      startDate: new Date(now - 1 * DAY_MS),
      dueDate: new Date(now + 5 * DAY_MS),
      projectId: etlePoldaJabar.id,
      reporterId: carol.id,
      assigneeId: bob.id,
    },
  });
  const issue3 = await prisma.issue.create({
    data: {
      title: 'Laporan keuangan bulanan tidak bisa di-export ke PDF',
      description: 'Tombol export PDF di modul laporan SAKI DI menghasilkan file kosong.',
      status: 'OPEN',
      priority: 'CRITICAL',
      projectId: sakiDi.id,
      reporterId: admin.id,
      assigneeId: alice.id,
    },
  });
  const issue4 = await prisma.issue.create({
    data: {
      title: 'Modul inventory ERP tidak update stok secara real-time',
      description: 'Stok barang di ERP APP baru ter-update setelah refresh manual, seharusnya real-time.',
      status: 'DEPLOY',
      priority: 'HIGH',
      solution: 'Menambahkan websocket untuk update stok secara real-time.',
      projectId: erpApp.id,
      reporterId: carol.id,
      assigneeId: bob.id,
    },
  });
  const issue5 = await prisma.issue.create({
    data: {
      title: 'Perhitungan lembur karyawan salah di slip gaji',
      description: 'Jam lembur di atas 3 jam tidak dihitung dengan tarif lembur yang benar.',
      status: 'CLOSED',
      priority: 'MEDIUM',
      solution: 'Memperbaiki rumus perhitungan tarif lembur bertingkat.',
      projectId: hrApp.id,
      reporterId: admin.id,
    },
  });

  await prisma.issueLabel.createMany({
    data: [
      { issueId: issue1.id, labelId: bugLabel.id },
      { issueId: issue1.id, labelId: infrastructureLabel.id },
      { issueId: issue2.id, labelId: improvementLabel.id },
      { issueId: issue3.id, labelId: bugLabel.id },
      { issueId: issue3.id, labelId: othersLabel.id },
      { issueId: issue4.id, labelId: bugLabel.id },
      { issueId: issue5.id, labelId: docsLabel.id },
      { issueId: issue5.id, labelId: featureLabel.id },
    ],
  });

  await prisma.issueEvent.createMany({
    data: [
      { issueId: issue1.id, type: 'CREATED', actorId: carol.id, detail: 'Issue created' },
      { issueId: issue1.id, type: 'ASSIGNMENT_CHANGE', actorId: admin.id, detail: 'Assigned to Alice Programmer' },
      {
        issueId: issue1.id,
        type: 'COMMENT',
        actorId: dina.id,
        body: 'Hasil analisa: kemungkinan besar disebabkan oleh threshold sensor infrared yang terlalu rendah pada firmware versi lama.',
      },
      {
        issueId: issue1.id,
        type: 'COMMENT',
        actorId: alice.id,
        body: 'Sudah dicek di 3 titik kamera, sepertinya masalah di sensor infrared-nya.',
      },
      { issueId: issue2.id, type: 'CREATED', actorId: carol.id, detail: 'Issue created' },
      { issueId: issue2.id, type: 'STATUS_CHANGE', actorId: bob.id, detail: 'Status changed from Open to In Progress' },
      { issueId: issue2.id, type: 'STATUS_CHANGE', actorId: bob.id, detail: 'Status changed from In Progress to Testing' },
      { issueId: issue4.id, type: 'CREATED', actorId: carol.id, detail: 'Issue created' },
      { issueId: issue4.id, type: 'STATUS_CHANGE', actorId: bob.id, detail: 'Status changed from In Progress to Resolved' },
      { issueId: issue4.id, type: 'STATUS_CHANGE', actorId: bob.id, detail: 'Status changed from Resolved to Deploy' },
      {
        issueId: issue4.id,
        type: 'COMMENT',
        actorId: evan.id,
        body: 'Sudah direview, perbaikan websocket berjalan sesuai ekspektasi. Approved.',
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: alice.id,
        issueId: issue1.id,
        message: 'You were assigned to "Kamera ETLE tidak mendeteksi pelanggaran di malam hari" by Admin User',
      },
      {
        userId: alice.id,
        issueId: issue3.id,
        message: 'You were assigned to "Laporan keuangan bulanan tidak bisa di-export ke PDF" by Admin User',
      },
    ],
  });

  console.log('Seed data created:', {
    projects: 11,
    issues: 5,
    labels: 6,
    users: 21,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
