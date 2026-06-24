document.addEventListener('DOMContentLoaded', () => {
  const asset = (name) => `assets/${name}`;
  const supabaseClient = (typeof window.supabase !== 'undefined') ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
  let _currentExecutiveData = [];
  const pageKey = (() => {
    const file = window.location.pathname.split('/').pop() || 'index.html';
    return file.replace(/\.html?$/, '') || 'index';
  })();

  const pageConfigs = {
    about: {
      eyebrow: 'About BAMSSA',
      title: 'Representing every basic medical science student at DELSU.',
      text: 'Founded in 2008, the Basic Medical Sciences Students Association is the umbrella body for students studying Anatomy, Physiology, and Biochemistry at Delta State University.',
      image: asset('campus.webp'),
    },
    departments: {
      eyebrow: 'Departments',
      title: 'Three pillars of the Basic Medical Sciences.',
      text: 'Each department offers a distinct lens on the human body, and together they form the foundation of every clinical career.',
      image: asset('anatomy.webp'),
    },
    events: {
      eyebrow: 'Calendar',
      title: 'Events and gatherings.',
      text: 'From academic bootcamps to community outreach and sports week, this is what is happening at BAMSSA.',
      image: asset('outreach.webp'),
    },
    news: {
      eyebrow: 'Latest news',
      title: 'From the BAMSSA desk.',
      text: 'Stories, announcements, and updates from the association as they happen.',
      image: asset('whitecoat.webp'),
    },
    executives: {
      eyebrow: 'Leadership',
      title: 'Executive Council 2026 / 2027.',
      text: 'The team guiding BAMSSA across academics, welfare, outreach, and student engagement.',
      image: asset('executives-banner.webp'),
    },
    gallery: {
      eyebrow: 'Gallery',
      title: 'Moments from campus life.',
      text: 'A visual mix of lectures, practicals, outreach, and student life across the faculty.',
      image: asset('gallery-campus.webp'),
    },
    suggestions: {
      eyebrow: 'Share Your Suggestions',
      title: 'Anonymous. Honest. Heard.',
      text: 'Your feedback shapes the future of BAMSSA. Share your thoughts freely.',
      image: asset('outreach.webp'),
    },
    staff: {
      eyebrow: 'Staff',
      title: 'The people behind the scenes.',
      text: 'Faculty support and administrative staff who keep the chapter organized and responsive.',
      image: asset('staff-banner.webp'),
    },
  };

  const executiveData = [];

  const galleryData = [];

  const eventData = [
    {
      image: asset('outreach.webp'),
      tag: 'Outreach',
      status: 'Upcoming',
      title: 'BAMSSA Health Awareness Walk 2026',
      text: 'Annual community walk to raise awareness about hypertension and diabetes.',
      when: 'Sat, Jun 13, 2026 - 7:00 AM',
      where: 'Abraka Campus, DELSU',
    },
    {
      image: asset('anatomy.webp'),
      tag: 'Academic',
      status: 'Upcoming',
      title: 'Anatomy Practical Bootcamp',
      text: 'Revision sessions on upper limb dissection ahead of second-semester exams.',
      when: 'Fri, Jun 19, 2026 - 2:00 PM',
      where: 'Anatomy Lab Block C',
    },
    {
      image: asset('sports.webp'),
      tag: 'Sports',
      status: 'Upcoming',
      title: 'BMS Inter-Departmental Sports Week',
      text: 'Anatomy versus Physiology versus Biochemistry in football, athletics, and tug of war.',
      when: 'Mon, Jul 6, 2026 - All week',
      where: 'DELSU Main Field',
    },
    {
      image: asset('whitecoat.webp'),
      tag: 'Academic',
      status: 'Past',
      title: 'White Coat Ceremony - 200 Level',
      text: '312 students were officially welcomed into the Faculty of Basic Medical Sciences.',
      when: 'Sat, May 23, 2026',
      where: 'Convocation Arena',
    },
    {
      image: asset('gallery-seminar.webp'),
      tag: 'Academic',
      status: 'Past',
      title: 'BAMSSA Career Symposium',
      text: 'Alumni from medicine, research, and industry shared career pathways.',
      when: 'Thu, Apr 11, 2026',
      where: 'Faculty Auditorium',
    },
  ];

  function injectHeader(pageKey) {
    const header = document.createElement('header');
    header.className = 'sticky top-0 z-50';
    header.innerHTML = `
      <div class="border-b border-white/10 bg-[#081429] text-slate-200">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <p class="text-xs sm:text-sm text-slate-200/90">Delta State University, Abraka - College of Health Sciences</p>
          <div class="hidden items-center gap-6 text-xs sm:flex">
            <a href="mailto:bamssa@delsu.edu.ng" class="hover:text-white">bamssa@delsu.edu.ng</a>
            <a href="tel:+2349069212042" class="hover:text-white">+234 906 921 2042</a>
          </div>
        </div>
      </div>
      <div class="border-b border-white/10 bg-[#233a68]/55 backdrop-blur-md text-white">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="index.html" class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/10 p-1 ring-1 ring-white/10 sm:h-14 sm:w-14 sm:p-0">
              <img src="${asset('logo-clean.webp')}" alt="Delta State University logo" class="h-full w-full object-contain" />
            </div>
            <div class="min-w-0 leading-tight">
              <p class="text-[0.98rem] font-extrabold tracking-tight text-white sm:text-[1.12rem]">Faculty of Basic Medical Sciences</p>
              <p class="text-sm text-slate-200/90 sm:text-base">Delta State University</p>
            </div>
          </a>
          <nav class="hidden items-center gap-2 lg:flex">
            <a href="index.html" class="${pageKey === 'index' ? 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white'}">Home</a>
            <a href="about.html" class="${pageKey === 'about' ? 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white'}">About</a>
            <a href="departments.html" class="${pageKey === 'departments' ? 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white'}">Departments</a>
            <a href="gallery.html" class="${pageKey === 'gallery' ? 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white'}">Gallery</a>
            <a href="news.html" class="${pageKey === 'news' ? 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white'}">News</a>
            <a href="staff.html" class="${pageKey === 'staff' ? 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white'}">Staff</a>
            <a href="executives.html" class="${pageKey === 'executives' ? 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white'}">Executives</a>
            <a href="suggestions.html" class="${pageKey === 'suggestions' ? 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white'}">Suggestions</a>
            <a href="contact.html" class="${pageKey === 'contact' ? 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white'}">Contact</a>
          </nav>
          <button data-menu-toggle type="button" class="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white lg:hidden">Menu</button>
        </div>
        <div data-mobile-nav class="hidden border-t border-white/10 bg-[#233a68] px-4 py-4 lg:hidden">
          <div class="mx-auto flex max-w-7xl flex-col gap-2 sm:px-2">
            <a href="index.html" class="rounded-xl ${pageKey === 'index' ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white'} px-4 py-3 text-sm font-semibold">Home</a>
            <a href="about.html" class="rounded-xl ${pageKey === 'about' ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white'} px-4 py-3 text-sm font-semibold">About</a>
            <a href="departments.html" class="rounded-xl ${pageKey === 'departments' ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white'} px-4 py-3 text-sm font-semibold">Departments</a>
            <a href="gallery.html" class="rounded-xl ${pageKey === 'gallery' ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white'} px-4 py-3 text-sm font-semibold">Gallery</a>
            <a href="news.html" class="rounded-xl ${pageKey === 'news' ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white'} px-4 py-3 text-sm font-semibold">News</a>
            <a href="staff.html" class="rounded-xl ${pageKey === 'staff' ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white'} px-4 py-3 text-sm font-semibold">Staff</a>
            <a href="executives.html" class="rounded-xl ${pageKey === 'executives' ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white'} px-4 py-3 text-sm font-semibold">Executives</a>
            <a href="suggestions.html" class="rounded-xl ${pageKey === 'suggestions' ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white'} px-4 py-3 text-sm font-semibold">Suggestions</a>
            <a href="contact.html" class="rounded-xl ${pageKey === 'contact' ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white'} px-4 py-3 text-sm font-semibold">Contact</a>
          </div>
        </div>
      </div>`;
    document.body.insertBefore(header, document.querySelector('main'));
  }

  function injectHero(config) {
    const main = document.querySelector('main');
    if (!main || !config) return;
    const hero = document.createElement('section');
    hero.className = 'relative overflow-hidden border-b border-white/10 bg-[#081429]';
    hero.innerHTML = `
      <div class="absolute inset-0">
        <img src="${config.image}" alt="" class="h-full w-full object-cover opacity-30" />
        <div class="absolute inset-0 bg-gradient-to-r from-[#081429]/96 via-[#081429]/84 to-[#081429]/45"></div>
      </div>
      <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <span class="inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-[#243963]/70 px-4 py-2 text-sm font-semibold text-slate-200">${config.eyebrow}</span>
        <h1 class="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">${config.title}</h1>
        <p class="mt-5 max-w-3xl text-lg leading-8 text-slate-200">${config.text}</p>
      </div>`;
    document.body.insertBefore(hero, main);
  }

  function injectFooter() {
    const footer = document.createElement('footer');
    footer.className = 'border-t border-white/10 bg-[#081429] text-slate-200';
    footer.innerHTML = `
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
                <img src="${asset('logo-clean.webp')}" alt="Delta State University logo" class="h-full w-full object-cover" />
              </div>
              <div>
                <p class="text-lg font-black tracking-tight text-white">Faculty of Basic Medical Sciences</p>
                <p class="text-sm text-slate-300">Delta State University</p>
              </div>
            </div>
            <p class="mt-4 max-w-sm text-sm leading-7 text-slate-300">The Basic Medical Sciences Students Association - the official voice of basic medical science students at Delta State University.</p>
          </div>
          <div>
            <h4 class="text-sm font-bold uppercase tracking-[0.22em] text-slate-300">Explore</h4>
            <ul class="mt-4 space-y-3">
              <li><a href="about.html" class="text-sm text-slate-300 hover:text-white">About BAMSSA</a></li>
              <li><a href="departments.html" class="text-sm text-slate-300 hover:text-white">Departments</a></li>
              <li><a href="gallery.html" class="text-sm text-slate-300 hover:text-white">Gallery</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-bold uppercase tracking-[0.22em] text-slate-300">Students</h4>
            <ul class="mt-4 space-y-3">
              <li><a href="news.html" class="text-sm text-slate-300 hover:text-white">News &amp; Updates</a></li>
              <li><a href="staff.html" class="text-sm text-slate-300 hover:text-white">Staff</a></li>
              <li><a href="contact.html" class="text-sm text-slate-300 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-bold uppercase tracking-[0.22em] text-slate-300">Reach Us</h4>
            <ul class="mt-4 space-y-3 text-sm text-slate-300">
              <li>Faculty of Basic Medical Sciences, DELSU, Abraka, Delta State</li>
              <li><a href="mailto:bamssa@delsu.edu.ng" class="hover:text-white">bamssa@delsu.edu.ng</a></li>
              <li><a href="tel:+2349069212042" class="hover:text-white">+234 906 921 2042</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-10 border-t border-white/10 pt-6 text-sm text-slate-400">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 BAMSSA - DELSU Chapter. All rights reserved.</p>
            <p>Faculty of Basic Medical Sciences - Delta State University</p>
          </div>
        </div>
      </div>`;
    document.body.appendChild(footer);
  }

  function makeSection(title, eyebrow, body) {
    return `
      <section class="border-b border-slate-200 bg-white text-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <span class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">${eyebrow}</span>
          <h2 class="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">${title}</h2>
          ${body}
        </div>
      </section>`;
  }

  function renderAbout(main, achievements) {
    const milestones = achievements || [];
    main.innerHTML = `
      <section class="border-b border-white/10 bg-[#0b1c39] text-white">
        <div class="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div class="reveal-card">
            <img src="${asset('campus.webp')}" alt="DELSU campus" class="h-full w-full rounded-[2rem] object-cover shadow-2xl shadow-black/25" />
          </div>
          <div class="flex flex-col justify-center">
            <span class="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">About BAMSSA</span>
            <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-5xl">A united voice for every basic medical science student.</h2>
            <p class="mt-5 text-lg leading-8 text-slate-200">BAMSSA brings together Anatomy, Physiology, and Biochemistry students under one strong chapter. We support academic excellence, student welfare, leadership growth, and community outreach.</p>
            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p class="text-sm font-bold">Academic support</p>
                <p class="mt-2 text-sm leading-6 text-slate-300">Tutorials, revision drives, and peer-led study support.</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p class="text-sm font-bold">Student welfare</p>
                <p class="mt-2 text-sm leading-6 text-slate-300">Advocacy, support, and a stronger student community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      ${makeSection('What BAMSSA stands for', 'Mission, vision, and values', `
        <div class="mt-10 grid gap-5 lg:grid-cols-3">
          <div class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Mission</p>
            <p class="mt-3 text-base leading-7 text-slate-600">To champion the academic, welfare, and social interests of basic medical science students at DELSU while developing future-ready health professionals through service and leadership.</p>
          </div>
          <div class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Vision</p>
            <p class="mt-3 text-base leading-7 text-slate-600">To be the most impactful and well-organized basic medical science students' body in Nigeria, setting the pace for excellence and service.</p>
          </div>
          <div class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Values</p>
            <ul class="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li><span class="font-semibold text-slate-900">Integrity.</span> We hold ourselves to the standard expected of every health professional.</li>
              <li><span class="font-semibold text-slate-900">Excellence.</span> We push every member to grow academically and personally.</li>
              <li><span class="font-semibold text-slate-900">Service.</span> Our skills exist to serve the campus community and beyond.</li>
              <li><span class="font-semibold text-slate-900">Unity.</span> Anatomy, Physiology, and Biochemistry - one family, one voice.</li>
            </ul>
          </div>
        </div>
      `)}
      <section class="border-b border-slate-200 bg-slate-50 text-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="max-w-2xl mb-10">
            <span class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Milestones</span>
            <h3 class="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Our journey so far.</h3>
          </div>
          ${milestones.length ? `
            <div class="space-y-4">
              ${milestones
                .map(
                  (m) => `
                    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex md:items-start md:gap-8">
                      <div class="md:w-28 flex-shrink-0 mb-2 md:mb-0">
                        <span class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                          <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>${m.year}
                        </span>
                      </div>
                      <div class="flex-1">
                        <h4 class="text-base font-semibold text-slate-900">${m.title}</h4>
                        <p class="mt-1 text-sm leading-relaxed text-slate-600">${m.text}</p>
                        <a href="achievement-detail.html?id=${m.id}" class="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">See more →</a>
                      </div>
                    </div>`,
                )
                .join('')}
            </div>
          ` : '<p class="text-center text-slate-500 py-10">Milestones will appear here once they are added in the admin dashboard.</p>'}
        </div>
      </section>`;
  }

  function renderDepartments(main, hodData) {
    const hods = hodData || {};
    const items = [
      {
        key: 'anatomy',
        image: '',
        title: 'Anatomy',
        subtitle: 'Structure of the human body',
        text: 'Explores gross anatomy, histology, embryology, and neuroanatomy through hands-on learning and imaging.',
        hod: hods['Anatomy'] ? hods['Anatomy'].name : '',
        hodImage: hods['Anatomy'] ? hods['Anatomy'].image : '',
        count: 1200,
        courses: ['Gross Anatomy', 'Histology', 'Embryology', 'Neuroanatomy', 'Radiological Anatomy'],
      },
      {
        key: 'physiology',
        image: '',
        title: 'Physiology',
        subtitle: 'How the body functions',
        text: 'Covers the mechanisms by which the human body operates from cellular signalling to whole-system integration.',
        hod: hods['Physiology'] ? hods['Physiology'].name : '',
        hodImage: hods['Physiology'] ? hods['Physiology'].image : '',
        count: 1050,
        courses: ['General Physiology', 'Cardiovascular Physiology', 'Endocrinology', 'Neurophysiology', 'Renal Physiology'],
      },
      {
        key: 'biochemistry',
        image: '',
        title: 'Biochemistry',
        subtitle: 'Chemistry of life',
        text: 'Studies the molecular basis of life from enzyme kinetics to metabolic pathways and clinical biochemistry.',
        hod: hods['Biochemistry'] ? hods['Biochemistry'].name : '',
        hodImage: hods['Biochemistry'] ? hods['Biochemistry'].image : '',
        count: 850,
        courses: ['General Biochemistry', 'Clinical Biochemistry', 'Molecular Biology', 'Enzymology', 'Nutritional Biochemistry'],
      },
    ];

    main.innerHTML = `
      <section class="bg-white text-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="grid gap-8 md:grid-cols-3">
            ${items.map(item => `
              <div class="group overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm flex flex-col" style="background:#ffffff;">
                <div class="overflow-hidden h-52 flex items-center justify-center" style="background:#f1f5f9;">
                  ${item.image
                    ? `<img src="${item.image}" alt="${item.title}" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />`
                    : `<span style="color:#94a3b8;font-size:0.875rem;">No image uploaded</span>`}
                </div>
                <div class="p-6 flex flex-col flex-1" style="background:#ffffff;">
                  <span class="text-xs font-bold uppercase tracking-[0.22em]" style="color:#2f6df6;">${item.subtitle}</span>
                  <h2 class="mt-2 text-2xl font-black" style="color:#0f172a;">${item.title}</h2>
                  <p class="mt-3 text-sm leading-6" style="color:#475569;">${item.text}</p>

                  <div class="mt-4 pt-4 border-t border-slate-100">
                    <div class="flex items-center gap-3">
                      ${item.hodImage
                        ? `<img src="${item.hodImage}" alt="${item.hod}" class="h-12 w-12 rounded-xl object-cover border-2 border-slate-200 shadow-sm" />`
                        : `<div class="h-12 w-12 rounded-xl flex items-center justify-center" style="background:#f1f5f9;"><span style="color:#94a3b8;font-size:0.7rem;">No photo</span></div>`
                      }
                      <div>
                        <p class="text-xs font-semibold uppercase tracking-wide" style="color:#64748b;">Head of Department</p>
                        <p class="text-sm font-bold mt-0.5" style="color:#0f172a;">${item.hod || 'Not assigned'}</p>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4">
                    <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style="background:#f0f9ff;color:#0369a1;">
                      <span class="h-1.5 w-1.5 rounded-full" style="background:#22c55e;display:inline-block;"></span>
                      ${item.count.toLocaleString()} students
                    </span>
                  </div>

                  <div class="mt-auto pt-5">
                    <a href="department-detail.html?dept=${item.key}" class="block w-full rounded-2xl py-3 text-sm font-bold text-center transition" style="background:#2f6df6;color:#ffffff;">
                      See More Info →
                    </a>
                  </div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  async function renderDepartmentDetail(main) {
    const params = new URLSearchParams(window.location.search);
    const deptKey = (params.get('dept') || '').toLowerCase();
    const deptMap = {
      anatomy: {
        title: 'Anatomy', subtitle: 'Structure of the human body',
        text: 'The Department of Anatomy explores the structure of the human body through gross anatomy, histology, embryology, and neuroanatomy. Students gain hands-on experience in dissection labs, microscopy, and radiological imaging.',
        courses: ['Gross Anatomy', 'Histology', 'Embryology', 'Neuroanatomy', 'Radiological Anatomy'],
        count: 1200, supabaseName: 'Anatomy'
      },
      physiology: {
        title: 'Physiology', subtitle: 'How the body functions',
        text: 'The Department of Physiology covers the functional mechanisms of the human body from cellular signalling to whole-system integration. Key areas include cardiovascular, renal, endocrine, and neurophysiology.',
        courses: ['General Physiology', 'Cardiovascular Physiology', 'Endocrinology', 'Neurophysiology', 'Renal Physiology'],
        count: 1050, supabaseName: 'Physiology'
      },
      biochemistry: {
        title: 'Biochemistry', subtitle: 'Chemistry of life',
        text: 'The Department of Biochemistry studies the molecular basis of life. From enzyme kinetics to metabolic pathways, students learn the chemical foundations of medicine and clinical biochemistry applications.',
        courses: ['General Biochemistry', 'Clinical Biochemistry', 'Molecular Biology', 'Enzymology', 'Nutritional Biochemistry'],
        count: 850, supabaseName: 'Biochemistry'
      }
    };

    const dept = deptMap[deptKey];
    if (!dept) {
      main.innerHTML = `<div class="flex items-center justify-center py-32"><p style="color:#94a3b8;">Department not found. <a href="departments.html" style="color:#2f6df6;">Go back</a></p></div>`;
      return;
    }

    // Update page title
    document.title = `${dept.title} - BAMSSA DELSU Chapter`;

    // Fetch HOD and gallery images from Supabase
    let hodName = '', hodImage = '', galleryImages = [];
    if (supabaseClient) {
      const { data: hodData } = await supabaseClient.from('hods').select('name, image_url').eq('department', dept.supabaseName).single();
      if (hodData) { hodName = hodData.name || ''; hodImage = hodData.image_url || ''; }
      const { data: galleryData } = await supabaseClient.from('gallery').select('image_url, title, caption').eq('department', dept.supabaseName).order('created_at', { ascending: false });
      if (galleryData) galleryImages = galleryData;
    }

    main.innerHTML = `
      <section style="background:#ffffff;">
        <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

          <a href="departments.html" class="inline-flex items-center gap-2 text-sm font-semibold mb-8" style="color:#2f6df6;">
            ← Back to Departments
          </a>

          <span class="text-xs font-bold uppercase tracking-widest" style="color:#2f6df6;">${dept.subtitle}</span>
          <h1 class="mt-2 text-4xl font-black" style="color:#0f172a;">${dept.title}</h1>
          <p class="mt-4 text-base leading-7" style="color:#475569;">${dept.text}</p>

          <div class="mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium" style="background:#f0f9ff;color:#0369a1;">
            <span class="h-2 w-2 rounded-full" style="background:#22c55e;display:inline-block;"></span>
            ${dept.count.toLocaleString()} registered students
          </div>

          <!-- HOD CARD -->
          <div class="mt-10 rounded-2xl p-6 flex items-center gap-5" style="background:#f8fafc;border:1px solid #e2e8f0;">
            ${hodImage
              ? `<img src="${hodImage}" alt="${hodName}" class="rounded-xl object-cover shadow" style="width:80px;height:80px;border:2px solid #fff;" />`
              : `<div class="rounded-xl flex items-center justify-center" style="width:80px;height:80px;background:#e2e8f0;flex-shrink:0;"><span style="color:#94a3b8;font-size:0.75rem;text-align:center;">No<br>photo</span></div>`
            }
            <div>
              <p class="text-xs font-bold uppercase tracking-widest" style="color:#64748b;">Head of Department</p>
              <p class="text-xl font-black mt-1" style="color:#0f172a;">${hodName || 'Not yet assigned'}</p>
            </div>
          </div>

          <!-- COURSES -->
          <div class="mt-10">
            <p class="text-xs font-bold uppercase tracking-widest mb-4" style="color:#64748b;">Courses Offered</p>
            <div class="flex flex-wrap gap-2">
              ${dept.courses.map(c => `<span class="rounded-full px-4 py-2 text-sm font-medium" style="background:#f1f5f9;color:#334155;border:1px solid #e2e8f0;">${c}</span>`).join('')}
            </div>
          </div>

          <!-- GALLERY -->
          <div class="mt-12">
            <p class="text-xs font-bold uppercase tracking-widest mb-4" style="color:#64748b;">Department Gallery</p>
            ${galleryImages.length > 0
              ? `<div class="grid gap-4 sm:grid-cols-2">
                  ${galleryImages.map(img => `
                    <figure class="overflow-hidden rounded-2xl" style="border:1px solid #e2e8f0;">
                      <img src="${img.image_url}" alt="${img.title || ''}" class="w-full object-cover" style="height:200px;" loading="lazy" />
                      ${img.caption ? `<figcaption class="p-3 text-sm" style="color:#64748b;">${img.caption}</figcaption>` : ''}
                    </figure>`).join('')}
                </div>`
              : `<div class="rounded-2xl py-12 flex items-center justify-center" style="background:#f8fafc;border:1px dashed #cbd5e1;">
                  <p style="color:#94a3b8;" class="text-sm">No images uploaded for this department yet.</p>
                </div>`
            }
          </div>

        </div>
      </section>`;
  }

  function renderAchievementDetail(main, detail) {
    const { achievement, images } = detail;
    document.title = `${achievement.title} - BAMSSA DELSU Chapter`;
    const dateLabel = achievement.date ? new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
    const description = achievement.description || '';

    main.innerHTML = `
      <section style="background:#ffffff;">
        <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <a href="about.html" class="inline-flex items-center gap-2 text-sm font-semibold mb-8" style="color:#2f6df6;">
            ← Back to About BAMSSA
          </a>

          ${achievement.tag ? `<span class="text-xs font-bold uppercase tracking-widest" style="color:#2f6df6;">${achievement.tag}</span>` : ''}
          <h1 class="mt-2 text-4xl font-black" style="color:#0f172a;">${achievement.title}</h1>
          ${dateLabel ? `<p class="mt-3 text-sm font-medium" style="color:#64748b;">${dateLabel}</p>` : ''}

          ${achievement.image_url ? `
            <div class="mt-8 overflow-hidden rounded-2xl">
              <img src="${achievement.image_url}" alt="${achievement.title}" class="w-full object-cover" style="max-height:420px;" />
            </div>` : ''}

          <div class="mt-8 text-base leading-7" style="color:#475569;">${description}</div>

          <div class="mt-12">
            <p class="text-xs font-bold uppercase tracking-widest mb-4" style="color:#64748b;">Gallery</p>
            ${images.length
              ? `<div class="grid gap-4 sm:grid-cols-2">
                  ${images.map(img => `
                    <figure class="overflow-hidden rounded-2xl" style="border:1px solid #e2e8f0;">
                      <img src="${img.image_url}" alt="${achievement.title}" class="w-full object-cover" style="height:220px;" loading="lazy" />
                    </figure>`).join('')}
                </div>`
              : `<div class="rounded-2xl py-12 flex items-center justify-center" style="background:#f8fafc;border:1px dashed #cbd5e1;">
                  <p style="color:#94a3b8;" class="text-sm">No extra images for this achievement yet.</p>
                </div>`
            }
          </div>
        </div>
      </section>`;
  }

  function renderGallery(main, galleryItems) {
    const data = galleryItems || galleryData;
    main.innerHTML = `
      <section class="bg-white text-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            ${data
              .map(
                (item) => `
                  <figure class="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100 shadow-sm">
                    <img src="${item.image}" alt="${item.title}" class="h-64 w-full object-cover transition duration-500 hover:scale-105" />
                    <figcaption class="p-5">
                      <span class="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">${item.tag}</span>
                      <h3 class="mt-3 text-lg font-black text-slate-900">${item.title}</h3>
                      <p class="mt-2 text-sm leading-6 text-slate-600">${item.text}</p>
                    </figcaption>
                  </figure>`,
              )
              .join('')}
          </div>
        </div>
      </section>`;
  }

  function renderStaff(main, staffPayload) {
    const payload = staffPayload || { staff: [], leadership: [] };
    const staff = payload.staff || [];
    const leadership = payload.leadership || [];
    main.innerHTML = `
      <section class="bg-white text-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          ${leadership.length ? `
            <div class="mb-14">
              <span class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">College Leadership</span>
              <div class="mt-5 grid gap-5 sm:grid-cols-2">
                ${leadership.map(l => `
                  <article class="flex items-center gap-5 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    ${l.image
                      ? `<img src="${l.image}" alt="${l.name}" class="h-24 w-24 flex-shrink-0 rounded-2xl object-cover" />`
                      : `<div class="h-24 w-24 flex-shrink-0 rounded-2xl flex items-center justify-center bg-slate-200"><span class="text-xs text-slate-500">No photo</span></div>`
                    }
                    <div>
                      <span class="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">${l.role}</span>
                      <h3 class="mt-2 text-xl font-black text-slate-900">${l.name}</h3>
                      ${l.bio ? `<p class="mt-1 text-sm leading-6 text-slate-600">${l.bio}</p>` : ''}
                    </div>
                  </article>`).join('')}
              </div>
            </div>
          ` : ''}
          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            ${staff.length ? staff
              .map(
                (member) => `
                  <article class="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
                    ${member.image
                      ? `<img src="${member.image}" alt="${member.name}" class="h-80 w-full object-cover" />`
                      : `<div class="h-80 w-full flex items-center justify-center bg-slate-100"><span class="text-sm text-slate-400">No photo</span></div>`
                    }
                    <div class="p-6">
                      <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">${member.role}${member.department ? ` · ${member.department}` : ''}</span>
                      <h3 class="mt-3 text-2xl font-black text-slate-900">${member.name}</h3>
                      ${member.description ? `<p class="mt-3 text-sm leading-6 text-slate-600">${member.description}</p>` : ''}
                    </div>
                  </article>`,
              )
              .join('') : '<p class="col-span-full text-center text-slate-500 py-16">No staff members listed yet.</p>'}
          </div>
        </div>
      </section>`;
  }

  function renderNews(main, newsItems) {
    const data = newsItems || [];
    main.innerHTML = `
      <section class="border-b border-white/10 bg-[#0b1c39] text-white">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <span class="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">News</span>
          <h1 class="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">From the BAMSSA desk.</h1>
          <p class="mt-5 max-w-3xl text-lg leading-8 text-slate-200">Stories, announcements, and updates from the association as they happen.</p>
        </div>
      </section>
      <section class="bg-white text-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          ${data.length ? `
            <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              ${data
                .map(
                  (article) => `
                    <article class="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
                      ${article.image
                        ? `<img src="${article.image}" alt="${article.title}" class="h-56 w-full object-cover" />`
                        : ''
                      }
                      <div class="p-6">
          <div class="flex items-center gap-2">
                          ${article.tag ? `<span class="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">${article.tag}</span>` : ''}
                          <span class="text-xs text-slate-500">${article.date}</span>
                        </div>
                        <h3 class="mt-3 text-xl font-black text-slate-900">${article.title}</h3>
                        <div class="mt-3 text-sm leading-6 text-slate-600">${article.text || ''}</div>
                      </div>
                    </article>`,
                )
                .join('')}
            </div>
          ` : '<p class="text-center text-slate-500 py-16">No news and updates at the moment. Check back soon.</p>'}
        </div>
      </section>`;
  }

  function renderEvents(main) {
    main.innerHTML = `
      <section class="border-b border-white/10 bg-[#0b1c39] text-white">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <span class="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Calendar</span>
          <h1 class="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Events and gatherings.</h1>
          <p class="mt-5 max-w-3xl text-lg leading-8 text-slate-200">From academic bootcamps to community outreach and sports week, this is what is happening at BAMSSA.</p>
        </div>
      </section>
      <section class="border-b border-slate-200 bg-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-wrap items-center gap-3 border-b border-slate-200 py-4">
            <button type="button" class="pill-tab active rounded-full bg-[#233a68] px-4 py-2 text-sm font-semibold text-white" data-event-filter="all">All <span class="ml-2 text-xs text-slate-300">${eventData.length}</span></button>
            <button type="button" class="pill-tab rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700" data-event-filter="upcoming">Upcoming <span class="ml-2 text-xs text-slate-400">3</span></button>
            <button type="button" class="pill-tab rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700" data-event-filter="past">Past <span class="ml-2 text-xs text-slate-400">2</span></button>
          </div>
        </div>
      </section>
      <section class="bg-slate-50 text-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            ${eventData
              .map(
                (event) => `
                  <article class="event-card overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm" data-status="${event.status}">
                    <img src="${event.image}" alt="${event.title}" class="h-56 w-full object-cover" />
                    <div class="p-6">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">${event.tag}</span>
                        <span class="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700">${event.status}</span>
                      </div>
                      <h3 class="mt-3 text-xl font-black text-slate-900">${event.title}</h3>
                      <p class="mt-3 text-sm leading-6 text-slate-600">${event.text}</p>
                      <div class="mt-5 border-t border-slate-200 pt-4 space-y-1.5 text-sm">
                        <div class="flex items-center justify-between gap-4">
                          <span class="text-slate-500">When</span>
                          <span class="text-slate-900">${event.when}</span>
                        </div>
                        <div class="flex items-center justify-between gap-4">
                          <span class="text-slate-500">Where</span>
                          <span class="text-slate-900">${event.where}</span>
                        </div>
                      </div>
                    </div>
                  </article>`,
              )
              .join('')}
          </div>
        </div>
      </section>`;
  }

  function socialBadgeIcon(name) {
    switch (name) {
      case 'WhatsApp':
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6" fill="none">
            <path fill="currentColor" d="M12 2.5c-5.23 0-9.5 3.98-9.5 8.89 0 1.78.56 3.47 1.61 4.9L3.5 21.5l5.39-1.95c1.02.3 2.1.46 3.17.46 5.23 0 9.5-3.98 9.5-8.89S17.23 2.5 12 2.5Zm4.45 12.45c-.19.54-1.1 1.03-1.49 1.08-.39.05-.81.07-1.31-.1-.3-.1-.69-.23-1.19-.44-2.09-.9-3.45-3.01-3.55-3.14-.09-.13-.85-1.13-.85-2.16 0-1.02.52-1.52.71-1.73.19-.2.41-.25.55-.25.13 0 .26 0 .38.01.12.01.28-.05.44.34.19.45.66 1.54.72 1.65.06.11.1.24.02.39-.08.15-.12.24-.24.37-.12.13-.25.29-.36.39-.12.11-.24.23-.1.48.14.25.64 1.08 1.38 1.75.95.85 1.75 1.12 2 .99.25-.13.42-.19.56-.34.14-.14.3-.18.51-.1.21.08 1.32.63 1.55.75.23.11.39.17.45.27.06.1.06.59-.13 1.13Z"/>
          </svg>`;
      case 'Instagram':
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6" fill="none">
            <path fill="currentColor" d="M7.25 2.75h9.5A4.5 4.5 0 0 1 21.25 7.25v9.5a4.5 4.5 0 0 1-4.5 4.5h-9.5a4.5 4.5 0 0 1-4.5-4.5v-9.5a4.5 4.5 0 0 1 4.5-4.5Zm0 1.75A2.75 2.75 0 0 0 4.5 7.25v9.5a2.75 2.75 0 0 0 2.75 2.75h9.5a2.75 2.75 0 0 0 2.75-2.75v-9.5a2.75 2.75 0 0 0-2.75-2.75h-9.5Zm9.86 1.46a1.04 1.04 0 1 1 0 2.08 1.04 1.04 0 0 1 0-2.08ZM12 7.2A4.8 4.8 0 1 1 12 16.8 4.8 4.8 0 0 1 12 7.2Zm0 1.75a3.05 3.05 0 1 0 0 6.1 3.05 3.05 0 0 0 0-6.1Z"/>
          </svg>`;
      case 'TikTok':
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6" fill="none">
            <path fill="currentColor" d="M14.5 3.5c.6 1.9 1.9 3.2 3.9 3.5v3.2c-1.4 0-2.6-.3-3.9-1v5.4a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.3a2.6 2.6 0 1 0 1.8 2.5V3.5h3.2Z"/>
          </svg>`;
      case 'Facebook':
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6" fill="none">
            <path fill="currentColor" d="M13.5 8.2V7c0-.9.6-1.5 1.6-1.5h1.4V2.75h-2c-2.6 0-4.2 1.6-4.2 4.2v1.25H8v3.1h2.3v9h3.2v-9h2.6l.4-3.1h-3Z"/>
          </svg>`;
      default:
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6" fill="none">
            <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.9"></circle>
          </svg>`;
    }
  }

  function renderContact(main) {
    main.innerHTML = `
      <section class="bg-white text-slate-900">
        <div class="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 class="text-2xl font-black text-slate-900">Send us a message</h2>
            <form class="mt-6 grid gap-5">
              <div>
                <label for="name" class="block text-sm font-semibold text-slate-700">Name</label>
                <input id="name" name="name" type="text" class="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </div>
              <div>
                <label for="email" class="block text-sm font-semibold text-slate-700">Email</label>
                <input id="email" name="email" type="email" class="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </div>
              <div>
                <label for="message" class="block text-sm font-semibold text-slate-700">Message</label>
                <textarea id="message" name="message" rows="5" class="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100"></textarea>
              </div>
              <button type="submit" class="inline-flex w-full items-center justify-center rounded-2xl bg-[#2f6df6] px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-blue-950/15 transition hover:bg-[#235ee8]">Send Message</button>
            </form>
          </div>
          <div class="space-y-5">
            <div class="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 class="text-2xl font-black text-slate-900">Reach us directly</h2>
              <ul class="mt-5 space-y-4 text-sm text-slate-600">
                <li><span class="font-semibold text-slate-900">Address:</span> Faculty of Basic Medical Sciences, DELSU, Abraka, Delta State</li>
                <li><span class="font-semibold text-slate-900">Email:</span> bamssa@delsu.edu.ng</li>
                <li><span class="font-semibold text-slate-900">Phone:</span> +234 906 921 2042</li>
              </ul>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              ${[
                ['WhatsApp', 'https://wa.me/2349069212042', 'Chat with us on WhatsApp', '#22c55e'],
                ['Instagram', 'https://www.instagram.com/bamssa._delsu?igsh=MWo4a3VuczRtdTI3cQ==', 'See photos and updates', '#ec4899'],
                ['TikTok', 'https://www.tiktok.com/@bamssa.delsu?_r=1&_t=ZP-97TaRQFWorH', 'Short videos and highlights', '#111827'],
                ['Facebook', 'https://www.facebook.com/share/1DynFBxdJH/', 'News and chapter updates', '#2563eb'],
              ]
                .map(
                  ([name, url, text, color]) => `
                    <a href="${url}" target="_blank" rel="noreferrer" class="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                      <div class="flex items-center gap-3">
                        <div class="flex h-12 w-12 items-center justify-center rounded-2xl" style="background:${color}22;color:${color};">
                          ${socialBadgeIcon(name)}
                        </div>
                        <div>
                          <h3 class="text-lg font-black text-slate-900">${name}</h3>
                          <p class="text-sm text-slate-600">${text}</p>
                        </div>
                      </div>
                    </a>`,
                )
                .join('')}
            </div>
          </div>
        </div>
      </section>`;
  }

  function renderSuggestions(main) {
    main.innerHTML = `
      <section class="bg-slate-50 text-slate-900">
        <div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 sm:p-10">
            <h2 class="text-2xl font-black text-slate-900">Share Your Suggestions</h2>
            <p class="mt-2 text-sm text-slate-500">Anonymous. Honest. Heard.</p>
            <form id="suggestions-form" class="mt-6 space-y-5">
              <div>
                <label for="suggestion-text" class="block text-sm font-semibold text-slate-700">Your suggestion</label>
                <textarea id="suggestion-text" rows="5" placeholder="Write your suggestion here..."
                  class="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100"></textarea>
              </div>
              <div id="suggestions-status"></div>
              <button type="submit" id="suggestions-submit"
                class="inline-flex w-full items-center justify-center rounded-2xl bg-[#2f6df6] px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-blue-950/15 transition hover:bg-[#235ee8]">
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>`;

    const form = document.getElementById('suggestions-form');
    const status = document.getElementById('suggestions-status');
    const submitBtn = document.getElementById('suggestions-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const textarea = document.getElementById('suggestion-text');
      const value = textarea.value.trim();
      if (!value) return;

      status.innerHTML = '';
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span> Submitting...`;

      if (!supabaseClient) {
        status.innerHTML = `<p class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">Something went wrong. Please try again.</p>`;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
        return;
      }

      const { error } = await supabaseClient.from('suggestions').insert([{ message: value }]);
      if (error) {
        status.innerHTML = `<p class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">Something went wrong. Please try again.</p>`;
      } else {
        textarea.value = '';
        status.innerHTML = `<p class="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">Your suggestion has been submitted.</p>`;
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    });
  }

  async function renderSuggestionsAsync(main) {
    renderSuggestions(main);
  }

  function renderExecutives(main, execData) {
    if (!execData || execData.length === 0) {
      main.innerHTML = `<div class="flex items-center justify-center py-32"><p class="text-slate-500 text-center">No executives found for the current administration.</p></div>`;
      return;
    }
    _currentExecutiveData = execData;
    const data = _currentExecutiveData;
    main.innerHTML = `
      <section class="bg-white text-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="max-w-2xl mb-10">
            <span class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Council roles</span>
            <h2 class="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Tap a name to view the profile.</h2>
          </div>
          <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            ${data
              .map(
                (exec, index) => `
                  <button type="button" data-exec-index="${index}" class="group text-left overflow-hidden rounded-[1.75rem] border border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-xl" style="background:#ffffff;">
                    ${exec.image ? `<img src="${exec.image}" alt="${exec.name}" class="h-72 w-full object-cover" />` : `<div class="h-72 w-full flex items-center justify-center" style="background:#f1f5f9;"><span style="color:#94a3b8;" class="text-sm">No photo</span></div>`}
                    <div class="p-5" style="background:#ffffff;">
                      <p class="text-xs font-bold uppercase tracking-[0.22em]" style="color:#64748b;">${exec.role}</p>
                      <h3 class="mt-2 text-2xl font-black" style="color:#0f172a;">${exec.name}</h3>
                      <p class="mt-2 text-sm leading-6" style="color:#475569;">${exec.summary || ''}</p>
                    </div>
                  </button>`,
              )
              .join('')}
          </div>
        </div>
      </section>
      <section class="border-t border-slate-200 bg-slate-50 text-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Need an update?</p>
                <h2 class="mt-3 text-2xl font-black text-slate-900">Send the official roster and we can swap in the final details immediately.</h2>
              </div>
              <a href="contact.html" class="inline-flex items-center justify-center rounded-2xl bg-[#2f6df6] px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-blue-950/15 transition hover:bg-[#235ee8]">Contact the council</a>
            </div>
          </div>
        </div>
      </section>
      <div data-exec-modal class="fixed inset-0 z-[60] hidden items-center justify-center p-4">
        <div data-exec-overlay class="absolute inset-0 bg-[#061021]/75 backdrop-blur-sm"></div>
        <button type="button" data-exec-close aria-label="Close" class="absolute right-4 top-4 sm:right-6 sm:top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl font-semibold text-white hover:bg-white/20">&times;</button>
        <div class="relative z-10 max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#081429] text-white shadow-2xl">
          <div class="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div class="bg-white/5">
              <img data-exec-image src="" alt="" class="h-64 w-full object-cover sm:h-80 lg:h-full" />
            </div>
            <div class="p-6 sm:p-8">
              <p data-exec-role class="text-xs font-bold uppercase tracking-[0.22em] text-slate-300"></p>
              <h3 data-exec-name class="mt-3 text-3xl font-black tracking-tight text-white"></h3>
              <p data-exec-summary class="mt-4 text-base leading-7 text-slate-200"></p>
              <div class="mt-6 grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Department</p>
                  <p data-exec-dept class="mt-2 text-sm font-semibold text-white"></p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Level</p>
                  <p data-exec-level class="mt-2 text-sm font-semibold text-white"></p>
                </div>
              </div>
              <div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Focus</p>
                <p data-exec-focus class="mt-2 text-sm leading-7 text-slate-200"></p>
              </div>
              <div class="mt-6 grid gap-3 sm:grid-cols-2">
                <a data-exec-email href="#" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"></a>
                <a data-exec-phone href="#" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"></a>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function injectLoading(main) {
    main.innerHTML = `<div class="flex items-center justify-center py-32">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>`;
  }

  function injectError(main) {
    main.innerHTML = `<p class="text-center py-32 text-slate-500">Could not load content. Please refresh the page.</p>`;
  }

  async function fetchExecutivesData() {
    if (!supabaseClient) return null;
    const { data: admin } = await supabaseClient.from('administrations').select('id').eq('is_current', true).single();
    if (!admin) return null;
    const { data, error } = await supabaseClient.from('executives').select('*').eq('administration_id', admin.id).order('display_order', { ascending: true });
    if (error) return null;
    return data.map(row => ({
      name: row.name,
      role: row.role,
      image: row.image_url,
      department: row.department,
      level: row.level,
      summary: row.summary,
      focus: row.focus,
      email: row.email,
      phone: row.phone
    }));
  }

  async function fetchGalleryData() {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return data.map(row => ({
      image: row.image_url,
      title: row.title,
      tag: row.tag,
      text: row.caption
    }));
  }

  async function fetchHodsData() {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient.from('hods').select('department, name, image_url').order('department', { ascending: true });
    if (error) return null;
    const result = {};
    data.forEach(row => { result[row.department] = { name: row.name || '', image: row.image_url || '' }; });
    return result;
  }

  async function fetchNewsData() {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient.from('news').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return data.map(row => ({
      id: row.id,
      image: row.image_url,
      tag: row.tag,
      date: row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      title: row.title,
      text: row.body
    }));
  }

  async function fetchStaffData() {
    if (!supabaseClient) return null;
    const [{ data: staffRows, error: staffErr }, { data: leadershipRows, error: leadErr }] = await Promise.all([
      supabaseClient.from('staff').select('*').order('display_order', { ascending: true }),
      supabaseClient.from('college_leadership').select('*'),
    ]);
    if (staffErr || leadErr) return null;
    return {
      staff: staffRows.map(row => ({
        name: row.name,
        role: row.role,
        department: row.department,
        image: row.image_url,
        description: row.bio
      })),
      leadership: leadershipRows
        .filter(row => row.name)
        .map(row => ({ role: row.role, name: row.name, image: row.image_url, bio: row.bio }))
    };
  }

  async function fetchAchievementsData() {
    if (!supabaseClient) return null;
    const { data: admin } = await supabaseClient.from('administrations').select('id').eq('is_current', true).single();
    let query = supabaseClient.from('achievements').select('*').order('date', { ascending: false });
    if (admin) query = query.eq('administration_id', admin.id);
    const { data, error } = await query;
    if (error) return null;
    return data.map(row => ({
      id: row.id,
      year: row.date ? new Date(row.date).getFullYear() : '',
      title: row.title,
      text: row.description ? row.description.replace(/<[^>]*>/g, '') : '',
      tag: row.tag,
      image: row.image_url,
      date: row.date
    }));
  }

  async function fetchAchievementDetail(id) {
    if (!supabaseClient || !id) return null;
    const { data: achievement, error } = await supabaseClient.from('achievements').select('*').eq('id', id).single();
    if (error || !achievement) return null;
    const { data: images } = await supabaseClient.from('achievement_images').select('*').eq('achievement_id', id).order('display_order', { ascending: true });
    return { achievement, images: images || [] };
  }

  async function renderPageAsync(pageKey, main) {
    switch (pageKey) {
      case 'executives': {
        injectLoading(main);
        const execs = await fetchExecutivesData();
        if (execs) { renderExecutives(main, execs); } else { injectError(main); }
        break;
      }
      case 'suggestions': {
        renderSuggestionsAsync(main);
        break;
      }
      case 'gallery': {
        injectLoading(main);
        const gallery = await fetchGalleryData();
        if (gallery) { renderGallery(main, gallery); } else { injectError(main); }
        break;
      }
      case 'department-detail': {
        injectLoading(main);
        await renderDepartmentDetail(main);
        break;
      }
      case 'departments': {
        injectLoading(main);
        const hods = await fetchHodsData();
        if (hods !== null) { renderDepartments(main, hods); } else { injectError(main); }
        break;
      }
      case 'news': {
        injectLoading(main);
        const news = await fetchNewsData();
        if (news !== null) { renderNews(main, news); } else { injectError(main); }
        break;
      }
      case 'staff': {
        injectLoading(main);
        const staffData = await fetchStaffData();
        if (staffData !== null) { renderStaff(main, staffData); } else { injectError(main); }
        break;
      }
      case 'about': {
        const achievements = await fetchAchievementsData();
        renderAbout(main, achievements || []);
        break;
      }
      case 'achievement-detail': {
        injectLoading(main);
        const params = new URLSearchParams(window.location.search);
        const detail = await fetchAchievementDetail(params.get('id'));
        if (detail) { renderAchievementDetail(main, detail); } else { injectError(main); }
        break;
      }
      default:
        renderPage(pageKey, main);
    }
  }

  async function renderPage(pageKey, main) {
    switch (pageKey) {
      case 'about':
        renderAbout(main);
        break;
      case 'departments':
        renderDepartments(main);
        break;
      case 'gallery':
        renderGallery(main);
        break;
      case 'staff':
        renderStaff(main);
        break;
      case 'news':
        renderNews(main);
        break;
      case 'events':
        renderEvents(main);
        break;
      case 'contact':
        renderContact(main);
        break;
      case 'executives':
        injectError(main);
        break;
      case 'suggestions':
        renderSuggestions(main);
        break;
      default:
        break;
    }
  }

  if (document.body.classList.contains('page-shell')) {
    const main = document.querySelector('main');
    injectHeader(pageKey);
    if (pageKey !== 'contact') {
      injectHero(pageConfigs[pageKey]);
    }
    document.body.classList.add('js-ready');
    if (['executives', 'gallery', 'departments', 'suggestions', 'department-detail', 'news', 'staff', 'about', 'achievement-detail'].includes(pageKey)) {
      if (supabaseClient) {
        renderPageAsync(pageKey, main);
      } else {
        renderPage(pageKey, main);
      }
    } else {
      renderPage(pageKey, main);
    }
    injectFooter();
  }

  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }

  const eventTabs = document.querySelectorAll('[data-event-filter]');
  const eventCards = document.querySelectorAll('.event-card');
  if (eventTabs.length && eventCards.length) {
    eventTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const selected = tab.getAttribute('data-event-filter');
        eventTabs.forEach((item) => {
          item.classList.remove('bg-[#233a68]', 'text-white');
          item.classList.add('border', 'border-slate-200', 'text-slate-700');
        });
        tab.classList.add('bg-[#233a68]', 'text-white');
        tab.classList.remove('border', 'border-slate-200', 'text-slate-700');
        eventCards.forEach((card) => {
          const status = (card.getAttribute('data-status') || '').toLowerCase();
          card.style.display = selected === 'all' || selected === status ? '' : 'none';
        });
      });
    });
  }

  const execCards = document.querySelectorAll('[data-exec-index]');
  const modal = document.querySelector('[data-exec-modal]');
  if (execCards.length && modal) {
    const overlay = modal.querySelector('[data-exec-overlay]');
    const close = modal.querySelector('[data-exec-close]');
    const image = modal.querySelector('[data-exec-image]');
    const role = modal.querySelector('[data-exec-role]');
    const name = modal.querySelector('[data-exec-name]');
    const summary = modal.querySelector('[data-exec-summary]');
    const dept = modal.querySelector('[data-exec-dept]');
    const level = modal.querySelector('[data-exec-level]');
    const focus = modal.querySelector('[data-exec-focus]');
    const email = modal.querySelector('[data-exec-email]');
    const phone = modal.querySelector('[data-exec-phone]');

    const hide = () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    };

    const show = (index) => {
      const data = _currentExecutiveData[index];
      if (!data) return;
      image.src = data.image || '';
      image.alt = data.name;
      role.textContent = data.role;
      name.textContent = data.name;
      summary.textContent = data.summary;
      dept.textContent = data.department;
      level.textContent = data.level;
      focus.textContent = data.focus;
      email.textContent = data.email;
      email.href = `mailto:${data.email}`;
      phone.textContent = data.phone;
      phone.href = `tel:${data.phone.replace(/[^+\d]/g, '')}`;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    };

    execCards.forEach((card) => {
      card.addEventListener('click', () => show(Number(card.getAttribute('data-exec-index'))));
    });
    overlay?.addEventListener('click', hide);
    close?.addEventListener('click', hide);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hide();
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealTargets = Array.from(
    document.querySelectorAll(
      'main section, main section > div > *, main article, main figure, main .reveal-card, main .rounded-xl, main .rounded-2xl, main .rounded-3xl'
    )
  ).filter((target) => !target.hasAttribute('data-no-reveal'));

  const countTargets = Array.from(document.querySelectorAll('[data-count]'));

  const formatCount = (value) => new Intl.NumberFormat('en-US').format(value);

  const animateCount = (element) => {
    if (element.dataset.countAnimated === 'true') return;
    element.dataset.countAnimated = 'true';

    const target = Number(element.getAttribute('data-count'));
    if (!Number.isFinite(target)) return;

    const prefix = element.getAttribute('data-count-prefix') || '';
    const suffix = element.getAttribute('data-count-suffix') || '';
    const duration = Number(element.getAttribute('data-count-duration')) || 1200;
    const start = performance.now();

    const render = (value) => {
      element.textContent = `${prefix}${formatCount(Math.round(value))}${suffix}`;
    };

    if (prefersReducedMotion) {
      render(target);
      return;
    }

    render(0);

    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      render(target * eased);

      if (progress >= 1) {
        window.clearInterval(timer);
        render(target);
      }
    }, 16);

    window.setTimeout(() => {
      window.clearInterval(timer);
      render(target);
    }, duration + 80);
  };

  const leaderData = [];

  // HOME GALLERY - fetch latest 6 images from Supabase
  const homeGalleryGrid = document.getElementById('home-gallery-grid');
  if (homeGalleryGrid && supabaseClient) {
    (async () => {
      const { data, error } = await supabaseClient.from('gallery').select('image_url, title, caption').order('created_at', { ascending: false }).limit(6);
      if (error || !data || data.length === 0) {
        homeGalleryGrid.innerHTML = '<p class="col-span-full text-center text-slate-500 py-8">No gallery images yet.</p>';
        return;
      }
      homeGalleryGrid.innerHTML = data.map(item => `
        <figure class="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100 shadow-sm">
          <img src="${item.image_url}" alt="${item.title || ''}" class="h-64 w-full object-cover transition duration-500 hover:scale-105" loading="lazy" />
        </figure>`).join('');
    })();
  }

  const leadersGrid = document.getElementById('leaders-grid');
  if (leadersGrid && supabaseClient) {
    (async () => {
      const { data: admin } = await supabaseClient.from('administrations').select('id').eq('is_current', true).single();
      if (!admin) { leadersGrid.innerHTML = '<p class="text-slate-500 text-center py-8 col-span-full">No executives found.</p>'; return; }
      const { data: execs, error } = await supabaseClient.from('executives').select('*').eq('administration_id', admin.id).order('display_order', { ascending: true });
      if (error || !execs || execs.length === 0) { leadersGrid.innerHTML = '<p class="text-slate-500 text-center py-8 col-span-full">No executives found.</p>'; return; }
      execs.forEach((exec, index) => { leaderData.push({ name: exec.name, role: exec.role, image: exec.image_url || '', department: exec.department || '', level: exec.level || '', summary: exec.summary || '', focus: exec.focus || '', email: exec.email || '', phone: exec.phone || '' }); });
      leadersGrid.innerHTML = execs.map((exec, index) => `
        <button type="button" class="leader-card" data-leader-index="${index}">
          <div class="leader-img-wrapper">
            ${exec.image_url ? `<img src="${exec.image_url}" alt="${exec.name}" loading="lazy">` : `<div style="width:100%;height:100%;background:#f1f5f9;display:flex;align-items:center;justify-content:center;"><span style="color:#94a3b8;font-size:0.875rem;">No photo</span></div>`}
          </div>
          <div class="leader-info">
            <h3 class="leader-name">${exec.name}</h3>
            <span class="leader-role">${exec.role}</span>
          </div>
        </button>`).join('');

      const leaderModal = document.querySelector('[data-leader-modal]');
      if (leaderModal) {
        const leaderOverlay = leaderModal_legacy.querySelector('[data-leader-overlay]');
        const leaderClose = leaderModal_legacy.querySelector('[data-leader-close]');
        const leaderImage = leaderModal_legacy.querySelector('[data-leader-image]');
        const leaderRole = leaderModal_legacy.querySelector('[data-leader-role]');
        const leaderName = leaderModal_legacy.querySelector('[data-leader-name]');
        const leaderSummary = leaderModal_legacy.querySelector('[data-leader-summary]');
        const leaderDept = leaderModal_legacy.querySelector('[data-leader-dept]');
        const leaderLevel = leaderModal_legacy.querySelector('[data-leader-level]');
        const leaderFocus = leaderModal_legacy.querySelector('[data-leader-focus]');
        const leaderEmail = leaderModal_legacy.querySelector('[data-leader-email]');
        const leaderPhone = leaderModal_legacy.querySelector('[data-leader-phone]');
        const hideLeaderModal = () => { leaderModal_legacy.classList.add('hidden'); leaderModal_legacy.classList.remove('flex'); };
        const showLeaderModal = (index) => {
          const data = leaderData[index];
          if (!data) return;
          leaderImage.src = data.image || '';
          leaderImage.alt = data.name;
          leaderRole.textContent = data.role;
          leaderName.textContent = data.name;
          leaderSummary.textContent = data.summary;
          leaderDept.textContent = data.department;
          leaderLevel.textContent = data.level;
          leaderFocus.textContent = data.focus;
          leaderEmail.textContent = data.email;
          leaderEmail.href = `mailto:${data.email}`;
          leaderPhone.textContent = data.phone;
          leaderPhone.href = `tel:${data.phone.replace(/[^+\d]/g, '')}`;
          leaderModal_legacy.classList.remove('hidden');
          leaderModal_legacy.classList.add('flex');
        };
        leadersGrid.addEventListener('click', (e) => {
          const card = e.target.closest('[data-leader-index]');
          if (card) showLeaderModal(parseInt(card.dataset.leaderIndex));
        });
        if (leaderOverlay) leaderOverlay.addEventListener('click', hideLeaderModal);
        if (leaderClose) leaderClose.addEventListener('click', hideLeaderModal);
      }
    })();
  }

  const leaderCards_legacy = document.querySelectorAll('[data-leader-index]');
  const leaderModal_legacy = document.querySelector('[data-leader-modal]');
  if (!leadersGrid && leaderCards_legacy.length && leaderModal_legacy) {
    const leaderOverlay = leaderModal_legacy.querySelector('[data-leader-overlay]');
    const leaderClose = leaderModal_legacy.querySelector('[data-leader-close]');
    const leaderImage = leaderModal_legacy.querySelector('[data-leader-image]');
    const leaderRole = leaderModal_legacy.querySelector('[data-leader-role]');
    const leaderName = leaderModal_legacy.querySelector('[data-leader-name]');
    const leaderSummary = leaderModal_legacy.querySelector('[data-leader-summary]');
    const leaderDept = leaderModal_legacy.querySelector('[data-leader-dept]');
    const leaderLevel = leaderModal_legacy.querySelector('[data-leader-level]');
    const leaderFocus = leaderModal_legacy.querySelector('[data-leader-focus]');
    const leaderEmail = leaderModal_legacy.querySelector('[data-leader-email]');
    const leaderPhone = leaderModal_legacy.querySelector('[data-leader-phone]');

    const hideLeaderModal = () => {
      leaderModal_legacy.classList.add('hidden');
      leaderModal_legacy.classList.remove('flex');
    };

    const showLeaderModal = (index) => {
      const data = leaderData[index];
      if (!data) return;
      leaderImage.src = data.image;
      leaderImage.alt = data.name;
      leaderRole.textContent = data.role;
      leaderName.textContent = data.name;
      leaderSummary.textContent = data.summary;
      leaderDept.textContent = data.department;
      leaderLevel.textContent = data.level;
      leaderFocus.textContent = data.focus;
      leaderEmail.textContent = data.email;
      leaderEmail.href = `mailto:${data.email}`;
      leaderPhone.textContent = data.phone;
      leaderPhone.href = `tel:${data.phone.replace(/[^+\d]/g, '')}`;
      leaderModal_legacy.classList.remove('hidden');
      leaderModal_legacy.classList.add('flex');
    };

    leaderCards.forEach((card) => {
      card.addEventListener('click', () => showLeaderModal(Number(card.getAttribute('data-leader-index'))));
    });
    leaderOverlay?.addEventListener('click', hideLeaderModal);
    leaderClose?.addEventListener('click', hideLeaderModal);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hideLeaderModal();
    });
  }

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.02, rootMargin: '0px' }
    );

    revealTargets.forEach((target, index) => {
      target.classList.add('reveal-item');
      target.style.setProperty('--reveal-delay', '0ms');
      revealObserver.observe(target);
    });

    countTargets.forEach((target) => animateCount(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
    countTargets.forEach((target) => animateCount(target));
  }
});
