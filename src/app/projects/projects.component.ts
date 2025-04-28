import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports: [
    CommonModule,
  ],
})
export class ProjectsComponent {
  projects = [
    {
      image: 'assets/projects/backgrounds/shokanri.png',
      title: 'ShoKanri',
      description: 'ShoKanri é um sistema de gerenciamento de finanças pessoais que visa ajudar os usuários a controlar suas despesas e receitas de forma simples e eficiente. O sistema permite o registro de transações financeiras, categorização de despesas, geração de relatórios e gráficos para análise financeira.',
      link: 'sho-kanri-front.vercel.app',
      technologies: [
        { name: 'GitHub', icon: 'assets/icons/github.svg', link: 'https://github.com/FelpLiet/ShoKanri-Front' },
        { name: 'Angular', icon: 'assets/icons/angular.svg' },
        { name: 'TypeScript', icon: 'assets/icons/typescript.svg' },
      ]
    },
    {
      image: 'assets/projects/backgrounds/sescomp.png',
      title: 'Site SESCOMP 2024',
      description: 'Este é o site oficial da Semana de Engenharia de Software e Ciência da Computação (SESCOMP) de 2024, um evento que conecta alunos, professores e profissionais apaixonados por tecnologia. O site foi desenvolvido para fornecer informações sobre o evento, programação, atividades e facilitar a inscrição dos participantes.',
      technologies: [
        { name: 'GitHub', icon: 'assets/icons/github.svg', link: 'https://github.com/FelpLiet/sescomp' },
        { name: 'React', icon: 'assets/icons/react.svg' },
        { name: 'TypeScript', icon: 'assets/icons/typescript.svg' },
      ]
    },
    {
      image: 'assets/projects/backgrounds/garu.jpg',
      title: 'Projeto GARU – Gestão de Acesso as Residências Universitárias',
      description: 'Desenvolvimento de PCBs e firmware do ESP32 para gerenciamento de recursos em ambientes acadêmicos. O projeto GARU visa otimizar o controle de acesso e a gestão de recursos em residências universitárias, proporcionando uma solução eficiente e segura para os usuários.',
      technologies: [
        { name: 'GitHub', icon: 'assets/icons/github.svg' },
        { name: 'PlatformIO', icon: 'assets/icons/platformio.svg' },
        { name: 'C++', icon: 'assets/icons/c++.svg' },
      ]
    },
  ];
}
