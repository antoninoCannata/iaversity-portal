import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenaiService } from '../../services/openai.service';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'

})
export class ChatComponent {

  userInput: string = '';
  aiResponse: string = '';
  loading: boolean = false;
  threadId: string = '';
  showChat : boolean = false;

  @ViewChild('chatResponse') chatResponse!: ElementRef;

  constructor(private openaiService: OpenaiService) {
  }

  send(): void {
    this.openaiService.askAssistant(this.userInput).subscribe((response: string) => {
      this.showChat  = true;
      this.aiResponse = response;
      setTimeout(() => {
        this.chatResponse?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 100); 
    });
  }


  

  sendFake(): void {
    if (!this.userInput.trim()) return;

    this.loading = true;
    this.showChat = true;

    this.openaiService.getFakeAssistantResponse(this.userInput).subscribe((response: string) => {
      this.aiResponse = response;
      this.loading = false;

      setTimeout(() => {
        this.chatResponse?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
  }
  
}
