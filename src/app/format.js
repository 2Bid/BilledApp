export const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr)
    const year = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
    const month = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
    const day = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
    const monthUpper = month.charAt(0).toUpperCase() + month.slice(1)
  return `${parseInt(day)} ${monthUpper.substr(0,3)}. ${year.toString().substr(2,4)}`
  } catch (error) {
    return ''
  }
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}