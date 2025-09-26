// app/admin/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, Admin 👋</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">Total Products</h3>
          <p className="text-2xl font-semibold">0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">Orders</h3>
          <p className="text-2xl font-semibold">0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">Customers</h3>
          <p className="text-2xl font-semibold">0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">Revenue</h3>
          <p className="text-2xl font-semibold">$0</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-600 text-sm">No activity yet.</p>
      </div>
    </div>
  )
}
