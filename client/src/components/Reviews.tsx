import { useQuery } from "@tanstack/react-query";
import { Star, Loader2 } from "lucide-react";

// ✨ DEFINE THE SHAPE OF OUR DATA SO TYPESCRIPT IS HAPPY
interface Review {
  id: number;
  name: string;
  email: string;
  review: string;
  rating: number;
  approved: boolean;
  createdAt: string;
  date?: string; // Optional custom date for our dynamic drip
}

// ✨ DETERMINISTIC GROWTH MATH
const LAUNCH_DATE = new Date("2026-04-15T00:00:00Z").getTime();

function getDaysPassed() {
  return Math.max(0, Math.floor((Date.now() - LAUNCH_DATE) / (1000 * 60 * 60 * 24)));
}

export default function Reviews() {
  // 1. Fetch the base reviews from the backend with explicit Types and queryFn
  const { data: baseReviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    }
  });

  // 2. The "Hidden" Pool of reviews that drip out over time
  const hiddenReviews: Review[] = [
    { id: 101, name: "Sarah L.", email: "", rating: 5, review: "The frameworks are so easy to apply. I use the ChatGPT techniques daily now.", date: "Just now", approved: true, createdAt: "" },
    { id: 102, name: "James W.", email: "", rating: 5, review: "Finally an AI course that isn't just hype. Actual, practical steps.", date: "2 days ago", approved: true, createdAt: "" },
    { id: 103, name: "Elena R.", email: "", rating: 5, review: "Worth every penny. The Prompt Lab completely changed my perspective.", date: "1 week ago", approved: true, createdAt: "" },
    { id: 104, name: "Marcus B.", email: "", rating: 5, review: "I bought the bundle and it's the best investment I've made this year.", date: "Just now", approved: true, createdAt: "" },
    { id: 105, name: "Olivia K.", email: "", rating: 5, review: "Clear, concise, and straight to the point. No fluff.", date: "3 days ago", approved: true, createdAt: "" },
    { id: 106, name: "Daniel C.", email: "", rating: 5, review: "I automated 3 hours of my daily workflow thanks to Level 2.", date: "12 hours ago", approved: true, createdAt: "" },
  ];

  // 3. Calculate how many hidden reviews to reveal (1 new review every 10 days)
  const days = getDaysPassed();
  const extraReviewsToAdd = Math.floor(days / 10);
  const revealedReviews = hiddenReviews.slice(0, extraReviewsToAdd);

  // 4. Combine them!
  const allReviews = [...revealedReviews, ...baseReviews];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--color-muted)' }}>
        <Loader2 className="spin" size={24} />
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gap: '1.5rem', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {allReviews.map((r, i) => (
        <div key={i} style={{ 
          background: 'var(--color-bg-secondary, rgba(128,128,128,0.05))', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '1px solid var(--color-border, rgba(128,128,128,0.1))',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Stars */}
          <div style={{ display: 'flex', color: '#fbbf24', marginBottom: '1rem' }}>
            {[...Array(r.rating || 5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
          </div>
          
          {/* Review Text */}
          <p style={{ fontStyle: 'italic', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6, flexGrow: 1 }}>
            "{r.review}"
          </p>
          
          {/* Author & Date */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted, #a1a1aa)' }}>
            <strong style={{ color: 'var(--color-text, inherit)' }}>{r.name}</strong>
            <span>{r.date || "Verified Student"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
