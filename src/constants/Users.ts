export const rols = [
  {
    name: "Any role",
    id: 0,
  },
  {
    name: "EA",
    id: 1,
  },
  {
    name: "TL",
    id: 2,
  },
  {
    name: "TM",
    id: 3,
  },
]

export const tmAppUrl = 'https://' + (window.location.hostname.startsWith('dev') ? 'dev-' : '') + 'app.readformyschool.com';