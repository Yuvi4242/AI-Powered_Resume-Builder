import React from 'react';
import { 
  FiGithub, FiLinkedin, FiGlobe, FiTwitter, 
  FiMousePointer, FiArrowUpRight, FiBook, 
  FiCodesandbox, FiLayout, FiFramer, FiMonitor
} from 'react-icons/fi';
import { 
  SiLeetcode, SiCodechef, SiHackerrank, 
  SiBehance, SiDribbble, SiMedium, SiX 
} from 'react-icons/si';
import { normalizeUrl, formatDisplayUrl } from '../utils/url';

const platformIconMap = {
  github: { icon: FiGithub, label: 'GitHub' },
  linkedin: { icon: FiLinkedin, label: 'LinkedIn' },
  portfolio: { icon: FiGlobe, label: 'Portfolio' },
  leetcode: { icon: SiLeetcode, label: 'LeetCode' },
  codechef: { icon: SiCodechef, label: 'CodeChef' },
  hackerrank: { icon: SiHackerrank, label: 'HackerRank' },
  twitter: { icon: SiX, label: 'Twitter' },
  behance: { icon: SiBehance, label: 'Behance' },
  dribbble: { icon: SiDribbble, label: 'Dribbble' },
  medium: { icon: SiMedium, label: 'Medium' },
  website: { icon: FiGlobe, label: 'Website' },
  kaggle: { icon: FiMonitor, label: 'Kaggle' },
  stackoverflow: { icon: FiCodesandbox, label: 'Stack Overflow' },
  scholar: { icon: FiBook, label: 'Google Scholar' }
};

const whitelistedKeys = Object.keys(platformIconMap);

const SocialLinksRenderer = ({ links, className = "", itemClassName = "", showIcon = true, showLabel = false, iconOnly = false, vertical = false, showSeparator = false }) => {
  if (!links) return null;

  // Handle both formats: Object { github, linkedin } or Array [{ platform, url }]
  const normalizedLinks = (Array.isArray(links) 
    ? links 
    : Object.entries(links)
        .filter(([key, value]) => {
          const lKey = key.toLowerCase();
          return (whitelistedKeys.includes(lKey) || lKey === 'email' || lKey === 'phone') && 
                 value && typeof value === 'string' && value.trim() !== '';
        })
        .map(([key, value]) => ({ platform: key.toLowerCase(), url: value }))
  ).filter(link => {
    // Final check: if it's not email/phone, it MUST be in the whitelist
    return whitelistedKeys.includes(link.platform) || link.platform === 'email' || link.platform === 'phone';
  });

  if (normalizedLinks.length === 0) return null;

  return (
    <div className={`flex ${vertical ? 'flex-col gap-y-3' : 'flex-wrap gap-x-4 gap-y-2'} ${className}`}>
      {normalizedLinks.map((link, index) => {
        const isEmail = link.platform === 'email';
        const isPhone = link.platform === 'phone';
        
        let href = normalizeUrl(link.url);
        let displayText = formatDisplayUrl(link.url);
        let Icon = null;
        let label = '';

        if (isEmail) {
          href = `mailto:${link.url.trim()}`;
          displayText = link.url.trim();
          Icon = FiMail;
          label = 'Email';
        } else if (isPhone) {
          href = `tel:${link.url.replace(/\s+/g, '')}`;
          displayText = link.url.trim();
          Icon = FiPhone;
          label = 'Phone';
        } else {
          const platformKey = whitelistedKeys.find(k => link.platform === k);
          if (!platformKey) return null;
          const config = platformIconMap[platformKey];
          Icon = config.icon;
          label = config.label;
        }

        if (!href) return null;

        return (
          <React.Fragment key={index}>
            {showSeparator && index > 0 && <span className="opacity-20 mx-1">|</span>}
            <a
              href={href}
              target={isEmail || isPhone ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 transition-colors hover:text-primary-600 group ${itemClassName}`}
              title={label}
            >
              {showIcon && Icon && <Icon className="shrink-0 w-[1.1em] h-[1.1em]" />}
              {!iconOnly && (
                <span className={`${showLabel ? "font-bold" : ""} border-b border-transparent group-hover:border-current leading-none py-0.5`}>
                  {showLabel ? label : displayText}
                </span>
              )}
            </a>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SocialLinksRenderer;
