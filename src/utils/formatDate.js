export default function formatDate(dateStr) {
  if (!dateStr) return "TBA";
  try {
    const dt = new Date(dateStr);
    return dt.toLocaleString();
  } catch (err) {
    return dateStr;
  }
}
