'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

export default function MyCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchCourses();
    }
  }, [status]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      const approvedOrders = (Array.isArray(data) ? data : []).filter(o => o.status === 'approved');
      const uniqueCourses = [];
      const seen = new Set();
      approvedOrders.forEach(order => {
        order.items?.forEach(item => {
          if (item.product && !seen.has(item.product.id)) {
            seen.add(item.product.id);
            uniqueCourses.push(item.product);
          }
        });
      });
      setCourses(uniqueCourses);
    } catch (e) {
      console.error('Failed to fetch courses:', e);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />
        <div className="empty-state"><p>Loading...</p></div>
      </>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

      <div className="user-page">
        <h1>My Courses</h1>

        {courses.length === 0 ? (
          <div className="empty-state">
            <h3>No courses yet</h3>
            <p>Your approved courses will appear here</p>
          </div>
        ) : (
          courses.map(course => (
            <div className="course-access-card" key={course.id}>
              <div className="course-access-img" style={{ backgroundImage: `url(${course.imageUrl})` }}></div>
              <div className="course-access-info">
                <h3>{course.title}</h3>
              </div>
              {course.downloadUrl ? (
                <a href={course.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-download">Download</a>
              ) : (
                <span style={{ fontSize: '11px', color: '#999' }}>Link coming soon</span>
              )}
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
}
