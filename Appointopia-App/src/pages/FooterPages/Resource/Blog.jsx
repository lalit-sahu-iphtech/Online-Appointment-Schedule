
import React from 'react';
import '../Page.css'

export default function Blog() {
  const posts = [
    { title: '10 Tips for Better Time Management', date: 'Jan 15, 2026' },
    { title: 'How AI is Changing Scheduling', date: 'Jan 10, 2026' },
    { title: 'Remote Work Best Practices', date: 'Jan 5, 2026' },
  ];

  return (
    <div className="page-container">
      <h1>Blog</h1>
      <p>Insights, tips, and news from the Appointopia team.</p>
      <div className="blog-list">
        {posts.map((post, index) => (
          <div key={index} className="blog-post">
            <h3>{post.title}</h3>
            <span className="date">{post.date}</span>
            <p>Read more →</p>
          </div>
        ))}
      </div>
    </div>
  );
}