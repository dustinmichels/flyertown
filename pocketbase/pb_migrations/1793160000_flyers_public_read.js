/// <reference path="../pb_data/types.d.ts" />

// The frontend reads flyers anonymously. poster_email is hidden so the public API
// never exposes submitters' addresses (superusers still see it).
migrate(
  (app) => {
    const flyers = app.findCollectionByNameOrId('flyers')
    flyers.listRule = ''
    flyers.viewRule = ''
    flyers.fields.getByName('poster_email').hidden = true
    app.save(flyers)
  },
  (app) => {
    const flyers = app.findCollectionByNameOrId('flyers')
    flyers.listRule = null
    flyers.viewRule = null
    flyers.fields.getByName('poster_email').hidden = false
    app.save(flyers)
  }
)
