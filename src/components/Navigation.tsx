'use client';

interface NavigationProps {
  activeView: 'notes' | 'products';
  onViewChange: (view: 'notes' | 'products') => void;
}

export default function Navigation({ activeView, onViewChange }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              <button
                onClick={() => onViewChange('notes')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeView === 'notes'
                    ? 'border-blue-500 text-black'
                    : 'border-transparent text-blue-600 hover:text-blue-800 hover:border-blue-300'
                }`}
              >
                📝 Notes Board
              </button>
              <button
                onClick={() => onViewChange('products')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeView === 'products'
                    ? 'border-blue-500 text-black'
                    : 'border-transparent text-blue-600 hover:text-blue-800 hover:border-blue-300'
                }`}
              >
                🚀 Product Board
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 