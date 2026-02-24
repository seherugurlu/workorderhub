const store = new Map();

const getAll = () => Array.from(store.values());

const getById = (id) => store.get(id) || null;

const save = (workOrder) => {
  store.set(workOrder.id, workOrder);
  return workOrder;
};

const remove = (id) => store.delete(id);

module.exports = { getAll, getById, save, remove };