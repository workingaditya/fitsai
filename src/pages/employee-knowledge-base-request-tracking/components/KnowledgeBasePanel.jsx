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
      <div className="p-6 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search for help articles, guides, or solutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        
        {/* Quick Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setViewMode('categories')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              viewMode === 'categories' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-secondary-hover'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setViewMode('search')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              viewMode === 'search' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-secondary-hover'
            }`}
          >
            All Articles
          </button>
          <button
            onClick={() => setViewMode('bookmarked')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              viewMode === 'bookmarked' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-secondary-hover'
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
              <h3 className="text-lg font-semibold text-foreground mb-3">Popular This Week</h3>
              <div className="space-y-2">
                {getPopularArticles()?.map(article => (
                  <div
                    key={article?.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{article?.title}</h4>
                        <p className="text-xs text-text-secondary">{article?.views} views • {article?.helpful}% helpful</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-secondary" />
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Categories */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Help Categories</h3>
              <div className="grid gap-4">
                {knowledgeCategories?.map(category => {
                  const Icon = category?.icon;
                  return (
                    <div
                      key={category?.id}
                      className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer bg-card"
                      onClick={() => {
                        setSelectedCategory(category?.id);
                        setViewMode('search');
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-primary text-primary-foreground`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{category?.name}</h4>
                            <p className="text-sm text-text-secondary">{category?.articles?.length} articles</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-secondary" />
                      </div>
                      
                      <div className="space-y-1">
                        {category?.articles?.slice(0, 3)?.map(article => (
                          <div key={article?.id} className="text-sm text-text-secondary hover:text-primary cursor-pointer">
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
              <h3 className="text-lg font-semibold text-foreground">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Articles'}
              </h3>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-text-secondary" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e?.target?.value)}
                  className="text-sm border border-border rounded px-3 py-1 focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
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
                  className="border border-border rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer bg-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground`}>
                          {article?.category}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {article?.views} views • {article?.helpful}% helpful
                        </span>
                      </div>
                      <h4 className="font-medium text-foreground mb-1">{article?.title}</h4>
                      <p className="text-sm text-text-secondary">
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
                            ? 'text-warning bg-warning/10' :'text-text-secondary hover:text-warning hover:bg-warning/10'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-text-secondary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles?.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No articles found</h4>
                <p className="text-text-secondary mb-4">
                  Try adjusting your search terms or browse by category
                </p>
                <button
                  onClick={onQuickAction}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Ask for help instead →
                </button>
              </div>
            )}
          </div>
        )}

        {viewMode === 'bookmarked' && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Saved Articles</h3>
            {bookmarkedArticles?.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No saved articles</h4>
                <p className="text-text-secondary">Bookmark articles to access them quickly later</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allArticles?.filter(article => bookmarkedArticles?.includes(article?.id))?.map(article => (
                  <div
                    key={article?.id}
                    className="border border-border rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer bg-card"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground`}>
                            {article?.category}
                          </span>
                        </div>
                        <h4 className="font-medium text-foreground mb-1">{article?.title}</h4>
                      </div>
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          onBookmarkArticle(article?.id);
                        }}
                        className="p-2 rounded-lg text-warning bg-warning/10 hover:bg-warning/20 transition-colors"
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