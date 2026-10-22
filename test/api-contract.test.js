import test from 'node:test'
import assert from 'node:assert/strict'

const baseUrl = 'https://hiring.harrisons.my/api/mock/sales-orders'
const headers = { 'x-assessment-key': 'hssb-assessment-mock-2026' }

test('API exposes the expected read-only facets', async () => {
  const response = await fetch(`${baseUrl}/meta`, { headers })
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.equal(body.readOnly, true)
  assert.equal(body.dataset.rows, 1200)
  assert.ok(body.facets.statuses.some(({ value }) => value === 'Open order'))
  assert.ok(body.facets.sites.some(({ value }) => value === 'B20'))
})

test('combined filters return matching paginated orders and a summary', async () => {
  const params = new URLSearchParams({ page: 1, pageSize: 5, status: 'Open order', site: 'B20', q: 'Siti' })
  const response = await fetch(`${baseUrl}?${params}`, { headers })
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.ok(body.total > 0)
  assert.ok(body.data.length <= 5)
  assert.ok(body.data.every((order) => order.SalesStatus === 'Open order' && order.InventSiteId === 'B20'))
  assert.equal(body.summary.total_orders, 1200)
})
