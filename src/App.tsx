import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import CreateProduct from './pages/CreateProduct';
import Wishlist from './pages/Wishlist';
import PageViewer from './pages/PageViewer';
import Contact from './pages/Contact';
import Plans from './pages/Plans';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminPlans from './pages/admin/AdminPlans';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPages from './pages/admin/AdminPages';
import AdminContacts from './pages/admin/AdminContacts';
import AdminReports from './pages/admin/AdminReports';
import AdminNews from './pages/admin/AdminNews';
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminSlides from './pages/admin/AdminSlides';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminNotify from './pages/admin/AdminNotify';
import AdminCurrency from './pages/admin/AdminCurrency';
import AdminReviews from './pages/admin/AdminReviews';
import AdminReviewDetails from './pages/admin/AdminReviewDetails';
import AdminContactDetails from './pages/admin/AdminContactDetails';
import AdminSubscribers from './pages/admin/AdminSubscribers';
import AdminCountries from './pages/admin/AdminCountries';
import AdminStates from './pages/admin/AdminStates';
import AdminCities from './pages/admin/AdminCities';
import AdminSplashMessages from './pages/admin/AdminSplashMessages';
import EditProduct from './pages/EditProduct';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import FreeAds from './pages/FreeAds';
import UpgradedAds from './pages/UpgradedAds';
import AdsActivity from './pages/AdsActivity';
import Followers from './pages/Followers';
import Following from './pages/Following';
import Payments from './pages/Payments';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/pages/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/pages/about-us" element={<AboutUs />} />
          <Route path="/pages/:slug" element={<PageViewer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/profile/password" element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          } />
          <Route path="/profile/free-ads" element={
            <PrivateRoute>
              <FreeAds />
            </PrivateRoute>
          } />
          <Route path="/profile/upgraded-ads" element={
            <PrivateRoute>
              <UpgradedAds />
            </PrivateRoute>
          } />
          <Route path="/profile/activity" element={
            <PrivateRoute>
              <AdsActivity />
            </PrivateRoute>
          } />
          <Route path="/profile/followers" element={
            <PrivateRoute>
              <Followers />
            </PrivateRoute>
          } />
          <Route path="/profile/following" element={
            <PrivateRoute>
              <Following />
            </PrivateRoute>
          } />
          <Route path="/profile/payments" element={
            <PrivateRoute>
              <Payments />
            </PrivateRoute>
          } />
          <Route path="/wishlist" element={
            <PrivateRoute>
              <Wishlist />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/home" element={
            <AdminRoute>
              <AdminLayout>
                <AdminHomePage />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/slides" element={
            <AdminRoute>
              <AdminLayout>
                <AdminSlides />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/plans" element={
            <AdminRoute>
              <AdminLayout>
                <AdminPlans />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/transactions" element={
            <AdminRoute>
              <AdminLayout>
                <AdminTransactions />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/categories" element={
            <AdminRoute>
              <AdminLayout>
                <AdminCategories />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/pages" element={
            <AdminRoute>
              <AdminLayout>
                <AdminPages />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/contacts" element={
            <AdminRoute>
              <AdminLayout>
                <AdminContacts />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/contacts/:id" element={
            <AdminRoute>
              <AdminLayout>
                <AdminContactDetails />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/reports" element={
            <AdminRoute>
              <AdminLayout>
                <AdminReports />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/news" element={
            <AdminRoute>
              <AdminLayout>
                <AdminNews />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/currency" element={
            <AdminRoute>
              <AdminLayout>
                <AdminCurrency />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/splash" element={
            <AdminRoute>
              <AdminLayout>
                <AdminSplashMessages />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/notify" element={
            <AdminRoute>
              <AdminLayout>
                <AdminNotify />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/reviews" element={
            <AdminRoute>
              <AdminLayout>
                <AdminReviews />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/reviews/:id" element={
            <AdminRoute>
              <AdminLayout>
                <AdminReviewDetails />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/subscribers" element={
            <AdminRoute>
              <AdminLayout>
                <AdminSubscribers />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/countries" element={
            <AdminRoute>
              <AdminLayout>
                <AdminCountries />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/states" element={
            <AdminRoute>
              <AdminLayout>
                <AdminStates />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/cities" element={
            <AdminRoute>
              <AdminLayout>
                <AdminCities />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/products/create" element={
            <PrivateRoute>
              <CreateProduct />
            </PrivateRoute>
          } />
          <Route path="/products/edit/:id" element={
            <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
          } />
        </Routes>
    </Layout>
  );
}

export default App;
