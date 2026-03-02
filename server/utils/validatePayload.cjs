function validatePayload(body) {
  const { shared, workers } = body || {};

  if (!shared) {
    return { valid: false, message: "Missing shared data" };
  }

  if (!workers || !Array.isArray(workers) || workers.length === 0) {
    return { valid: false, message: "Missing workers array" };
  }

  return { valid: true, shared, workers };
}

module.exports = { validatePayload };

