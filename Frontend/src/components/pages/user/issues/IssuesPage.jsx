import React, { useState } from "react";
import ReportIssues from "./ReportIssue";
import MyIssues from "./MyIssues";
import PublicIssues from "./PublicIssues";

export default function IssuesPage() {
  const [activeTab, setActiveTab] = useState("my");

  return (
    <>
      <style>{`
        .tab-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
          margin: 25px 0;
        }

        .segmented-control {
          display: flex;
          background: #eeeef0;
          padding: 4px;
          border-radius: 12px;
          width: 100%;
          max-width: 500px; /* Limits width on desktop */
        }

        .tab-button {
          flex: 1;
          border: none;
          outline: none;
          padding: 12px 10px;
          font-size: 14px;
          font-weight: 600;
          color: #636366;
          background: transparent;
          border-radius: 10px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
        }

        .tab-button.active {
          background: #ffffff;
          color: #000000;
          box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.12);
        }

        /* Responsive Adjustments */
        @media (max-width: 576px) {
          .tab-button {
            font-size: 13px;
            padding: 10px 5px;
          }
          .segmented-control {
            max-width: 100%;
          }
        }
      `}</style>

      <main className="main">
        {/* Page Title */}
        <div className="page-title light-background">
          <div className="container d-lg-flex justify-content-between align-items-center">
            <h1 className="mb-2 mb-lg-0">Issues Dashboard</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><a href="/">Home</a></li>
                <li className="current">Issues Dashboard</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container">
          {/* Responsive Styled Tabs */}
          <div className="tab-wrapper">
            <div className="segmented-control">
              <button
                className={`tab-button ${activeTab === "my" ? "active" : ""}`}
                onClick={() => setActiveTab("my")}
              >
                <span>📄</span> My Issues
              </button>

              <button
                className={`tab-button ${activeTab === "public" ? "active" : ""}`}
                onClick={() => setActiveTab("public")}
              >
                <span>🌍</span> Public Issues
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="issue-content-area">
            {activeTab === "my" && <MyIssues />}
            {activeTab === "public" && <PublicIssues />}
          </div>
        </div>
      </main>
    </>
  );
}