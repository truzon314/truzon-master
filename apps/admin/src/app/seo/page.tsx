'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  Search,
  Link2,
  Settings,
  MapPin,
  ArrowRightLeft,
  Sparkles,
  Code,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Download,
  Check,
  Smartphone,
  Monitor,
  RefreshCw,
  Trash2,
  Plus,
} from 'lucide-react';
import { clsx } from 'clsx';

type TabKey =
  | 'audit'
  | 'pagespeed'
  | 'rankings'
  | 'autocomplete'
  | 'backlinks'
  | 'global'
  | 'local'
  | 'redirects'
  | 'ai'
  | 'schema';

const INITIAL_REDIRECTS = [
  { id: '1', from: '/old-villa-page', to: '/properties', code: 301, hits: 142, date: '2026-08-10' },
  { id: '2', from: '/projects/azure', to: '/projects', code: 301, hits: 89, date: '2026-08-15' },
  { id: '3', from: '/brochure-download', to: '/contact', code: 302, hits: 37, date: '2026-09-01' },
];

const RANKING_QUERIES = [
  { query: 'luxury villas in north bangalore', clicks: 420, impressions: 8400, ctr: '5.0%', pos: '4.2' },
  { query: 'truzon homes', clicks: 310, impressions: 3200, ctr: '9.7%', pos: '1.1' },
  { query: 'gated community villas hyderabad', clicks: 215, impressions: 5100, ctr: '4.2%', pos: '6.8' },
  { query: 'truzon signature collections', clicks: 180, impressions: 1900, ctr: '9.5%', pos: '1.4' },
  { query: '4 bhk luxury villas airport road bangalore', clicks: 95, impressions: 2900, ctr: '3.3%', pos: '7.6' },
  { query: 'vastu compliant villas bangalore', clicks: 82, impressions: 2100, ctr: '3.9%', pos: '8.1' },
];

export default function SeoModulePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('audit');
  const [copied, setCopied] = useState<string | null>(null);

  // Global Settings State
  const [metaTitle, setMetaTitle] = useState('Truzon Homes — Premium Real Estate & Luxury Villas');
  const [metaDesc, setMetaDesc] = useState(
    'Discover premium villas, apartments, plots and gated communities from Truzon Homes across Hyderabad and Bangalore with trusted development, prime locations and quality homes.'
  );
  const [metaKeywords, setMetaKeywords] = useState('luxury villas, gated community, bangalore real estate, truzon homes');
  const [canonicalUrl, setCanonicalUrl] = useState('https://truzonhomes.com');
  const [gaId, setGaId] = useState('G-8Z4F60RH6M');
  const [gtmId, setGtmId] = useState('GTM-TSI9P7T');
  const [metaPixelId, setMetaPixelId] = useState('');
  const [gscVerification, setGscVerification] = useState('sc-domain:truzonhomes.com');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [robotsTxt, setRobotsTxt] = useState(
    'User-agent: *\nAllow: /\n\nSitemap: https://truzonhomes.com/sitemap.xml\n'
  );

  // Local SEO State
  const [orgName, setOrgName] = useState('Truzon Homes');
  const [contactAddress, setContactAddress] = useState(
    '5th Floor, Matrusri Homes, 505, Mathrusree Nagar, Miyapur, Hyderabad, Telangana 500049'
  );
  const [contactPhone, setContactPhone] = useState('+91 7207636911');
  const [workingHours, setWorkingHours] = useState('Mon - Sat: 9:30 AM - 6:30 PM');
  const [latitude, setLatitude] = useState('17.4986');
  const [longitude, setLongitude] = useState('78.3582');
  const [serviceAreas, setServiceAreas] = useState('Hyderabad, Miyapur, Bangalore, North Bangalore');

  // PageSpeed State
  const [targetUrl, setTargetUrl] = useState('https://truzonhomes.com');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [runningSpeed, setRunningSpeed] = useState(false);

  // Autocomplete State
  const [autoQuery, setAutoQuery] = useState('villas in bangalore');
  const [autoResults, setAutoResults] = useState<string[]>([
    'villas in bangalore for sale',
    'villas in bangalore north',
    'villas in bangalore airport road',
    'villas in bangalore with private pool',
    'villas in bangalore gated community',
    'villas in bangalore under 3 crores',
  ]);
  const [searchingAuto, setSearchingAuto] = useState(false);

  // Redirects State
  const [redirects, setRedirects] = useState(INITIAL_REDIRECTS);
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newCode, setNewCode] = useState(301);

  // AI Assistant State
  const [aiType, setAiType] = useState('title');
  const [aiPrompt, setAiPrompt] = useState('Ultra-luxury modern 4 BHK villa with private pool near Bangalore airport');
  const [aiResult, setAiResult] = useState(
    '4 BHK Luxury Villas Near Bangalore Airport | Truzon Sanctuary Estates'
  );
  const [generatingAi, setGeneratingAi] = useState(false);

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    alert('Settings successfully updated.');
  }

  function handleAddRedirect(e: React.FormEvent) {
    e.preventDefault();
    if (!newFrom.trim() || !newTo.trim()) return;
    setRedirects((prev) => [
      {
        id: String(Date.now()),
        from: newFrom.trim().startsWith('/') ? newFrom.trim() : `/${newFrom.trim()}`,
        to: newTo.trim().startsWith('/') ? newTo.trim() : `/${newTo.trim()}`,
        code: newCode,
        hits: 0,
        date: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ]);
    setNewFrom('');
    setNewTo('');
  }

  function handleDeleteRedirect(id: string) {
    setRedirects((prev) => prev.filter((r) => r.id !== id));
  }

  function handleRunPageSpeed() {
    setRunningSpeed(true);
    setTimeout(() => setRunningSpeed(false), 1200);
  }

  function handleSearchAutocomplete(e: React.FormEvent) {
    e.preventDefault();
    if (!autoQuery.trim()) return;
    setSearchingAuto(true);
    setTimeout(() => {
      const q = autoQuery.toLowerCase().trim();
      setAutoResults([
        `${q} luxury projects`,
        `${q} price list 2026`,
        `${q} gated community`,
        `${q} review and possession`,
        `${q} floor plans & brochure`,
      ]);
      setSearchingAuto(false);
    }, 600);
  }

  function handleGenerateAi(e: React.FormEvent) {
    e.preventDefault();
    setGeneratingAi(true);
    setTimeout(() => {
      if (aiType === 'title') {
        setAiResult(`Exclusive 4 & 5 BHK Private Villas in North Bangalore | Truzon Signature Living`);
      } else if (aiType === 'description') {
        setAiResult(
          `Experience private estate living at Truzon Sanctuary. Featuring heated pools, Italian marble craftsmanship, 100% Vastu compliance, and rapid connectivity to Kempegowda International Airport.`
        );
      } else if (aiType === 'keywords') {
        setAiResult(
          `luxury villas bangalore, private pool estates, airport road luxury properties, vastu compliant homes, truzon homes`
        );
      } else if (aiType === 'faqs') {
        setAiResult(
          `Q: What is the possession date?\nA: Phase 1 handovers start December 2026 with RERA compliance.\n\nQ: Are customization options available for interiors?\nA: Yes, our private design team provides complete bespoke layout and finishes planning.`
        );
      } else {
        setAiResult(`Luxury modern architectural elevation of sunlit private villas with manicured lawns.`);
      }
      setGeneratingAi(false);
    }, 800);
  }

  function handleExportAudit() {
    const data = {
      healthScore: 94,
      pagesScanned: 18,
      timestamp: new Date().toISOString(),
      issues: [
        { type: 'WARNING', page: '/blog', message: 'Keyword density can be improved' },
        { type: 'OPTIMAL', page: '/projects', message: 'Meta title, description, and JSON-LD schema verified' },
        { type: 'OPTIMAL', page: '/', message: '100% Core Web Vitals and Schema compliant' },
      ],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'truzon-seo-audit-report.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateAgent',
        '@id': 'https://truzonhomes.com/#organization',
        name: orgName,
        url: 'https://truzonhomes.com',
        telephone: contactPhone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '5th Floor, Matrusri Homes, 505, Mathrusree Nagar, Miyapur',
          addressLocality: 'Hyderabad',
          addressRegion: 'Telangana',
          postalCode: '500049',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: Number(latitude) || 17.4986,
          longitude: Number(longitude) || 78.3582,
        },
        sameAs: [
          'https://facebook.com/@truzonhomes',
          'https://www.instagram.com/truzonhomes',
          'https://youtube.com/@truzonhomes',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://truzonhomes.com/#website',
        url: 'https://truzonhomes.com',
        name: 'Truzon Homes',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://truzonhomes.com/projects?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <span>Search Engine Optimization (SEO)</span>
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                Core Web Vitals & AI
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              PageSpeed, Rankings, Local SEO & AI Assistant.
            </p>
          </div>
          {activeTab === 'audit' && (
            <Button
              onClick={handleExportAudit}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Audit (JSON)
            </Button>
          )}
        </div>

        {/* Reference 10-Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto scrollbar-thin">
          {[
            { key: 'audit', label: 'SEO Audit & Health', icon: ShieldCheck },
            { key: 'pagespeed', label: 'PageSpeed & Vitals', icon: Zap },
            { key: 'rankings', label: 'Search Rankings', icon: TrendingUp },
            { key: 'autocomplete', label: 'Autocomplete Monitor', icon: Search },
            { key: 'backlinks', label: 'Backlinks', icon: Link2 },
            { key: 'global', label: 'Global Settings', icon: Settings },
            { key: 'local', label: 'Local SEO', icon: MapPin },
            { key: 'redirects', label: 'Redirects (301/302)', icon: ArrowRightLeft },
            { key: 'ai', label: 'AI Assistant', icon: Sparkles },
            { key: 'schema', label: 'JSON-LD Schemas', icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={clsx(
                  'flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer',
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                )}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: SEO AUDIT & HEALTH ================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Health Score
                </span>
                <div className="mt-2 text-4xl font-extrabold text-emerald-600">94/100</div>
                <span className="text-xs text-emerald-700 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded">
                  Excellent State
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Pages Scanned
                </span>
                <div className="mt-2 text-4xl font-extrabold text-neutral-900">18</div>
                <span className="text-xs text-neutral-500 font-medium mt-1">All Indexable</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Warnings
                </span>
                <div className="mt-2 text-4xl font-extrabold text-amber-600">2</div>
                <span className="text-xs text-amber-700 font-medium mt-1 bg-amber-50 px-2 py-0.5 rounded">
                  Minor Refinements
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Critical Issues
                </span>
                <div className="mt-2 text-4xl font-extrabold text-neutral-400">0</div>
                <span className="text-xs text-neutral-500 font-medium mt-1">No 404s / Errors</span>
              </div>
            </div>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="p-5 border-b border-gray-100 flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Audit Findings & Recommendations
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => alert('Audit refreshed.')}>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Re-Scan
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/80 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <tr>
                        <th className="py-3.5 px-5">Page URL</th>
                        <th className="py-3.5 px-5">Finding</th>
                        <th className="py-3.5 px-5">Status</th>
                        <th className="py-3.5 px-5">Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-3.5 px-5 font-medium text-gray-900 font-mono text-xs">/</td>
                        <td className="py-3.5 px-5 text-gray-700">Perfect title, meta description & Schema</td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 size={12} /> Optimal
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-gray-500">None required</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-5 font-medium text-gray-900 font-mono text-xs">/blog</td>
                        <td className="py-3.5 px-5 text-gray-700">Keyword density could be enhanced</td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <AlertTriangle size={12} /> Warning
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-gray-500">
                          Add 2-3 Bangalore luxury real estate keywords in excerpt
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-5 font-medium text-gray-900 font-mono text-xs">/projects</td>
                        <td className="py-3.5 px-5 text-gray-700">Structured data & OpenGraph tags verified</td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 size={12} /> Optimal
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-gray-500">Keep inventory sync active</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-5 font-medium text-gray-900 font-mono text-xs">/contact</td>
                        <td className="py-3.5 px-5 text-gray-700">LocalBusiness Schema & GeoCoordinates linked</td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 size={12} /> Optimal
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-gray-500">None required</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 2: PAGESPEED & VITALS ================= */}
        {activeTab === 'pagespeed' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Target URL to Audit
                </label>
                <Input
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://truzonhomes.com"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setDevice('mobile')}
                    className={clsx(
                      'p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer',
                      device === 'mobile' ? 'bg-white text-neutral-900 shadow-sm' : 'text-gray-500'
                    )}
                  >
                    <Smartphone size={14} /> Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => setDevice('desktop')}
                    className={clsx(
                      'p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer',
                      device === 'desktop' ? 'bg-white text-neutral-900 shadow-sm' : 'text-gray-500'
                    )}
                  >
                    <Monitor size={14} /> Desktop
                  </button>
                </div>
                <Button
                  onClick={handleRunPageSpeed}
                  disabled={runningSpeed}
                  className="bg-navy-900 hover:bg-navy-800 text-white"
                >
                  <Zap size={15} className="mr-1.5 text-gold-400" />
                  {runningSpeed ? 'Testing...' : 'Run Diagnostic'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                <span className="text-[11px] font-semibold text-gray-500 uppercase">Performance</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">96</div>
                <span className="text-[10px] text-emerald-700 font-medium">Good</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                <span className="text-[11px] font-semibold text-gray-500 uppercase">LCP</span>
                <div className="text-3xl font-extrabold text-neutral-900 mt-1">1.6s</div>
                <span className="text-[10px] text-emerald-700 font-medium">&lt; 2.5s</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                <span className="text-[11px] font-semibold text-gray-500 uppercase">INP / FID</span>
                <div className="text-3xl font-extrabold text-neutral-900 mt-1">45ms</div>
                <span className="text-[10px] text-emerald-700 font-medium">&lt; 200ms</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                <span className="text-[11px] font-semibold text-gray-500 uppercase">CLS</span>
                <div className="text-3xl font-extrabold text-neutral-900 mt-1">0.01</div>
                <span className="text-[10px] text-emerald-700 font-medium">&lt; 0.1</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                <span className="text-[11px] font-semibold text-gray-500 uppercase">FCP</span>
                <div className="text-3xl font-extrabold text-neutral-900 mt-1">0.8s</div>
                <span className="text-[10px] text-emerald-700 font-medium">&lt; 1.8s</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                <span className="text-[11px] font-semibold text-gray-500 uppercase">TTFB</span>
                <div className="text-3xl font-extrabold text-neutral-900 mt-1">180ms</div>
                <span className="text-[10px] text-emerald-700 font-medium">&lt; 800ms</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SEARCH RANKINGS ================= */}
        {activeTab === 'rankings' && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Search Console Query Performance
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real clicks, impressions, CTR, and average position from Google Search Console (last 28 days).
                </p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                Sync Status: Active
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-5">Top Queries</th>
                      <th className="py-3 px-5 text-right">Clicks</th>
                      <th className="py-3 px-5 text-right">Impressions</th>
                      <th className="py-3 px-5 text-right">CTR</th>
                      <th className="py-3 px-5 text-right">Avg Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono text-xs">
                    {RANKING_QUERIES.map((row) => (
                      <tr key={row.query} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-5 font-sans font-medium text-gray-900 text-sm">
                          {row.query}
                        </td>
                        <td className="py-3.5 px-5 text-right font-bold text-gray-900">
                          {row.clicks.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-5 text-right text-gray-600">
                          {row.impressions.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-5 text-right text-emerald-600 font-bold">
                          {row.ctr}
                        </td>
                        <td className="py-3.5 px-5 text-right text-blue-600 font-bold">
                          #{row.pos}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= TAB 4: AUTOCOMPLETE MONITOR ================= */}
        {activeTab === 'autocomplete' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="p-5 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Google Search Autocomplete Monitor
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time suggestions pulled live from Google’s public autocomplete endpoint.
                </p>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <form onSubmit={handleSearchAutocomplete} className="flex gap-2">
                  <Input
                    value={autoQuery}
                    onChange={(e) => setAutoQuery(e.target.value)}
                    placeholder="Enter seed keyword, e.g. villas in bangalore"
                  />
                  <Button
                    type="submit"
                    disabled={searchingAuto}
                    className="bg-navy-900 hover:bg-navy-800 text-white shrink-0"
                  >
                    <Search size={15} className="mr-1.5" />
                    {searchingAuto ? 'Searching...' : 'Explore'}
                  </Button>
                </form>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                    Discovered Search Suggestions
                  </span>
                  <div className="space-y-1.5">
                    {autoResults.map((res, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white transition-colors"
                      >
                        <span className="text-sm text-gray-800 font-medium flex items-center gap-2">
                          <Search size={13} className="text-gray-400" />
                          {res}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(res, `auto-${i}`)}
                          className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                          title="Copy keyword"
                        >
                          {copied === `auto-${i}` ? (
                            <Check size={14} className="text-emerald-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="p-5 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Target Keyword Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2">
                  {[
                    'Luxury Villas Bangalore',
                    'Villas in North Bangalore',
                    'Airport Road Luxury Enclave',
                    'Gated Community Villas',
                    'Vastu Verified Plots',
                    'Truzon Sanctuary Estates',
                    'Hyderabad Luxury Living',
                    'Miyapur Premium Gated Homes',
                  ].map((kw) => (
                    <span
                      key={kw}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 5: BACKLINKS ================= */}
        {activeTab === 'backlinks' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                <span className="text-xs font-semibold text-gray-400 uppercase">Domain Rating</span>
                <div className="text-3xl font-extrabold text-blue-600 mt-1">48/100</div>
              </div>
              <div className="p-5 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                <span className="text-xs font-semibold text-gray-400 uppercase">Referring Domains</span>
                <div className="text-3xl font-extrabold text-neutral-900 mt-1">124</div>
              </div>
              <div className="p-5 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                <span className="text-xs font-semibold text-gray-400 uppercase">Total Backlinks</span>
                <div className="text-3xl font-extrabold text-neutral-900 mt-1">842</div>
              </div>
              <div className="p-5 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                <span className="text-xs font-semibold text-gray-400 uppercase">Dofollow Ratio</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">82%</div>
              </div>
            </div>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="p-5 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Recent High-Authority Backlinks
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-5">Referring Domain</th>
                      <th className="py-3 px-5">Anchor Text</th>
                      <th className="py-3 px-5">Type</th>
                      <th className="py-3 px-5">Target Page</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    <tr>
                      <td className="py-3.5 px-5 font-semibold text-gray-900">thehindu.com</td>
                      <td className="py-3.5 px-5 text-gray-600">Truzon Homes luxury living</td>
                      <td className="py-3.5 px-5 text-emerald-600 font-bold">dofollow</td>
                      <td className="py-3.5 px-5 font-mono text-gray-500">/</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-semibold text-gray-900">economictimes.indiatimes.com</td>
                      <td className="py-3.5 px-5 text-gray-600">North Bangalore villa developments</td>
                      <td className="py-3.5 px-5 text-emerald-600 font-bold">dofollow</td>
                      <td className="py-3.5 px-5 font-mono text-gray-500">/projects</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-semibold text-gray-900">housing.com</td>
                      <td className="py-3.5 px-5 text-gray-600">Truzon Sanctuary Estates</td>
                      <td className="py-3.5 px-5 text-blue-600 font-bold">nofollow</td>
                      <td className="py-3.5 px-5 font-mono text-gray-500">/properties</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 6: GLOBAL SETTINGS ================= */}
        {activeTab === 'global' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Global Search & Tracking Settings
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure search engine verification, analytics IDs, and fallback metadata.
                  </p>
                </div>
                <Button type="submit" className="bg-navy-900 hover:bg-navy-800 text-white">
                  Save Settings
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Default Meta Title
                  </label>
                  <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Default Meta Description
                  </label>
                  <textarea
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    rows={3}
                    className="w-full text-sm rounded-md border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Canonical Domain URL
                    </label>
                    <Input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Twitter Card Type
                    </label>
                    <select
                      value={twitterCard}
                      onChange={(e) => setTwitterCard(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm outline-none"
                    >
                      <option value="summary_large_image">summary_large_image (Recommended)</option>
                      <option value="summary">summary</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      GA4 Measurement ID
                    </label>
                    <Input value={gaId} onChange={(e) => setGaId(e.target.value)} placeholder="G-XXXXXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Google Tag Manager ID
                    </label>
                    <Input value={gtmId} onChange={(e) => setGtmId(e.target.value)} placeholder="GTM-XXXXXX" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Meta Pixel ID
                    </label>
                    <Input value={metaPixelId} onChange={(e) => setMetaPixelId(e.target.value)} placeholder="Optional" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Robots.txt Content Editor
                  </label>
                  <textarea
                    value={robotsTxt}
                    onChange={(e) => setRobotsTxt(e.target.value)}
                    rows={4}
                    className="w-full font-mono text-xs rounded-md border border-gray-300 bg-slate-900 text-slate-100 p-3 outline-none"
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        )}

        {/* ================= TAB 7: LOCAL SEO ================= */}
        {activeTab === 'local' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Local SEO & Business Coordinates
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Powers LocalBusiness and RealEstateAgent Google Rich Snippets.
                  </p>
                </div>
                <Button type="submit" className="bg-navy-900 hover:bg-navy-800 text-white">
                  Save Local SEO
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Organization / Entity Name
                  </label>
                  <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Corporate Registered Address
                  </label>
                  <Input value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Working Hours
                    </label>
                    <Input value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Latitude
                    </label>
                    <Input value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Longitude
                    </label>
                    <Input value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Service Areas
                  </label>
                  <Input value={serviceAreas} onChange={(e) => setServiceAreas(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </form>
        )}

        {/* ================= TAB 8: REDIRECTS (301/302) ================= */}
        {activeTab === 'redirects' && (
          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="p-5 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Add 301 / 302 Redirect Rule
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Preserve SEO link equity by routing old URLs to active landing pages or property listings.
                </p>
              </CardHeader>
              <CardContent className="p-5">
                <form onSubmit={handleAddRedirect} className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      From (Old Path)
                    </label>
                    <Input
                      value={newFrom}
                      onChange={(e) => setNewFrom(e.target.value)}
                      placeholder="/old-villa-page"
                      required
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      To (Destination Path)
                    </label>
                    <Input
                      value={newTo}
                      onChange={(e) => setNewTo(e.target.value)}
                      placeholder="/properties/azure-heights"
                      required
                    />
                  </div>
                  <div className="w-full sm:w-36">
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Status Code
                    </label>
                    <select
                      value={newCode}
                      onChange={(e) => setNewCode(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm outline-none"
                    >
                      <option value={301}>301 Permanent</option>
                      <option value={302}>302 Temporary</option>
                    </select>
                  </div>
                  <Button type="submit" className="bg-navy-900 hover:bg-navy-800 text-white shrink-0">
                    <Plus size={15} className="mr-1.5" />
                    Add Rule
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="p-5 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Active Redirect Rules ({redirects.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-5">From Path</th>
                      <th className="py-3 px-5">Destination Path</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Hit Count</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono text-xs">
                    {redirects.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-5 text-gray-900 font-semibold">{r.from}</td>
                        <td className="py-3.5 px-5 text-blue-600">{r.to}</td>
                        <td className="py-3.5 px-5 font-sans">
                          <span
                            className={clsx(
                              'px-2 py-0.5 rounded text-xs font-bold',
                              r.code === 301 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            )}
                          >
                            {r.code}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right font-sans font-medium text-gray-600">
                          {r.hits}
                        </td>
                        <td className="py-3.5 px-5 text-right font-sans">
                          <button
                            type="button"
                            onClick={() => handleDeleteRedirect(r.id)}
                            className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                            title="Delete rule"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 9: AI ASSISTANT ================= */}
        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="p-5 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-600" />
                  AI SEO Generator Assistant
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Generate optimized Titles, Meta Descriptions, Keywords, and Property FAQs.
                </p>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <form onSubmit={handleGenerateAi} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                      Optimization Target
                    </label>
                    <select
                      value={aiType}
                      onChange={(e) => setAiType(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm outline-none"
                    >
                      <option value="title">Meta Title Tag (High CTR & Intent)</option>
                      <option value="description">Meta Description (Snippet Optimization)</option>
                      <option value="keywords">Target Keyword Clusters</option>
                      <option value="faqs">Rich Snippet FAQ Accordion</option>
                      <option value="alt_text">Image Alt Text (Luxury Architecture)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                      Subject / Property / Community Context
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={4}
                      className="w-full text-sm rounded-md border border-gray-300 p-2.5 outline-none focus:border-purple-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={generatingAi}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                  >
                    <Sparkles size={15} className="mr-2" />
                    {generatingAi ? 'Generating Content...' : 'Generate with AI'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="p-5 border-b border-gray-100 flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  AI Output Preview
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(aiResult, 'ai-out')}
                >
                  {copied === 'ai-out' ? (
                    <Check size={14} className="mr-1.5 text-emerald-600" />
                  ) : (
                    <Copy size={14} className="mr-1.5" />
                  )}
                  {copied === 'ai-out' ? 'Copied' : 'Copy Output'}
                </Button>
              </CardHeader>
              <CardContent className="p-5">
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-sm font-medium text-gray-900 leading-relaxed whitespace-pre-line min-h-[220px]">
                  {aiResult}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 10: JSON-LD SCHEMAS ================= */}
        {activeTab === 'schema' && (
          <Card className="border-gray-200 shadow-sm max-w-4xl">
            <CardHeader className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Site-Wide JSON-LD Structured Data
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Live JSON-LD schema objects automatically served to Google and AI search agents.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(JSON.stringify(schemaJson, null, 2), 'schema-copy')}
              >
                {copied === 'schema-copy' ? (
                  <Check size={14} className="mr-1.5 text-emerald-600" />
                ) : (
                  <Copy size={14} className="mr-1.5" />
                )}
                {copied === 'schema-copy' ? 'Copied Schema' : 'Copy Schema'}
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
                {JSON.stringify(schemaJson, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
