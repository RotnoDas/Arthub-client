'use client';
import { apiFetch } from "@/lib/api";

import React, { useState, useEffect } from 'react';
import { Button, Avatar } from '@heroui/react';
import toast from 'react-hot-toast';
import { FaPaperPlane, FaLock, FaEdit, FaTrash, FaCheck, FaTimes, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';

const CommentSection = ({ artworkId, session, isPurchased }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Edit State
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/comments/${artworkId}`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.error("Failed to fetch comments", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [artworkId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !isPurchased) return;

        setIsSubmitting(true);
        try {
            const commentData = {
                userId: session.user.id || session.user.email,
                userEmail: session.user.email,
                userName: session.user.name || session.user.email.split('@')[0],
                avatar: session.user.image || `https://ui-avatars.com/api/?name=${session.user.name || session.user.email}&background=random`,
                comment: newComment
            };

            const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/artworks/${artworkId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData)
            });

            if (res.ok) {
                const postedComment = await res.json();
                setComments([{ ...commentData, _id: postedComment.insertedId, createdAt: new Date().toISOString() }, ...comments]);
                setNewComment('');
                toast.success('Comment posted successfully!');
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to post comment.');
            }
        } catch (error) {
            toast.error('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (commentId) => {
        setItemToDelete(commentId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/comments/${itemToDelete}`, { method: 'DELETE' });
            if (res.ok) {
                setComments(comments.filter(c => c._id !== itemToDelete));
                toast.success('Comment deleted.');
                setDeleteModalOpen(false);
            } else {
                toast.error('Failed to delete comment.');
            }
        } catch (error) {
            toast.error('An error occurred.');
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    const handleEditSave = async (commentId) => {
        if (!editContent.trim()) return;

        try {
            const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/comments/${commentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: editContent })
            });

            if (res.ok) {
                setComments(comments.map(c => c._id === commentId ? { ...c, comment: editContent } : c));
                setEditingId(null);
                toast.success('Comment updated.');
            } else {
                toast.error('Failed to update comment.');
            }
        } catch (error) {
            toast.error('An error occurred.');
        }
    };

    return (
        <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8 transition-colors duration-500">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                Discussion <span className="bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400 text-sm py-1 px-3 rounded-full">{comments.length}</span>
            </h3>

            {/* Comment Input */}
            <div className="mb-8 p-6 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm transition-colors duration-500">
                {!session ? (
                    <div className="text-center py-6">
                        <FaLock className="mx-auto text-indigo-300 dark:text-indigo-800 w-8 h-8 mb-3" />
                        <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Join the conversation</h4>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">You must log in to participate.</p>
                        <Link href="/login">
                            <Button className="bg-indigo-600 text-white font-bold px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all rounded-full">
                                Log In
                            </Button>
                        </Link>
                    </div>
                ) : !isPurchased ? (
                    <div className="text-center py-6">
                        <FaShieldAlt className="mx-auto text-amber-400 dark:text-amber-600 w-8 h-8 mb-3" />
                        <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Verified Buyers Only</h4>
                        <p className="text-slate-500 dark:text-slate-400">Only users who have purchased this artwork can leave a comment.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-4 items-start">
                        <Avatar src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name || session.user?.email}&background=random`} />
                        <div className="flex-1 space-y-2">
                            <textarea
                                placeholder="What do you think about this artwork?"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={2}
                                className="w-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-indigo-100 dark:border-indigo-900/50 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-2xl transition-all p-3 outline-none resize-y font-medium text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            />
                            <div className="flex justify-end">
                                <Button 
                                    type="submit" 
                                    isLoading={isSubmitting}
                                    isDisabled={!newComment.trim()}
                                    className="bg-indigo-600 text-white font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 hover:bg-indigo-700 transition-all px-6 py-2 h-10"
                                >
                                    {!isSubmitting && <FaPaperPlane className="mr-2 text-xs" />} Post Comment
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center text-indigo-400 dark:text-indigo-600 py-8 font-medium animate-pulse">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center text-slate-400 dark:text-slate-500 py-10 font-medium bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-500">
                        No comments yet. Be the first verified buyer to share your thoughts!
                    </div>
                ) : (
                    comments.map((c) => {
                        const isOwner = session?.user?.email && (c.userEmail === session.user.email || c.userId === session.user.email || c.userId === session.user.id);
                        
                        return (
                            <div key={c._id} className="flex gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                                <Avatar src={c.avatar} className="flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-white">{c.userName}</span>
                                            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                                {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        {isOwner && editingId !== c._id && (
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                <button onClick={() => { setEditingId(c._id); setEditContent(c.comment || c.text); }} className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                                                    <FaEdit size={14} />
                                                </button>
                                                <button onClick={() => handleDeleteClick(c._id)} className="text-slate-400 hover:text-red-600 transition-colors p-1">
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {editingId === c._id ? (
                                        <div className="mt-2 space-y-2">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                rows={2}
                                                className="w-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-indigo-200 dark:border-indigo-900/50 focus:border-indigo-500 rounded-xl p-3 outline-none text-sm"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="light" color="danger" onPress={() => setEditingId(null)}>
                                                    <FaTimes /> Cancel
                                                </Button>
                                                <Button size="sm" color="primary" onPress={() => handleEditSave(c._id)}>
                                                    <FaCheck /> Save
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap text-sm">{c.comment || c.text}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {deleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
                        <h3 className="text-xl font-bold text-red-600 dark:text-red-500 mb-2">Delete Comment</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">
                            Are you sure you want to permanently delete this comment? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20 transition-colors disabled:opacity-50">
                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
