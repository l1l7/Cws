// public/api-config.js
export const API_BASE = '/api'; // Vercel maps /api/* automatically

export const ENDPOINTS = {
  reviews: `${API_BASE}/reviews`,
  leadSubmit: `${API_BASE}/lead-submit`,
  adminLogin: `${API_BASE}/admin-login`,
  adminLeads: `${API_BASE}/admin-leads`,
  adminReviews: `${API_BASE}/admin-reviews`,
  reviewsApproved: `${API_BASE}/reviews-approved`,
};