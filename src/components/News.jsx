import React, { useState } from "react";
import { Typography, Row, Col, Card, Input } from "antd";
import moment from "moment";

import { useGetCryptoNewsQuery } from "../services/cryptoNewsApi";

const { Text, Title } = Typography;
const { Search } = Input;

const News = ({ simplified }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: cryptoNews, isLoading, error } = useGetCryptoNewsQuery();

  console.log("cryptoNews:", cryptoNews);

  if (isLoading) return "Loading...";
  if (error) return "Error loading news...";

  // Handle different possible data structures
  let newsData = [];
  if (cryptoNews) {
    if (Array.isArray(cryptoNews)) {
      newsData = cryptoNews;
    } else if (cryptoNews.data && Array.isArray(cryptoNews.data)) {
      newsData = cryptoNews.data;
    } else if (cryptoNews.articles && Array.isArray(cryptoNews.articles)) {
      newsData = cryptoNews.articles;
    } else if (cryptoNews.value && Array.isArray(cryptoNews.value)) {
      newsData = cryptoNews.value;
    }
  }

  if (!newsData || newsData.length === 0) return "No news available...";

  // Filter news based on search query
  const filteredNews = newsData.filter((news) => {
    // Filter by search query (search in title per word)
    let searchMatch = true;
    if (searchQuery.trim()) {
      const title = (news.title || news.name || news.headline || "").toLowerCase();
      const searchWords = searchQuery.toLowerCase().trim().split(/\s+/);

      // Check if all search words are found in the title
      searchMatch = searchWords.every((word) => title.includes(word));
    }

    return searchMatch;
  });

  const limitedNews = filteredNews.slice(0, simplified ? 6 : 100);

  return (
    <Row gutter={[24, 24]}>
      {!simplified && (
        <Col span={24}>
          <Search placeholder="Search in news titles..." allowClear value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%" }} />

          {searchQuery.trim() && (
            <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#f0f2f5", borderRadius: "6px" }}>
              <Text type="secondary">
                Search query: <strong>"{searchQuery}"</strong>
                <br />
                <Text type="secondary">
                  ({filteredNews.length} article{filteredNews.length !== 1 ? "s" : ""} found)
                </Text>
              </Text>
            </div>
          )}
        </Col>
      )}

      {filteredNews.length === 0 ? (
        <Col span={24}>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Title level={4}>No news found</Title>
            <Text type="secondary">
              {searchQuery.trim() ? `No articles found with "${searchQuery}" in the title.` : "No articles available."}
              <br />
              Try adjusting your search criteria.
            </Text>
          </div>
        </Col>
      ) : (
        limitedNews.map((news, i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <Card hoverable className="news-card">
              <a href={news.url || news.link} target="_blank" rel="noreferrer">
                <div className="news-image-container">
                  {(news.thumbnail || news.image || news.urlToImage) && <img src={news.thumbnail || news.image || news.urlToImage} alt="news" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />}
                  <div style={{ width: news.thumbnail || news.image || news.urlToImage ? "65%" : "100%" }}>
                    <Title className="news-title" level={4}>
                      {news.title || news.name || news.headline || "No Title Available"}
                    </Title>
                  </div>
                </div>
                <Text className="news-description">{news.description || news.excerpt || news.summary || "No description available"}</Text>
                <div className="provider-container" style={{ marginTop: "10px" }}>
                  <Text type="secondary">{moment(news.createdAt || news.publishedAt || news.date || news.datePublished).fromNow()}</Text>
                </div>
              </a>
            </Card>
          </Col>
        ))
      )}
    </Row>
  );
};

export default News;
