function validateParams(body, required) {
  let requiredKeys = required || [];
  let errors = [];
  requiredKeys.forEach(el => {
    if (!body[el]) {
      errors.push(el);
    }
  })
  if (errors.length) {
    return {
      "error": "Missing key(s): " + errors.toString(),
      "status": 412
    }
  }
  return null;
}

module.exports = {
  validateParams
}