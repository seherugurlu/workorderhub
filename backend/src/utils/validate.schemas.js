const { DEPARTMENTS, PRIORITIES, STATUSES } = require("./constants");

const clean = (v) => (typeof v === "string" ? v.trim() : v);

const isNonEmptyString = (v, min) => typeof v === "string" && v.trim().length >= min;

const createWorkOrder = (req) => {
  const b = req.body || {};
  const value = {
    title: clean(b.title),
    description: clean(b.description),
    department: clean(b.department),
    priority: clean(b.priority),
    requesterName: clean(b.requesterName),
    assignee: b.assignee === undefined ? null : clean(b.assignee)
  };

  const errors = [];

  if (!isNonEmptyString(value.title, 5)) errors.push({ field: "title", reason: "Min 5 characters" });
  if (!isNonEmptyString(value.description, 10)) errors.push({ field: "description", reason: "Min 10 characters" });
  if (!DEPARTMENTS.includes(value.department)) errors.push({ field: "department", reason: `Must be ${DEPARTMENTS.join("/")}` });
  if (!PRIORITIES.includes(value.priority)) errors.push({ field: "priority", reason: `Must be ${PRIORITIES.join("/")}` });
  if (!isNonEmptyString(value.requesterName, 3)) errors.push({ field: "requesterName", reason: "Min 3 characters" });
  if (value.assignee !== null && value.assignee !== "" && typeof value.assignee !== "string") errors.push({ field: "assignee", reason: "Must be a string" });

  if (value.assignee === "") value.assignee = null;

  return { value, errors };
};

const updateWorkOrder = (req) => {
  const b = req.body || {};
  const value = {
    title: b.title === undefined ? undefined : clean(b.title),
    description: b.description === undefined ? undefined : clean(b.description),
    priority: b.priority === undefined ? undefined : clean(b.priority),
    assignee: b.assignee === undefined ? undefined : clean(b.assignee)
  };

  const errors = [];

  if (value.title !== undefined && !isNonEmptyString(value.title, 5)) errors.push({ field: "title", reason: "Min 5 characters" });
  if (value.description !== undefined && !isNonEmptyString(value.description, 10)) errors.push({ field: "description", reason: "Min 10 characters" });
  if (value.priority !== undefined && !PRIORITIES.includes(value.priority)) errors.push({ field: "priority", reason: `Must be ${PRIORITIES.join("/")}` });

  if (value.assignee !== undefined) {
    if (value.assignee === "") value.assignee = null;
    if (value.assignee !== null && typeof value.assignee !== "string") errors.push({ field: "assignee", reason: "Must be a string" });
  }

  if (Object.values(value).every((x) => x === undefined)) {
    errors.push({ field: "body", reason: "Provide at least one updatable field" });
  }

  return { value, errors };
};

const changeStatus = (req) => {
  const b = req.body || {};
  const value = { status: clean(b.status) };
  const errors = [];

  if (!STATUSES.includes(value.status)) errors.push({ field: "status", reason: `Must be ${STATUSES.join("/")}` });

  return { value, errors };
};

module.exports = { createWorkOrder, updateWorkOrder, changeStatus };