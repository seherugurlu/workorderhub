const svc = require("../services/workorders.service");
const { ok } = require("../utils/response.util");
const { AppError } = require("../utils/errors.util");
const { ERROR_CODES, DEPARTMENTS, PRIORITIES } = require("../utils/constants");
const { parse } = require("csv-parse/sync");
const crypto = require("crypto");
const schemas = require("../utils/validate.schemas");

const list = (req, res, next) => {
  try {
    const data = svc.list(req.query || {});
    return ok(res, req.requestId, data);
  } catch (e) {
    next(e);
  }
};

const getById = (req, res, next) => {
  try {
    const data = svc.get(req.params.id);
    return ok(res, req.requestId, data);
  } catch (e) {
    next(e);
  }
};

const create = (req, res, next) => {
  try {
    const data = svc.create(req.validated);
    return ok(res, req.requestId, data);
  } catch (e) {
    next(e);
  }
};

const update = (req, res, next) => {
  try {
    const data = svc.update(req.params.id, req.validated);
    return ok(res, req.requestId, data);
  } catch (e) {
    next(e);
  }
};

const changeStatus = (req, res, next) => {
  try {
    const data = svc.changeStatus(req.params.id, req.validated.status);
    return ok(res, req.requestId, data);
  } catch (e) {
    next(e);
  }
};

const remove = (req, res, next) => {
  try {
    svc.removeOne(req.params.id);
    return ok(res, req.requestId, { deleted: true });
  } catch (e) {
    next(e);
  }
};

const normalizeKeys = (obj) => {
  const out = {};
  for (const k of Object.keys(obj)) {
    out[String(k).trim().toLowerCase()] = obj[k];
  }
  return out;
};

const bulkUpload = (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, "Missing file field 'file'", []);
    }

    const text = req.file.buffer.toString("utf8");
    const records = parse(text, { columns: true, skip_empty_lines: true, trim: true });

    const uploadId = crypto.randomUUID();
    const strategy = "PARTIAL_ACCEPTANCE";

    const required = ["title", "description", "department", "priority", "requestername"];
    const errors = [];
    let accepted = 0;

    if (!Array.isArray(records)) {
      throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, "CSV parsing failed", []);
    }

    const normalizedRecords = records.map((r) => normalizeKeys(r));

    const headerKeys = normalizedRecords[0] ? Object.keys(normalizedRecords[0]) : [];
    const missing = required.filter((h) => !headerKeys.includes(h));

    if (missing.length) {
      throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, "Missing required CSV headers", missing.map((x) => ({ field: x, reason: "Header needed" })));
    }

    const totalRows = normalizedRecords.length;

    for (let i = 0; i < normalizedRecords.length; i++) {
      const rowNumber = i + 2;
      const r = normalizedRecords[i];

      const payload = {
        title: r.title,
        description: r.description,
        department: String(r.department || "").trim().toUpperCase(),
        priority: String(r.priority || "").trim().toUpperCase(),
        requesterName: r.requestername,
        assignee: r.assignee === undefined ? null : r.assignee
      };

      const fakeReq = { body: payload };
      const { value, errors: rowErrors } = schemas.createWorkOrder(fakeReq);

      if (rowErrors && rowErrors.length) {
        for (const er of rowErrors) {
          errors.push({ row: rowNumber, field: er.field, reason: er.reason });
        }
        continue;
      }

      svc.create(value);
      accepted++;
    }

    const rejected = totalRows - accepted;

    return ok(res, req.requestId, {
      uploadId,
      strategy,
      totalRows,
      accepted,
      rejected,
      errors
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { list, getById, create, update, changeStatus, remove, bulkUpload };