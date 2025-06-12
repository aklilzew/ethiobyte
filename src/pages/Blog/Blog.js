import React, { useState, useEffect, useCallback } from "react";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import { FiLoader, FiAlertCircle } from "react-icons/fi";
import { format } from "date-fns";
import api from "../../api/api"; // Adjust if needed

import parse from "html-react-parser";
import DOMPurify from "dompurify";

import heroBgImage from "../../image/fabe2.png"; // Add your image path here

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPostId, setExpandedPostId] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.posts.getAll();
      const fetchedPosts = Array.isArray(response.data) ? response.data : [];

      const formattedPosts = fetchedPosts.map((post) => ({
        id: post.id,
        title: post.title || "Untitled Post",
        slug: post.slug,
        rawContent: post.content, // Store the raw HTML content
        status: post.status,
        date: post.created_at ? format(new Date(post.created_at), "PP") : "N/A",
        author: post.author || "Admin",
      }));

      setPosts(formattedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch posts.";
      setError(errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleExpanded = (id) => {
    setExpandedPostId((prevId) => (prevId === id ? null : id));
  };

  // Helper function to get plain text from HTML for length check and truncation
  const getPlainTextFromHtml = (htmlString) => {
    if (!htmlString) return "";
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-10 bg-gray-50">
        <FiLoader className="animate-spin text-5xl text-orange-600 mb-4" />
        <p className="text-xl text-gray-700">Loading News & Blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-10 bg-red-50">
        <FiAlertCircle className="text-5xl text-red-500 mb-4" />
        <p className="text-xl font-semibold text-red-700">
          Oops! Something went wrong.
        </p>
        <p className="text-md text-red-600 mt-2 mb-6">{error}</p>
        <button
          onClick={fetchPosts}
          className="bg-red-600 text-white px-6 py-2.5 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section with Background Image */}
      <div
        className="relative bg-cover bg-center py-32 text-center text-white"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mt-10 transition duration-300 hover:text-orange-600 cursor-pointer">
            Our News & Blog
          </h1>
        </div>
      </div>

      <div className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-orange-600 font-semibold uppercase tracking-wider mb-2 transition duration-300 hover:text-orange-700 cursor-pointer">
              News & Blogs
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 transition duration-300 hover:text-orange-600 cursor-pointer">
              Our Latest News Post And Articles
            </h2>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {posts.map((post) => {
                const isExpanded = expandedPostId === post.id;
                const plainTextContent = getPlainTextFromHtml(post.rawContent);
                const needsTruncation = plainTextContent.length > 100;

                // Sanitize the HTML content before rendering
                const sanitizedFullContent = DOMPurify.sanitize(
                  post.rawContent || ""
                );

                const truncatedContentDisplay =
                  needsTruncation && !isExpanded
                    ? `${plainTextContent.slice(0, 100)}...`
                    : sanitizedFullContent;

                return (
                  <div
                    key={post.id}
                    tabIndex={0}
                    aria-label={`Blog Post: ${post.title}`}
                    className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col p-6 cursor-pointer
                               transform transition duration-300
                               hover:-translate-y-2 hover:bg-orange-600 hover:text-white hover:shadow-xl"
                  >
                    <div
                      className="flex items-center space-x-4 text-sm mb-3
                                    transition-colors duration-300
                                    text-gray-600 group-hover:text-white"
                    >
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-orange-600 transition-colors duration-300 group-hover:text-white" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <FaUser className="mr-1 text-orange-600 transition-colors duration-300 group-hover:text-white" />
                        {post.author}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-white">
                      {post.title}
                    </h3>

                    <p className="text-sm mb-1 transition-colors duration-300 text-gray-600 group-hover:text-white">
                      <strong>Status:</strong> {post.status}
                    </p>

                    <div className="text-sm mb-3 prose prose-sm max-w-none transition-colors duration-300 group-hover:prose-invert">
                      {parse(truncatedContentDisplay)}
                    </div>

                    {needsTruncation && (
                      <button
                        onClick={() => toggleExpanded(post.id)}
                        className="text-orange-600 hover:text-orange-700 hover:underline text-sm font-medium mt-auto self-start transition-colors cursor-pointer"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            !loading && (
              <p className="text-center text-gray-500 text-lg py-10">
                No blog posts found.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
