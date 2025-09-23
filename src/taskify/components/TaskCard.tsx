import React, { useState } from 'react';
import type { Task } from '../types';
import { useApp } from '../context/AppContext';
import { MessageSquare, User as UserIcon, X, Edit2, Trash2, Send } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  projectId: string;
  isMyTask: boolean;
  onClose: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, projectId, onClose }) => {
  const { users, currentUser, updateTaskAssignee, addComment, editComment, deleteComment } = useApp();
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');


  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTaskAssignee(projectId, task.id, e.target.value);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(projectId, task.id, newComment.trim());
      setNewComment('');
    }
  };

  const handleStartEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const handleSaveEdit = () => {
    if (editingContent.trim() && editingCommentId) {
      editComment(projectId, task.id, editingCommentId, editingContent.trim());
      setEditingCommentId(null);
      setEditingContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment(projectId, task.id, commentId);
    }
  };

  const getCommentAuthor = (authorId: string) => {
    return users.find(u => u.id === authorId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <p className="text-gray-600">{task.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              {task.status}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
            <select
              value={task.assigneeId || ''}
              onChange={handleAssigneeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Comments ({task.comments.length})
            </h3>

            <div className="space-y-3 mb-4">
              {task.comments.map(comment => {
                const author = getCommentAuthor(comment.authorId);
                const isMyComment = comment.authorId === currentUser?.id;

                return (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-800">{author?.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {isMyComment && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleStartEdit(comment.id, comment.content)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows={2}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};