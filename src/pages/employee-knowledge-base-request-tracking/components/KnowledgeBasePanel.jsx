import React, { useState } from 'react';
import { Search, BookOpen, Bookmark, ChevronRight, Filter, TrendingUp } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const KnowledgeBasePanel = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  knowledgeCategories, 
  bookmarkedArticles, 
  onBookmarkArticle, 
  onQuickAction 
}) => {
  const [viewMode, setViewMode] = useState('categories'); // 'categories', 'search', 'bookmarked'

  const allArticles = knowledgeCategories?.flatMap(cat => 
    cat?.articles?.map(article => ({
      ...article,
      category: cat?.name,
      categoryId: cat?.id,
      categoryColor: cat?.color
    }))
  );

  const filteredArticles = allArticles?.filter(article => {
    const matchesSearch = article?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase() || '');
    const matchesCategory = selectedCategory === 'all' || article?.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPopularArticles = () => {
    return allArticles?.sort((a, b) => b?.views - a?.views)?.slice(0, 5);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for help articles, guides, or solutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Quick Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setViewMode('categories')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              viewMode === 'categories' ?'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setViewMode('search')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              viewMode === 'search' ?'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Articles
          </button>
          <button
            onClick={() => setViewMode('bookmarked')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              viewMode === 'bookmarked' ?'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bookmark className="w-4 h-4 inline mr-1" />
            Saved ({bookmarkedArticles?.length || 0})
          </button>
        </div>
      </div>
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'categories' && !searchQuery && (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular This Week</h3>
              <div className="space-y-2">
                {getPopularArticles()?.map(article => (
                  <div
                    key={article?.id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{article?.title}</h4>
                        <p className="text-xs text-gray-600">{article?.views} views • {article?.helpful}% helpful</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Help Categories</h3>
              <div className="grid gap-4">
                {knowledgeCategories?.map(category => {
                  const Icon = category?.icon;
                  return (
                    <div
                      key={category?.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(category?.id);
                        setViewMode('search');
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${category?.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{category?.name}</h4>
                            <p className="text-sm text-gray-600">{category?.articles?.length} articles</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      
                      <div className="space-y-1">
                        {category?.articles?.slice(0, 3)?.map(article => (
                          <div key={article?.id} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                            • {article?.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {(viewMode === 'search' || searchQuery) && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Articles'}
              </h3>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e?.target?.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {knowledgeCategories?.map(cat => (
                    <option key={cat?.id} value={cat?.id}>{cat?.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredArticles?.map(article => (
                <div
                  key={article?.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${article?.categoryColor}`}>
                          {article?.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {article?.views} views • {article?.helpful}% helpful
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{article?.title}</h4>
                      <p className="text-sm text-gray-600">
                        Step-by-step guide with screenshots and troubleshooting tips
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          onBookmarkArticle(article?.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          bookmarkedArticles?.includes(article?.id)
                            ? 'text-yellow-600 bg-yellow-100' :'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles?.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No articles found</h4>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or browse by category
                </p>
                <button
                  onClick={onQuickAction}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ask for help instead →
                </button>
              </div>
            )}
          </div>
        )}

        {viewMode === 'bookmarked' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Articles</h3>
            {bookmarkedArticles?.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No saved articles</h4>
                <p className="text-gray-600">Bookmark articles to access them quickly later</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allArticles?.filter(article => bookmarkedArticles?.includes(article?.id))?.map(article => (
                  <div
                    key={article?.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${article?.categoryColor}`}>
                            {article?.category}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{article?.title}</h4>
                      </div>
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          onBookmarkArticle(article?.id);
                        }}
                        className="p-2 rounded-lg text-yellow-600 bg-yellow-100 hover:bg-yellow-200 transition-colors"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBasePanel;