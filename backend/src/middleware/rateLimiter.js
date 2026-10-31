/**
 * In-memory Token Bucket Anti-Spam Middleware
 * Prevents rapid repeated crowd report submissions.
 */

const clientSubmissions = new Map();
const COOLDOWN_SECONDS = 15;

function spamGuard(req, res, next) {
  const identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.body?.userId || 'client_default';
  const now = Date.now();
  const lastTime = clientSubmissions.get(identifier) || 0;

  const diffSec = (now - lastTime) / 1000;
  if (diffSec < COOLDOWN_SECONDS) {
    const remaining = Math.ceil(COOLDOWN_SECONDS - diffSec);
    return res.status(429).json({
      success: false,
      error: 'SPAM_PREVENTION_TRIGGERED',
      message: `Please wait ${remaining} seconds before submitting another crowd report.`,
      remainingSeconds: remaining
    });
  }

  clientSubmissions.set(identifier, now);
  next();
}

module.exports = { spamGuard };

