export const ENDPOINTS = {
  events: {
    list: '/pmprocess/between-dates',
    create: '/pmprocess',
    delete: (seriesId: number) => `/pmprocess/series/${seriesId}`,
    test: '/pmprocess/test'
  }
} as const;