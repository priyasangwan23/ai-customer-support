export const stats = [
  { label: 'Total Conversations', value: '1,284', trend: '+12%', color: '#A78BFA' },
  { label: 'Active Users',       value: '42',    trend: '+5%',  color: '#6D28D9' },
  { label: 'Resolved Queries',   value: '94.2%', trend: '+2%',  color: '#A78BFA' },
  { label: 'AI Confidence Avg',  value: '98.5%', trend: '+0.4%',color: '#C4B5FD' },
];

export const recentChats = [
  { id: 1, name: 'John Doe',   lastMessage: 'I need help with my order.', sentiment: 'neutral',  time: '2m ago' },
  { id: 2, name: 'Alice Smith', lastMessage: 'Thank you so much!',        sentiment: 'positive', time: '10m ago' },
  { id: 3, name: 'Bob Wilson',  lastMessage: 'This is not working at all.', sentiment: 'negative', time: '15m ago' },
  { id: 4, name: 'Chris Evans', lastMessage: 'Can I get a refund?',       sentiment: 'neutral',  time: '22m ago' },
];

export const aiInsights = {
  sentiment: 'Positive',
  intent: 'Refund Request',
  suggestedAction: 'Escalate to human agent',
};

export const quickActions = [
  { label: 'Track Order',   icon: 'Package', color: '#6D28D9' },
  { label: 'Refund Status', icon: 'DollarSign', color: '#A78BFA' },
  { label: 'Contact Support',icon: 'Headphones', color: '#C4B5FD' },
];

export const activityFeed = [
  { id: 1, event: 'User requested refund', time: '2 mins ago', status: 'pending' },
  { id: 2, event: 'AI handled conversation successfully', time: '15 mins ago', status: 'success' },
  { id: 3, event: 'New user registered', time: '1 hr ago', status: 'info' },
  { id: 4, event: 'Escalation triggered by Bob Wilson', time: '2 hrs ago', status: 'warning' },
];
