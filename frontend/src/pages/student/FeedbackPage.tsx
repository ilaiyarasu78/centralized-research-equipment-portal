import React, { useState } from 'react';
import { MessageSquare, Star, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const FeedbackPage: React.FC = () => {
  const [module, setModule] = useState('Tools/Equipment Access');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/feedback', { module, rating, comments });
      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (e) {
      alert('Failed to submit feedback');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[800px] mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          Campus Portal Feedback
        </h1>
        <p className="text-xs text-gray-400">Share your experience to help us improve lab facilities and equipment scheduling</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border-purple-500/30">
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-gray-400">Your review helps our IT and lab administration enhance student facilities.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
            >
              Submit Another Review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Target Module / Service</label>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="w-full px-3 py-2 bg-[#121828] border border-white/10 rounded-xl text-xs text-white"
              >
                <option value="Tools/Equipment Access">Tools / Equipment Access</option>
                <option value="Lab Facilities">Lab Facilities</option>
                <option value="Issue Reporting System">Issue Reporting System</option>
                <option value="3D Campus Map">3D Campus Map</option>
                <option value="Overall Platform UI">Overall Platform UI</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-bold text-amber-400">{rating} / 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Comments & Suggestions</label>
              <textarea
                rows={4}
                placeholder="What did you like? What can be improved?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
