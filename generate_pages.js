const fs = require('fs');
const path = require('path');

const root = 'c:\\Users\\dufhm\\Desktop\\Web Project\\the-rojgar-result';
const dataFile = path.join(root, 'post data');
const latestJobsFile = path.join(root, 'latest-jobs.html');
const indexFile = path.join(root, 'index.html');

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') + '.html';
}

function cleanTitle(raw) {
  return raw.replace(/\s*\|.*$/, '').replace(/\s+\(.*?\)/g, '').trim();
}

function normalize(raw) {
  return raw.replace(/\r/g, '').trim();
}

// Parse post data blocks separated by divider lines.
const raw = normalize(fs.readFileSync(dataFile, 'utf8'));
const divider = '##########################################################################################';
const blocks = raw.split(divider).map(x => x.trim()).filter(x => x && x.includes('GENERAL VACANCY INFORMATION'));

const posts = blocks.slice(0, 8).map(block => {
  const lines = block.split('\n').map(x => x.trim());
  const generalIndex = lines.findIndex(x => x === 'GENERAL VACANCY INFORMATION');
  const titleLine = (generalIndex >= 0 && lines[generalIndex + 1]) ? lines[generalIndex + 1] : lines.find(line => line.startsWith('- '));
  const title = cleanTitle(titleLine.replace(/^-\s?/, ''));

  const lastDateMatch = block.match(/-\s*Last Date\s*\|\s*([^\n]+)/i);
  const lastDate = lastDateMatch ? lastDateMatch[1].trim() : 'As per notification';

  const orgMatch = block.match(/-\s*Organization\s*\|\s*([^\n]+)/i);
  const org = orgMatch ? orgMatch[1].trim() : 'The Rojgar Result';

  const examMatch = block.match(/-\s*Exam Name\s*\|\s*([^\n]+)/i);
  const exam = examMatch ? examMatch[1].trim() : 'Recruitment 2026';

  const vacMatch = block.match(/-\s*Total Vacancy\s*\|\s*([^\n]+)/i);
  const vacancy = vacMatch ? vacMatch[1].trim() : 'Vacancy details';

  const officialMatch = block.match(/-\s*Official Website\s*\|\s*([^\n]+)/i);
  const official = officialMatch ? officialMatch[1].trim() : 'https://therojgarresult.com/';

  const postDateMatch = block.match(/-\s*Post Date\s*\|\s*([^\n]+)/i) || block.match(/-\s*Post Date\s*:\s*([^\n]+)/i);
  const postDate = postDateMatch ? postDateMatch[1].trim() : 'As per notification';

  const applyStart = block.match(/-\s*Apply Online Start Date\s*\|\s*([^\n]+)/i)?.[1]?.trim() || 'As per schedule';
  const lastDatePay = block.match(/-\s*Last Date Pay Fees\s*\|\s*([^\n]+)/i)?.[1]?.trim() || lastDate;
  const admitDate = block.match(/-\s*Admit Card Released Date\s*\|\s*([^\n]+)/i)?.[1]?.trim() || 'As per schedule';
  const examDate = block.match(/-\s*Exam Date\s*\|\s*([^\n]+)/i)?.[1]?.trim() || 'As per schedule';
  const resultDate = block.match(/-\s*Result Declared Date\s*\|\s*([^\n]+)/i)?.[1]?.trim() || 'As per schedule';

  const eligibilityLine = lines
    .find(line => line.toLowerCase().includes('candidates must have')) ||
    lines.find(line => line.toLowerCase().includes('eligibility')) ||
    'Candidates must read the complete notification and check the eligibility details before applying.';

  const minAgeMatch = block.match(/-\s*Minimum Age\s*\|\s*([^\n]+)/i);
  const maxAgeMatch = block.match(/-\s*Maximum Age\s*\|\s*([^\n]+)/i);
  const ageLimit = minAgeMatch && maxAgeMatch ? `${minAgeMatch[1].trim()} to ${maxAgeMatch[1].trim()}` : 'As per notification';

  const feeLines = lines.filter(line => line.startsWith('- General') || line.startsWith('- SC / ST / PwBD / EWS / SEBC') || line.startsWith('- Female') || line.startsWith('- OBC'));
  const fee = feeLines.length ? feeLines.join(' | ') : 'As per notification';

  const applicationMode = block.match(/-\s*Application Mode\s*\|\s*([^\n]+)/i)?.[1]?.trim() || 'Online';
  const applyStepsRaw = block.match(/HOW TO APPLY[^\n]*([\s\S]*?)SOME USEFUL IMPORTANT LINKS/i)?.[1] || 'Visit the official website, register, fill the form, upload documents, and pay the fee before submitting.';
  const applySteps = applyStepsRaw
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    title,
    file: slugify(title),
    lastDate,
    org,
    exam,
    vacancy,
    official,
    postDate,
    applyStart,
    lastDatePay,
    admitDate,
    examDate,
    resultDate,
    ageLimit,
    fee,
    applicationMode,
    eligibilityLine,
    applySteps,
    summary: `${title}. ${org} announced a government job recruitment opportunity for ${vacancy}.`,
  };
});

function esc(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;');
}

function pageTemplate(post) {
  const safeTitle = esc(post.title);
  const safeOrg = esc(post.org);
  const safeExam = esc(post.exam);
  const safeVacancy = esc(post.vacancy);
  const safeSummary = esc(post.summary);
  const safeLastDate = esc(post.lastDate);
  const safeOfficial = esc(post.official);
  const safePostDate = esc(post.postDate);
  const safeAgeLimit = esc(post.ageLimit);
  const safeFee = esc(post.fee);
  const safeApplicationMode = esc(post.applicationMode);
  const safeEligibility = esc(post.eligibilityLine);
  const safeSteps = esc(post.applySteps.replace(/\n/g, ' '));
  const safeApplyStart = esc(post.applyStart);
  const safePayLast = esc(post.lastDatePay);
  const safeAdmitDate = esc(post.admitDate);
  const safeExamDate = esc(post.examDate);
  const safeResultDate = esc(post.resultDate);

  const faq = `
      <details class="bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600 cursor-pointer">
        <summary class="font-bold outline-none">Q. What is the last date to apply for ${safeTitle}?</summary>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">Ans: The last date to apply is <strong>${safeLastDate}</strong>.</p>
      </details>
      <details class="bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600 cursor-pointer">
        <summary class="font-bold outline-none">Q. What is the recruitment organization?</summary>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">Ans: The organization is <strong>${safeOrg}</strong>.</p>
      </details>
      <details class="bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600 cursor-pointer">
        <summary class="font-bold outline-none">Q. What is the application mode?</summary>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">Ans: Applications are accepted in <strong>${safeApplicationMode}</strong> mode.</p>
      </details>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - The Rojgar Result</title>
  <meta name="title" content="${safeTitle} - The Rojgar Result">
  <meta name="description" content="${safeSummary}">
  <meta name="keywords" content="The Rojgar Result, Sarkari Result, Latest Jobs, ${safeTitle}">
  <meta name="robots" content="index, follow">
  <meta name="language" content="English, Hindi">
  <meta property="og:title" content="${safeTitle} - The Rojgar Result">
  <meta property="og:description" content="${safeSummary}">
  <meta property="og:url" content="https://therojgarresult.com/${post.file}">
  <meta property="og:image" content="https://therojgarresult.com/images/favicon.png">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"${safeTitle}","description":"${safeSummary}","publisher":{"@type":"Organization","name":"The Rojgar Result"}}</script>

  <link rel="icon" type="image/png" href="images/favicon.png">
  <link rel="preconnect" href="https://cdn.tailwindcss.com">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: { extend: { colors: { rrRed: '#a30000', rrBlue: '#1f4fb2' } } }
    };
  </script>
  <link rel="stylesheet" href="style.css">
  <script>
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  </script>
</head>
<body class="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
  <header class="bg-rrBlue dark:bg-gray-950 text-white shadow-md border-b-4 border-rrRed sticky top-0 z-50 transition-colors duration-300">
    <div class="max-w-[1400px] w-[98%] mx-auto px-2 md:px-4 py-3 flex justify-between items-center relative">
      <a href="/" class="text-2xl md:text-3xl font-extrabold tracking-wide drop-shadow-md">TheRojgarResult</a>
      <div class="flex items-center gap-3">
        <button onclick="toggleSearch()" class="p-2 rounded-full bg-blue-700 dark:bg-gray-800 text-white hover:bg-blue-600 dark:hover:bg-gray-700 transition shadow-inner focus:outline-none">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <button onclick="toggleDarkMode()" class="p-2 rounded-full bg-white dark:bg-gray-800 text-rrBlue dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-inner focus:outline-none">
          <svg id="sun-icon" class="hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <svg id="moon-icon" class="block w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </button>
        <div id="search-container" class="hidden absolute top-full right-4 mt-3 w-72 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-3 z-50 transition-all">
          <div class="relative">
            <input type="text" id="search-input" onkeyup="performSearch()" placeholder="Search Jobs, Result, Admit Card..." class="w-full p-2 pl-3 pr-8 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500">
          </div>
          <ul id="search-results" class="mt-2 max-h-48 overflow-y-auto hidden"></ul>
        </div>
      </div>
    </div>
  </header>

  <nav class="bg-yellow-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 shadow-sm">
    <div class="max-w-[1400px] w-[98%] mx-auto px-2 md:px-4 py-2 flex space-x-6 overflow-x-auto whitespace-nowrap text-sm md:text-base font-bold text-gray-800 dark:text-gray-200">
      <a href="index.html" class="hover:text-rrRed dark:hover:text-blue-400 px-2 transition">HOME</a>
      <a href="latest-jobs.html" class="hover:text-rrRed dark:hover:text-blue-400 px-2 transition">LATEST JOBS</a>
      <a href="admit-card.html" class="hover:text-rrRed dark:hover:text-blue-400 px-2 transition">ADMIT CARD</a>
      <a href="latest-result.html" class="hover:text-rrRed dark:hover:text-blue-400 px-2 transition">RESULT</a>
      <a href="answer-key.html" class="hover:text-rrRed dark:hover:text-blue-400 px-2 transition">ANSWER KEY</a>
      <a href="syllabus.html" class="hover:text-rrRed dark:hover:text-blue-400 px-2 transition">SYLLABUS</a>
      <a href="admission-form.html" class="hover:text-rrRed dark:hover:text-blue-400 px-2 transition">ADMISSION</a>
    </div>
  </nav>

  <main class="max-w-[1200px] w-[98%] mx-auto mt-6 px-2 md:px-0 mb-10 flex-grow">
    <article class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-xl rounded-xl overflow-hidden p-4 md:p-8">
      <div class="text-center mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-4">
        <div class="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 font-bold px-3 py-1 rounded-full text-xs mb-3 shadow border border-green-300 dark:border-green-600">
          LATEST JOBS
        </div>
        <h1 class="text-2xl md:text-4xl font-bold text-rrRed dark:text-red-400 mb-2 leading-tight">${safeTitle}</h1>
        <h2 class="text-lg md:text-xl font-bold text-blue-800 dark:text-blue-400 mt-2">${safeOrg}</h2>
        <p class="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-3">
          Post Update: ${safePostDate} | ${safeExam}
        </p>
      </div>

      <div class="mb-8 text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border-l-4 border-rrBlue">
        <p class="mb-3"><strong>${safeOrg}</strong> has published the official recruitment notification for <strong>${safeTitle}</strong>. This vacancy is for ${safeVacancy}. Applicants are advised to check the recruitment rules, age restriction, eligibility, fee, and official website before applying.</p>
        <p>${safeSummary}</p>
      </div>

      <div class="w-full bg-gray-200 dark:bg-gray-700 text-center rounded-lg py-6 mb-6 text-gray-500 font-bold border border-dashed border-gray-400">
        Ad Banner Space (728x90)
      </div>

      <div class="overflow-x-auto rounded-lg mb-8">
        <table class="job-table bg-gray-50 dark:bg-gray-700 text-sm md:text-base">
          <thead>
            <tr class="bg-rrBlue text-white">
              <th colspan="2" class="text-center text-lg py-3">Important Dates & Application Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="w-1/2 align-top">
                <ul class="list-disc ml-5 space-y-1.5">
                  <li>Application Begin : <strong class="text-red-600 dark:text-red-400">${safeApplyStart}</strong></li>
                  <li>Last Date for Apply : <strong>${safeLastDate}</strong></li>
                  <li>Last Date Pay Fees : <strong>${safePayLast}</strong></li>
                  <li>Admit Card Available : <strong>${safeAdmitDate}</strong></li>
                  <li>Exam Date : <strong>${safeExamDate}</strong></li>
                  <li>Result Declared Date : <strong>${safeResultDate}</strong></li>
                </ul>
              </td>
              <td class="w-1/2 align-top">
                <ul class="list-disc ml-5 space-y-1.5">
                  <li>${safeFee}</li>
                  <li>Pay the application fee through the official portal using the configured payment mode.</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="overflow-x-auto mb-8 rounded-lg">
        <table class="job-table bg-gray-50 dark:bg-gray-700 rounded-lg text-sm md:text-base">
          <thead>
            <tr class="bg-orange-600 text-white">
              <th class="text-center text-lg py-2">Age Limit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <ul class="list-disc ml-5 space-y-1.5">
                  <li>Minimum Age : <strong>${safeAgeLimit.split(' to ')[0] || 'As per notification'}</strong></li>
                  <li>Maximum Age : <strong>${safeAgeLimit.split(' to ')[1] || safeAgeLimit}</strong></li>
                  <li>Age Relaxation Extra as per recruitment rules.</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="overflow-x-auto rounded-lg mb-8">
        <table class="job-table bg-gray-50 dark:bg-gray-700 text-sm md:text-base">
          <thead>
            <tr class="bg-green-700 text-white">
              <th colspan="3" class="text-center text-lg py-2">Vacancy Details Total : ${safeVacancy}</th>
            </tr>
            <tr class="bg-gray-200 dark:bg-gray-600 text-black dark:text-white">
              <th>Post Name</th>
              <th>Total Post</th>
              <th>Eligibility Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold text-center">${safeTitle}</td>
              <td class="text-center font-bold text-red-600 dark:text-red-400">${safeVacancy}</td>
              <td>${safeEligibility}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
        <div class="bg-rrBlue dark:bg-rrBlue text-white px-4 py-2 font-bold text-lg">How to Fill Form (Online Apply)</div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800">
          <ul class="list-disc ml-5 space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
            <li>${safeTitle}. Candidate can apply online within the last date.</li>
            <li>Candidate must read the full notification before filling the recruitment application form.</li>
            <li>Kindly check and collect all documents including eligibility, ID proof, address details, and basic details.</li>
            <li>Kindly keep scanned documents ready such as photo, signature, id proof, and other required documents.</li>
            <li>Before submit the application form, check all filled columns and the preview carefully.</li>
            <li>Take a printout of the final submitted form for future reference.</li>
          </ul>
        </div>
      </div>

      <div class="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-600 rounded-lg text-yellow-800 dark:text-yellow-200 text-sm">
        <strong class="uppercase">Important Note:</strong> All the information given in this post is in short. Candidates who are thinking of applying should first read the complete notification and then apply.
      </div>

      <div class="border-2 border-rrBlue dark:border-blue-500 rounded-lg p-4 md:p-6 bg-blue-50 dark:bg-gray-800 mb-10 shadow-inner">
        <h2 class="text-2xl font-bold text-center text-rrBlue dark:text-blue-400 mb-6">Important Links</h2>
        <div class="flex flex-col md:flex-row justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-3 mb-3">
          <span class="font-bold text-lg">Apply Online</span>
          <a href="${safeOfficial}" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold w-full md:w-auto text-center mt-2 md:mt-0 transition shadow">Click Here</a>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-3 mb-3">
          <span class="font-bold text-lg">Download Notification</span>
          <a href="${safeOfficial}" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold w-full md:w-auto text-center mt-2 md:mt-0 transition shadow">Click Here</a>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center pb-2">
          <span class="font-bold text-lg">Official Website</span>
          <a href="${safeOfficial}" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded font-bold w-full md:w-auto text-center mt-2 md:mt-0 transition shadow">Click Here</a>
        </div>
      </div>

      <div class="w-full bg-gray-200 dark:bg-gray-700 text-center rounded-lg py-6 mb-10 text-gray-500 font-bold border border-dashed border-gray-400">
        Ad Banner Space (728x90)
      </div>

      <div class="mb-10">
        <h2 class="text-2xl font-bold mb-4 border-b-2 border-rrRed pb-2 inline-block">Frequently Asked Questions (FAQ)</h2>
        <div class="space-y-3 mt-4">
          ${faq}
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold mb-4 border-b-2 border-rrBlue pb-2 inline-block">Related Jobs / Updates</h2>
        <div class="related-scroll gap-4 no-scrollbar pb-2 mt-4">
          <a href="latest-jobs.html" class="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-xs md:text-sm shadow hover:bg-blue-700 transition">View All Latest Jobs</a>
        </div>
      </div>
    </article>
  </main>

  <footer class="bg-rrBlue dark:bg-gray-950 text-white mt-4 border-t-4 border-rrRed">
    <div class="max-w-[1400px] w-[98%] mx-auto px-2 md:px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-center md:text-left">
      <div>
        <h3 class="text-lg font-bold border-b-2 border-blue-400 dark:border-gray-700 pb-2 mb-4">About The Rojgar Result</h3>
        <p class="text-blue-100 dark:text-gray-400 leading-relaxed">The Rojgar Result is a leading platform providing fast, accurate, and real-time updates for Sarkari Result, Latest Jobs, Admit Cards, and Admission details since 2026.</p>
      </div>
      <div>
        <h3 class="text-lg font-bold border-b-2 border-blue-400 dark:border-gray-700 pb-2 mb-4">Important Links</h3>
        <ul class="grid grid-cols-2 gap-x-4 gap-y-3 text-blue-100 dark:text-gray-400 text-left md:text-center lg:text-left mx-auto md:mx-0 w-fit md:w-full">
          <li><a href="about-us.html" class="hover:text-white transition">About Us</a></li>
          <li><a href="contact-us.html" class="hover:text-white transition">Contact Us</a></li>
          <li><a href="disclaimer.html" class="hover:text-white transition">Disclaimer</a></li>
          <li><a href="sitemap.xml" class="hover:text-white transition">Sitemap Here</a></li>
          <li><a href="privacy-policy.html" class="hover:text-white transition">Privacy Policy</a></li>
          <li><a href="terms-and-conditions.html" class="hover:text-white transition">Terms & Conditions</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-bold border-b-2 border-blue-400 dark:border-gray-700 pb-2 mb-4">Connect With Us</h3>
        <div class="flex flex-wrap gap-3 justify-center md:justify-start mt-2">
          <a href="https://t.me/mr_parthh" class="bg-blue-700 dark:bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-800 dark:hover:bg-blue-700 font-bold transition shadow border border-blue-500 dark:border-transparent">Telegram</a>
          <a href="https://chat.whatsapp.com/IO9kQcY25HOKg3jA22THyg?" class="bg-green-600 px-4 py-2 rounded-full hover:bg-green-700 font-bold transition shadow border border-green-500 dark:border-transparent">WhatsApp</a>
        </div>
      </div>
    </div>
    <div class="bg-blue-900 dark:bg-black py-4 text-center text-xs text-blue-200 dark:text-gray-500 tracking-wide">
      &copy; 2026 TheRojgarResult.Com. All Rights Reserved.
    </div>
  </footer>
  <script src="main.js"></script>
</body>
</html>`;
}

for (const post of posts) {
  fs.writeFileSync(path.join(root, post.file), pageTemplate(post));
}

// Update latest-jobs page list by replacing the placeholder list in that page.
let latestJobs = fs.readFileSync(latestJobsFile, 'utf8');
let listHtml = posts.map((post, idx) => `\n                  <li class="border-b border-gray-200 dark:border-gray-700 pb-2 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded transition flex justify-between items-center">
                     <div class="w-[85%]">
                        <a href="${post.file}" class="text-blue-700 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 text-sm md:text-base font-semibold block leading-snug">
                           ${idx + 1}. ${post.title}
                        </a>
                        <span class="text-xs font-bold text-red-600 dark:text-red-400 mt-1 block">Last Date: ${post.lastDate}</span>
                     </div>
                     <span class="bg-green-100 text-green-700 text-[10px] md:text-xs font-bold px-2 py-1 rounded border border-green-300 shadow-sm">Active</span>
                  </li>`).join('');

latestJobs = latestJobs.replace(/<ul class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">[\s\S]*?<\/ul>/m, `<ul class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">${listHtml}\n               </ul>`);
fs.writeFileSync(latestJobsFile, latestJobs);

// Update index latest jobs area.
let index = fs.readFileSync(indexFile, 'utf8');
let cardHtml = posts.map((post, idx) => `               <li class="border-b border-gray-200 dark:border-gray-700 py-2">
                  <a href="${post.file}" class="text-blue-700 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 text-xs md:text-sm font-semibold block leading-snug">${idx + 1}. ${post.title}</a>
                  <span class="text-[11px] font-bold text-red-600 dark:text-red-400 mt-1 block">Last Date: ${post.lastDate}</span>
               </li>`).join('\n');

index = index.replace(/<div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-xl">\s*<div class="bg-yellow-500 text-white flex justify-between items-center px-3 py-2 border-b-2 border-yellow-700">\s*<h2 class="font-bold text-base md:text-lg">Latest Jobs<\/h2>\s*<a href="latest-jobs.html" class="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 font-bold shadow">View\s*All<\/a>\s*<\/div>\s*<ul class="flex-grow p-2 space-y-1">[\s\S]*?<\/ul>\s*<\/div>/m,
`<div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-xl">
   <div class="bg-yellow-500 text-white flex justify-between items-center px-3 py-2 border-b-2 border-yellow-700">
      <h2 class="font-bold text-base md:text-lg">Latest Jobs</h2>
      <a href="latest-jobs.html" class="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 font-bold shadow">View All</a>
   </div>
   <ul class="flex-grow p-2 space-y-1">
${cardHtml}
   </ul>
</div>`);

fs.writeFileSync(indexFile, index);

console.log('Generated', posts.length, 'detail pages from post data.');
