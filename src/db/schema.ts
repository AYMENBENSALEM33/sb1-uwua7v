export const SCHEMA = {
  series: `
    CREATE TABLE IF NOT EXISTS series (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      defaultColor TEXT NOT NULL,
      defaultPosition INTEGER NOT NULL DEFAULT 1,
      isCustom INTEGER DEFAULT 0,
      order INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `,
  
  events: `
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      color TEXT NOT NULL,
      visible INTEGER NOT NULL DEFAULT 1,
      position INTEGER NOT NULL DEFAULT 1,
      seriesId INTEGER NOT NULL,
      type TEXT,
      value REAL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (seriesId) REFERENCES series(id) ON DELETE CASCADE
    )
  `
};

export const INDEXES = {
  series: [
    'CREATE INDEX IF NOT EXISTS idx_series_order ON series(order)'
  ],
  events: [
    'CREATE INDEX IF NOT EXISTS idx_events_series ON events(seriesId)',
    'CREATE INDEX IF NOT EXISTS idx_events_dates ON events(startDate, endDate)'
  ]
};