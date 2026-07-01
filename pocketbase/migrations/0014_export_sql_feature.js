migrate(
  (app) => {
    console.log('Migration 0014: Database SQL export feature removed')
  },
  (app) => {
    console.log('Migration 0014: Database SQL export feature removal reverted')
  },
)
