export const states = [
  "Telangana",
  "Andhra Pradesh",
  "West Bengal",
  "Karnataka",
  "Jharkhand",
  "Jammu & Kashmir",
  "Maharashtra",
  "Goa",
  "Assam",
  "Madhya Pradesh",
  "Odisha",
  "Chhattisgarh",
  "Kerala",
  "Uttarakhand",
  "Tamil Nadu",
].map((name, i) => ({ id: i + 1, name, status: "Active" }));

export const locations = [
  ["CO-Corporate - Head Office", "Telangana"],
  ["WD001-PALAIR PKG 48", "Telangana"],
  ["WD002-TDWSP-Khammam, Godavari Segment", "Telangana"],
  ["WD003-TDWSP Warangal", "Telangana"],
  ["WD004-Tailpond-Krishna River", "Telangana"],
  ["WD005-GWMC - Warangal", "Telangana"],
  ["WD006-HMWSSB-ORR", "Telangana"],
  ["WD007-TMC-Tirupati", "Andhra Pradesh"],
  ["WD008-Suryapet-STP", "Telangana"],
  ["WDPH009-New Pump House Godavari, Khammam", "Telangana"],
].map(([name, state], i) => ({ id: i + 1, name, state, status: "Active" }));

export const sites = [
  ["CO", "CO-Corporate - Head Office", "CO-Corporate - Head Office", "Telangana"],
  ["WD001", "WD001-PALAIR PKG 48", "WD001-PALAIR PKG 48", "Telangana"],
  ["WD002", "WD002-TDWSP-Khammam, Godavari Segment", "WD002-TDWSP-Khammam, Godavari Segment", "Telangana"],
  ["WD003", "WD003-TDWSP Warangal", "WD003-TDWSP Warangal", "Telangana"],
  ["WD004", "WD004-Tailpond-Krishna River", "WD004-Tailpond-Krishna River", "Telangana"],
  ["WD005", "WD005-GWMC - Warangal", "WD005-GWMC - Warangal", "Telangana"],
  ["WD006", "WD006-HMWSSB-ORR", "WD006-HMWSSB-ORR", "Telangana"],
  ["WD007", "WD007-TMC-Tirupati", "WD007-TMC-Tirupati", "Andhra Pradesh"],
  ["WD008", "WD008-Suryapet-STP", "WD008-Suryapet-STP", "Telangana"],
  ["WDPH009", "WDPH009-New Pump House Godavari, Khammam", "WDPH009-New Pump House Godavari, Khammam", "Telangana"],
].map(([code, name, location, state], i) => ({
  id: i + 1,
  code,
  name,
  location,
  state,
  status: "Active",
}));

export const admins = [
  ["DEV SITE ADMIN", "8500222765", "99999", "developer2@apoyphe.com", "CO"],
  ["Appalkonda G", "8978863838", "10578", "appalakonda.g@gaja.co.in", "WD001"],
  ["Ashok T", "9952237933", "10885", "ashok.t@gaja.co.in", "WD002"],
  ["Bhaskara Rao B", "9493005922", "10350", "bhaskarrao.b@gaja.co.in", "WD003"],
  ["BS Murty", "7674822111", "10241", "murty.bs@gaja.co.in", "WD001–WD008"],
  ["Jagannadham P", "9553895611", "10412", "jagannadham.p@gaja.co.in", "WD004"],
  ["Kajal Ghosh", "9593508710", "10850", "kajal.ghosh@gaja.co.in", "WD005"],
  ["KSSN RAJU", "9100974678", "10005", "raju.kssn@gaja.co.in", "WD006"],
].map(([name, phone, employee, email, assigned], i) => ({
  id: i + 1,
  name,
  phone,
  employee,
  email,
  assigned,
  users: i + 2,
  status: "Active",
}));

export const users = [
  ["DEV SITE USER", "8500222765", "88888", "developer3@apoyphe.com", "CO"],
  ["Ramkiran D", "9329296693", "10259", "ramkiran.d@gaja.co.in", "WD001"],
  ["T. Ravi Kumar", "8074303259", "11042", "planning.ranchi@gaja.co.in", "WD002"],
  ["Ram Karan Singh", "9939593269", "10967", "accounts.prayagraj@gaja.co.in", "WD003"],
  ["K Rama Nageswara Rao", "9100101677", "10936", "planning.prayagraj@gaja.co.in", "WD004"],
  ["Rahul Pandit", "8931947283", "10536", "acts.peddapalli@gaja.co.in", "WD005"],
  ["Deepak Kumar", "8709779229", "10921", "acts.nidadavolu@gaja.co.in", "WD006"],
  ["Karthik Damodara Reddy", "9440899975", "11026", "acts.goa@gaja.co.in", "WD007"],
].map(([name, phone, employee, email, assigned], i) => ({
  id: i + 1,
  name,
  phone,
  employee,
  email,
  assigned,
  status: i === 4 ? "Inactive" : "Active",
}));

export const invoices = [
  ["INV-2026-1048", "WD001", "Sri Sai Cement", 248000, "28 Sep 2026", "Pending"],
  ["INV-2026-1047", "WD003", "Metro Steel Works", 186500, "27 Sep 2026", "Approved"],
  ["INV-2026-1046", "WD007", "Apex Equipment", 94200, "26 Sep 2026", "Rejected"],
  ["INV-2026-1045", "WD002", "Lakshmi Aggregates", 315750, "24 Sep 2026", "Pending"],
  ["INV-2026-1044", "WD005", "BuildRight Services", 128400, "23 Sep 2026", "S3"],
  ["INV-2026-1043", "WD006", "Pragati Electricals", 76500, "21 Sep 2026", "Approved"],
].map(([number, site, vendor, amount, date, status], i) => ({
  id: i + 1,
  number,
  site,
  vendor,
  amount,
  date,
  status,
}));

export const roleLabels = {
  super_admin: "Super Admin",
  site_admin: "Site Admin",
  site_user: "Site User",
};

export const demoCredentials = {
  super_admin: { email: "superadmin@gaja.co.in", password: "admin123" },
  site_admin: { email: "siteadmin@gaja.co.in", password: "admin123" },
  site_user: { email: "siteuser@gaja.co.in", password: "admin123" },
};
