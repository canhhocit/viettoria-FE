import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import { publicApi } from '../services/api';
import type { BlogPost } from '../types';
import { PageLoadingHeritage } from '../components/common/HeritageSkeleton';
import { resolveImageUrl, handleImageFallback } from '../utils/mediaResolver';
import { useLanguage } from '../contexts/LanguageContext';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, localizeBlog } = useLanguage();
  const [rawBlog, setRawBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      publicApi.getBlogBySlug(slug, language).then((data) => {
        setRawBlog(data);
        setLoading(false);
      });
    }
  }, [slug, language]);

  const blog = rawBlog ? localizeBlog(rawBlog) : null;

  if (loading) {
    return <PageLoadingHeritage message={t('blogsPage.loadingDetail')} />;
  }

  if (!blog) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-paper text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-forest mb-2">{t('blogsPage.notFoundTitle')}</h2>
        <p className="text-sm text-charcoal-muted mb-6">{t('blogsPage.notFoundDesc')}</p>
        <Link to="/blogs" className="px-5 py-2.5 bg-forest text-paper font-mono text-xs uppercase tracking-wider">
          {t('blogsPage.backToBlogs')}
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-paper min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-charcoal-muted hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('blogsPage.allBlogs')}</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-4">
          <span className="inline-block px-3 py-1 bg-brass text-forest text-xs font-mono uppercase tracking-widest font-bold">
            {blog.category}
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-forest leading-[1.2]">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono text-charcoal-muted pt-2 border-y border-paper-border py-3">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brass" />
              <span>{blog.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brass" />
              <span>{blog.publishedAt}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brass" />
              <span>{blog.readTime}</span>
            </span>
          </div>
        </header>

        {/* Cover Image */}
        <div className="aspect-[16/9] overflow-hidden bg-forest border border-brass/30 corner-frame shadow-xl">
          <img
            src={resolveImageUrl(blog.coverImage)}
            alt={blog.title}
            onError={(e) => handleImageFallback(e)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Excerpt Pull Quote */}
        <div className="p-6 bg-paper-warm border-l-2 border-brass italic font-serif text-lg text-charcoal/90 leading-relaxed">
          "{blog.excerpt}"
        </div>

        {/* Article Body Content */}
        <div className="prose prose-lg mx-auto max-w-3xl text-ink leading-relaxed font-normal space-y-5 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-forest first-letter:float-left first-letter:mr-3 first-letter:leading-none">
          {blog.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-base sm:text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer & Attribution */}
        <footer className="pt-8 border-t border-paper-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs font-mono text-charcoal-muted">
            {t('blogsPage.inCategory')} <span className="text-forest font-semibold">{blog.category}</span>
          </div>

          <Link
            to="/blogs"
            className="px-5 py-2.5 bg-forest text-paper hover:bg-brass transition-colors font-mono text-xs uppercase tracking-wider font-semibold"
          >
            {t('blogsPage.readMoreOther')}
          </Link>
        </footer>
      </div>
    </article>
  );
};

export default BlogDetailPage;
