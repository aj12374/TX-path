import { useState, useEffect } from "react";
import {
  ArrowRight,
  PenTool,
  Users,
  Star,
  X,
  Check,
  Send,
  Sparkles,
  Eye,
} from "lucide-react";
import "./BlogWriteForUs.css";

const SHOWCASE_DATA = [
  {
    id: 0,
    badge: "SHARE WHAT YOU KNOW",
    badgeColor: "blue",
    title: "Demystifying Full-Stack System Design",
    desc: "Step-by-step breakdown of microservices, caching, and database indexing for production.",
    author: "Alumni Tech Lead",
    metric: "3.4k Reads",
    metricIcon: Eye,
    icon: PenTool,
    accent: "#2563EB"
  },
  {
    id: 1,
    badge: "REACH LEARNERS",
    badgeColor: "purple",
    title: "From Campus to Senior Dev: Placement Lessons",
    desc: "Key technical mindset shifts and interview preparation frameworks that actually work.",
    author: "Senior Software Engineer",
    metric: "15,000+ Impacted",
    metricIcon: Users,
    icon: Users,
    accent: "#7C3AED"
  },
  {
    id: 2,
    badge: "BUILD YOUR PRESENCE",
    badgeColor: "emerald",
    title: "Verified TX Author Spotlight",
    desc: "Elevate your professional profile, share expertise, and connect with top technology employers.",
    author: "Featured Author Badge",
    metric: "Top Contributor ⭐ 4.9",
    metricIcon: Star,
    icon: Star,
    accent: "#059669"
  }
];

function BlogContributorAnimation() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % SHOWCASE_DATA.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const current = SHOWCASE_DATA[activeTab];
  const CurrentIcon = current.icon;
  const MetricIcon = current.metricIcon;

  return (
    <div className="write-visual">
      {/* Interactive Main Showcase Card */}
      <div className="showcase-card-wrapper">
        <div className="showcase-card">
          <div className="showcase-card-header">
            <span className={`showcase-tag ${current.badgeColor}`}>
              <Sparkles size={12} />
              {current.badge}
            </span>
            
          </div>

          <h3 className="showcase-card-title">{current.title}</h3>
          <p className="showcase-card-desc">{current.desc}</p>

          <div className="showcase-card-footer">
            <div className="showcase-author-info">
              <div className="author-avatar-badge">
                <CurrentIcon size={14} style={{ color: current.accent }} />
              </div>
              <span className="author-name">{current.author}</span>
            </div>

            <div className="showcase-metric-pill">
              <MetricIcon size={12} style={{ color: current.accent }} />
              <span>{current.metric}</span>
            </div>
          </div>
        </div>

        {/* Tab Indicators */}
        <div className="showcase-tabs">
          {SHOWCASE_DATA.map((tab, idx) => (
            <button
              key={tab.id}
              type="button"
              className={`showcase-tab-dot ${idx === activeTab ? "active" : ""}`}
              onClick={() => setActiveTab(idx)}
              aria-label={`Show ${tab.badge}`}
            >
              <span className="tab-progress-fill" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const initialForm = {
  name: "",
  email: "",
  role: "Student",
  category: "Career Guidance & Roadmaps",
  pitch: "",
};

const BlogWriteForUs = () => {
  const [showContributorModal, setShowContributorModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.name.trim() && formData.email.trim()) {
      setIsSubmitted(true);
    }
  };

  const closeModal = () => {
    setShowContributorModal(false);
    setIsSubmitted(false);
    setFormData(initialForm);
  };

  return (
    <section className="write-section">
      <div className="write-container">
        <div className="write-card">

          {/* Decorative background elements */}
          <div className="write-glow write-glow-one" />
          <div className="write-glow write-glow-two" />

          {/* Content */}
          <div className="write-content">

            <div className="write-label">
             
            </div>

            <h2 className="write-title">
              Your Experience
              <br />
              <span>Can Inspire Someone.</span>
            </h2>

            <p className="write-description">
              Have a project, career lesson, technical insight, or learning
              experience worth sharing? Turn your knowledge into something
              useful for the next generation of learners.
            </p>

            <div className="write-benefits">

              <div className="write-benefit">
                <div className="benefit-icon benefit-blue">
                  <PenTool size={17} />
                </div>

                <div>
                  <h4>Share What You Know</h4>
                  <p>
                    Tutorials, projects, career lessons and practical insights.
                  </p>
                </div>
              </div>

              <div className="write-benefit">
                <div className="benefit-icon benefit-purple">
                  <Users size={17} />
                </div>

                <div>
                  <h4>Reach Learners</h4>
                  <p>
                    Put your ideas in front of students and technology
                    enthusiasts.
                  </p>
                </div>
              </div>

              <div className="write-benefit">
                <div className="benefit-icon benefit-green">
                  <Star size={17} />
                </div>

                <div>
                  <h4>Build Your Presence</h4>
                  <p>
                    Showcase your knowledge and strengthen your professional
                    profile.
                  </p>
                </div>
              </div>

            </div>

            <button
              type="button"
              className="write-button"
              onClick={() => setShowContributorModal(true)}
            >
              <span>Become a Contributor</span>
              <ArrowRight size={17} />
            </button>
          </div>

          {/* Animated Contributor Showcase Visual */}
          <BlogContributorAnimation />
        </div>
      </div>

      {/* Contributor Modal */}
      {showContributorModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="contributor-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">
              <div>
                <div className="modal-label">
                  <span />
                  CONTRIBUTOR APPLICATION
                </div>

                <h2>Share Your Story</h2>

                <p>
                  Tell us what you would like to write about and our editorial
                  team will get back to you.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="modal-content">

              {isSubmitted ? (
                <div className="success-message">

                  <div className="success-icon">
                    <Check size={30} />
                  </div>

                  <h3>Application Received</h3>

                  <p>
                    Thank you, <strong>{formData.name}</strong>. Our editorial
                    team will review your idea and contact you at{" "}
                    <strong>{formData.email}</strong>.
                  </p>

                  <button
                    type="button"
                    className="success-button"
                    onClick={closeModal}
                  >
                    Done
                  </button>

                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contributor-form">

                  <div className="form-grid">

                    <div className="form-field">
                      <label>Full Name *</label>

                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>Email Address *</label>

                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                  </div>

                  <div className="form-grid">

                    <div className="form-field">
                      <label>I am a *</label>

                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role: e.target.value,
                          })
                        }
                      >
                        <option value="Student">
                          B.Tech / Degree Student
                        </option>
                        <option value="Software Engineer">
                          Software Engineer / Placed Alumni
                        </option>
                        <option value="Educator">
                          College Educator / Faculty
                        </option>
                        <option value="Industry Mentor">
                          Industry Mentor / Corporate Lead
                        </option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Primary Topic *</label>

                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value="Career Guidance & Roadmaps">
                          Career Guidance & Roadmaps
                        </option>
                        <option value="Internship & Placement Experience">
                          Internship & Placement Experience
                        </option>
                        <option value="Full-Stack & System Design">
                          Full-Stack & System Design
                        </option>
                        <option value="AI, ML & Cloud Technologies">
                          AI, ML & Cloud Technologies
                        </option>
                        <option value="Student Project Case Studies">
                          Student Project Case Studies
                        </option>
                      </select>
                    </div>

                  </div>

                  <div className="form-field">
                    <label>Article Topic & Short Pitch *</label>

                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about the article, tutorial, project or experience you would like to share..."
                      value={formData.pitch}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pitch: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-actions">

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="submit-button">
                      <span>Submit Application</span>
                      <Send size={15} />
                    </button>

                  </div>

                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogWriteForUs;
