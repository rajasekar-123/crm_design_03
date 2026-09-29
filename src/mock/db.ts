
export const generateId = () => Math.random().toString(36).substr(2, 9);

export const initialCustomers = [
  { id: '1', name: "Acme Corp", email: "contact@acme.com", phone: "+1 555-0101", status: "Active", revenue: "$50k" },
  { id: '2', name: "Globex Inc", email: "info@globex.com", phone: "+1 555-0102", status: "Inactive", revenue: "$12k" },
  { id: '3', name: "Stark Industries", email: "tony@stark.com", phone: "+1 555-0103", status: "Active", revenue: "$1.2M" },
];

export const initialLeads = [
  { id: '1', title: "Enterprise SaaS Upgrade", company: "Stark Industries", value: 50000, stage: "New" },
  { id: '2', title: "Cloud Migration", company: "Wayne Enterprises", value: 120000, stage: "Negotiation" },
  { id: '3', title: "Security Audit", company: "Oscorp", value: 15000, stage: "Qualified" },
];

export function getLocalData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}

export function setLocalData<T>(key: string, data: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
