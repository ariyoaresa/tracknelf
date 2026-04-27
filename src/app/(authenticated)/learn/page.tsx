'use client'

import { useState } from 'react'
import { BookOpen, Share2, ArrowLeft, ExternalLink, MessageCircle } from 'lucide-react'

interface Article {
  id: string
  title: string
  category: string
  content: string
}

const ARTICLES: Article[] = [
  { id: 'u1', category: 'Understanding your loan', title: 'What is the NELFUND Student Loan?', content: 'The Nigerian Education Loan Fund (NELFUND) is designed to provide financial assistance to Nigerian students in tertiary institutions. It covers tuition fees and provide a monthly maintenance allowance.' },
  { id: 'u2', category: 'Understanding your loan', title: 'Interest Rates Explained', content: 'NELFUND loans are interest-free. You only pay back the exact amount disbursed to you or on your behalf.' },
  { id: 'u3', category: 'Understanding your loan', title: 'The Role of the Disbursement Portal', content: 'All disbursements are handled through the official portal. Traknelf helps you monitor these events in real-time.' },
  { id: 'u4', category: 'Understanding your loan', title: 'School vs. Personal Loans', content: 'Institutional loans go directly to your school for tuition, while personal loans are sent to your bank account for upkeep.' },
  { id: 'o1', category: 'Compliance & Updates', title: 'Mandatory Information Updates', content: 'You must update your academic status, matriculation details, and contact info whenever they change.' },
  { id: 'o2', category: 'Compliance & Updates', title: 'Annual Re-validation', content: 'Every academic session, you are required to re-verify your enrollment status to continue receiving disbursements.' },
  { id: 'o3', category: 'Compliance & Updates', title: 'Notification of Graduation', content: 'Once you graduate, you must notify NELFUND within 30 days to start the grace period countdown.' },
  { id: 'o4', category: 'Compliance & Updates', title: 'Post-Graduation Reporting', content: 'Students are expected to report their employment status during the 2-year grace period.' },
  { id: 'r1', category: 'Repayment', title: 'The 10% Statutory Deduction', content: 'Repayment happens via a 10% deduction from your monthly salary once you are employed.' },
  { id: 'r2', category: 'Repayment', title: 'How the 2-year Grace Period Works', content: 'Repayment starts 2 years after your NYSC completion date, giving you time to find stable employment.' },
  { id: 'r3', category: 'Repayment', title: 'Making Voluntary Payments', content: 'You can choose to pay back faster by making voluntary deposits directly to the NELFUND account.' },
  { id: 'r4', category: 'Repayment', title: 'Manual Repayment vs PAYE', content: 'While PAYE is automatic, you can also set up standing orders for manual repayments.' },
  { id: 'd1', category: 'Default consequences', title: 'Legal Implications of Defaulting', content: 'Defaulting on a federal loan can lead to legal action and prosecution by the fund.' },
  { id: 'd2', category: 'Default consequences', title: 'Impact on Credit Score', content: 'Late or missed payments are reported to credit bureaus, making it harder to get future loans or mortgages.' },
  { id: 'd3', category: 'Default consequences', title: 'Employment Restrictions', content: 'Chronic defaulters may face restrictions in certain public sector employment opportunities.' },
  { id: 'd4', category: 'Default consequences', title: 'Blacklisting and Public Record', content: 'Continued non-compliance may result in names being published in national registries.' },
]

export default function Learn() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  
  const categories = Array.from(new Set(ARTICLES.map(a => a.category)))

  if (selectedArticle) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <button 
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </button>

        <article className="bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-[0.2em]">
              {selectedArticle.category}
            </span>
            <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">
              {selectedArticle.title}
            </h1>
          </div>
          
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
            {selectedArticle.content}
            <p className="mt-6">For more official details, always consult the NELFUND Student Portal guidelines.</p>
          </div>

          <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
            <button 
              onClick={() => {
                const url = `https://wa.me/?text=${encodeURIComponent(`Check out this article on Traknelf: ${selectedArticle.title}`)}`
                window.open(url, '_blank')
              }}
              className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              Share on WhatsApp
            </button>
            <a 
              href="https://nelf.gov.ng" 
              target="_blank" 
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm font-bold"
            >
              Portal <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-20">
      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Knowledge Base</h1>
        <p className="text-slate-500 max-w-md mx-auto">Everything you need to know about navigating your student loan journey.</p>
      </header>

      <div className="space-y-16">
        {categories.map(cat => (
          <section key={cat} className="space-y-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] px-1 border-b border-slate-50 pb-4">
              {cat}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ARTICLES.filter(a => a.category === cat).map(article => (
                <button 
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group p-6 bg-white border border-slate-100 rounded-3xl text-left hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50 transition-all duration-300"
                >
                  <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Read Article</span>
                    <Share2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
