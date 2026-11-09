import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Clock, User } from 'lucide-react';
import { publicApi } from '../services/api';
import type { BlogPost } from '../types';
import { resolveImageUrl, handleImageFallback } from '../utils/mediaResolver';
import { useLanguage } from '../contexts/LanguageContext';

export const BlogsPage: React.FC = () => {
  const { t, localizeBlog } = useLanguage();
  const [rawBlogs, setRawBlogs] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getBlogs().then((data) => {
      setRawBlogs(data);
      setLoading(false);
    });
  }, []);

  const blogs = (rawBlogs || []).map((b) => localizeBlog(b));

  const categories = ['all', ...Array.from(new Set(blogs.map(b => b.category)))];

  const filteredBlogs = selectedCategory === 'all'
    ? blogs
    : blogs.filter(b => b.category === selectedCategory);

  return (
    <div className="bg-paper min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest font-semibold">
            <FileText className="w-4 h-4" />
            <span>{t('blogsPage.eyebrow')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest leading-tight">
            {t('blogsPage.title')}
          </h1>
          <p className="text-base text-charcoal/80 font-normal leading-relaxed">
            {t('blogsPage.desc')}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-paper-border pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors border ${
                selectedCategory === cat
                  ? 'bg-forest text-paper border-forest font-semibold'
                  : 'bg-paper-warm text-charcoal border-paper-border hover:border-brass'
              }`}
            >
              {cat === 'all' ? t('blogsPage.allPosts') : cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-paper-warm border border-paper-border corner-frame overflow-hidden p-0 space-y-4 shadow-sm">
                <div className="aspect-[16/10] heritage-shimmer" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-28 heritage-shimmer" />
                  <div className="h-6 w-3/4 heritage-shimmer" />
                  <div className="h-3 w-full heritage-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="bg-paper-warm border border-paper-border hover:border-brass transition-all corner-frame overflow-hidden flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-forest">
                    <img
                      src={resolveImageUrl(blog.coverImage)}
                      alt={blog.title}
                      onError={(e) => handleImageFallback(e)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-muted">
                      <span className="text-brass font-semibold uppercase">{blog.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{blog.readTime}</span>
                      </span>
                    </div>

                    <h2 className="font-serif text-xl font-bold text-forest group-hover:text-brass transition-colors leading-snug">
                      <Link to={`/blogs/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-charcoal/80 font-normal line-clamp-3 leading-6">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 mt-auto border-t border-brass/20 flex items-center justify-between text-xs font-mono text-charcoal-muted">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-brass" />
                      <span>{blog.author}</span>
                    </span>

                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-brass font-bold hover:underline"
                    >
                      <span>{t('blogsPage.readMore')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
