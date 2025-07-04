'use client';

import { useState } from 'react';
import { useStorage, useMutation, useSelf } from '@liveblocks/react';
import { LiveList } from '@liveblocks/client';

interface Comment {
  id: string;
  productId: string;
  text: string;
  author: string;
  createdAt: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface CommentSectionProps {
  productId: string;
}

export default function CommentSection({ productId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const self = useSelf();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allComments = useStorage((root) => root.comments) as LiveList<Record<string, any>> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comments = allComments ? allComments.filter((comment: Record<string, any>) => comment.productId === productId) : [];

  const addComment = useMutation(({ storage }, commentText: string) => {
    const commentsList = storage.get('comments');
    if (commentsList && commentsList.push) {
      const newComment: Comment = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId,
        text: commentText,
        author: self?.info?.name || 'Anonymous',
        createdAt: Date.now(),
      };
      commentsList.push(newComment);
    }
  }, []);

  const deleteComment = useMutation(({ storage }, commentId: string) => {
    const commentsList = storage.get('comments');
    if (commentsList) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const commentIndex = commentsList.findIndex((comment: Record<string, any>) => comment.id === commentId);
      if (commentIndex !== -1) {
        commentsList.delete(commentIndex);
      }
    }
  }, []);

  const handleAddComment = () => {
    const trimmed = newComment.trim();
    if (!trimmed || !allComments) return;

    addComment(trimmed);
    setNewComment('');
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!allComments) {
    return <div className="text-sm text-gray-500">Loading comments...</div>;
  }

  return (
    <div className="border-t border-gray-200 pt-3">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Comments</h4>
      
      {/* Comments List */}
      <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          comments.map((comment: Record<string, any>) => (
            <div key={comment.id} className="bg-gray-50 rounded p-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-xs font-medium text-blue-600">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-xs text-red-500 hover:text-red-700 ml-2"
                  title="Delete comment"
                >
                  🗑️
                </button>
              </div>
              <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          placeholder="Add a comment..."
          className="flex-1 text-xs p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  );
} 