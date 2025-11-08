function normalizeTrustProxyValue(value) {
  if (value === undefined || value === null) {
    return undefined;
  }

  const stringValue = String(value).trim();
  if (stringValue.length === 0) {
    return undefined;
  }

  const lowerValue = stringValue.toLowerCase();
  if (lowerValue === 'true') {
    return true;
  }

  if (lowerValue === 'false') {
    return false;
  }

  const numericValue = Number(stringValue);
  if (!Number.isNaN(numericValue)) {
    return numericValue;
  }

  return stringValue;
}

function getTrustProxySetting() {
  const override = normalizeTrustProxyValue(process.env.TRUST_PROXY);
  if (override !== undefined) {
    return override;
  }

  if (process.env.RENDER) {
    // Render routes traffic through a single reverse proxy hop
    return 1;
  }

  return false;
}

module.exports = {
  getTrustProxySetting,
};
