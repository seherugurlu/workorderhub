const crypto = require("crypto");
const data = require("../data/workorders.store");
const { AppError } = require("../utils/errors.util");
const { ERROR_CODES, TRANSITIONS } = require("../utils/constants");

const nowIso = () => new Date().toISOString();

const list = (query) => {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.max(1, parseInt(query.limit || "10", 10));

  const status = query.status || null;
  const department = query.department || null;
  const priority = query.priority || null;
  const assignee = query.assignee || null;
  const q = (query.q || "").trim().toLowerCase();

  let items = data.getAll();

  if (status) items = items.filter((x) => x.status === status);
  if (department) items = items.filter((x) => x.department === department);
  if (priority) items = items.filter((x) => x.priority === priority);
  if (assignee) items = items.filter((x) => (x.assignee || "") === assignee);
  if (q) items = items.filter((x) => x.title.toLowerCase().includes(q));

  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return { items: paged, page, limit, total };
};

const get = (id) => {
  const found = data.getById(id);
  if (!found) throw new AppError(404, ERROR_CODES.NOT_FOUND, "Work order not found");
  return found;
};

const create = (payload) => {
  const id = crypto.randomUUID();
  const t = nowIso();
  const workOrder = {
    id,
    title: payload.title,
    description: payload.description,
    department: payload.department,
    priority: payload.priority,
    status: "NEW",
    requesterName: payload.requesterName,
    assignee: payload.assignee || null,
    createdAt: t,
    updatedAt: t
  };
  data.save(workOrder);
  return workOrder;
};

const update = (id, payload) => {
  const found = get(id);
  const updated = {
    ...found,
    title: payload.title === undefined ? found.title : payload.title,
    description: payload.description === undefined ? found.description : payload.description,
    priority: payload.priority === undefined ? found.priority : payload.priority,
    assignee: payload.assignee === undefined ? found.assignee : payload.assignee,
    updatedAt: nowIso()
  };
  data.save(updated);
  return updated;
};

const changeStatus = (id, nextStatus) => {
  const found = get(id);
  const allowed = TRANSITIONS[found.status] || [];
  if (!allowed.includes(nextStatus)) {
    throw new AppError(409, ERROR_CODES.INVALID_TRANSITION, `Invalid transition from ${found.status} to ${nextStatus}`, [
      { from: found.status, to: nextStatus, allowed }
    ]);
  }
  const updated = { ...found, status: nextStatus, updatedAt: nowIso() };
  data.save(updated);
  return updated;
};

const removeOne = (id) => {
  const found = get(id);
  data.remove(found.id);
  return true;
};

module.exports = { list, get, create, update, changeStatus, removeOne };