'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';

export default function LiveSearch({ 
  placeholder = "Search...", 
  inputClass = "", 
  buttonClass = "", 
  containerClass = "",
  onSearchSubmit = null,
  initialValue = ""
}) {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            // Show top 5 matches
            setResults(data.slice(0, 5));
          } else {
            setResults([]);
          }
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 250); // Debounce search request to save DB queries

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  const triggerSearch = () => {
    setShowDropdown(false);
    if (onSearchSubmit) {
      onSearchSubmit(query);
    } else {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
    }
  };

  const handleSelectProduct = (slug) => {
    setShowDropdown(false);
    router.push(`/product/${slug}`);
  };

  return (
    <div ref={containerRef} className={containerClass} style={{ position: 'relative', display: 'flex', width: '100%' }}>
      <input
        type="text"
        className={inputClass}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onKeyPress={handleKeyPress}
        style={{ width: '100%' }}
      />
      
      {buttonClass && (
        <button className={buttonClass} onClick={triggerSearch} type="button">
          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: '#555', display: 'block' }}>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      )}

      {/* Suggestions Dropdown */}
      {showDropdown && query.trim() && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          border: '1px solid #cbd5e1',
          marginTop: '6px',
          zIndex: 9999,
          maxHeight: '320px',
          overflowY: 'auto'
        }}>
          {loading && (
            <div style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              Searching...
            </div>
          )}
          
          {!loading && results.length === 0 && (
            <div style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              No courses found
            </div>
          )}

          {!loading && results.length > 0 && (
            <div style={{ padding: '6px 0' }}>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    style={{
                      width: '45px',
                      height: '35px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #e2e8f0',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {product.title}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#e98126', marginTop: '2px' }}>
                      {formatPrice(product.newPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
