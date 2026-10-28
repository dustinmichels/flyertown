/// <reference path="../pb_data/types.d.ts" />

// Dummy events for local development. Some carry a generated SVG poster in `image`;
// the rest have none (the field is optional). Down migration deletes exactly these ids.
//
// Only seeds when PB_SEED_DUMMY=1 (set by `mise run pb`). Elsewhere, e.g. production,
// it is recorded as applied without inserting anything.

const IMPACT = "Impact, 'Arial Narrow', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const SERIF = 'Georgia, serif'
const MONO = "'Courier New', monospace"

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function text(x, y, size, str, o = {}) {
  const attrs = [
    `x="${x}"`,
    `y="${y}"`,
    `font-size="${size}"`,
    `font-family="${o.font || SANS}"`,
    `font-weight="${o.weight || 700}"`,
    `fill="${o.fill || '#111'}"`,
    `text-anchor="${o.anchor || 'start'}"`,
  ]
  if (o.italic) attrs.push('font-style="italic"')
  if (o.spacing) attrs.push(`letter-spacing="${o.spacing}"`)
  if (o.rotate) attrs.push(`transform="rotate(${o.rotate} ${x} ${y})"`)
  return `<text ${attrs.join(' ')}>${esc(str)}</text>`
}

function svg(bg, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="600" height="800" fill="${bg}"/>${body}</svg>`
}

/** Row of tear-off tabs along the bottom edge. */
function tearTabs(label, color) {
  const dash = `stroke="${color}" stroke-width="2" stroke-dasharray="6 6"`
  let out = `<line x1="0" y1="640" x2="600" y2="640" ${dash}/>`
  for (let i = 0; i < 8; i++) {
    const x = i * 75
    if (i) out += `<line x1="${x}" y1="640" x2="${x}" y2="800" ${dash}/>`
    out += text(x + 45, 790, 17, label, { font: MONO, weight: 400, fill: color, rotate: -90 })
  }
  return out
}

const POSTERS = {
  bike: () =>
    svg(
      '#ffd23f',
      [
        text(40, 190, 170, 'FIX IT', { font: IMPACT }),
        text(40, 350, 150, 'FRIDAY', { font: IMPACT }),
        '<g fill="none" stroke="#111" stroke-width="12" stroke-linejoin="round" stroke-linecap="round">',
        '<circle cx="190" cy="520" r="80"/><circle cx="420" cy="520" r="80"/>',
        '<path d="M190 520 L280 420 L400 420 L420 520 M280 420 L300 520 L190 520 M300 520 L400 420"/>',
        '<path d="M262 402 L304 402 M386 404 L424 392"/>',
        '</g>',
        text(40, 680, 34, 'Free community bike repair'),
        text(40, 725, 30, 'Fri Nov 6, 5-8pm, Union Sq Plaza', { weight: 400 }),
        text(40, 765, 24, 'Tools and coffee provided. Bring your bike.', { weight: 400 }),
      ].join('')
    ),

  river: () => {
    let waves = ''
    for (let y = 470; y <= 630; y += 40) {
      waves += `<path d="M0 ${y} Q 75 ${y - 30} 150 ${y} T 300 ${y} T 450 ${y} T 600 ${y}" fill="none" stroke="#9fd3f0" stroke-width="6" opacity="${1 - (y - 470) / 260}"/>`
    }
    const fg = '#f2efe6'
    return svg(
      '#1d5c8c',
      [
        text(300, 170, 120, 'MYSTIC', { font: IMPACT, anchor: 'middle', fill: fg }),
        text(300, 300, 120, 'RIVER', { font: IMPACT, anchor: 'middle', fill: fg }),
        text(300, 380, 58, 'fall cleanup', {
          font: SERIF,
          weight: 400,
          italic: true,
          anchor: 'middle',
          fill: '#9fd3f0',
        }),
        waves,
        text(300, 700, 34, 'Sat Nov 7, 9am to noon', { anchor: 'middle', fill: fg }),
        text(300, 745, 26, 'Meet at the Wellington boathouse', {
          anchor: 'middle',
          weight: 400,
          fill: fg,
        }),
        text(300, 780, 20, 'Gloves and bags provided', { anchor: 'middle', weight: 400, fill: fg }),
      ].join('')
    )
  },

  tenant: () =>
    svg(
      '#fbfbf8',
      [
        '<rect width="600" height="260" fill="#c8102e"/>',
        text(40, 130, 92, 'KNOW YOUR', { font: IMPACT, fill: '#fff' }),
        text(40, 230, 92, 'RIGHTS', { font: IMPACT, fill: '#fff' }),
        text(40, 320, 40, 'Tenant rights workshop'),
        text(40, 375, 26, '- Rent increases', { font: MONO, weight: 400 }),
        text(40, 410, 26, '- Repairs and code violations', { font: MONO, weight: 400 }),
        text(40, 445, 26, '- Eviction notices', { font: MONO, weight: 400 }),
        text(40, 500, 24, 'Free. Spanish and Portuguese', { weight: 400 }),
        text(40, 530, 24, 'interpretation available.', { weight: 400 }),
        text(40, 600, 28, 'Tue Nov 10, 6:30pm, Central Library'),
        tearTabs('Nov 10 6:30pm', '#c8102e'),
      ].join('')
    ),

  zine: () => {
    const fills = ['#111', '#fff', '#ffd23f', '#fff']
    const turns = [-8, 5, -3, 9, 6, -7, 4, -5]
    let letters = ''
    'ZINESWAP'.split('').forEach((ch, i) => {
      const x = 55 + (i % 4) * 130
      const y = i < 4 ? 60 : 220
      const fill = fills[i % fills.length]
      const ink = fill === '#111' ? '#fff' : '#111'
      letters += `<g transform="rotate(${turns[i]} ${x + 55} ${y + 70})"><rect x="${x}" y="${y}" width="110" height="140" fill="${fill}"/>${text(x + 55, y + 112, 110, ch, { font: i % 2 ? SERIF : IMPACT, anchor: 'middle', fill: ink })}</g>`
    })
    return svg(
      '#ff8fb1',
      [
        '<defs><pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="3" fill="#111" opacity=".25"/></pattern></defs>',
        '<rect y="520" width="600" height="280" fill="url(#dots)"/>',
        letters,
        text(300, 470, 50, 'and print night', {
          font: SERIF,
          weight: 400,
          italic: true,
          anchor: 'middle',
        }),
        text(300, 600, 38, 'Thu Nov 12, 7-10pm', { anchor: 'middle' }),
        text(300, 650, 28, 'Aeronaut Brewing back room', { anchor: 'middle', weight: 400 }),
        text(300, 700, 24, 'Bring 5 zines, leave with 5 zines', { anchor: 'middle', weight: 400 }),
        text(300, 740, 22, 'Risograph and long-arm staplers on site', {
          anchor: 'middle',
          weight: 400,
        }),
      ].join('')
    )
  },

  seeds: () => {
    const green = '#2f4a1e'
    const seeds = [
      [80, 330, 20],
      [140, 380, -30],
      [470, 340, 60],
      [530, 400, 10],
      [100, 470, 80],
      [500, 480, -50],
      [190, 520, 35],
      [420, 530, -15],
    ]
      .map(
        ([x, y, r]) =>
          `<ellipse cx="${x}" cy="${y}" rx="14" ry="8" fill="#4a3520" transform="rotate(${r} ${x} ${y})"/>`
      )
      .join('')
    return svg(
      '#c9a66b',
      [
        text(300, 150, 120, 'FREE', { font: IMPACT, anchor: 'middle', fill: green }),
        text(300, 270, 120, 'SEEDS', { font: IMPACT, anchor: 'middle', fill: green }),
        seeds,
        `<path d="M300 570 L300 440" stroke="${green}" stroke-width="10" stroke-linecap="round"/>`,
        `<path d="M300 480 Q250 430 220 470 Q260 510 300 480 Z M300 455 Q350 405 380 445 Q340 485 300 455 Z" fill="${green}"/>`,
        text(300, 640, 38, 'Seed library opening', { anchor: 'middle', fill: green }),
        text(300, 690, 30, 'Sat Nov 21, 10am-2pm', { anchor: 'middle', fill: green }),
        text(300, 735, 26, 'Somerville Public Library, West Branch', {
          anchor: 'middle',
          weight: 400,
          fill: green,
        }),
      ].join('')
    )
  },

  jazz: () => {
    const bg = '#1b2440'
    const gold = '#e8b04a'
    const fg = '#f2efe6'
    return svg(
      bg,
      [
        text(300, 90, 30, 'LAST ONE OF THE YEAR', {
          anchor: 'middle',
          fill: gold,
          spacing: 4,
        }),
        `<circle cx="300" cy="290" r="160" fill="${gold}"/>`,
        [330, 365, 400, 432]
          .map((y, i) => `<rect y="${y}" width="600" height="${8 + i * 5}" fill="${bg}"/>`)
          .join(''),
        `<rect y="450" width="600" height="20" fill="${bg}"/>`,
        text(300, 560, 92, 'PORCH JAZZ', { font: IMPACT, anchor: 'middle', fill: fg }),
        text(300, 640, 34, 'Sun Nov 8, 3-5pm', { anchor: 'middle', fill: gold }),
        text(300, 690, 28, '42 Hawthorne St porch, Medford', {
          anchor: 'middle',
          weight: 400,
          fill: fg,
        }),
        text(300, 740, 24, 'Bring a chair. Pass the hat.', {
          anchor: 'middle',
          weight: 400,
          fill: fg,
        }),
      ].join('')
    )
  },
}

/** Boston wall-clock time (EST, after Nov 1 2026) to PocketBase's UTC datetime format. */
const est = (local) =>
  new Date(`${local.replace(' ', 'T')}:00-05:00`).toISOString().replace('T', ' ')

/** 15-char [a-z0-9] record id. */
const seedId = (key) => `seed${key}00000000000`.slice(0, 15)

const EVENTS = [
  {
    key: 'bike',
    title: 'Fix-It Friday: Community Bike Repair',
    description:
      '<p>Flat tire? Squeaky chain? Bring your bike and we will help you fix it yourself.</p><p>Stands, tools, and coffee provided. All skill levels welcome.</p>',
    start: '2026-11-06 17:00',
    end: '2026-11-06 20:00',
    location: 'Union Square Plaza, Somerville',
    website: 'https://example.org/fix-it-friday',
    poster_name: 'Somerville Bike Kitchen',
    poster_email: 'hello@bikekitchen.example.org',
    poster: 'bike',
  },
  {
    key: 'river',
    title: 'Mystic River Fall Cleanup',
    description:
      '<p>Help clear litter from the riverbanks before winter. We will split into teams along the Mystic River Reservation.</p><p>Wear closed-toe shoes and clothes that can get muddy.</p>',
    start: '2026-11-07 09:00',
    end: '2026-11-07 12:00',
    location: 'Wellington Boathouse, Medford',
    website: 'https://example.org/mystic-cleanup',
    poster_name: 'Mystic River Watershed Volunteers',
    poster_email: 'volunteer@mystic.example.org',
    poster: 'river',
  },
  {
    key: 'jazz',
    title: 'Porch Jazz: Last One of the Year',
    description:
      '<p>The neighborhood porch quartet plays its final set before the cold sets in. Sidewalk seating, kids and dogs welcome.</p>',
    start: '2026-11-08 15:00',
    end: '2026-11-08 17:00',
    location: '42 Hawthorne St, Medford',
    website: '',
    poster_name: 'Hawthorne St Neighbors',
    poster_email: 'porchjazz@example.org',
    poster: 'jazz',
  },
  {
    key: 'tenant',
    title: 'Tenant Rights Workshop',
    description:
      '<p>Learn what your landlord can and cannot do: rent increases, repairs and code violations, and what to do if you receive an eviction notice.</p><p>Free. Spanish and Portuguese interpretation available.</p>',
    start: '2026-11-10 18:30',
    end: '2026-11-10 20:00',
    location: 'Somerville Public Library, Central Branch',
    website: 'https://example.org/tenant-rights',
    poster_name: 'Somerville Tenants Union',
    poster_email: 'info@tenants.example.org',
    poster: 'tenant',
  },
  {
    key: 'zine',
    title: 'Zine Swap & Print Night',
    description:
      '<p>Bring five copies of your zine, leave with five new ones. A risograph and long-arm staplers will be on hand if you want to print something on the spot.</p>',
    start: '2026-11-12 19:00',
    end: '2026-11-12 22:00',
    location: 'Aeronaut Brewing, Somerville',
    website: 'https://example.org/zine-swap',
    poster_name: 'Paper Cuts Collective',
    poster_email: 'zines@papercuts.example.org',
    poster: 'zine',
  },
  {
    key: 'transit',
    title: 'Transit Justice Teach-In',
    description:
      '<p>A lunchtime session on bus network redesign, fare-free pilots, and how to testify at the next MBTA board meeting.</p>',
    start: '2026-11-16 12:00',
    end: '2026-11-16 13:30',
    location: 'Tufts University, Brown House',
    website: 'https://example.org/transit-teach-in',
    poster_name: 'UEP Student Council',
    poster_email: 'council@uep.example.org',
  },
  {
    key: 'alumni',
    title: 'UEP Alumni Coffee Hour',
    description:
      '<p>Informal coffee with UEP alumni working in planning, policy, and advocacy. Come with questions about jobs, internships, or thesis topics.</p>',
    start: '2026-11-18 08:30',
    end: '2026-11-18 09:30',
    location: 'Diesel Cafe, Davis Square',
    website: '',
    poster_name: 'UEP Alumni Network',
    poster_email: 'alumni@uep.example.org',
  },
  {
    key: 'climate',
    title: 'Climate Resilience Open House',
    description:
      '<p>See the draft flood and heat resilience maps for the Mystic watershed and tell the planning team what they missed.</p>',
    start: '2026-11-19 17:00',
    end: '2026-11-19 19:00',
    location: 'Medford City Hall, Room 207',
    website: 'https://example.org/resilience-open-house',
    poster_name: 'Medford Office of Planning',
    poster_email: 'planning@medford.example.org',
  },
  {
    key: 'seeds',
    title: 'Seed Library Grand Opening',
    description:
      '<p>Borrow seeds in spring, return seeds from your harvest in fall. Opening day includes a seed-saving demo and free starter packets.</p>',
    start: '2026-11-21 10:00',
    end: '2026-11-21 14:00',
    location: 'Somerville Public Library, West Branch',
    website: 'https://example.org/seed-library',
    poster_name: 'Growing Somerville',
    poster_email: 'seeds@growing.example.org',
    poster: 'seeds',
  },
  {
    key: 'potluck',
    title: 'Friendsgiving Potluck',
    description:
      '<p>Bring a dish to share, or just bring yourself. Plates, cutlery, and a very large pot of soup provided.</p>',
    start: '2026-11-22 17:00',
    end: '2026-11-22 21:00',
    location: 'UEP Lounge, 97 Talbot Ave',
    website: '',
    poster_name: 'UEP Student Council',
    poster_email: 'council@uep.example.org',
  },
  {
    key: 'thesis',
    title: 'Thesis Lightning Talks',
    description:
      '<p>Second-year students present their thesis work in five minutes each, followed by questions and snacks.</p>',
    start: '2026-12-03 16:00',
    end: '2026-12-03 18:00',
    location: 'Tufts University, Barnum 104',
    website: '',
    poster_name: 'UEP Department',
    poster_email: 'uep@example.org',
  },
]

migrate(
  (app) => {
    if ($os.getenv('PB_SEED_DUMMY') !== '1') return
    const flyers = app.findCollectionByNameOrId('flyers')
    for (const e of EVENTS) {
      const end = est(e.end)
      const record = new Record(flyers)
      record.set('id', seedId(e.key))
      record.set('title', e.title)
      record.set('description', e.description)
      record.set('start_datetime', est(e.start))
      record.set('end_datetime', end)
      record.set('expiration_date', end)
      record.set('location', e.location)
      record.set('website', e.website)
      record.set('poster_name', e.poster_name)
      record.set('poster_email', e.poster_email)
      if (e.poster) {
        const bytes = toBytes(POSTERS[e.poster]())
        record.set('image', $filesystem.fileFromBytes(bytes, `${e.poster}.svg`))
      }
      app.save(record)
    }
  },
  (app) => {
    for (const e of EVENTS) {
      try {
        app.delete(app.findRecordById('flyers', seedId(e.key)))
      } catch {
        // already gone
      }
    }
  }
)
