import { useEffect, useMemo, useState } from 'react'

const API_URL = 'https://hiring.harrisons.my/api/mock/sales-orders'
const API_HEADERS = { 'x-assessment-key': 'hssb-assessment-mock-2026' }

const money = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  minimumFractionDigits: 2,
})

const date = new Intl.DateTimeFormat('en-MY', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kuala_Lumpur',
})

const SORT_OPTIONS = [
  ['CreatedDateTime1:desc', 'Newest first'],
  ['CreatedDateTime1:asc', 'Oldest first'],
  ['HAR_TotalSOAmount:desc', 'Amount: high to low'],
  ['HAR_TotalSOAmount:asc', 'Amount: low to high'],
  ['SalesId:asc', 'Order number: A–Z'],
]

function Icon({ name, size = 18 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></>,
    orders: <><path d="M6 3h12l2 4v14H4V7z" /><path d="M4 7h16M9 11h6" /></>,
    open: <><path d="M12 22a10 10 0 1 0-10-10" /><path d="M12 6v6l4 2" /></>,
    done: <><circle cx="12" cy="12" r="10" /><path d="m7.5 12 3 3 6-7" /></>,
    cancel: <><circle cx="12" cy="12" r="10" /><path d="m8 8 8 8M16 8l-8 8" /></>,
    value: <><path d="M3 6h18v12H3z" /><path d="M7 12h.01M17 12h.01" /><circle cx="12" cy="12" r="2.5" /></>,
    filter: <path d="M4 5h16l-6 7v5l-4 2v-7z" />,
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    first: <><path d="m17 18-6-6 6-6M7 6v12" /></>,
    last: <><path d="m7 18 6-6-6-6M17 6v12" /></>,
    alert: <><path d="M12 3 2 21h20z" /><path d="M12 9v5M12 18h.01" /></>,
    close: <path d="m7 7 10 10M17 7 7 17" />,
  }

  return (
    <svg aria-hidden="true" className="icon" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      {paths[name]}
    </svg>
  )
}

function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value.trim()), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

function formatDate(value) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : date.format(parsed)
}

function statusClass(status) {
  return {
    'Open order': 'status-open',
    Invoiced: 'status-invoiced',
    Delivered: 'status-delivered',
    Cancelled: 'status-cancelled',
  }[status] || 'status-default'
}

function StatCard({ icon, label, value, detail, tone, loading }) {
  return (
    <article className={`stat-card ${tone || ''}`}>
      <div className="stat-top">
        <span className="stat-icon"><Icon name={icon} /></span>
        <span className="stat-detail">{detail}</span>
      </div>
      {loading ? <span className="skeleton stat-skeleton" /> : <strong>{value}</strong>}
      <span className="stat-label">{label}</span>
    </article>
  )
}

function StatusBadge({ status }) {
  return <span className={`status-badge ${statusClass(status)}`}><i />{status}</span>
}

function TableSkeleton() {
  return Array.from({ length: 7 }, (_, index) => (
    <tr className="skeleton-row" key={index}>
      <td><span className="skeleton w-72" /><span className="skeleton w-48" /></td>
      <td><span className="skeleton w-80" /><span className="skeleton w-56" /></td>
      <td><span className="skeleton w-48" /></td>
      <td><span className="skeleton w-64" /></td>
      <td><span className="skeleton w-64" /></td>
      <td><span className="skeleton w-56" /></td>
    </tr>
  ))
}

function OrderTable({ orders, loading }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Order</th><th>Customer</th><th>Branch</th><th>Order date</th><th>Status</th><th className="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <TableSkeleton /> : orders.map((order) => (
            <tr key={order.SalesId}>
              <td><strong className="order-id">{order.SalesId}</strong><small>{order.CustomerRef || 'No reference'}</small></td>
              <td><span className="customer-name">{order.SalesName}</span><small>{order.CustAccount}</small></td>
              <td><span className="site-pill">{order.InventSiteId}</span><small>{order.HAR_DeliveryDistrictDescription}</small></td>
              <td>{formatDate(order.CreatedDateTime1)}</td>
              <td><StatusBadge status={order.SalesStatus} /></td>
              <td className="amount"><strong>{money.format(order.HAR_TotalSOAmount)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OrderCards({ orders, loading }) {
  if (loading) return <div className="order-cards">{Array.from({ length: 4 }, (_, i) => <div className="mobile-skeleton skeleton" key={i} />)}</div>
  return (
    <div className="order-cards">
      {orders.map((order) => (
        <article className="order-card" key={order.SalesId}>
          <div className="order-card-head"><strong>{order.SalesId}</strong><StatusBadge status={order.SalesStatus} /></div>
          <div><span className="customer-name">{order.SalesName}</span><small>{order.CustAccount} · {order.CustomerRef}</small></div>
          <dl>
            <div><dt>Branch</dt><dd>{order.InventSiteId}</dd></div>
            <div><dt>Order date</dt><dd>{formatDate(order.CreatedDateTime1)}</dd></div>
            <div className="card-amount"><dt>Amount</dt><dd>{money.format(order.HAR_TotalSOAmount)}</dd></div>
          </dl>
        </article>
      ))}
    </div>
  )
}

function App() {
  const [meta, setMeta] = useState({ statuses: [], sites: [] })
  const [orders, setOrders] = useState([])
  const [summary, setSummary] = useState(null)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounced(query)
  const [status, setStatus] = useState('')
  const [site, setSite] = useState('')
  const [sortValue, setSortValue] = useState('CreatedDateTime1:desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [result, setResult] = useState({ total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${API_URL}/meta`, { headers: API_HEADERS, signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        return response.json()
      })
      .then((data) => setMeta(data.facets))
      .catch((err) => { if (err.name !== 'AbortError') setError('Could not load filter options. Please try again.') })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const [sort, order] = sortValue.split(':')
    const params = new URLSearchParams({ page, pageSize, sort, order })
    if (debouncedQuery) params.set('q', debouncedQuery)
    if (status) params.set('status', status)
    if (site) params.set('site', site)

    setLoading(true)
    setError('')
    fetch(`${API_URL}?${params}`, { headers: API_HEADERS, signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        return response.json()
      })
      .then((data) => {
        setOrders(data.data)
        setSummary(data.summary)
        setResult({ total: data.total, totalPages: data.totalPages || 1 })
        setUpdatedAt(new Date())
      })
      .catch((err) => { if (err.name !== 'AbortError') setError('We could not load the orders. Check your connection and try again.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })

    return () => controller.abort()
  }, [debouncedQuery, status, site, sortValue, page, pageSize, refreshKey])

  const activeFilters = Boolean(debouncedQuery || status || site)
  const range = useMemo(() => {
    if (!result.total) return '0 results'
    const start = (page - 1) * pageSize + 1
    const end = Math.min(page * pageSize, result.total)
    return `${start}–${end} of ${result.total.toLocaleString('en-MY')}`
  }, [page, pageSize, result.total])

  function updateFilter(setter, value) {
    setPage(1)
    setter(value)
  }

  function clearFilters() {
    setQuery('')
    setStatus('')
    setSite('')
    setPage(1)
  }

  const completed = (summary?.invoiced_orders || 0) + (summary?.delivered_orders || 0)
  const hasNoResults = !loading && !error && orders.length === 0

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#main" aria-label="Sales Order Monitor home">
          <span className="brand-mark"><Icon name="orders" size={20} /></span>
          <span><strong>Orderflow</strong><small>Sales operations</small></span>
        </a>
        <div className="topbar-meta">
          <span className="live-label"><i />Live API</span>
          <button className="icon-button" onClick={() => setRefreshKey((key) => key + 1)} title="Refresh orders" type="button">
            <Icon name="refresh" /><span>Refresh</span>
          </button>
        </div>
      </header>

      <main id="main">
        <section className="page-heading">
          <div>
            <span className="eyebrow">Sales overview</span>
            <h1>Orders at a glance</h1>
            <p>Track performance and fulfilment across every branch.</p>
          </div>
          <div className="updated">
            <span>Last refreshed</span>
            <strong>{updatedAt ? updatedAt.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }) : '—'}</strong>
          </div>
        </section>

        <section className="stats-grid" aria-label="Order summary">
          <StatCard detail="All branches" icon="orders" label="Total orders" loading={!summary} value={summary?.total_orders.toLocaleString('en-MY')} />
          <StatCard detail="Needs action" icon="open" label="Open / pending" loading={!summary} tone="amber" value={summary?.open_orders.toLocaleString('en-MY')} />
          <StatCard detail="Fulfilled" icon="done" label="Completed" loading={!summary} tone="green" value={completed.toLocaleString('en-MY')} />
          <StatCard detail="Not proceeding" icon="cancel" label="Cancelled" loading={!summary} tone="red" value={summary?.cancelled_orders.toLocaleString('en-MY')} />
          <StatCard detail="Gross value" icon="value" label="Total order value" loading={!summary} tone="dark" value={summary ? money.format(summary.total_order_value) : ''} />
        </section>

        <section className="orders-panel" aria-labelledby="orders-title">
          <div className="panel-heading">
            <div>
              <h2 id="orders-title">Sales orders</h2>
              <p>{activeFilters ? `${result.total.toLocaleString('en-MY')} matching orders` : 'Complete order register'}</p>
            </div>
            {activeFilters && <button className="clear-button" onClick={clearFilters} type="button"><Icon name="close" size={15} />Clear filters</button>}
          </div>

          <div className="filter-bar">
            <label className="search-field">
              <span className="sr-only">Search orders</span>
              <Icon name="search" />
              <input onChange={(event) => updateFilter(setQuery, event.target.value)} placeholder="Search order, customer, account…" type="search" value={query} />
              {query !== debouncedQuery && <span className="mini-spinner" aria-label="Waiting to search" />}
            </label>
            <div className="filter-selects">
              <label>
                <span className="sr-only">Filter by status</span>
                <select onChange={(event) => updateFilter(setStatus, event.target.value)} value={status}>
                  <option value="">All statuses</option>
                  {meta.statuses.map(({ value, count }) => <option key={value} value={value}>{value} ({count})</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">Filter by branch</span>
                <select onChange={(event) => updateFilter(setSite, event.target.value)} value={site}>
                  <option value="">All branches</option>
                  {meta.sites.map(({ value, count }) => <option key={value} value={value}>{value} ({count})</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">Sort orders</span>
                <select onChange={(event) => updateFilter(setSortValue, event.target.value)} value={sortValue}>
                  {SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>
          </div>

          {error && (
            <div className="error-state" role="alert">
              <span><Icon name="alert" size={20} /></span>
              <div><strong>Something went wrong</strong><p>{error}</p></div>
              <button onClick={() => setRefreshKey((key) => key + 1)} type="button">Try again</button>
            </div>
          )}

          {!error && hasNoResults && (
            <div className="empty-state">
              <span><Icon name="filter" size={25} /></span>
              <h3>No matching orders</h3>
              <p>Try a broader search or remove one of the filters.</p>
              <button onClick={clearFilters} type="button">Clear all filters</button>
            </div>
          )}

          {!error && !hasNoResults && <>
            <OrderTable loading={loading} orders={orders} />
            <OrderCards loading={loading} orders={orders} />
          </>}

          {!error && !hasNoResults && (
            <footer className="pagination">
              <label>Rows
                <select onChange={(event) => { setPage(1); setPageSize(Number(event.target.value)) }} value={pageSize}>
                  {[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
              <span className="range">{loading ? 'Loading…' : range}</span>
              <div className="page-buttons" aria-label="Pagination">
                <button aria-label="First page" disabled={page === 1 || loading} onClick={() => setPage(1)}><Icon name="first" /></button>
                <button aria-label="Previous page" disabled={page === 1 || loading} onClick={() => setPage((current) => current - 1)}><Icon name="chevronLeft" /></button>
                <span>Page <strong>{page}</strong> of {result.totalPages}</span>
                <button aria-label="Next page" disabled={page >= result.totalPages || loading} onClick={() => setPage((current) => current + 1)}><Icon name="chevronRight" /></button>
                <button aria-label="Last page" disabled={page >= result.totalPages || loading} onClick={() => setPage(result.totalPages)}><Icon name="last" /></button>
              </div>
            </footer>
          )}
        </section>

        <p className="fixture-note">Fictional assessment data · Read-only source</p>
      </main>
    </div>
  )
}

export default App
