const ok = (res, requestId, data) => {
  return res.json({ requestId, success: true, data });
};

const error = (res, requestId, status, code, message, details) => {
  return res.status(status).json({
    requestId,
    success: false,
    error: { code, message, details: details || [] }
  });
};

module.exports = { ok, error };