import type { Access, FieldAccess } from 'payload'

export const anyone: Access = () => true

/** Any signed-in admin-panel user (admin or editor). */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Public sees published documents only; signed-in users also see drafts. */
export const publishedOrAuthenticated: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'

/** Admins see everyone; other users only themselves. */
export const isAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  return { id: { equals: req.user.id } }
}
