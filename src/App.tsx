import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { StorefrontLayout } from '@/components/layout/StorefrontLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { HomePage } from '@/pages/storefront/HomePage'
import { ShopPage } from '@/pages/storefront/ShopPage'
import { ProductPage } from '@/pages/storefront/ProductPage'
import { CartPage } from '@/pages/storefront/CartPage'
import { CheckoutPage } from '@/pages/storefront/CheckoutPage'
import { OrderConfirmationPage, AboutPage, ContactPage } from '@/pages/storefront/OrderConfirmationPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { ProductsPage, CategoriesPage, InventoryPage } from '@/pages/admin/ProductsPage'
import { OrdersPage, CustomersPage, CouponsPage } from '@/pages/admin/OrdersPage'
import { MetaPage, DeliveryPage, AnalyticsPage, SettingsPage } from '@/pages/admin/MetaPage'
import { CartProvider, useCart } from '@/lib/cartContext'
import { Language } from '@/i18n'

function StorefrontRoutes() {
  const [lang, setLang] = useState<Language>('fr')
  const cart = useCart()

  return (
    <StorefrontLayout lang={lang} onLangChange={setLang} cartCount={cart.count}>
      <Routes>
        <Route path="/" element={<HomePage lang={lang} onAddToCart={(id) => cart.addItem(id)} />} />
        <Route path="/shop" element={<ShopPage lang={lang} onAddToCart={(id) => cart.addItem(id)} />} />
        <Route path="/products/:slug" element={<ProductPage lang={lang} onAddToCart={(id, qty, variant) => cart.addItem(id, qty, variant)} />} />
        <Route path="/cart" element={<CartPage lang={lang} items={cart.items} onUpdateQty={cart.updateQty} onRemove={cart.removeItem} />} />
        <Route path="/checkout" element={<CheckoutPage lang={lang} items={cart.items} onOrderPlaced={() => cart.clear()} />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </StorefrontLayout>
  )
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/meta" element={<MetaPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </AdminLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<StorefrontRoutes />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
