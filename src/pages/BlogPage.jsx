import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowLeft, ChevronRight } from 'lucide-react';
import { getBlogBySlug } from '../services/blogService';
import { motion } from 'framer-motion';

const BlogPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogBySlug(slug);
        setBlog(data.blog);
        setRelatedBlogs(data.relatedBlogs);
      } catch (err) {
        setError('Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-error text-lg mb-4">{error || 'Blog not found'}</p>
        <Link to="/" className="text-primary-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <img 
          src={blog.images[0]} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Blog Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <Link to="/blogs" className="inline-flex items-center text-gray-600 hover:text-primary-500 mb-4">
              <ArrowLeft size={16} className="mr-1" />
              Back to Blogs
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center">
                <User size={18} className="mr-1" />
                {blog.author.name}
              </div>
              <div className="flex items-center">
                <Calendar size={18} className="mr-1" />
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <Eye size={18} className="mr-1" />
                {blog.views} views
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">{blog.description}</p>
          </div>

          {/* Blog Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <div className="prose max-w-none">
              {blog.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {blog.images.length > 1 && (
              <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blog.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${blog.title} - image ${index + 2}`}
                      className="rounded-lg w-full h-64 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog._id}
                    to={`/blog/${relatedBlog.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-md">
                      <img
                        src={relatedBlog.images[0]}
                        alt={relatedBlog.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">
                          {relatedBlog.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Calendar size={14} className="mr-1" />
                          {new Date(relatedBlog.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;