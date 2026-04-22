import React from 'react';

export default function PhotoView({ photo, onClose }) {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative max-w-4xl w-full max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-800 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="bg-white rounded-lg shadow-xl p-4">
          <div className="mb-4">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{photo.title || '未命名'}</h2>
            <p className="text-gray-600 mt-2">{photo.description || '无描述'}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>{new Date(photo.date).toLocaleDateString()}</span>
              {photo.category && (
                <span className="ml-4 bg-gray-100 px-2 py-1 rounded">{photo.category}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
