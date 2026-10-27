// ==============================================================
// 1. INITIALIZATION ON PAGE LOAD
// ==============================================================
document.addEventListener("DOMContentLoaded", () => {
    // Setup Dark Mode
    setupTheme();

    // Execute Auto-SEO Engine
    runAutoSEO();
});

// ==============================================================
// 2. DARK MODE LOGIC
// ==============================================================
function setupTheme() {
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    if(!sunIcon || !moonIcon) return; 

    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        sunIcon.classList.remove('hidden'); moonIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        sunIcon.classList.add('hidden'); moonIcon.classList.remove('hidden');
    }
}

function toggleDarkMode() {
    const htmlTag = document.documentElement;
    if (htmlTag.classList.contains('dark')) {
        htmlTag.classList.remove('dark'); localStorage.setItem('theme', 'light');
    } else {
        htmlTag.classList.add('dark'); localStorage.setItem('theme', 'dark');
    }
    setupTheme();
}

// ==============================================================
// 3. LIVE SEARCH LOGIC
// ==============================================================
const searchDatabase = [
    { title: "Home", link: "index.html" },
    { title: "Latest Jobs", link: "latest-jobs.html" },
    { title: "Latest Result", link: "latest-result.html" },
    { title: "Admit Card", link: "admit-card.html" },
    { title: "Answer Key", link: "answer-key.html" },
    { title: "Syllabus", link: "syllabus.html" },
    { title: "Admission Form", link: "admission-form.html" },
    { title: "Upcoming Jobs", link: "upcoming-jobs.html" },
    { title: "Sarkari Yojana", link: "sarkari-yojana.html" },
    { title: "About Us", link: "about-us.html" },
    { title: "Contact Us", link: "contact-us.html" },
    { title: "Privacy Policy", link: "privacy-policy.html" },
    { title: "Terms And Conditions", link: "terms-and-conditions.html" },
    { title: "Disclaimer", link: "disclaimer.html" },
    { title: "404 Page", link: "404.html" },
    { title: "Coming Soon", link: "coming-soon.html" },
    { title: "RRB Railway Technician Syllabus 2026", link: "coming-soon.html" },
    { title: "SSC CGL Syllabus 2026", link: "coming-soon.html" }
];

function toggleSearch() {
    const container = document.getElementById('search-container');
    if(container) {
        container.classList.toggle('hidden');
        if(!container.classList.contains('hidden')) document.getElementById('search-input').focus();
    }
}

function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const resultsUl = document.getElementById('search-results');
    if(!resultsUl) return;

    resultsUl.innerHTML = '';
    if(query.length === 0) { resultsUl.classList.add('hidden'); return; }
    
    resultsUl.classList.remove('hidden');
    const matches = searchDatabase.filter(item => item.title.toLowerCase().includes(query));
    
    if(matches.length > 0) {
        matches.forEach(match => {
            resultsUl.innerHTML += `<li class="border-b dark:border-gray-700 last:border-0"><a href="${match.link}" class="block py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-red-500 font-semibold transition">${match.title}</a></li>`;
        });
    } else {
        resultsUl.innerHTML = `<li class="py-2 text-sm text-red-500 font-bold text-center">No Result Found</li>`;
    }
}

// ==============================================================
// 4. ULTIMATE AUTO-SEO & SCHEMA ENGINE
// ==============================================================
function runAutoSEO() {
    const pageUrl = window.location.href;
    const pagePath = window.location.pathname.toLowerCase();
    
    const h1Element = document.querySelector('main h1');
    const pageTitle = h1Element ? h1Element.innerText : 'The Rojgar Result - Sarkari Result & Latest Jobs';
    
    const firstParagraph = document.querySelector('main p');
    let pageDescription = firstParagraph ? firstParagraph.innerText.substring(0, 155) + "..." : "Get the latest Sarkari Result, Govt Jobs, Admit Cards, and Answer Keys on The Rojgar Result.";

    function setMeta(name, content, isProperty = false) {
        if (!content) return;
        let selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let metaTag = document.querySelector(selector);
        
        if (!metaTag) {
            metaTag = document.createElement('meta');
            if (isProperty) metaTag.setAttribute('property', name);
            else metaTag.setAttribute('name', name);
            document.head.appendChild(metaTag);
        }
        if (metaTag.getAttribute('content') === '' || !metaTag.hasAttribute('content')) {
            metaTag.setAttribute('content', content);
        }
    }

    if (document.title === '' || document.title === 'Document') {
        document.title = `${pageTitle} - The Rojgar Result`;
    }

    setMeta('description', pageDescription);
    setMeta('og:title', document.title, true);
    setMeta('og:description', pageDescription, true);
    setMeta('og:url', pageUrl, true);
    setMeta('og:type', (pagePath.includes('post') || h1Element) ? 'article' : 'website', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', document.title);
    setMeta('twitter:description', pageDescription);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', pageUrl.split('?')[0]); 
        document.head.appendChild(canonical);
    }

    function injectSchema(schemaObj) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schemaObj);
        document.head.appendChild(script);
    }

    // Auto Breadcrumb Schema
    let pathArray = window.location.pathname.split('/').filter(p => p.length > 0 && !p.includes('.html') && p !== 'index');
    if (pathArray.length > 0) {
        let breadcrumbList = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": window.location.origin
            }]
        };
        let currentPath = window.location.origin;
        pathArray.forEach((path, index) => {
            currentPath += `/${path}`;
            breadcrumbList.itemListElement.push({
                "@type": "ListItem",
                "position": index + 2,
                "name": path.replace(/-/g, ' ').toUpperCase(),
                "item": currentPath
            });
        });
        injectSchema(breadcrumbList);
    }

    // Auto Page/Job Schema
    if (pagePath === '/' || pagePath.includes('index.html')) {
        injectSchema({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "The Rojgar Result",
            "url": window.location.origin,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${window.location.origin}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        });
    } else if (pagePath.includes('about') || pagePath.includes('privacy') || pagePath.includes('terms') || pagePath.includes('contact')) {
        injectSchema({
            "@context": "https://schema.org",
            "@type": pagePath.includes('about') ? "AboutPage" : pagePath.includes('contact') ? "ContactPage" : "WebPage",
            "name": pageTitle,
            "description": pageDescription,
            "url": pageUrl
        });
    } else if (h1Element) {
        const isJob = pageTitle.toLowerCase().includes('form') || pageTitle.toLowerCase().includes('recruitment');
        let postSchema = {
            "@context": "https://schema.org",
            "@type": isJob ? "JobPosting" : "Article",
            "headline": pageTitle,
            "title": pageTitle,
            "description": pageDescription,
            "datePosted": new Date().toISOString().split('T')[0],
            "publisher": {
                "@type": "Organization",
                "name": "The Rojgar Result",
                "logo": { "@type": "ImageObject", "url": `${window.location.origin}/images/logo.png` }
            }
        };
        if (isJob) {
            postSchema.employmentType = "FULL_TIME";
            postSchema.hiringOrganization = { "@type": "Organization", "name": "Govt Department" };
            postSchema.jobLocation = { "@type": "Place", "address": { "@type": "PostalAddress", "addressCountry": "IN" } };
        }
        injectSchema(postSchema);
    }

    // Auto FAQ Schema
    const faqItems = document.querySelectorAll('details');
    if (faqItems.length > 0) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": []
        };
        faqItems.forEach(item => {
            const summaryElem = item.querySelector('summary');
            if (summaryElem) {
                const question = summaryElem.innerText.replace('Q.', '').trim();
                const answer = item.innerText.replace(summaryElem.innerText, '').replace('Ans:', '').trim();
                faqSchema.mainEntity.push({
                    "@type": "Question",
                    "name": question,
                    "acceptedAnswer": { "@type": "Answer", "text": answer }
                });
            }
        });
        injectSchema(faqSchema);
    }
}

// ==============================================================
// 5. SMART EMPTY LINK HANDLER & TOAST NOTIFICATION
// ==============================================================
document.addEventListener('click', function(e) {
    let target = e.target.closest('a');
    
    // Agar koi link pe "#" hai ya wo khali hai
    if (target && (target.getAttribute('href') === '#' || target.getAttribute('href') === '')) {
        e.preventDefault(); 
        showToast("Link will be activated soon or currently unavailable!");
    }
});

function showToast(message) {
    let existingToast = document.getElementById('rr-toast');
    if (existingToast) existingToast.remove();

    let toast = document.createElement('div');
    toast.id = 'rr-toast';
    toast.className = "fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-6 py-3 rounded-full shadow-2xl z-[9999] transition-all duration-300 opacity-0 translate-y-5 flex items-center gap-2 text-sm";
    toast.innerHTML = `<span>⚠️</span> ${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-5');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-5');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

  /* ==============================================================
   CLICK OUTSIDE TO CLOSE SEARCH BAR
   ============================================================== */
document.addEventListener('click', function(event) {
    // सर्च कंटेनर को खोजें
    const searchContainer = document.getElementById('search-container');
    
    // अगर सर्च कंटेनर मौजूद है और खुला हुआ है (hidden क्लास नहीं है)
    if (searchContainer && !searchContainer.classList.contains('hidden')) {
        
        // चेक करें कि क्या यूजर ने सर्च बॉक्स के अंदर क्लिक किया है
        const isClickInsideSearch = searchContainer.contains(event.target);
        
        // चेक करें कि क्या यूजर ने सर्च वाले बटन पर क्लिक किया है
        const isClickOnSearchButton = event.target.closest('button[onclick="toggleSearch()"]');
        
        // अगर क्लिक न तो सर्च बॉक्स के अंदर है और न ही बटन पर, तो उसे बंद कर दें
        if (!isClickInsideSearch && !isClickOnSearchButton) {
            searchContainer.classList.add('hidden');
        }
    }
});











