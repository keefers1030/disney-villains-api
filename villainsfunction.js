const villains = require('./villains.js')

villains.forEach(villain => {
  // eslint-disable-next-line max-len
  console.log(`('${villain.name}', '${villain.movie}', '${villain.slug}'),`)
})
