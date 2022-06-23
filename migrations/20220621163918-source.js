const uuid = require('uuid');
const sources = [
  {
    staticId: uuid.v4(),
    url: `https://decrypt.co/feed`,
    lastRead: new Date(-1),
    enabled: true
  },
  {
    staticId: uuid.v4(),
    url: `https://blockworks.co/feed/`,
    lastRead: new Date(-1),
    enabled: true
  },
  {
    staticId: uuid.v4(),
    url: `https://cryptopotato.com/feed`,
    lastRead: new Date(-1),
    enabled: true
  },
  {
    staticId: uuid.v4(),
    url: `https://cryptobriefing.com/feed/`,
    lastRead: new Date(-1),
    enabled: true
  },
  {
    staticId: uuid.v4(),
    url: `https://dailyhodl.com/feed/`,
    lastRead: new Date(-1),
    enabled: true
  },
  {
    staticId: uuid.v4(),
    url: `https://cointelegraph.com/rss`,
    lastRead: new Date(-1),
    enabled: true
  },
  {
    staticId: uuid.v4(),
    url: `https://nova.rs/feed`,
    lastRead: new Date(-1),
    enabled: true
  }
];

const ids = sources.map(source => source.staticId);

module.exports = {
  async up(db) {
    return db.collection(`sources`).insertMany(sources);
  },

  async down(db) {
    return db.collection(`sources`).deleteMany({ staticId: {$in : ids} });
  }
};
