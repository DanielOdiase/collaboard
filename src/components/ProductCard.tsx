'use client';

import { useState, useRef } from 'react';
import { useStorage, useMutation, useUpdateMyPresence, useOthers } from '@liveblocks/react';
import { LiveList } from '@liveblocks/client';
import CommentSection from './CommentSection';

interface Product {
  id: string;
  name: string;
  description: string;
  status: 'idea' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

interface Comment {
  [key: string]: unknown;
  id: string;
  productId: string;
  text: string;
  author: string;
  createdAt: number;
}

interface HighlightComment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
}

interface Highlight {
  [key: string]: unknown;
  id: string;
  productId: string;
  start: number;
  end: number;
  text: string;
  comments: HighlightComment[];
}

interface ProductCardProps {
  product: Product;
  onStatusChange: (productId: string, newStatus: Product['status']) => void;
}

export default function ProductCard({ product, onStatusChange }: ProductCardProps) {
  const [showComments, setShowComments] = useState(false);
  const comments = useStorage((root) =>
    (root.comments?.filter((comment: Comment) => comment.productId === product.id)) ?? []
  ) as Comment[];

  // Inline highlight state
  const allHighlightsRaw = useStorage((root) => root.highlights) as unknown as Highlight[] | null;
  const highlights: Highlight[] = allHighlightsRaw
    ? allHighlightsRaw.filter((h) => h.productId === product.id)
    : [];
  const addHighlight = useMutation(({ storage }, highlight: Highlight) => {
    const highlightsList = storage.get('highlights');
    if (highlightsList && highlightsList.push) {
      highlightsList.push(highlight);
    }
  }, []);
  const [selection, setSelection] = useState<{start: number, end: number, text: string} | null>(null);
  const [showHighlightInput, setShowHighlightInput] = useState(false);
  const [highlightComment, setHighlightComment] = useState('');
  const descRef = useRef<HTMLDivElement>(null);
  const [hoveredHighlightId, setHoveredHighlightId] = useState<string | null>(null);
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusOptions: Product['status'][] = ['idea', 'in-progress', 'completed'];

  const updateProduct = useMutation(({ storage }, updatedProduct: Product) => {
    const productsList = storage.get('products');
    if (productsList) {
      const productIndex = productsList.findIndex((p: Product) => p.id === updatedProduct.id);
      if (productIndex !== -1) {
        productsList.set(productIndex, updatedProduct);
      }
    }
  }, []);

  // Delete a comment from a highlight
  const deleteComment = useMutation(({ storage }, highlightId: string, commentId: string) => {
    const highlightsList = storage.get('highlights');
    if (highlightsList) {
      const idx = highlightsList.findIndex((h: Highlight) => h.id === highlightId);
      if (idx !== -1) {
        const highlight = highlightsList.get(idx);
        if (highlight) {
          const newComments = highlight.comments.filter((c: HighlightComment) => c.id !== commentId);
          if (newComments.length === 0) {
            highlightsList.delete(idx); // Remove highlight if no comments left
          } else {
            highlightsList.set(idx, { ...highlight, comments: newComments });
          }
        }
      }
    }
  }, []);

  // Edit mode state for product card
  const [editMode, setEditMode] = useState(false);
  const [editProduct, setEditProduct] = useState({ ...product });
  const handleEditChange = (field: keyof Product, value: string | number | Product['status'] | Product['priority']) => {
    setEditProduct((prev) => ({ ...prev, [field]: value }));
  };
  const handleSaveEdit = () => {
    updateProduct(editProduct);
    setEditMode(false);
  };
  const handleCancelEdit = () => {
    setEditProduct({ ...product });
    setEditMode(false);
  };

  // Handle text selection in description
  const handleMouseUp = () => {
    const selectionObj = window.getSelection();
    if (!selectionObj || !descRef.current) return;
    const selectedText = selectionObj.toString();
    if (!selectedText) {
      setSelection(null);
      setShowHighlightInput(false);
      updateMyPresence({ previewHighlight: null });
      return;
    }
    // Find start/end relative to description text
    const descText = descRef.current.innerText;
    const start = descText.indexOf(selectedText);
    if (start !== -1) {
      setSelection({ start, end: start + selectedText.length, text: selectedText });
      setShowHighlightInput(true);
      updateMyPresence({ previewHighlight: { productId: product.id, start, end: start + selectedText.length, text: selectedText } });
    }
  };

  // Add highlight with comment
  const handleAddHighlight = () => {
    if (!selection || !highlightComment.trim()) return;
    const highlightId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const commentId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    addHighlight({
      id: highlightId,
      productId: product.id,
      start: selection.start,
      end: selection.end,
      text: selection.text,
      comments: [{
        id: commentId,
        author: 'Anonymous',
        text: highlightComment,
        createdAt: Date.now(),
      }],
    });
    setSelection(null);
    setHighlightComment('');
    setShowHighlightInput(false);
    updateMyPresence({ isTyping: false, previewHighlight: null });
  };

  // Set isTyping presence when typing a comment
  const handleHighlightCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHighlightComment(e.target.value);
    updateMyPresence({ isTyping: !!e.target.value });
  };

  // Render description with highlights and live preview highlights
  function renderDescriptionWithHighlights() {
    const allHighlights = highlights
      ? highlights.filter((h: Highlight) => h.productId === product.id)
      : [];
    // Add live preview highlights from others
    others.forEach((user) => {
      const preview = user.presence?.previewHighlight;
      if (
        preview &&
        typeof preview === 'object' &&
        preview !== null &&
        'productId' in preview &&
        preview.productId === product.id
      ) {
        allHighlights.push({
          ...preview,
          id: 'preview-' + user.connectionId,
          isPreview: true,
          author: user.info?.name || `Anon${user.connectionId}`,
        });
      }
    });
    if (allHighlights.length === 0) return product.description;
    // Sort highlights by start
    const sorted = allHighlights.sort((a: Highlight, b: Highlight) => a.start - b.start);
    const parts = [];
    let lastIdx = 0;
    for (const h of sorted) {
      if (lastIdx < h.start) {
        parts.push(product.description.slice(lastIdx, h.start));
      }
      parts.push(
        <span
          key={h.id}
          className={`rounded px-1 relative ${h.isPreview ? 'bg-yellow-100 opacity-60' : 'bg-yellow-200 cursor-pointer'}`}
          onMouseEnter={() => !h.isPreview && setHoveredHighlightId(h.id)}
          onMouseLeave={() => !h.isPreview && setHoveredHighlightId(null)}
        >
          {product.description.slice(h.start, h.end)}
          {h.isPreview && (
            <span className="absolute left-1/2 -translate-x-1/2 mt-6 px-2 py-1 bg-gray-800 text-white text-xs rounded pointer-events-none whitespace-nowrap z-20">
              {h.author} is highlighting
            </span>
          )}
          {hoveredHighlightId === h.id && !h.isPreview && (
            <div className="absolute z-10 left-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg text-xs min-w-[180px] max-w-xs">
              <div className="font-semibold mb-1">Comments</div>
              {h.comments && h.comments.length > 0 ? (
                h.comments.map((c: { id: string; author: string; text: string; createdAt: number }) => (
                  <div key={c.id} className="mb-1">
                    <span className="font-bold text-blue-700">{c.author}:</span> {c.text}
                  </div>
                ))
              ) : (
                <div className="text-blue-600 italic">No comments</div>
              )}
            </div>
          )}
        </span>
      );
      lastIdx = h.end;
    }
    if (lastIdx < product.description.length) {
      parts.push(product.description.slice(lastIdx));
    }
    return parts;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          {editMode ? (
            <input
                              className="font-semibold text-black text-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-white"
              value={editProduct.name}
              onChange={e => handleEditChange('name', e.target.value)}
              autoFocus
            />
          ) : (
                            <h3 className="font-semibold text-black">{product.name}</h3>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[product.priority]}`}>
            {product.priority}
          </span>
          <button
                            className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
            onClick={() => setEditMode((v) => !v)}
            title="Edit card"
          >
            ✏️
          </button>
        </div>
        
        {editMode ? (
          <textarea
                            className="text-sm text-black mb-3 w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
            value={editProduct.description}
            onChange={e => handleEditChange('description', e.target.value)}
            rows={3}
          />
        ) : (
          <div
            ref={descRef}
                            className="text-sm text-black mb-3 select-text"
            onMouseUp={handleMouseUp}
            style={{ whiteSpace: 'pre-line' }}
          >
            {renderDescriptionWithHighlights()}
          </div>
        )}
        {editMode && (
          <div className="flex gap-2 mb-3">
            <select
              value={editProduct.status}
              onChange={e => handleEditChange('status', e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option value="idea">💡 Idea</option>
              <option value="in-progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
            <select
              value={editProduct.priority}
              onChange={e => handleEditChange('priority', e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
                              className="px-3 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 text-xs"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Highlight Input */}
        {showHighlightInput && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div className="text-xs text-black mb-1 font-medium">
              Highlighted: &quot;{selection?.text}&quot;
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={highlightComment}
                onChange={handleHighlightCommentChange}
                placeholder="Add a comment to this highlight..."
                className="flex-1 text-xs p-2 border border-gray-300 rounded text-black"
                autoFocus
              />
              <button
                onClick={handleAddHighlight}
                disabled={!highlightComment.trim()}
                className="px-3 py-2 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setSelection(null);
                  setShowHighlightInput(false);
                  updateMyPresence({ previewHighlight: null });
                }}
                className="px-3 py-2 text-xs bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <select
            value={product.status}
            onChange={(e) => onStatusChange(product.id, e.target.value as Product['status'])}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-black"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status} className="text-black">
                {status === 'idea' ? '💡 Idea' : 
                 status === 'in-progress' ? '🔄 In Progress' : '✅ Completed'}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showComments ? 'Hide Comments' : `Comments (${comments.length})`}
          </button>
        </div>

        {showComments && (
          <CommentSection productId={product.id} />
        )}

        {/* Highlights & Comments Section */}
        {highlights && highlights.length > 0 && (
          <div className="mt-3">
            <div className="font-semibold text-xs text-blue-800 mb-1">Highlights & Comments:</div>
            <ul className="space-y-1">
              {highlights.map((h: Highlight) => (
                <li key={h.id} className="text-xs text-black">
                  <span className="bg-yellow-200 rounded px-1 mr-2 text-black">{h.text}</span>
                  {h.comments && h.comments.length > 0 ? (
                    h.comments.map((c: { id: string; author: string; text: string; createdAt: number }) => (
                      <span key={c.id} className="mr-2">
                        <span className="font-bold text-blue-700">{c.author}:</span> {c.text}
                        <button
                          className="ml-1 text-red-500 hover:text-red-700 text-xs"
                          title="Delete comment"
                          onClick={() => deleteComment(h.id, c.id)}
                        >
                          🗑️
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-blue-600 italic">No comments</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 