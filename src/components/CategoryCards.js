'use client';
import { useRouter } from 'next/navigation';

export default function CategoryCards() {
  const router = useRouter();

  const categories = [
    { name: 'STOCK Market', slug: 'stock-market', image: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=800&q=80' },
    { name: 'Forex Courses', slug: 'forex-courses', image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Digital MARKETING', slug: 'digital-marketings', image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="content">
      {categories.map((cat, index) => (
        <div key={index} className="course-card" style={{ backgroundImage: `url('${cat.image}')` }}>
          <h2>{cat.name}</h2>
          <button className="btn-purchase" onClick={() => router.push(`/shop?category=${cat.slug}`)}>Purchase Now</button>
        </div>
      ))}
    </div>
  );
}
