import { Injectable, signal } from '@angular/core';
import { Experience, SkillGroup, Project, ContactLink } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  readonly experiences = signal<Experience[]>([
    {
      company: 'NTT DATA Europe & Latam',
      role: 'Senior Software Developer',
      period: 'set/2025 – presente',
      description: 'EXPERIENCE.NTT.DESCRIPTION',
      techs: ['Angular 19', 'RxJS', '.NET', 'C#', 'xUnit', 'Redis', 'Azure', 'Microfrontends'],
      current: true,
    },
    {
      company: 'Mottu',
      role: 'Front-end Developer',
      period: 'mar/2024 – set/2025',
      description: 'EXPERIENCE.MOTTU.DESCRIPTION',
      techs: ['Angular 13', 'RxJS', 'NestJS', 'C#', 'Datadog', 'GitHub Actions', 'Cloudflare'],
      current: false,
    },
    {
      company: 'Bioma Investimentos',
      role: 'Desenvolvedor Web',
      period: 'set/2023 – mar/2024',
      description: 'EXPERIENCE.BIOMA.DESCRIPTION',
      techs: ['ReactJS', 'NextJS', 'TypeScript'],
      current: false,
    },
  ]);

  readonly skillGroups = signal<SkillGroup[]>([
    {
      category: 'SKILLS.CATEGORY.FRONTEND',
      skills: ['Angular', 'RxJS', 'TypeScript', 'React', 'Next.js', 'Angular Material'],
    },
    {
      category: 'SKILLS.CATEGORY.BACKEND',
      skills: ['NestJS', '.NET', 'C#'],
    },
    {
      category: 'SKILLS.CATEGORY.DEVOPS',
      skills: ['GitHub Actions', 'Datadog', 'Azure', 'Cloudflare', 'Redis'],
    },
    {
      category: 'SKILLS.CATEGORY.CONCEPTS',
      skills: ['Micro Front-ends', 'CI/CD', 'Testes Unitários', 'Arquitetura Orientada a Eventos'],
    },
  ]);

  readonly projects = signal<Project[]>([
    {
      number: '01',
      title: 'Restaurant Management System',
      description: 'PROJECTS.RESTAURANT.DESCRIPTION',
      tags: ['Angular 21', 'NestJS', 'PostgreSQL', 'Prisma', 'Socket.IO', 'Gemini AI', 'Vercel'],
      githubUrls: [
        { label: 'API', url: 'https://github.com/GabrielKayran/restaurant-management-api' },
        { label: 'Front', url: 'https://github.com/GabrielKayran/restaurant-management-front' },
      ],
      demoUrl: 'https://restaurant-management-front.vercel.app/',
      available: true,
    },
    {
      number: '02',
      title: 'Frontend Alignment Test',
      description: 'PROJECTS.ALIGNMENT.DESCRIPTION',
      tags: ['Angular 21', 'TypeScript', 'RxJS', 'Angular CDK', 'SSR', 'ngx-translate', 'Vitest'],
      githubUrls: [
        { label: 'GitHub', url: 'https://github.com/GabrielKayran/frontend-alignment-test' },
      ],
      demoUrl: 'https://frontend-alignment-test.vercel.app/',
      available: true,
    },
    {
      number: '03',
      title: 'Sales API',
      description: 'PROJECTS.SALES.DESCRIPTION',
      tags: [
        '.NET 8',
        'C#',
        'PostgreSQL',
        'EF Core',
        'CQRS',
        'MediatR',
        'Clean Architecture',
        'DDD',
        'xUnit',
      ],
      githubUrls: [{ label: 'GitHub', url: 'https://github.com/GabrielKayran/sales-api' }],
      demoUrl: '#',
      available: true,
    },
  ]);

  readonly contactLinks = signal<ContactLink[]>([
    {
      label: 'Email',
      url: 'mailto:gabrielkayran@gmail.com',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/gabrielkayran',
      icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
    },
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/gabrielkayran',
      icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    },
  ]);
}
