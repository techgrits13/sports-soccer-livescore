'use strict';

/**
 * Placeholder round controller to keep /api/rounds endpoint available
 * until full implementation is delivered.
 */
const notImplemented = (action) => (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      message: `Round ${action} is not implemented yet`
    }
  });
};

const getRounds = notImplemented('listing');
const getRoundById = notImplemented('detail retrieval');

module.exports = {
  getRounds,
  getRoundById
};
