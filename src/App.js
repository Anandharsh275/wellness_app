import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, RefreshCw, Bookmark, BookmarkCheck, ArrowLeft, ChevronRight, Activity, Apple, Brain, Dumbbell, Moon } from 'lucide-react';

const WellnessApp = () => {
  const [screen, setScreen] = useState('profile');
  const [profile, setProfile] = useState({ age: '', gender: '', goal: '' });
  const [tips, setTips] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [savedTips, setSavedTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const goals = [
    { id: 'weight', label: 'Weight Management', icon: Activity },
    { id: 'nutrition', label: 'Better Nutrition', icon: Apple },
    { id: 'mental', label: 'Mental Wellness', icon: Brain },
    { id: 'fitness', label: 'Build Fitness', icon: Dumbbell },
    { id: 'sleep', label: 'Improve Sleep', icon: Moon }
  ];

  const tipIcons = {
    0: Activity,
    1: Apple,
    2: Brain,
    3: Dumbbell,
    4: Moon
  };

  useEffect(() => {
    const stored = localStorage.getItem('savedTips');
    if (stored) {
      setSavedTips(JSON.parse(stored));
    }
  }, []);

  const generateTips = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate 5 concise wellness tips for a ${profile.age}-year-old ${profile.gender} focused on ${goals.find(g => g.id === profile.goal)?.label}. 
            
Return ONLY valid JSON (no preamble, no markdown) in this exact format:
[
  {"title": "Tip Title", "preview": "One sentence preview"},
  ...5 tips total
]

Make titles action-oriented and previews engaging.`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text.replace(/```json|```/g, '').trim();
      const parsedTips = JSON.parse(text);
      setTips(parsedTips);
      setScreen('tips');
    } catch (err) {
      console.error('Error generating tips:', err);
      setTips([
        { title: "Start with Morning Hydration", preview: "Drink water within 30 minutes of waking to boost metabolism" },
        { title: "Practice Mindful Eating", preview: "Slow down and savor each bite to improve digestion" },
        { title: "Move Every Hour", preview: "Set reminders for brief movement breaks throughout the day" },
        { title: "Create a Sleep Sanctuary", preview: "Optimize your bedroom environment for better rest" },
        { title: "Build a Gratitude Practice", preview: "Journal three things you're grateful for each evening" }
      ]);
      setScreen('tips');
    }
    setLoading(false);
  };

  const generateDetail = async (tip, index) => {
    setSelectedTip({ ...tip, index });
    setDetailLoading(true);
    setScreen('detail');

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Expand on this wellness tip: "${tip.title}" - ${tip.preview}

Return ONLY valid JSON (no preamble, no markdown):
{
  "explanation": "2-3 sentence explanation of why this matters",
  "steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]
}

Make steps specific and actionable.`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text.replace(/```json|```/g, '').trim();
      const detail = JSON.parse(text);
      setSelectedTip({ ...tip, index, ...detail });
    } catch (err) {
      console.error('Error generating detail:', err);
      setSelectedTip({
        ...tip,
        index,
        explanation: "This wellness practice can significantly improve your health and wellbeing when incorporated consistently into your daily routine.",
        steps: [
          "Start small and build the habit gradually",
          "Set a specific time each day for this practice",
          "Track your progress in a journal or app",
          "Adjust based on how your body responds",
          "Celebrate small wins along the way"
        ]
      });
    }
    setDetailLoading(false);
  };

  const toggleSave = (tip) => {
    const isSaved = savedTips.some(t => t.title === tip.title);
    let newSaved;
    if (isSaved) {
      newSaved = savedTips.filter(t => t.title !== tip.title);
    } else {
      newSaved = [...savedTips, tip];
    }
    setSavedTips(newSaved);
    localStorage.setItem('savedTips', JSON.stringify(newSaved));
  };

  const isSaved = (tip) => savedTips.some(t => t.title === tip.title);

  if (screen === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-md mx-auto pt-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Wellness Guide</h1>
            <p className="text-gray-600">Get personalized health recommendations powered by AI</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Wellness Goal</label>
              <div className="grid grid-cols-1 gap-2">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setProfile({ ...profile, goal: goal.id })}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        profile.goal === goal.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${profile.goal === goal.id ? 'text-purple-500' : 'text-gray-400'}`} />
                      <span className={`font-medium ${profile.goal === goal.id ? 'text-purple-700' : 'text-gray-700'}`}>
                        {goal.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={generateTips}
              disabled={!profile.age || !profile.gender || !profile.goal || loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Tips
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'tips') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setScreen('profile')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={generateTips}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Wellness Tips</h2>
            <p className="text-gray-600">Personalized recommendations for {goals.find(g => g.id === profile.goal)?.label}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((tip, index) => {
              const Icon = tipIcons[index] || Activity;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => generateDetail(tip, index)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(tip);
                        }}
                        className="text-gray-400 hover:text-purple-500 transition-colors"
                      >
                        {isSaved(tip) ? (
                          <BookmarkCheck className="w-5 h-5 text-purple-500 fill-current" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{tip.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{tip.preview}</p>
                    <div className="flex items-center text-purple-500 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Learn more</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {savedTips.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookmarkCheck className="w-6 h-6 text-purple-500" />
                Saved Tips ({savedTips.length})
              </h3>
              <div className="space-y-2">
                {savedTips.map((tip, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700 font-medium">{tip.title}</span>
                    <button
                      onClick={() => toggleSave(tip)}
                      className="text-purple-500 hover:text-purple-700"
                    >
                      <BookmarkCheck className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'detail') {
    const Icon = selectedTip ? tipIcons[selectedTip.index] : Activity;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-3xl mx-auto pt-8">
          <button
            onClick={() => setScreen('tips')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tips
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedTip?.title}</h2>
                    <p className="text-blue-100">{selectedTip?.preview}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSave(selectedTip)}
                  className="text-white hover:scale-110 transition-transform"
                >
                  {isSaved(selectedTip) ? (
                    <BookmarkCheck className="w-6 h-6 fill-current" />
                  ) : (
                    <Bookmark className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-8">
              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Why This Matters</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedTip?.explanation}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Step-by-Step Guide</h3>
                    <div className="space-y-4">
                      {selectedTip?.steps?.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-gray-700">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WellnessApp;