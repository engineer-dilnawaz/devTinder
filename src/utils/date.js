function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  const units = [
    { name: "year", seconds: 365 * 24 * 60 * 60 },
    { name: "month", seconds: 30 * 24 * 60 * 60 },
    { name: "week", seconds: 7 * 24 * 60 * 60 },
    { name: "day", seconds: 24 * 60 * 60 },
    { name: "hour", seconds: 60 * 60 },
    { name: "minute", seconds: 60 },
    { name: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const value = Math.floor(seconds / unit.seconds);
    if (value >= 1) {
      return value === 1
        ? `${value} ${unit.name} ago`
        : `${value} ${unit.name}s ago`;
    }
  }

  return "just now";
}

module.exports = {
  timeAgo,
};
