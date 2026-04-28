// Set this to the day you launch (Format: YYYY-MM-DD)
// The math will calculate everything relative to this date!
const LAUNCH_DATE = new Date("2026-04-15T00:00:00Z").getTime();

// Helper to get how many days have passed since launch
function getDaysPassed() {
  return Math.max(0, Math.floor((Date.now() - LAUNCH_DATE) / (1000 * 60 * 60 * 24)));
}

export function getDynamicTicker() {
  const days = getDaysPassed();

  // 1. THE ORIGINALS (They grow over time)
  // Example: Sarah starts at Day 4, and goes up 1 level every 3 days.
  const items = [
    { 
      name: "Sarah M.", 
      action: `just finished Day ${Math.min(30, 4 + Math.floor(days / 3))}`, 
      time: "2 min ago" 
    },
    { 
      name: "David K.", 
      action: `unlocked Level ${Math.min(3, 1 + Math.floor(days / 15))}`, 
      time: "12 min ago" 
    },
    { 
      name: "Jessica R.", 
      action: `just finished Day ${Math.min(30, 7 + Math.floor(days / 4))}`, 
      time: "28 min ago" 
    },
  ];

  // 2. THE NEWCOMERS (Add 3 new people every 15 days)
  const newBatches = Math.floor(days / 15);
  const fakeNames = ["Alex T.", "Jordan B.", "Taylor S.", "Morgan C.", "Casey W.", "Riley L.", "Jamie D.", "Avery P.", "Drew M.", "Sam R."];

  for (let i = 0; i < newBatches; i++) {
    for (let j = 0; j < 3; j++) {
       const name = fakeNames[(i * 3 + j) % fakeNames.length];
       // Calculate how long this specific user has been around
       const daysActive = days - (i * 15);
       // They start at Day 1 and grow every 3 days
       const currentDay = Math.min(30, 1 + Math.floor(daysActive / 3));
       
       // Add them to the START of the ticker list
       items.unshift({ 
         name, 
         action: `just finished Day ${currentDay}`, 
         time: `${(j + 1) * 5} min ago` 
       });
    }
  }

  return items;
}

export function getDynamicReviews(baseReviews: any[]) {
   const days = getDaysPassed();
   
   // Add 1 new review for every 10 days that pass
   const extraReviewsToAdd = Math.floor(days / 10);

   // The "Hidden" Pool of reviews that drip out over time
   const hiddenReviews = [
     { name: "Michael T.", rating: 5, text: "Absolutely changed how I work. The Prompt Lab alone is worth it.", date: "Just now" },
     { name: "Emily R.", rating: 5, text: "I was skeptical, but the ROI is insane. Finished Level 2 yesterday.", date: "1 day ago" },
     { name: "Chris P.", rating: 5, text: "Clear, concise, and incredibly actionable. Best AI course hands down.", date: "2 days ago" },
     { name: "Amanda J.", rating: 5, text: "Saved me 10 hours this week already. The frameworks are genius.", date: "Just now" },
     { name: "Thomas L.", rating: 5, text: "Finally, someone explains AI without the confusing jargon.", date: "1 day ago" },
   ];

   // Take only the amount of reviews we are allowed to show right now
   const revealed = hiddenReviews.slice(0, extraReviewsToAdd);

   // Combine the newly revealed ones at the TOP, followed by your original base reviews
   return [...revealed, ...baseReviews];
}
