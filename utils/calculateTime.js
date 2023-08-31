// calculates the time difference between the current time and a given createdAt
const calculateTime = (createdAt) => {
  const currentDate = new Date()
  const createdAtDate = new Date(createdAt)

  const timeDifference = currentDate.getTime() - createdAtDate.getTime()

  const seconds = Math.floor(timeDifference / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30.44)
  const years = Math.floor(months / 12)

  if (years > 0) return `${years} years ago`
  if (months > 0) return `${months} months ago`
  if (days > 0) return `${days} days ago`
  if (hours > 0) return `${hours} hours ago`
  if (minutes > 0) return `${minutes} minutes ago`
  if (seconds > 0) return `now`
}

module.exports = calculateTime
