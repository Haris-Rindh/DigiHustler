import React from 'react';

interface TechLogoProps {
  name: string;
  className?: string;
}

export const TechLogo: React.FC<TechLogoProps> = ({ name, className = 'w-3.5 h-3.5' }) => {
  const normalized = (name || '').toLowerCase().trim();

  // 1. Web Frameworks
  if (normalized === 'react') {
    return (
      <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none" aria-hidden="true">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  if (normalized === 'next.js' || normalized === 'nextjs') {
    return (
      <svg className={className} viewBox="0 0 180 180" fill="none" aria-hidden="true">
        <circle cx="90" cy="90" r="90" fill="currentColor" />
        <path
          d="M149.5 157.5L69.1 54H54v72h12.1V69.4l73.9 95.4c3.3-2.2 6.5-4.6 9.5-7.3z"
          fill="var(--bg-surface, #ffffff)"
        />
        <rect x="114" y="54" width="12" height="72" fill="var(--bg-surface, #ffffff)" />
      </svg>
    );
  }

  if (normalized === 'vue' || normalized === 'vue.js') {
    return (
      <svg className={className} viewBox="0 0 261.76 226.69" aria-hidden="true">
        <path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#42B883" />
        <path d="M161.096.001l-30.225 52.351L100.647.001H52.846l78.026 135.145 78.025-135.145z" fill="#35495E" />
      </svg>
    );
  }

  if (normalized.includes('tailwind')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#06B6D4" aria-hidden="true">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    );
  }

  if (normalized === 'vite') {
    return (
      <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="viteGradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#41D1FF" />
            <stop offset="100%" stopColor="#BD34FE" />
          </linearGradient>
          <linearGradient id="viteGradB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFEA83" />
            <stop offset="100%" stopColor="#FFDD35" />
          </linearGradient>
        </defs>
        <path
          d="M29.8 5.7L16.9 28.7a1 1 0 01-1.8 0L2.2 5.7a1 1 0 011.3-1.4l12.5 5.5 12.5-5.5a1 1 0 011.3 1.4z"
          fill="url(#viteGradA)"
        />
        <path
          d="M21.5 3.3L12.7 13h5.2l-3.3 9.4L23 11.2h-5.2l3.7-7.9z"
          fill="url(#viteGradB)"
        />
      </svg>
    );
  }

  // 2. Languages
  if (normalized === 'typescript') {
    return (
      <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="#3178C6" />
        <path
          fill="#FFFFFF"
          d="M10.8 13.5v11.7h-2.9V13.5H4v-2.6h9.7v2.6h-2.9zm6 11.7v-2.3c.7.4 1.4.7 2.1.8.8.2 1.5.2 2.2.2.8 0 1.4-.2 1.8-.5.4-.3.6-.8.6-1.3 0-.4-.1-.7-.4-1-.3-.3-.7-.5-1.3-.8l-1.5-.6c-1.1-.4-1.9-.9-2.4-1.5-.5-.6-.8-1.4-.8-2.4 0-1.1.4-2 1.3-2.7.9-.7 2.1-1 3.6-1 1.6 0 3.1.5 4.3 1.4l-1.4 2.2c-1-.7-2.1-1.1-3.1-1.1-.7 0-1.2.2-1.6.5-.4.3-.5.7-.5 1.1 0 .4.1.7.4.9.3.2.7.5 1.3.7l1.5.6c1.2.5 2.1 1 2.6 1.7.5.7.8 1.5.8 2.5 0 1.2-.4 2.1-1.3 2.8-.9.7-2.2 1-3.8 1-1.7 0-3.3-.5-4.7-1.4z"
        />
      </svg>
    );
  }

  if (normalized === 'javascript') {
    return (
      <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="#F7DF1E" />
        <path
          fill="#000000"
          d="M12.7 23.3c-.6 1-1.5 1.7-2.6 2.1-1.1.4-2.4.4-3.6.1l.6-2.5c.8.2 1.6.2 2.3 0 .7-.2 1.2-.7 1.4-1.4.2-.6.2-1.8.2-3.7v-4.4h2.8v4.6c-.1 2.5-.3 4.2-1.1 5.2zm9.1.5c-.7.9-1.8 1.5-3 1.8-1.2.3-2.5.2-3.6-.2l.6-2.5c.8.3 1.6.4 2.4.3.8-.1 1.4-.4 1.7-.9.3-.5.4-1.1.2-1.7-.2-.6-.7-1.2-1.4-1.7l-.8-.6c-1.1-.8-1.8-1.6-2.1-2.4-.3-.8-.3-1.8 0-2.6.4-.9 1.1-1.6 2.1-2 1-.4 2.1-.5 3.2-.2.9.2 1.8.6 2.5 1.2l-1.1 2.2c-.6-.4-1.2-.7-1.8-.8-.6-.1-1.2 0-1.7.2-.5.2-.7.6-.8 1-.1.4 0 .8.2 1.1.2.3.6.7 1.2 1.1l.8.6c1.2.8 2 1.6 2.4 2.5.4.9.4 2 .1 2.9z"
        />
      </svg>
    );
  }

  if (normalized === 'python') {
    return (
      <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M15.9 3.5c-4.3 0-4 .9-4 2.8v2.2h8v1H9.4c-2.3 0-4.3 1.4-4.3 4.2 0 3.3 1.6 4.3 4.3 4.3h1.8v-2.3c0-2.6 2.2-4.8 4.8-4.8h4.5c1.3 0 2.3-.9 2.3-2.3V6.3c0-1.9-.3-2.8-6.9-2.8zm-2.2 2.2a1 1 0 110 2 1 1 0 010-2z"
          fill="#3776AB"
        />
        <path
          d="M16.1 28.5c4.3 0 4-.9 4-2.8v-2.2h-8v-1h10.5c2.3 0 4.3-1.4 4.3-4.2 0-3.3-1.6-4.3-4.3-4.3h-1.8v2.3c0 2.6-2.2 4.8-4.8 4.8h-4.5c-1.3 0-2.3.9-2.3 2.3v2.3c0 1.9.3 2.8 6.9 2.8zm2.2-2.2a1 1 0 110-2 1 1 0 010 2z"
          fill="#FFD438"
        />
      </svg>
    );
  }

  if (normalized === 'sql') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00758F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3" fill="#00758F" fillOpacity="0.2" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    );
  }

  if (normalized.includes('html') || normalized.includes('css')) {
    return (
      <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
        {/* HTML5 & CSS3 dual shield */}
        <g transform="translate(0, 0)">
          <path d="M4 4l2.2 20.3L15.9 28l9.7-3.7L27.8 4H4z" fill="#E34F26" />
          <path d="M15.9 6.2v19.4l7.6-2.9 1.8-16.5H15.9z" fill="#EF652A" />
          <path d="M8.2 9.5h15.4l-.4 3.7h-11l.4 3.7h10.2l-.8 7.4-6.1 2.1-6.1-2.1-.4-4.6h3.4l.2 2.3 2.9.9 2.9-.9.3-3.2H8.6l-.4-9.3z" fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  // 3. Cloud & Hosting
  if (normalized === 'aws') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#FF9900" aria-hidden="true">
        <path d="M12.923 15.658c-2.99 2.213-7.348 3.39-11.082 1.05-.538-.337-.087-1.077.443-.762 3.197 1.884 6.945 1.05 9.774-.783.435-.282.997.234.865.495zm1.189-.868c-.382-.49-.785-.968-1.205-1.428-.168-.184-.047-.417.182-.363 1.547.363 3.125.688 4.697 1.002.327.065.385.45.088.625-1.246.732-2.528 1.41-3.834 2.052-.256.126-.492-.093-.343-.303.415-.584.814-1.185 1.184-1.797l-.769.212z" />
        <path d="M9.805 10.362c-.066-1.127-.687-1.637-1.684-1.637-.922 0-1.64.455-1.748 1.637h3.432zm-5.467 2.015c.033-2.617 1.944-4.148 4.225-4.148 2.35 0 3.774 1.436 3.774 3.967v3.29c0 .736.257 1.042.843 1.042.31 0 .617-.076.883-.19.167-.074.32.062.246.223-.393.856-1.229 1.258-2.146 1.258-1.282 0-1.921-.77-1.921-2.164v-.485c-.657.973-1.613 1.516-2.736 1.516-1.764 0-3.168-1.182-3.168-3.049v-.002c0-2.072 1.554-3.16 3.791-3.16h1.996v-.72c0-1.396-.785-2.067-2.056-2.067-1.157 0-1.895.55-2.071 1.666-.027.173-.178.293-.353.284l-1.307-.066c-.173-.01-.303-.16-.29-.333v.024zm4.086 2.923c1.077 0 1.902-.857 1.902-1.956v-.737h-1.86c-1.281 0-1.992.614-1.992 1.624 0 1.037.771 1.769 1.95 1.769v-.7z" />
      </svg>
    );
  }

  if (normalized === 'vercel') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L2 19.7778h20L12 2z" />
      </svg>
    );
  }

  if (normalized === 'docker') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#2496ED" aria-hidden="true">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.954-5.43h2.118a.186.186 0 00.186-.186V3.575a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.887c0 .102.083.186.185.186zm0 2.715h2.118a.186.186 0 00.186-.186V6.29a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.887c0 .102.083.186.185.186zm-2.954 0h2.118a.186.186 0 00.186-.186V6.29a.186.186 0 00-.186-.186H8.075a.185.185 0 00-.185.186v1.887c0 .102.083.186.185.186zm0 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186H8.075a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.954 0h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186H5.121a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm8.862 0h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-5.908 2.715h2.118a.186.186 0 00.186-.186v-1.886a.186.186 0 00-.186-.186H8.075a.185.185 0 00-.185.186v1.886c0 .103.083.186.185.186zm2.954 0h2.118a.186.186 0 00.186-.186v-1.886a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.886c0 .103.083.186.185.186zm10.75-2.07c-.45-1.127-1.576-1.745-1.63-1.77-.18-.088-.394-.02-.486.155-.091.176-.026.392.15.485.04.02 1.05.545 1.455 1.542-1.077 1.045-2.827 1.157-5.116 1.157H1.365a.684.684 0 00-.684.685c0 2.87 1.144 4.802 3.4 5.742 2.054.856 5.092.83 8.358-.073 5.482-1.517 8.286-5.59 8.653-8.024.364.048.729.088 1.096.118.2.016.375-.13.391-.33.016-.2-.13-.374-.33-.39-.42-.034-.84-.08-1.258-.135z" />
      </svg>
    );
  }

  if (normalized.includes('supabase')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M11.968 1.002c-.37 0-.71.18-.92.48L3.25 12.78c-.37.52-.01 1.25.62 1.25h6.63v8.97c0 .61.73.93 1.19.53l7.99-10.98c.41-.57.01-1.37-.69-1.37h-6.72l-.3-10.18z"
          fill="#3ECF8E"
        />
        <path
          d="M11.968 1.002l-.3 10.18h6.72c.7 0 1.1.8.69 1.37l-7.99 10.98c-.46.4-1.19.08-1.19-.53v-8.97H3.25c-.63 0-.99-.73-.62-1.25l7.798-11.298c.21-.3.55-.48.92-.48z"
          fill="#3ECF8E"
          fillOpacity="0.8"
        />
      </svg>
    );
  }

  if (normalized === 'cloudflare') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#F38020" aria-hidden="true">
        <path d="M18.22 9.07c-.45-2.73-2.8-4.79-5.63-4.79-2.29 0-4.26 1.35-5.18 3.32-.4-.08-.82-.12-1.25-.12-3.13 0-5.66 2.54-5.66 5.66 0 .42.05.83.14 1.22H.5c-.28 0-.5.22-.5.5s.22.5.5.5h18.25c2.62 0 4.75-2.13 4.75-4.75 0-2.43-1.83-4.43-4.28-4.71l-.5-.03z" />
        <path d="M19.5 15.5h-15c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h15c2.21 0 4-1.79 4-4s-1.79-4-4-4h-.5c-.28 0-.5-.22-.5-.5 0-2.48-2.02-4.5-4.5-4.5-2.03 0-3.74 1.35-4.29 3.23-.08.26-.32.44-.59.42-.42-.03-.83.03-1.22.18-.25.1-.54.01-.68-.21-.14-.23-.07-.53.16-.69.51-.2 1.05-.27 1.6-.23 1.05-1.99 3.14-3.37 5.52-3.37 3.31 0 6 2.69 6 6 .33.05.65.15.96.28.25.11.36.4.25.65-.1.25-.4.36-.65.25z" fill="#FAAD3F" />
      </svg>
    );
  }

  // 4. Databases
  if (normalized === 'postgresql') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#336791" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.2 16.5c-2.4.3-4.7-1.1-5.3-3.3-.2-.7-.3-1.4-.3-2.1 0-3 2.1-5.5 5.1-5.8 2.6-.3 5.1 1.4 5.6 3.9.5 2.6-.9 5.2-3.4 6.7-.5.4-1.1.5-1.7.6zm1.8-6.1c-.2-.9-.9-1.5-1.8-1.5-.9 0-1.7.7-1.7 1.6 0 .9.7 1.7 1.7 1.7.9 0 1.6-.8 1.8-1.8z" />
      </svg>
    );
  }

  if (normalized === 'mongodb') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#47A248" aria-hidden="true">
        <path d="M12 1.5c-.2 0-.4.1-.5.3C9.8 4.7 6.5 9.7 6.5 14.2c0 4.2 2.8 7.8 5.5 8.3v-21zm0 0c.2 0 .4.1.5.3 1.7 2.9 5 7.9 5 12.4 0 4.2-2.8 7.8-5.5 8.3v-21z" />
      </svg>
    );
  }

  if (normalized === 'redis') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#DC382D" aria-hidden="true">
        <path d="M21.5 7.8L12.3 2.6c-.2-.1-.5-.1-.7 0L2.5 7.8c-.3.2-.5.5-.5.8v8.7c0 .3.2.7.5.8l9.2 5.2c.2.1.5.1.7 0l9.2-5.2c.3-.2.5-.5.5-.8V8.6c0-.3-.2-.6-.6-.8zM12 4.1l7.4 4.2-2.6 1.5-7.4-4.2L12 4.1zm-8 5.6l7.4 4.2v3.1L4 12.8V9.7zm9 10.2v-3.1l7.4-4.2v3.1l-7.4 4.2z" />
      </svg>
    );
  }

  if (normalized === 'sqlite') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#003B57" aria-hidden="true">
        <path d="M19.5 3h-15C3.1 3 2 4.1 2 5.5v13C2 19.9 3.1 21 4.5 21h15c1.4 0 2.5-1.1 2.5-2.5v-13C22 4.1 20.9 3 19.5 3zm-3.8 14.5c-2.3 0-3.7-1.4-3.7-3.6 0-2.3 1.5-3.8 3.8-3.8 1.4 0 2.4.5 3 1.3l-1.3 1.3c-.5-.5-1-.8-1.7-.8-1.2 0-2 .9-2 2.2 0 1.3.8 2.1 2 2.1.8 0 1.3-.3 1.8-.8l1.3 1.3c-.7.8-1.8 1.4-3.2 1.4z" />
      </svg>
    );
  }

  // 5. AI & Machine Learning
  if (normalized.includes('openai')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#10A37F" aria-hidden="true">
        <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0010.83.5a6.037 6.037 0 00-5.768 4.218 6.047 6.047 0 00-4.043 2.929 6.038 6.038 0 00.748 7.078 5.98 5.98 0 00.516 4.911 6.05 6.05 0 006.515 2.9A5.985 5.985 0 0013.26 23.5a6.037 6.037 0 005.748-4.218 6.047 6.047 0 004.043-2.929 6.038 6.038 0 00-.77-7.532zm-7.697 12.023a4.484 4.484 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.778 0l5.834-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zm-1.89-9.52a4.486 4.486 0 012.34-1.972V12.3a.765.765 0 00.386.681l5.835 3.368-2.02 1.168a.078.078 0 01-.068 0L3.35 14.75a4.5 4.5 0 01-1.64-5.966zm16.598 3.738l-5.835-3.37 2.02-1.168a.078.078 0 01.068 0l4.832 2.766a4.5 4.5 0 01-.676 8.08V13.2a.765.765 0 00-.409-.678zm2.015-3.025l-.141-.085-4.779-2.759a.775.775 0 00-.782 0L8.98 9.923V7.59a.079.079 0 01.033-.062l4.832-2.767a4.5 4.5 0 016.577 4.744zM8.07 10.98l2.92-1.686 2.92 1.686v3.372l-2.92 1.686-2.92-1.686z" />
      </svg>
    );
  }

  if (normalized.includes('claude')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#D97757" aria-hidden="true">
        {/* Anthropic Claude star icon */}
        <path d="M12 2l1.6 6.8L20 7.5l-4.5 5.2L20.5 17l-6.9-.6L12 23l-1.6-6.6L3.5 17l5-4.3L4 7.5l6.4 1.3L12 2z" />
      </svg>
    );
  }

  if (normalized.includes('custom llm') || normalized.includes('llm')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" fill="#8B5CF6" fillOpacity="0.25" />
      </svg>
    );
  }

  if (normalized.includes('hugging')) {
    return (
      <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="14" fill="#FFD21E" />
        {/* Smiling face */}
        <circle cx="11" cy="13" r="2" fill="#2E2E2E" />
        <circle cx="21" cy="13" r="2" fill="#2E2E2E" />
        <path d="M10 18c1.5 3 4.5 4 6 4s4.5-1 6-4" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Hugging hands */}
        <path d="M4 19c2 0 4-2 6-1s2 3 0 4-5-1-6-3zM28 19c-2 0-4-2-6-1s-2 3 0 4 5-1 6-3z" fill="#FF9D00" />
      </svg>
    );
  }

  if (normalized.includes('langchain')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#22C55E" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5v-2h-2v2H9v-4h2v-2H9V8.5h2v-2h2v2h2v4h-2v2h2v2h-2z" />
      </svg>
    );
  }

  // 6. Automation & Integrations
  if (normalized === 'n8n') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#EA4B71" aria-hidden="true">
        <path d="M19 8a3 3 0 00-2.82 2H13V8a3 3 0 10-2 0v2H7.82A3 3 0 105 12a3 3 0 002.82 2H11v2a3 3 0 102 0v-2h3.18A3 3 0 1019 8zm-8-3a1 1 0 11-2 0 1 1 0 012 0zM5 13a1 1 0 110-2 1 1 0 010 2zm7 5a1 1 0 110-2 1 1 0 010 2zm7-5a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
    );
  }

  if (normalized === 'zapier') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#FF4A00" aria-hidden="true">
        <path d="M10.8 19.2L12 14.4h3.6l-4.8-9.6L9.6 9.6H6l4.8 9.6z" />
        <path d="M13.2 4.8L12 9.6H8.4l4.8 9.6 1.2-4.8h3.6L13.2 4.8z" fill="#FF7A33" />
      </svg>
    );
  }

  if (normalized.includes('webhook')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="6" r="3" fill="#6366F1" />
        <circle cx="6" cy="18" r="3" fill="#6366F1" fillOpacity="0.3" />
        <path d="M15 9l-6 6" />
        <path d="M6 9a9 9 0 019 9" />
      </svg>
    );
  }

  if (normalized.includes('api') || normalized.includes('rest')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M6 10h4M6 14h2M14 10l2 4 2-4" />
      </svg>
    );
  }

  if (normalized.includes('script') || normalized.includes('python scripts')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#3776AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 17l6-6-6-6M12 19h8" />
      </svg>
    );
  }

  // 7. UI/UX & 3D Design
  if (normalized === 'figma') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 2h4v5H8a2.5 2.5 0 010-5z" fill="#F24E1E" />
        <path d="M12 2h4a2.5 2.5 0 010 5h-4V2z" fill="#FF7262" />
        <path d="M8 7h4v5H8a2.5 2.5 0 010-5z" fill="#A259FF" />
        <path d="M12 7h4a2.5 2.5 0 010 5h-4V7z" fill="#1ABCFE" />
        <path d="M8 12h4v4.5a2.5 2.5 0 11-4-2.1V12z" fill="#0ACF83" />
      </svg>
    );
  }

  if (normalized.includes('cinema') || normalized.includes('c4d')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#0055FF" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zm0 13l-10-5v7l10 5 10-5v-7l-10 5z" />
      </svg>
    );
  }

  if (normalized === 'blender') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.5 2.5c-.8 0-1.5.7-1.5 1.5 0 .4.2.8.5 1.1L8.2 8.4c-.4-.3-.9-.4-1.4-.4-1.7 0-3 1.3-3 3s1.3 3 3 3c.3 0 .7-.1 1-.2l2.6 3.8c-.3.4-.4.8-.4 1.3 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-.6-.2-1.2-.6-1.6l3.5-2.5c.5.4 1.1.6 1.7.6 1.7 0 3-1.3 3-3s-1.3-3-3-3c-.6 0-1.2.2-1.6.6l-3.3-2.5c.2-.4.3-.8.3-1.3 0-1.6-1.1-2.7-2.6-2.7z" fill="#EA7600" />
        <circle cx="12.5" cy="12" r="3.5" fill="#225780" />
        <circle cx="12.5" cy="12" r="1.5" fill="#FFFFFF" />
      </svg>
    );
  }

  if (normalized.includes('adobe')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
        <path d="M15.1 2H24v20L15.1 2zM8.9 2H0v20L8.9 2zM12 9.4L16.2 20h-2.9l-1.3-3.4H9.7l2.3-7.2z" />
      </svg>
    );
  }

  if (normalized === 'framer') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#0055FF" aria-hidden="true">
        <path d="M4 2h16v7h-8l8 8H4v-7h8L4 2z" />
      </svg>
    );
  }

  // 8. Testing & QA
  if (normalized === 'playwright') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        {/* Playwright green & red theater masks */}
        <circle cx="8" cy="12" r="6" fill="#2EAD33" />
        <circle cx="16" cy="12" r="6" fill="#E04055" />
        <circle cx="7" cy="10" r="1" fill="#FFFFFF" />
        <circle cx="9" cy="10" r="1" fill="#FFFFFF" />
        <path d="M7 13c.5.8 1.5.8 2 0" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />
        <circle cx="15" cy="10" r="1" fill="#FFFFFF" />
        <circle cx="17" cy="10" r="1" fill="#FFFFFF" />
        <path d="M15 14c.5-.8 1.5-.8 2 0" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />
      </svg>
    );
  }

  if (normalized === 'jest') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#C21325" aria-hidden="true">
        <path d="M18.8 4.2C17.4 3 15.3 3.3 14 4.8l-1.8 2.1c-.3.4-.9.4-1.2 0L9.2 4.8C7.9 3.3 5.8 3 4.4 4.2 2.9 5.5 2.7 7.7 4 9.1l5.4 6.2c1.4 1.6 3.8 1.6 5.2 0l5.4-6.2c1.3-1.4 1.1-3.6-.2-4.9z" />
        <circle cx="7" cy="7" r="1" fill="#FFFFFF" />
        <circle cx="17" cy="7" r="1" fill="#FFFFFF" />
      </svg>
    );
  }

  if (normalized === 'vitest') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.5 2.5L7.2 13h5.1L9.5 21.5 20.8 9.5h-5.3l3-7z" fill="#FCC72B" />
        <path d="M8.5 2.5L3.2 13h5.1L5.5 21.5 13.8 9.5H8.5l3-7z" fill="#729B1B" />
      </svg>
    );
  }

  if (normalized === 'cypress') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#00BF88" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#00BF88" strokeWidth="2.5" />
        <path d="M15 8.5a5 5 0 100 7" fill="none" stroke="#00BF88" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (normalized === 'lighthouse') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2L8 8h8l-4-6z" fill="#F44B21" />
        <path d="M9 8h6l-1 12H10L9 8z" fill="#005BBB" />
        <circle cx="12" cy="6" r="1.5" fill="#FFEA83" />
        <path d="M4 6l3 2M20 6l-3 2" stroke="#FFEA83" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 9. Cybersecurity
  if (normalized.includes('owasp')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#0284C7" fillOpacity="0.2" />
        <path d="M9 12l2 2 4-4" stroke="#0284C7" strokeWidth="2" />
      </svg>
    );
  }

  if (normalized.includes('penetration') || normalized.includes('testing')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <circle cx="12" cy="12" r="3" fill="#EF4444" fillOpacity="0.3" />
      </svg>
    );
  }

  if (normalized.includes('ssl') || normalized.includes('tls')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="#10B981" fillOpacity="0.2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
        <circle cx="12" cy="16" r="1" fill="#10B981" />
      </svg>
    );
  }

  if (normalized.includes('dependency') || normalized.includes('audit')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
        <path d="M12 12l8-4.5M12 12v8M12 12L4 7.5" />
      </svg>
    );
  }

  // 10. Analytics & BI
  if (normalized === 'powerbi' || normalized === 'power bi') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#F2C811" aria-hidden="true">
        <rect x="3" y="12" width="4" height="9" rx="1" fill="#F2C811" />
        <rect x="10" y="7" width="4" height="14" rx="1" fill="#E6AD10" />
        <rect x="17" y="3" width="4" height="18" rx="1" fill="#D99408" />
      </svg>
    );
  }

  if (normalized.includes('ga4') || normalized.includes('analytics')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#F9AB00" aria-hidden="true">
        <rect x="17" y="3" width="4" height="18" rx="2" fill="#F9AB00" />
        <rect x="10" y="9" width="4" height="12" rx="2" fill="#E37400" />
        <circle cx="5" cy="18" r="2.5" fill="#E37400" />
      </svg>
    );
  }

  if (normalized === 'mixpanel') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#7856FF" aria-hidden="true">
        <circle cx="5" cy="12" r="3" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="19" cy="12" r="3" />
      </svg>
    );
  }

  if (normalized.includes('custom dashboard') || normalized.includes('dashboard')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    );
  }

  // 11. CMS & E-commerce
  if (normalized.includes('headless cms')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#8B5CF6" fillOpacity="0.25" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    );
  }

  if (normalized === 'wordpress') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#21759B" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#21759B" strokeWidth="2" />
        <path d="M3.5 12c0 3.7 2.4 6.9 5.8 7.9L5.4 9.1c-1.2.8-1.9 1.8-1.9 2.9zm13-1c.2-1.3-.5-2.2-1.4-2.2-1.2 0-2 1.2-2 2.4 0 1.7 1 2.5 2.1 4.5l-2.4 7.2c.4.1.8.1 1.2.1 1.6 0 3.1-.4 4.4-1.2l-3.3-9.6c.9-.4 1.4-.7 1.4-1.2z" />
      </svg>
    );
  }

  if (normalized === 'shopify') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.8 6.5l-1.9-.6c-.1 0-.1 0-.2.1L15.3 19l4.5-.9c.4-.1.7-.5.7-.9l.3-9.5c0-.6-.5-1.1-1-1.2z" fill="#7AB55C" />
        <path d="M15.3 19l-4.2-13-5.2 1.6c-.4.1-.7.5-.7.9l.4 10.3c0 .5.3.9.7 1l6.7 1.4 2.3-2.2z" fill="#95BF47" />
        <path d="M11.1 6l1.7-1.9c.7-.8 1.8-1.2 2.9-1.2.3 0 .7.1 1 .2l-1.4 8.9L11.1 6z" fill="#5E8E3E" />
        <path d="M12.8 12.3c-.7-.1-1.2-.3-1.2-.7 0-.5.5-.8 1.2-.8.8 0 1.3.3 1.7.8l.8-.9c-.6-.7-1.4-1-2.4-1-1.4 0-2.4.9-2.4 2 0 1.4 1.1 1.8 2.1 2 .8.2 1.3.4 1.3.8 0 .5-.6.9-1.4.9-.9 0-1.6-.4-2-1.1l-.9.9c.6.9 1.6 1.4 2.8 1.4 1.6 0 2.6-.9 2.6-2.1 0-1.4-1-1.9-2.2-2.2z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (normalized === 'stripe') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#635BFF" aria-hidden="true">
        <path d="M13.9 8.7c0-.8-.7-1.2-1.8-1.2-1.6 0-3.6.5-5.1 1.4V3.8C8.7 3.2 10.6 3 12.1 3c4.4 0 7.3 2.2 7.3 6 0 5.8-8 6.1-8 9.3 0 1 .9 1.4 2.2 1.4 1.9 0 4.2-.8 5.8-1.8v5.1c-1.8.8-3.9 1.1-5.8 1.1-4.7 0-7.7-2.3-7.7-6.2 0-6.1 8-6.5 8-9.2z" />
      </svg>
    );
  }

  // 12. Mobile & Cross-Platform
  if (normalized.includes('react native')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="6" y="2" width="12" height="20" rx="3" stroke="#61DAFB" strokeWidth="1.5" />
        <circle cx="12" cy="18" r="1" fill="#61DAFB" />
        <circle cx="12" cy="9.5" r="1.5" fill="#61DAFB" />
        <ellipse cx="12" cy="9.5" rx="5" ry="2" stroke="#61DAFB" strokeWidth="0.9" />
        <ellipse cx="12" cy="9.5" rx="5" ry="2" stroke="#61DAFB" strokeWidth="0.9" transform="rotate(60 12 9.5)" />
        <ellipse cx="12" cy="9.5" rx="5" ry="2" stroke="#61DAFB" strokeWidth="0.9" transform="rotate(120 12 9.5)" />
      </svg>
    );
  }

  if (normalized === 'flutter') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.3 2L4 12.3l3.2 3.2L20.7 2h-6.4z" fill="#02569B" />
        <path d="M14.3 13.5l-4.8 4.8 4.8 4.8h6.4l-8-8h1.6z" fill="#54C5F8" />
        <path d="M11.1 19.9l2.4 2.4h6.4l-5.6-5.6-3.2 3.2z" fill="#0175C2" />
      </svg>
    );
  }

  if (normalized === 'pwa') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#5A0FC8" aria-hidden="true">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm-1 14.5l-4-2.5V9.5l4 2.5v4.5zm2 0v-4.5l4-2.5v4.5l-4 2.5z" />
      </svg>
    );
  }

  // Fallback for any other tool: Crisp code badge icon
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
};
