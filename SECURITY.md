# Security Policy

## Reporting a Vulnerability

**Do NOT create a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in Nomad Treasures, please report it by emailing:

📧 **security@nomadtreasures.com**

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your contact information (optional but appreciated)

We will:

- Acknowledge receipt within 48 hours
- Provide regular updates on our progress
- Work with you to understand and resolve the issue
- Credit you in security advisories (if desired)

## Security Best Practices

### For Users

1. **Keep dependencies updated** - Regularly run `npm update` and review changelogs
2. **Use environment variables** - Never hardcode secrets in code or `.env` files
3. **Change default credentials** - Immediately change demo credentials in production
4. **Enable HTTPS** - Always use HTTPS in production
5. **Regular backups** - Maintain regular database backups
6. **Monitor logs** - Watch for suspicious activity in server logs

### For Developers

1. **Input validation** - Always validate and sanitize user input
2. **Authentication** - Use strong, token-based authentication
3. **Authorization** - Implement proper access controls
4. **Encryption** - Use HTTPS for all communications
5. **Dependencies** - Keep dependencies up-to-date and audit regularly
6. **Secrets management** - Use environment variables or secret management tools
7. **Code review** - Get security-minded reviewers on PRs

## Security Features

### Currently Implemented

- **Password Hashing** - PBKDF2 with salt
- **JWT Tokens** - Secure token-based authentication
- **Rate Limiting** - Protects against brute force attacks
- **CORS** - Prevents cross-origin attacks
- **Helmet.js** - Security headers in production
- **Input Validation** - Zod validation for requests
- **Environment Variables** - Secrets not stored in code

## Known Vulnerabilities

None reported. If you discover a vulnerability, please report it immediately using the process above.

## Security Advisories

Security advisories will be published at: https://github.com/afripicx/nomad-treasures/security/advisories

## Third-Party Dependencies

We monitor all dependencies for vulnerabilities using:

- GitHub's Dependabot
- `npm audit`
- Regular security reviews

## Responsible Disclosure

We appreciate security researchers who responsibly disclose vulnerabilities. We commit to:

1. ✅ Acknowledging receipt within 48 hours
2. ✅ Providing regular updates
3. ✅ Working transparently to fix issues
4. ✅ Crediting researchers appropriately
5. ✅ Releasing patches without unnecessary delay

## Security Updates

Security patches will be released as soon as possible after verification. Users should:

1. Monitor release notes for security patches
2. Update immediately when security releases are available
3. Subscribe to security advisories

## Support

For security questions or to report concerns:

- 📧 Email: security@nomadtreasures.com
- 🔗 GitHub: https://github.com/afripicx/nomad-treasures/security
- 📖 Docs: See SECURITY.md in repository

---

Thank you for helping keep Nomad Treasures secure! 🛡️
