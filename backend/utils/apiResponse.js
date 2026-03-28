const ok = (res, { message = 'OK', data = {}, legacy = {} } = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    ...legacy, // keep older UI working
  });
};

const fail = (res, status = 500, { message = 'Request failed', error = {} } = {}) => {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
};

module.exports = { ok, fail };

