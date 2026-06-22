import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import Hero from "../components/Hero";
import RoadmapForm from "../components/RoadmapForm";
import HowItWorks from "../components/HowItWorks";

function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="grid-overlay" />
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);

    const systemPrompt = `You are an expert learning path architect. Your job is to generate comprehensive, structured learning roadmaps for technologies and skills. Always respond with valid JSON only, no markdown fences, no extra text.

The JSON structure must be:
{
  "title": "Complete title for the roadmap",
  "skill": "skill name",
  "description": "2-3 sentence overview of what this roadmap covers",
  "totalDuration": "estimated total time (e.g., '6 months')",
  "difficulty": "beginner|intermediate|advanced",
  "tags": ["tag1", "tag2", "tag3"],
  "phases": [
    {
      "id": "phase-1",
      "title": "Phase title",
      "duration": "X weeks",
      "description": "What this phase covers",
      "color": "#hexcolor",
      "nodes": [
        {
          "id": "node-1-1",
          "title": "Topic title",
          "type": "core|optional|project|milestone",
          "status": "locked|available|in-progress|done",
          "duration": "X hours",
          "description": "Brief description",
          "resources": [
            { "type": "video|article|book|course|docs", "title": "Resource title", "url": "#" }
          ],
          "skills": ["skill1", "skill2"],
          "prerequisites": []
        }
      ]
    }
  ],
  "careerOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3"],
  "nextSteps": ["Next step 1", "Next step 2"]
}

Generate 3-5 phases, each with 3-6 nodes. Make it specific, practical, and actionable.`;

    const userPrompt = `Create a detailed learning roadmap for:
- Skill/Technology: ${formData.skillInput}
- Current Experience Level: ${formData.experience}
- Learning Goal: ${formData.goal}
- Available Timeframe: ${formData.timeframe} months

Make the phases flow logically from foundations to advanced topics. Use varied node types (core, optional, project, milestone). For the color field in each phase, use distinct hex colors that progress from cool (blues/purples) to warm (greens/amber) across phases. The first node in phase 1 should have status "available", all others "locked".`;

    const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;

    try {
      const response = await fetch(
        "https://api.mistral.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: "mistral-large-latest",
            temperature: 0.7,
            response_format: {
              type: "json_object",
            },
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: userPrompt,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(
          errBody?.message ||
            errBody?.error?.message ||
            `API Error: ${response.status}`
        );
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      const parsed =
        typeof content === "string" ? JSON.parse(content) : content;

      navigate("/roadmap", {
        state: {
          ...parsed,
          experience: formData.experience,
          goal: formData.goal,
          timeframe: formData.timeframe,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <AnimatedBackground />

      <header className="home-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">PathForge</span>
          </div>
          <nav className="header-nav">
            <a href="#form" className="nav-link">
              Get Started
            </a>
            <a href="#how" className="nav-link">
              How it works
            </a>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <Hero />
        <RoadmapForm onSubmit={handleFormSubmit} loading={loading} />
        <HowItWorks />
      </main>

      <footer className="home-footer">
        <p>
          PathForge · Build your unique learning path · Your data stays with you
        </p>
      </footer>
    </div>
  );
}
