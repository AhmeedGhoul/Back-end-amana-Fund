import { Component, AfterViewInit } from '@angular/core';
declare var ScrollReveal: any;
declare var Swiper: any;
import { ViewEncapsulation } from '@angular/core';
import {RouterLink} from "@angular/router";
@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss'],
  standalone: true,
  imports: [
    RouterLink
  ],
  encapsulation: ViewEncapsulation.None
})
export class VisitorComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
    const menuBtnIcon = menuBtn?.querySelector("i");

    menuBtn?.addEventListener("click", () => {
      navLinks?.classList.toggle("open");
      const isOpen = navLinks?.classList.contains("open");
      menuBtnIcon?.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-3-line");
    });

    navLinks?.addEventListener("click", () => {
      navLinks?.classList.remove("open");
      menuBtnIcon?.setAttribute("class", "ri-menu-3-line");
    });

    const scrollRevealOption = {
      distance: "50px",
      origin: "bottom",
      duration: 1000,
    };

    ScrollReveal().reveal(".header__content h1", scrollRevealOption);
    ScrollReveal().reveal(".header__content .section__description", { ...scrollRevealOption, delay: 500 });
    ScrollReveal().reveal(".header__content form", { ...scrollRevealOption, delay: 1000 });
    ScrollReveal().reveal(".header__content img", { ...scrollRevealOption, origin: "left", delay: 1500 });

    ScrollReveal().reveal(".about__content .section__header", scrollRevealOption);
    ScrollReveal().reveal(".about__content .section__description", { ...scrollRevealOption, delay: 500 });
    ScrollReveal().reveal(".about__signature", { ...scrollRevealOption, delay: 1000 });

    ScrollReveal().reveal(".tour__card", { ...scrollRevealOption, interval: 500 });
    ScrollReveal().reveal(".destination__card", { ...scrollRevealOption, interval: 500 });
    ScrollReveal().reveal(".blog__card", { ...scrollRevealOption, interval: 500 });

    new Swiper(".swiper", { loop: true });

    const banner = document.querySelector(".banner__wrapper");
    const bannerImages = Array.from(banner?.children || []);
    bannerImages.forEach((item) => {
      const duplicateNode = item.cloneNode(true) as HTMLElement;
      duplicateNode.setAttribute("aria-hidden", "true");
      banner?.appendChild(duplicateNode);
    });
  }
}
