import React, { useEffect, useState } from 'react';
import LivePreview from './BlockPreview';
import { getCustomPalette } from './blockTypes';

const PagePublicView = ({ id }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/lead-magnets/${id}`);
        const result = await res.json();
        if (result.success) {
          setData(result.leadMagnet.data);
        } else {
          setError('Página no encontrada');
        }
      } catch (err) {
        setError('Error al cargar la página');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
      <div>
        <h1 className="text-4xl font-black text-slate-200 mb-4">404</h1>
        <p className="text-slate-600 font-medium">{error}</p>
        <a href="/" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">Volver al inicio</a>
      </div>
    </div>
  );

  const { blocks, palette, customHex, author } = data;
  const resolvedPalette = palette === 'custom' ? getCustomPalette(customHex) : null;

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center py-0 sm:py-8">
      <div className="w-full max-w-[850px] shadow-2xl">
        <LivePreview 
          blocks={blocks} 
          palette={palette} 
          resolvedPalette={resolvedPalette} 
          author={author} 
        />
      </div>
    </div>
  );
};

export default PagePublicView;
