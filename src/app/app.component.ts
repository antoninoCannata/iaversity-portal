import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'iaversity-portal';

  
  lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    const footer = document.getElementById('main-footer');

    if (!footer) return;

    if (currentScroll > this.lastScrollTop) {
      // Scroll verso il basso
      footer.classList.add('footer-hidden');
    } else {
      // Scroll verso l'alto
      footer.classList.remove('footer-hidden');
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
}
