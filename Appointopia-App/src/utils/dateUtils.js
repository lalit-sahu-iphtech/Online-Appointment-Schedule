
// GET WEEK DAYS (Monday to Sunday)
export const getWeekDays = (date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  
  return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
  });
};

// GET MONTH DAYS (For Month View Calendar)
export const getMonthDays = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  //  FIXED: Get day of week (0 = Sunday, 1 = Monday, etc.)
  let startDayOfWeek = firstDay.getDay();
  // Convert to Monday-based week (Monday = 0, Sunday = 6)
  if (startDayOfWeek === 0) {
      startDayOfWeek = 6; // Sunday becomes 6 (last day)
  } else {
      startDayOfWeek = startDayOfWeek - 1; // Monday = 0, Tuesday = 1, etc.
  }
  
  const days = [];
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  // Previous month days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
          date: new Date(year, month - 1, prevMonthLastDay - i),
          isCurrentMonth: false
      });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
      days.push({
          date: new Date(year, month, i),
          isCurrentMonth: true
      });
  }
  
  // Next month days (to complete 42 days = 6 rows × 7 days)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
      days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false
      });
  }
  
  return days;
};

//  FIXED: FORMAT DATE TO YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// CHECK IF DATE IS TODAY
export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const d = new Date(date);
  return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
};

// GET MONTH YEAR (e.g., "August, 2026")
export const getMonthYear = (date) => {
  if (!date) return '';
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]}, ${date.getFullYear()}`;
};

// GET DAY DATE (e.g., "Wed, August 19, 2026")
export const getDayDate = (date) => {
  if (!date) return '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};