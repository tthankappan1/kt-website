import type { Post } from './types'

export const post: Post = {
  slug: 'lender-number-isnt-your-loan-balance',
  title: `The Number Your Lender Actually Looks At Isn't Your Loan Balance`,
  category: 'Market Update',
  date: '2026-07-08',
  excerpt: `Student loans are back in the headlines, and a lot of Bay Area buyers are quietly assuming they're disqualified. The data — and the math lenders actually use — says otherwise.`,
  cover: true,
  body: [
    `Student loans are back in the news, and if you've been telling yourself the home search has to wait until that balance hits zero, I want to gently push back. That single belief keeps more qualified Bay Area buyers on the sidelines than almost anything else I see.`,
    `Here's the part most people never hear: carrying student debt does not disqualify you from a mortgage. It's one number in a much bigger equation — and it isn't even the number that matters most.`,
    { h: `You Are Not the Only One Buying With Debt` },
    `If student loans feel like a personal roadblock, look at how much company you're in. In the National Association of Realtors' research on student debt, 51% of loan holders say the debt delayed them from buying a home — and among millennials who don't yet own, 61% believe it's the thing standing in their way.`,
    { chart: {
      "kind": "bar",
      "title": "The Worry Is Widespread",
      "source": "National Association of Realtors, The Impact of Student Loan Debt",
      "note": "Most of that delay is worry meeting sticker shock — not a lender saying no.",
      "unit": "%",
      "bars": [
        {
          "label": "Non-homeowning millennials who say student debt delays buying",
          "value": 61
        },
        {
          "label": "Student-loan holders who say debt delayed a home purchase",
          "value": 51
        }
      ]
    } },
    `Now set that worry against what actually happens at the closing table. According to NAR's Profile of Home Buyers and Sellers, roughly one in three first-time buyers purchased their home while still carrying student debt — with a median balance of $30,400.`,
    { chart: {
      "kind": "donut",
      "title": "One in Three First-Time Buyers Bought With Student Debt",
      "source": "National Association of Realtors, Profile of Home Buyers and Sellers",
      "note": "A third didn't wait for a zero balance — they qualified with the loans still on the books.",
      "unit": "%",
      "slices": [
        {
          "label": "Bought carrying student debt",
          "value": 33
        },
        {
          "label": "Bought without student debt",
          "value": 67
        }
      ]
    } },
    `Read that again. A third of first-time buyers didn't wait for zero. They bought with the loans still on the books, because they understood how lenders actually weigh them.`,
    { h: `It's About the Ratio, Not the Balance` },
    `When a lender opens your file, they're not scanning for a scary total. They're calculating your **debt-to-income ratio** — your monthly debt payments, student loans included, measured against your gross monthly income.`,
    `A $30,000 balance sounds intimidating as a lump sum. But a manageable monthly payment against a strong income is a very different story. Two buyers with the identical loan balance can land in completely different places, depending on their income, their other debts, and how the loan is structured.`,
    `That's also why the Bay Area cuts both ways. Our home prices are high, yes — but so are our incomes, and a healthy Tri-Valley salary gives your ratio real room to absorb a student loan payment that would strain a budget almost anywhere else.`,
    { h: `Small Moves That Change Your Math` },
    `The encouraging part is that your DTI is something you can actively improve before you ever write an offer. A few levers I walk clients through:`,
    { list: [
      `Ask your servicer about income-driven repayment — a lower monthly payment can meaningfully improve your ratio.`,
      `Pay down a credit card or auto loan instead of the student loan; retiring a smaller, high-payment debt sometimes helps your DTI more than chipping at the big balance.`,
      `Get pre-approved early, so you're planning around real numbers instead of fear-based guesses.`,
    ] },
    `The buyers who get stuck are usually the ones who never asked. They assumed the answer was no, and never gave a lender the chance to run the actual math.`,
    { h: `Don't Disqualify Yourself` },
    `Here's what I tell every first-time buyer weighing this: let a professional tell you no before you tell yourself no. A fifteen-minute conversation with a good lender can replace a year of anxious assumptions with a real number you can plan around.`,
    `Your student loans are a line item, not a life sentence. In a market like ours, the cost of waiting — rising prices, lost equity, another year of rent — is often far greater than the cost of the debt you're waiting to clear.`,
    { cta: `If student loans have been the reason you've held off, let's talk. Call or text me and I'll connect you with a trusted local lender who can run your real numbers — no pressure, just clarity on what's actually possible.` },
    { disclaimer: `I am not a financial advisor. Please consult your CPA or trusted financial strategist before making any financial decisions.` },
    { sources: [
      { t: `NAR, Profile of Home Buyers and Sellers`, href: 'https://www.nar.realtor/research-and-statistics/research-reports/highlights-from-the-profile-of-home-buyers-and-sellers' },
      { t: `NAR, Student Loan Debt`, href: 'https://www.nar.realtor/student-loan-debt' },
    ] },
  ],
}
