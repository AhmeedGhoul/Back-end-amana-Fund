import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

@Component({
  selector: 'app-credit-card-animation',
  templateUrl: './credit-card-animation.component.html',
  styleUrls: ['./credit-card-animation.component.scss'],
  standalone: true
})
export class CreditCardAnimationComponent implements OnInit {
  private tl: any;
  private starShine: any;

  ngOnInit(): void {
    gsap.registerPlugin(MotionPathPlugin);
    this.initAnimations();
  }

  initAnimations(): void {
    this.tl = gsap.timeline()
      .set('svg', { opacity: 1 })
      .set('.scratches', { rotation: 70, x: 450, y: -10 })
      .set('#tri2', { scale: 0.5 })
      .from('#cardMask rect', { scale: 0, rotation: -20, duration: 2, transformOrigin: '50% 50%', ease: 'expo.inOut' }, 0)
      .to('#tri1', {
        motionPath: {
          path: "#midC",
          align: "#midC",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 1,
          end: 0
        }, duration: 6, repeat: -1, ease: 'none', repeatDelay: 1
      }, 0.5)
      .to('#tri2', {
        motionPath: {
          path: "#innerC",
          align: "#innerC",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 1
        }, duration: 5, repeat: -1, ease: 'none', repeatDelay: 1
      }, 1.5)
      .from('.coil', { attr: { 'stroke-dashoffset': (i: number) => (i == 1) ? -28 : 28 }, ease: 'none', duration: 1, repeat: -1 }, 1)
      .fromTo('#orb1', { y: 160 }, { y: -20, ease: 'circ', repeat: -1, yoyo: true, duration: 1 }, 0.8)
      .from('.logoPt', { x: (i: number) => [18, -10][i], duration: 1.2, ease: 'expo.inOut' }, 0.9)
      .from('svg text', { x: -40, duration: 1.1, ease: 'expo.inOut', stagger: 0.2 }, 1)
      .from('.txtBox', { scaleX: 0, transformOrigin: '100% 0', duration: 1.1, ease: 'expo.inOut', stagger: 0.2 }, 1)
      .fromTo('#wave1', { x: 0, y: 0 }, { duration: 5, x: -701, y: 815, repeat: -1, ease: 'none' }, 0)
      .fromTo('#wave2', { x: 0, y: 0 }, { duration: 6, x: 804, y: -917, repeat: -1, ease: 'none', onRepeat: () => this.starShine.play(0) }, 0);

    this.starShine = gsap.timeline({ paused: true })
      .set('#star', { scale: 0, transformOrigin: '50% 50%', x: 2, y: 10 })
      .to('#star', { scale: 1, repeat: 1, yoyo: true, yoyoEase: true, duration: 0.4, ease: 'power4' }, 0)
      .fromTo('#star', { rotate: -20 }, { rotate: 120, duration: 0.8, ease: 'none' }, 0);
  }

  playAnimation(): void {
    if (this.tl) {
      this.tl.play(0);
    }
  }
}